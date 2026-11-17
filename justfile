# Every local and CI check is a recipe here; CI calls these recipes.
# Tool versions live in mise.toml.

default:
    @just --list

# Install dependencies exactly as locked.
install:
    pnpm install --frozen-lockfile

# Rewrite files into the project's format.
fmt:
    pnpm exec biome check --write .

# Lint and check formatting without changing files.
lint:
    pnpm exec biome ci .

typecheck:
    pnpm -r typecheck

test:
    pnpm -r test

build:
    pnpm -r build

# Run the server and the web app in development mode.
dev:
    pnpm -r --parallel dev

# Vendor a dac-plane release's Surface API contract and regenerate the client types.
contract-sync release:
    pnpm --filter @dac-plane-example/surface-client contract:sync {{ release }}

# Fail if the vendored contract or the generated types differ from the pinned release.
contract-check:
    pnpm --filter @dac-plane-example/surface-client contract:check

# Check the GitHub workflows.
lint-workflows:
    actionlint

# Start the pinned dac-plane release and the application beside it (docs/setup.md).
up:
    deploy/stack.sh up

# Stop the stack, keeping its data.
down:
    deploy/stack.sh down

# Run a docker compose command against the stack, such as `just stack ps` or `just stack logs example`.
stack *args:
    deploy/stack.sh compose {{ args }}

# Build the application image.
image:
    docker build -t dac-plane-example:dev .

# Fail if the Compose overlay no longer composes with the pinned dac-plane release.
compose-check:
    deploy/stack.sh check

# The local equivalent of the CI gate.
ci: lint lint-workflows contract-check typecheck test build compose-check image
