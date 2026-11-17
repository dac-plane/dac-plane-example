# Contributing

This repository follows the conventions of [dac-plane](https://github.com/dac-plane/dac-plane/blob/main/CONTRIBUTING.md).

## Commits and pull requests

- Commits and pull request titles are conventional commits: `type(optional scope)optional-!: subject`, with
  type one of `feat`, `fix`, `perf`, `deps`, `revert`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`,
  `style`. The subject is lowercase, imperative and has no closing period. `.github/workflows/pr-title.yml`
  enforces the same list.
- Pull request bodies follow `.github/PULL_REQUEST_TEMPLATE.md`, including what was not verified.
- Never put the skip-CI marker in a pull request body.
- The author merges a pull request once its checks pass and its description is filled. Review-bot findings
  are verified against the code: the valid ones are fixed, and false positives are answered with the
  mechanism.

## The boundary

The application uses only what dac-plane publishes: the Surface API, the OpenAPI document and the JSON
Schemas from a release, the released images and the released adapter kit. It never imports dac-plane source,
reads its database or uses simulator controls. When it needs something dac-plane does not offer, that is an
issue in dac-plane, not a workaround here.

## Checks

Every check is a recipe in the `justfile`, and CI runs the same recipes. Run `just ci` before opening a pull
request.

## Hygiene

- No secrets in the tree, a log, CI output or a pull request body. Provider keys stay in local files outside
  the repository.
- `.work/` is local scratch and is never committed.
- Dependencies resolve only to versions at least a week old (`minimumReleaseAge` in `pnpm-workspace.yaml`,
  `cooldown` in `.github/dependabot.yml`).
