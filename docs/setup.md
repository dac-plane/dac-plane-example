# Run the example beside dac-plane

This starts the dac-plane release pinned in [`deploy/release.json`](../deploy/release.json) with real providers
(Codex in E2B sandboxes, a SeaweedFS artifact store and Keycloak) and the application beside it, on one host.
Everything comes from that release's published Compose bundle and images; nothing is built from dac-plane source.

The stack is the one dac-plane's [deploy guide](https://dac-plane.github.io/dac-plane/deploy/) describes. This page
is the short path to it; read that guide for what each service does and how to operate it.

## Before you start

- An arm64 host (the release's images are qualified on arm64), with Docker and Compose v2.24.4 or later, `jq`,
  `curl` and `openssl`. On macOS, Docker runs in a VM: give it at least 4 CPUs and 8 GB.
- [mise](https://mise.jdx.dev), which installs the pinned Node, pnpm and just: `mise install`.
- A model provider API key for Codex, and its provider name, model and base URL.
- An E2B API key and an E2B template built for dac-plane's Codex runtime. A template is built once per E2B account
  and reused; dac-plane's deploy guide lists it under Prerequisites.

## 1. Lay out the stack

`PILOT_HOME` holds the stack's configuration and every secret. It stays on this host, outside the repository, and
defaults to `~/dac-pilot`; set it to use another directory.

```sh
export PILOT_HOME="$HOME/dac-pilot"
just up
```

The first run downloads the pinned release bundle into `.work/release/`, refuses it unless its SHA-256 matches the
pin, generates a private CA, certificates and secrets under `PILOT_HOME`, and stops with the list of what only you
can provide.

## 2. Add provider keys and settings

```sh
install -m 0444 /path/to/model-api-key "$PILOT_HOME/secrets/model-api-key"
install -m 0444 /path/to/e2b-api-key   "$PILOT_HOME/secrets/e2b-api-key"
```

Then fill in the four empty lines at the end of `$PILOT_HOME/pilot.env`: `DAC_CODEX_MODEL_PROVIDER`,
`DAC_CODEX_MODEL`, `DAC_CODEX_BASE_URL` and `DAC_E2B_TEMPLATE_ID`. The keys are read from files, never from the
environment or the repository.

## 3. Start it

```sh
just up
```

This configures Keycloak and the tenant (the first run creates the tenant, its owner, and the runtime, environment
and artifact store providers), then starts the stack and the application and waits until every service is healthy.
It is safe to run again: identifiers are kept in `$PILOT_HOME/pilot.ids` and reused.

Open <http://127.0.0.1:3000>. The application acts as the tenant's owner, through the `pilot-owner` client; its token
stays in the server and never reaches the browser.

## 4. Try it

1. **Agents:** create an agent. Its runtime and environment default to the providers the stack provisioned.
2. **Tasks:** delegate a task to it, for example a written review of a public Git repository.
3. **Attention:** the tenant's first policy asks the owner before the agent runs a command or writes a file.
   Approve once, always, or deny.
4. **The task:** follow its events, then accept the result, reject it or send it back for changes.

## Operate

```sh
just stack ps                 # the services and their health
just stack logs -f example    # the application's log
just down                     # stop everything, keeping its data
```

`just stack` passes its arguments to `docker compose` for this stack. Backups, upgrades and credential rotation are
in dac-plane's [operate guide](https://dac-plane.github.io/dac-plane/operate/).

Only the application (`127.0.0.1:3000`), the Surface API and Keycloak are published, all on loopback. To change the
application's address, set `DAC_EXAMPLE_BIND` and `DAC_EXAMPLE_PORT` in `pilot.env`. The application's API answers
only requests addressed to that address or `localhost` on the same port, and only from its own pages; if browsers reach
it by another name, list every `host:port` they use in `DAC_EXAMPLE_ALLOWED_HOSTS`.

## When something fails

- **`just up` stops with a list:** a key file or setting from step 2 is missing.
- **`just up` reports volumes of an earlier stack:** a `dac-pilot` stack ran on this host with another
  configuration, and its databases only open with that configuration's passwords. Point `PILOT_HOME` at it, or, if
  its data is no longer needed, remove the volumes it lists with `docker volume rm`.
- **A SHA-256 mismatch:** the downloaded bundle is not the pinned release; nothing is started.
- **The application shows a problem from dac-plane:** its status, title and detail are dac-plane's own; the
  application does not retry or hide them. `just stack logs dac-plane` shows the other side.
- **`/readyz` answers 503:** the application has no token or dac-plane does not answer for the tenant.
- **The API answers 403 "does not answer for that host":** the browser reached the application by an address missing
  from `DAC_EXAMPLE_ALLOWED_HOSTS`. A script calling the API sends `Origin` with each change, for example
  `-H "Origin: http://127.0.0.1:3000"` with curl.
