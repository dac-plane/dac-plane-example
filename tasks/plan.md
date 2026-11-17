# Reference application for dac-plane

Tracker: https://github.com/dac-plane/dac-plane/issues/97 (epic #94).
Builds against: dac-plane `v0.3.0`, Surface API `1.2.0`, adapter kit `v0.3.0`, from the release's
`release-manifest.json`, `dac-plane-contracts-v0.3.0.tar.gz` and `dac-plane-compose-v0.3.0.tar.gz`.

## What it is

A small web application for delegating work to dac-plane agents and following it to a reviewed result, built
to be used by the pilot team rather than thrown away after a demo. It holds no product records: tasks,
attention, decisions, revisions and reviews stay in dac-plane, and the application keeps only sessions.

It makes no product claim. Its polish is limited to what the lifecycle flows need; a first-party workspace
is a separate, later decision.

**First scenario: review a repository.** The owner gives an agent a public Git repository and asks for a
written review. The agent clones it in its sandbox, may ask the owner a question, writes its review as an
artifact and proposes a result; the owner reads it, requests changes or accepts it.

## Boundary

- Only the published Surface API, the released OpenAPI document and adapter kit v0.3.0. No dac-plane source,
  no `internal/` packages, no database access, no simulator controls.
- dac-plane failures are shown as they are: the problem's status, type and detail reach the user.
- No secret in the browser, the repository, a log or CI output.

## Stack

| Part | Choice | Why |
|---|---|---|
| Web UI | TypeScript, React, Vite, TanStack Query | A client in another language than dac-plane proves the published contract stands on its own. |
| API client | Generated from the released `surface-v1.json` with openapi-typescript and openapi-fetch | Types come from the contract, and a version bump regenerates them. |
| Server | TypeScript on Node (Fastify) | Holds tokens server-side, relays the event stream, adds idempotency keys and ETags. |
| Connector | Go on adapter kit v0.3.0 | Shows the released kit used outside the repository. |
| Workspace | pnpm workspace plus one Go module |  |
| Deployment | One application image; a compose file that runs it beside the released dac-plane stack, pinned by digest |  |

## Stages

Each stage is one pull request in this repository, with its own CI.

1. **Scaffold.** pnpm workspace, strict TypeScript, lint and format, Vitest, the CI workflow, the PR title
   gate, CONTRIBUTING and the PR template following dac-plane's conventions, dependency updates.
2. **Contract and client.** Vendor `surface-v1.json` from the release with its digest; generate the client;
   a check that fails when the vendored document differs from the pinned release asset.
3. **Server.** Configuration; a token source behind one interface, client credentials of one service
   principal for now; typed calls with `Idempotency-Key` and `If-Match`; problem documents passed through;
   the task and tenant event streams relayed with `Last-Event-ID` resumption and reset handling.
4. **UI, delegation.** Agents: list, create, revise, retire. Submit a task to an agent. Task page with its
   state, attempts and live events. Cancel.
5. **UI, authority and results.** Attention inbox and decisions, including the connector-call proposal
   view; result revisions with their artifacts; review: accept, request changes, reject.
6. **Deployment.** Application image; compose overlay on the released bundle; setup guide for a new user.
7. **Smoke test and evidence.** An end-to-end test of the repository review against a running stack;
   screenshots or a recording; evidence linked from #97.
8. **Connector (optional for the first release).** A small Go connector on the kit, used by the scenario
   under an `ask` grant.

## Depends on dac-plane

- **#153, artifact metadata and download.** Surface API 1.2.0 lists artifact identifiers only. Stage 5 shows
  the identifiers until #153 ships, and the downloads follow with it.
- **User sign-in.** Deferred: one service principal for now. Stage 3 keeps the token source behind an
  interface so OpenID Connect sign-in (authorization code with PKCE) for each user can replace it. A web
  application whose users sign in themselves needs no dac-plane change; only a chat surface needs #152.

## Practices adopted from comparable reference applications

- **One command to start** (as dotnet/eShop's single `dotnet run`): `just up` brings up the released stack and
  the application.
- **Production-lite, and a base to build on** (the OpenTelemetry demo's stated goals): real providers, real
  deployment shape, no product claims.
- **Pinned to a release, moved by a pull request.** A sample in a separate repository drifts from what it
  demonstrates unless something moves it. Each dac-plane release opens a bump here that regenerates the
  client and reruns the checks.
- **The example is also an end-to-end test of dac-plane.** Its smoke test can later join dac-plane's release
  qualification.
- **Tokens stay on the server** (the Backend for Frontend pattern of the IETF draft "OAuth 2.0 for
  Browser-Based Applications").

## Decisions

- **The smoke test runs locally with the provider keys the pilot already uses** (Camer, E2B and its template),
  read from local files and never copied into the repository or CI. Running it in the example's CI with
  repository secrets is deferred.

## Open questions

- **The identity provider for users**, when sign-in is added: the pilot's Keycloak or the Camer endpoint.
