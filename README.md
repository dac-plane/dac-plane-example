# dac-plane example

A reference application for [dac-plane](https://github.com/dac-plane/dac-plane): a small web app that delegates
work to dac-plane agents and follows it to a reviewed result, using only dac-plane's published Surface API,
its released OpenAPI document and the released adapter kit.

It is built to be used by the pilot team, not thrown away after a demo, and it makes no product claim.
Tasks, approvals, results and reviews stay in dac-plane; this application keeps only sessions.

Tracked by [dac-plane#97](https://github.com/dac-plane/dac-plane/issues/97). The plan is in
[tasks/plan.md](tasks/plan.md).

## Status

A server with a health check, a web page with a heading, and a typed Surface API client generated from the
dac-plane v0.3.0 contract. The stages that follow are listed in the plan.

## Layout

```text
apps/server/   Node and Fastify: holds dac-plane tokens and relays the API to the browser
apps/web/      React and Vite: the user interface
packages/surface-client/
               the Surface API contract vendored from a dac-plane release, and the client generated from it
tasks/plan.md  the plan for the work in progress
```

## Develop

You need [mise](https://mise.jdx.dev), which installs the pinned Node, pnpm and just from `mise.toml`.

```sh
mise install
just install   # dependencies, exactly as locked
just dev       # the server on 127.0.0.1:3000 and the web app on Vite's port
just ci        # lint, typecheck, test and build, as CI runs them
```

## Move to a new dac-plane release

```sh
just contract-sync v0.4.0   # vendor that release's contract, record its SHA-256, regenerate the types
just ci                     # the type checker shows what the new contract changed
```

`just contract-check`, part of `just ci` and CI, downloads the pinned release asset, refuses it unless its
SHA-256 matches the pin, and fails if any vendored file or the generated types differ from it.

## License

Apache-2.0. See [LICENSE](LICENSE).
