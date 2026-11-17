#!/bin/sh
# Runs the application beside the dac-plane release pinned in deploy/release.json,
# using only that release's published Compose bundle and images.
#
# usage: deploy/stack.sh fetch          download and verify the pinned release bundle
#        deploy/stack.sh up             configure the stack under PILOT_HOME and start it with the application
#        deploy/stack.sh down           stop it, keeping its data
#        deploy/stack.sh compose ARGS   any other docker compose command against the same stack
#        deploy/stack.sh check          check that the overlay composes with the release, without a stack
#
# PILOT_HOME (default $HOME/dac-pilot) holds the stack's configuration and every
# secret; it stays on this host, outside the repository. docs/setup.md is the guide.
set -eu

root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
pin="$root/deploy/release.json"
home=${PILOT_HOME:-$HOME/dac-pilot}

command -v jq >/dev/null || { echo "jq is required" >&2; exit 2; }
release=$(jq -er .release "$pin")
bundle="dac-plane-compose-$release.tar.gz"
work="$root/.work/release/$release"
compose_dir="$work/deploy/compose"

sha256() {
  if command -v sha256sum >/dev/null; then sha256sum "$1" | cut -d' ' -f1; else shasum -a 256 "$1" | cut -d' ' -f1; fi
}

# fetch downloads each pinned asset of the release and refuses one whose digest
# differs from the pin, then unpacks the Compose bundle.
fetch() {
  mkdir -p "$work"
  for asset in $(jq -er '.assets | keys[]' "$pin"); do
    want=$(jq -er --arg a "$asset" '.assets[$a]' "$pin")
    if [ ! -s "$work/$asset" ] || [ "$(sha256 "$work/$asset")" != "$want" ]; then
      curl -fsSL --retry 3 -o "$work/$asset.part" \
        "https://github.com/dac-plane/dac-plane/releases/download/$release/$asset"
      mv "$work/$asset.part" "$work/$asset"
    fi
    got=$(sha256 "$work/$asset")
    if [ "$got" != "$want" ]; then
      rm -f "$work/$asset"
      echo "$asset: SHA-256 $got, pinned $want" >&2
      exit 1
    fi
  done
  tar -xzf "$work/$bundle" -C "$work" deploy/compose
}

compose() {
  docker compose -p dac-pilot --env-file "$home/pilot.env" --project-directory "$compose_dir" \
    -f "$compose_dir/compose.yaml" -f "$compose_dir/compose.pilot.yaml" \
    -f "$compose_dir/compose.keycloak.yaml" -f "$root/deploy/compose.example.yaml" "$@"
}

# load exports the stack's settings and identifiers for Compose to interpolate.
load() {
  set -a
  . "$home/pilot.env"
  [ ! -f "$home/pilot.ids" ] || . "$home/pilot.ids"
  set +a
  # Before the first provisioning these are unset, and Compose interpolates
  # every service on every command; configure-pilot.sh uses the same
  # placeholders. No adapter can start with them.
  for name in DAC_RUNTIME_PROVIDER_ID DAC_ENVIRONMENT_PROVIDER_ID DAC_ARTIFACT_PROVIDER_ID DAC_TENANT_ID; do
    eval "value=\${$name:-}"
    [ -n "$value" ] || export "$name=unconfigured"
  done
  export DAC_EXAMPLE_ROOT="$root"
  export DAC_EXAMPLE_CLIENT_SECRET_FILE="$home/secrets/owner-client-secret"
}

# missing lists what only the operator can provide: provider keys and settings.
missing() {
  for file in model-api-key e2b-api-key; do
    [ -s "$home/secrets/$file" ] || echo "  $home/secrets/$file"
  done
  for name in DAC_CODEX_MODEL_PROVIDER DAC_CODEX_MODEL DAC_CODEX_BASE_URL DAC_E2B_TEMPLATE_ID; do
    grep -Eq "^$name=.+" "$home/pilot.env" || echo "  $name in $home/pilot.env"
  done
}

up() {
  fetch
  # A configuration generated now cannot open databases another configuration
  # initialized: their passwords differ. Say so instead of failing inside Keycloak.
  if [ ! -s "$home/pilot.ids" ]; then
    old=$(docker volume ls -q --filter label=com.docker.compose.project=dac-pilot)
    if [ -n "$old" ]; then
      echo "Volumes of an earlier dac-pilot stack exist, but $home has no record of it:" >&2
      echo "$old" | sed 's/^/  /' >&2
      echo "Point PILOT_HOME at that stack's configuration, or remove the volumes (docs/setup.md)." >&2
      exit 1
    fi
  fi
  "$compose_dir/generate-pilot-config.sh" "$home" "$work/release-manifest.json"
  gaps=$(missing)
  if [ -n "$gaps" ]; then
    echo "The stack needs these before it can start (docs/setup.md, step 2):" >&2
    echo "$gaps" >&2
    exit 1
  fi
  "$compose_dir/configure-pilot.sh" "$home" "$compose_dir"
  load
  compose up -d --build --wait
  echo "The application is at http://${DAC_EXAMPLE_BIND:-127.0.0.1}:${DAC_EXAMPLE_PORT:-3000}"
}

# check renders the whole stack with placeholder settings, so CI proves the
# overlay still composes with the pinned release without starting anything.
check() {
  fetch
  scratch=$(mktemp -d)
  trap 'rm -rf "$scratch"' EXIT
  : >"$scratch/file"
  {
    for name in $(grep -Eo '\$\{[A-Z0-9_]+' "$compose_dir"/compose.yaml "$compose_dir"/compose.pilot.yaml \
      "$compose_dir"/compose.keycloak.yaml "$root"/deploy/compose.example.yaml | sed 's/.*{//' | sort -u); do
      case "$name" in
        *_FILE) echo "$name=$scratch/file" ;;
        *_IMAGE) echo "$name=$(jq -r '.images["dac-plane"]' "$work/release-manifest.json")" ;;
        *_PORT) echo "$name=1" ;;
        *_BIND) echo "$name=127.0.0.1" ;;
        *) echo "$name=placeholder" ;;
      esac
    done
  } >"$scratch/env"
  DAC_EXAMPLE_ROOT="$root" docker compose -p dac-pilot --env-file "$scratch/env" --project-directory "$compose_dir" \
    -f "$compose_dir/compose.yaml" -f "$compose_dir/compose.pilot.yaml" \
    -f "$compose_dir/compose.keycloak.yaml" -f "$root/deploy/compose.example.yaml" config -q
  echo "the overlay composes with dac-plane $release"
}

case "${1:-}" in
  fetch) fetch ;;
  up) up ;;
  down) load; compose down ;;
  compose) shift; load; compose "$@" ;;
  check) check ;;
  *) sed -n '2,13p' "$0" >&2; exit 2 ;;
esac
