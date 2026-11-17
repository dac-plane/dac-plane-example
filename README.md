# dac-plane example

The reference application for [dac-plane](https://github.com/dac-plane/dac-plane). Create agents, delegate work to
them, decide what they may do, and review what they deliver, through dac-plane's published Surface API only.

It is a small web app built for the pilot team to use, not a product: tasks, approvals, results and reviews stay in
dac-plane, and the application keeps no records of its own. Its server holds the token, so the browser never does.

It currently runs against dac-plane v0.3.0 with Codex in E2B sandboxes. Where v0.3.0 serves nothing yet, the app says
so: artifact content ([dac-plane#153](https://github.com/dac-plane/dac-plane/issues/153), merged for the next
release), a task list ([#155](https://github.com/dac-plane/dac-plane/issues/155)), a provider list
([#156](https://github.com/dac-plane/dac-plane/issues/156)), a question's words
([#157](https://github.com/dac-plane/dac-plane/issues/157)) and what an approval allows
([#161](https://github.com/dac-plane/dac-plane/issues/161)).

## Documentation

* [Run the example beside dac-plane](docs/setup.md) - start the pinned release with real providers and the app, then
  take a task from delegation to review
* [Move to a new dac-plane release](docs/upgrading.md) - bump the pinned contract and regenerate the client
* [The plan](tasks/plan.md) - what the application is, its boundary, the stages and the decisions taken

Beyond this repository:

* [dac-plane's user guide](https://dac-plane.github.io/dac-plane/) - deploying, operating and using the Surface API
* [dac-plane#97](https://github.com/dac-plane/dac-plane/issues/97) - the tracker this application delivers

## Reporting security vulnerabilities

If you have found a security vulnerability, follow
[dac-plane's instructions on how to report it](https://github.com/dac-plane/dac-plane/blob/main/SECURITY.md). Do not
open a public issue.

## Reporting an issue

If you believe you have found a defect in the application, open
[an issue](https://github.com/dac-plane/dac-plane-example/issues) with a summary, what you expected and the steps to
reproduce it. Something dac-plane does not offer is an issue in
[dac-plane](https://github.com/dac-plane/dac-plane/issues), not here.

## Getting started

You need an arm64 host with Docker, a model provider key for Codex and an E2B key. Then:

```sh
mise install
just up
```

The first run fetches the pinned dac-plane release, verifies it, generates the stack's configuration under
`~/dac-pilot` and lists the keys and settings to add. The second run starts everything and serves the app at
<http://127.0.0.1:3000>. [Run the example beside dac-plane](docs/setup.md) has the details.

## Building from source

You need [mise](https://mise.jdx.dev), which installs the pinned Node, pnpm and just from `mise.toml`.

```sh
mise install
cp .env.example .env   # then point it at a dac-plane deployment and its issuer
just install           # dependencies, exactly as locked
just dev               # the server on 127.0.0.1:3000 and the web app on Vite's port
just ci                # every check, as CI runs them
```

`.env.example` describes each setting; secrets are read from files it names, never from the environment. The server
answers `/healthz` while it runs and `/readyz` once it has a token and dac-plane answers for the tenant.

## Contributing

Before contributing, read the [contributing guidelines](CONTRIBUTING.md). Above all, the application uses only what
dac-plane publishes: never its source, its database or its simulator controls.

## License

[Apache License, Version 2.0](LICENSE).
