// Keeps the vendored Surface API contract identical to a dac-plane release.
//
//   node scripts/contract.ts sync <version>   vendor that release's contracts and regenerate the types
//   node scripts/contract.ts check            fail if the vendored contract or the types drifted
//
// The release asset is pinned by its SHA-256 in contract.json. `sync` takes the
// digest GitHub reports for the asset and records it; `check` downloads the
// asset again, refuses it unless it matches the pin, and compares every file.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import openapiTS, {
  astToString,
  type SchemaObject,
  transformSchemaObject,
} from "openapi-typescript";

const root = fileURLToPath(new URL("..", import.meta.url));
const pinFile = join(root, "contract.json");
const vendored = join(root, "contract");
const generated = join(root, "src", "schema.gen.ts");
const repository = "dac-plane/dac-plane";

interface Pin {
  release: string;
  asset: string;
  sha256: string;
}

const assetName = (release: string) => `dac-plane-contracts-${release}.tar.gz`;
const assetURL = (pin: Pin) =>
  `https://github.com/${repository}/releases/download/${pin.release}/${pin.asset}`;

async function download(pin: Pin): Promise<Buffer> {
  const response = await fetch(assetURL(pin));
  if (!response.ok) {
    throw new Error(`download ${assetURL(pin)}: HTTP ${response.status}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== pin.sha256) {
    throw new Error(`${pin.asset}: SHA-256 ${digest}, pinned ${pin.sha256}`);
  }
  return bytes;
}

// extract unpacks the asset's `contracts/` directory into `into`.
async function extract(archive: Buffer, into: string): Promise<void> {
  const work = await mkdtemp(join(tmpdir(), "contract-"));
  try {
    const file = join(work, "contracts.tar.gz");
    await writeFile(file, archive);
    execFileSync("tar", ["-xzf", file, "-C", work, "contracts"]);
    await rm(into, { recursive: true, force: true });
    execFileSync("mv", [join(work, "contracts"), into]);
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

// A branch of anyOf or oneOf that only says which properties are present,
// such as "agent_id, or both provider ids" or "agent_id or task_id, not both",
// constrains presence but adds no shape. openapi-typescript renders each such
// branch as `unknown`, and `T | unknown` is `unknown`, which would erase the
// whole type. Those branches are dropped from the types; dac-plane still
// enforces them and answers a violation with 422.
const isPresenceOnly = (branch: unknown): boolean => {
  if (typeof branch !== "object" || branch === null) return false;
  const { required, not, ...rest } = branch as { required?: unknown; not?: unknown };
  return (
    Object.keys(rest).length === 0 &&
    (required === undefined || Array.isArray(required)) &&
    (not === undefined || isPresenceOnly(not)) &&
    (required !== undefined || not !== undefined)
  );
};

function withoutPresenceOnlyBranches(schema: SchemaObject): SchemaObject | undefined {
  let changed = false;
  const copy: SchemaObject = { ...schema };
  for (const key of ["anyOf", "oneOf"] as const) {
    const branches = copy[key];
    if (Array.isArray(branches) && branches.length > 0 && branches.every(isPresenceOnly)) {
      delete copy[key];
      changed = true;
    }
  }
  return changed ? copy : undefined;
}

async function generate(contract: string): Promise<string> {
  const document = new URL(`file://${join(contract, "openapi", "surface-v1.json")}`);
  const ast = await openapiTS(document, {
    transform(schema, options) {
      const stripped = withoutPresenceOnlyBranches(schema);
      return stripped ? transformSchemaObject(stripped, options) : undefined;
    },
  });
  const banner =
    "// Generated from the dac-plane Surface API contract by scripts/contract.ts. Do not edit.\n\n";
  return banner + astToString(ast);
}

async function files(dir: string): Promise<Map<string, Buffer>> {
  const out = new Map<string, Buffer>();
  for (const entry of await readdir(dir, { recursive: true, withFileTypes: true })) {
    if (entry.isFile()) {
      const path = join(entry.parentPath, entry.name);
      out.set(relative(dir, path), await readFile(path));
    }
  }
  return out;
}

async function latestDigest(release: string): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${repository}/releases/tags/${release}`,
    {
      headers: { accept: "application/vnd.github+json" },
    },
  );
  if (!response.ok) {
    throw new Error(`release ${release}: HTTP ${response.status}`);
  }
  const body = (await response.json()) as { assets: { name: string; digest?: string }[] };
  const asset = body.assets.find((a) => a.name === assetName(release));
  const digest = asset?.digest?.replace(/^sha256:/, "");
  if (!digest) {
    throw new Error(`release ${release} has no ${assetName(release)} with a digest`);
  }
  return digest;
}

async function sync(release: string): Promise<void> {
  const pin: Pin = { release, asset: assetName(release), sha256: await latestDigest(release) };
  await extract(await download(pin), vendored);
  await writeFile(generated, await generate(vendored));
  await writeFile(pinFile, `${JSON.stringify(pin, null, 2)}\n`);
  console.log(`vendored ${pin.asset} (sha256 ${pin.sha256})`);
}

async function check(): Promise<void> {
  const pin = JSON.parse(await readFile(pinFile, "utf8")) as Pin;
  const work = await mkdtemp(join(tmpdir(), "contract-check-"));
  const problems: string[] = [];
  try {
    const released = join(work, "contracts");
    await extract(await download(pin), released);
    const want = await files(released);
    const have = await files(vendored);
    for (const [path, bytes] of want) {
      const local = have.get(path);
      if (!local) problems.push(`missing contract/${path}`);
      else if (!local.equals(bytes)) problems.push(`changed contract/${path}`);
    }
    for (const path of have.keys()) {
      if (!want.has(path)) problems.push(`extra contract/${path}`);
    }
    if ((await generate(released)) !== (await readFile(generated, "utf8"))) {
      problems.push("src/schema.gen.ts is not generated from the pinned contract");
    }
  } finally {
    await rm(work, { recursive: true, force: true });
  }
  if (problems.length > 0) {
    console.error(`The contract differs from ${pin.release}:\n  ${problems.join("\n  ")}`);
    console.error(`Run: just contract-sync ${pin.release}`);
    process.exit(1);
  }
  console.log(`contract matches ${pin.asset} (sha256 ${pin.sha256})`);
}

const [command, release] = process.argv.slice(2);
if (command === "sync" && release) {
  await sync(release);
} else if (command === "check") {
  await check();
} else {
  console.error("usage: contract.ts sync <release> | check");
  process.exit(2);
}
