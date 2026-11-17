# Move to a new dac-plane release

The application builds against one dac-plane release at a time. Its Surface API contract is vendored from that
release and pinned in `packages/surface-client/contract.json`.

## Steps

```sh
just contract-sync v0.4.0   # vendor that release's contract, record its SHA-256, regenerate the types
just ci                     # the type checker shows what the new contract changed
```

`contract-sync` takes the SHA-256 GitHub reports for the release's `dac-plane-contracts-<version>.tar.gz`,
downloads the asset, refuses it on a mismatch, replaces `packages/surface-client/contract/` and regenerates
`packages/surface-client/src/schema.gen.ts`.

Fix what `just ci` reports, read the release notes for behaviour that types cannot show, and commit the
contract, the pin and the code changes together.

## What keeps the pin honest

`just contract-check`, part of `just ci` and CI, downloads the pinned asset again, refuses it unless its
SHA-256 matches the pin, and fails if any vendored file or the generated types differ from it. The vendored
files are never edited by hand or by the formatter.
