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

# Check the GitHub workflows.
lint-workflows:
    actionlint

# The local equivalent of the CI gate.
ci: lint lint-workflows typecheck test build
