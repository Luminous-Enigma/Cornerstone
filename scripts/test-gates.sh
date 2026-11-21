#!/usr/bin/env bash
# Proves every Going Public gate catches what it is built to catch.
#   bash scripts/test-gates.sh          (CI sets REQUIRE_GITLEAKS=1 so GP3 is never skipped)
#
# For each gate: build a clean throwaway repo and check the gate PASSES, then plant one failure
# and check that same gate FAILS. A gate that lets its planted failure through fails this test.
# Planted failures are created at run time in a temp folder; none is ever committed here.
set -uo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
gates="$here/public-gates.sh"
problems=0
ok()   { printf 'OK    %s\n' "$1"; }
nope() { printf 'BROKEN %s\n' "$1"; problems=1; }

# A clean repo: one commit by a noreply identity, a pinned workflow, valid JSON, no LICENSE.
clean_repo() {
  local d; d="$(mktemp -d)"
  (
    cd "$d" && git init -q && git checkout -q -b main
    git config user.name "Gate Test" && git config user.email "1+gate-test@users.noreply.github.com"
    mkdir -p .github/workflows
    printf 'name: t\non:\n  pull_request:\njobs:\n  t:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1\n' > .github/workflows/t.yml
    printf '{"ok": true}\n' > data.json
    printf 'clean\n' > README.md
    git add -A && git commit -q -m "clean"
  )
  printf '%s' "$d"
}

# result_of <repo> <gate>: prints PASS or FAIL for that gate's line.
result_of() { (cd "$1" && bash "$gates" 2>/dev/null) | grep -E "^(PASS|FAIL) +$2 " | awk '{print $1}' | head -1; }

expect() { # expect <gate> <description> <plant-command...>
  local gate="$1" what="$2"; shift 2
  local repo; repo="$(clean_repo)"
  local before; before="$(result_of "$repo" "$gate")"
  if [ "$gate" = GP3 ] && ! command -v gitleaks >/dev/null 2>&1; then
    if [ "${REQUIRE_GITLEAKS:-0}" = 1 ]; then nope "GP3: gitleaks is required here but not installed"
    else printf 'SKIP  GP3 (gitleaks not installed here; CI runs it)\n'; fi
    rm -rf "$repo"; return
  fi
  [ "$before" = PASS ] || nope "$gate fails on a clean repo (got '${before:-nothing}'): it would block good work"
  (cd "$repo" && "$@") >/dev/null 2>&1
  local after; after="$(result_of "$repo" "$gate")"
  if [ "$after" = FAIL ]; then ok "$gate catches: $what"
  else nope "$gate MISSED: $what (got '${after:-nothing}')"; fi
  rm -rf "$repo"
}

plant_email()   { git -c user.email="someone@example.com" commit -q --allow-empty -m "personal email"; }
plant_file()    { touch local.properties && git add -f local.properties && git commit -q -m "file"; }
plant_secret()  { printf 'token = "%s%s"\n' "ghp_" "a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8" > config.txt && git add config.txt && git commit -q -m "secret"; }
plant_prt_block() { printf 'on:\n  pull_request_target:\njobs: {}\n' > .github/workflows/bad.yml && git add -A && git commit -q -m "prt"; }
plant_prt_inline() { printf 'on: [push, pull_request_target]\njobs: {}\n' > .github/workflows/bad.yml && git add -A && git commit -q -m "prt inline"; }
plant_json()    { printf '{"broken": \n' > broken.json && git add -A && git commit -q -m "json"; }
plant_license() { printf 'MIT License\n' > LICENSE && git add -A && git commit -q -m "license"; }
plant_unpinned() { printf 'on: pull_request\njobs:\n  t:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n' > .github/workflows/u.yml && git add -A && git commit -q -m "unpinned"; }

expect GP1 "a commit with a personal email"                  plant_email
expect GP2 "a tracked local.properties"                      plant_file
expect GP3 "a token committed in a file"                     plant_secret
expect GP4 "pull_request_target on its own line"             plant_prt_block
expect GP4 "pull_request_target inside an inline list"       plant_prt_inline
expect GP5 "a JSON file that doesn't parse"                  plant_json
expect GP6 "a LICENSE added without the owner's approval"    plant_license
expect GP7 "an action pinned to a movable tag (@v4)"         plant_unpinned

if [ $problems -eq 0 ]; then echo "All gates catch their planted failures."; else echo "Some gates are broken (see above)."; fi
exit $problems
