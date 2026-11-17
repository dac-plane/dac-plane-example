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
- The web app:
  - **Agents:** list, create, revise and retire them.
  - **Tasks:** delegate a task to an agent, and see every task with its state, kept live from the event stream.
  - **A task:** its state, attempt and events as they happen; cancel it; review its result: accept, reject, or
    send it back for changes.
  - **Attention:** what is waiting on you, live. Approve an action once or always, or deny it, after seeing the
    exact connector call it would allow. Answer a question.
  - Every refusal shows dac-plane's own problem: status, title and detail.

What dac-plane v0.3.0 does not offer yet, and the app says so where it matters: artifact content
([dac-plane#153](https://github.com/dac-plane/dac-plane/issues/153)), a task list
([#155](https://github.com/dac-plane/dac-plane/issues/155)), a provider list
([#156](https://github.com/dac-plane/dac-plane/issues/156)), and the words of a question and of its answer
([#157](https://github.com/dac-plane/dac-plane/issues/157)).

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
