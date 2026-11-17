# dac-plane example

A reference application for [dac-plane](https://github.com/dac-plane/dac-plane): a small web app that delegates
work to dac-plane agents and follows it to a reviewed result, using only dac-plane's published Surface API,
its released OpenAPI document and the released adapter kit.

It is built to be used by the pilot team, not thrown away after a demo, and it makes no product claim.
Tasks, approvals, results and reviews stay in dac-plane; this application keeps only sessions.

Tracked by [dac-plane#97](https://github.com/dac-plane/dac-plane/issues/97). The plan is in
[tasks/plan.md](tasks/plan.md).

## Status

- A typed Surface API client generated from the dac-plane v0.3.0 contract.
- The server: it obtains the service principal's token and passes `/api/v1/tenants/{tenant}/...` through to the
  Surface API, including commands with their `Idempotency-Key` and `If-Match`, and the event stream with
  `Last-Event-ID`. The browser never holds a token.
- A web page with a heading.

The stages that follow are listed in the plan.

## Develop

You need [mise](https://mise.jdx.dev), which installs the pinned Node, pnpm and just from `mise.toml`.

```sh
mise install
cp .env.example .env   # then point it at a dac-plane deployment and its issuer
just install   # dependencies, exactly as locked
just dev       # the server on 127.0.0.1:3000 and the web app on Vite's port
just ci        # lint, typecheck, test and build, as CI runs them
```

`.env.example` describes each setting. Secrets are read from files named there, never from the environment.
The server answers `/healthz` while it runs and `/readyz` once it has a token and dac-plane answers for the
tenant.

To build against a newer dac-plane release, see [Move to a new dac-plane release](docs/upgrading.md).

## License

Apache-2.0. See [LICENSE](LICENSE).
