# The gates and their test suite

The Going Public gates ([`scripts/public-gates.sh`](../scripts/public-gates.sh)) check a repo
before it is made public. Their test suite ([`scripts/test-gates.sh`](../scripts/test-gates.sh))
proves each gate catches what it is built to catch, and does not cry wolf. Rule 1 of
[Checks that really catch things](BASELINE_RULE.md#checks-that-really-catch-things), in full.

```bash
bash scripts/test-gates.sh
```

```bash
bash scripts/public-gates.sh
```

Either takes gate names to run only those (`bash scripts/test-gates.sh GP2 GP5`).

## The gates

| Gate | Checks                                                                                     |
|------|--------------------------------------------------------------------------------------------|
| GP0  | The gates can see everything: a full clone (not shallow), every submodule checked out      |
| GP1  | Every author, committer and tagger email in the full history is a noreply address          |
| GP2  | No secret-bearing or generated binary files, by name or content, now, in history or zipped |
| GP3  | No secrets in the full history (gitleaks); nothing silenced without the owner's approval   |
| GP4  | No dangerous workflow triggers, no outsider text in shell commands, no switched-off checks |
| GP5  | Every JSON, YAML, notebook and Markdown JSON block parses; files match their local schema  |
| GP6  | No license file or license field without the owner's dated approval                        |
| GP7  | Every action is pinned to a full commit with a version comment, and Dependabot is on       |
| GP8  | zizmor finds no workflow problems (online in CI, so impostor commits are caught)           |

## The 15 kinds of planted failure

Every gate GP1 to GP7 is tested against all 15 kinds (105 in all), plus look-alikes.

| Kind | Name                    | What it tries                                                       |
|------|-------------------------|---------------------------------------------------------------------|
| 1    | Plain                   | The textbook case                                                   |
| 2    | Written differently     | Same thing, other syntax (inline list, committer instead of author) |
| 3    | Somewhere else          | Another branch, folder or file                                      |
| 4    | Hidden in history       | Committed, then deleted                                             |
| 5    | Sneaky edge             | Capitals, quotes, empty files, byte-order marks                     |
| 6    | Renamed or moved        | A keystore called `release.dat`, a key pasted into notes            |
| 7    | Encoding tricks         | Invisible characters, look-alike letters, Windows line endings      |
| 8    | Side door               | Zip, tar, symlink, submodule, composite action, notebook output     |
| 9    | Many at once            | Several problems: every one must be listed, not just the first      |
| 10   | Blind environment       | Shallow clone, missing tool, unreadable file                        |
| 11   | Deliberately disguised  | Base64, YAML aliases, deep nesting, `//` in a path                  |
| 12   | Look-alike source       | Typosquatted names, fake noreply domains, duplicate keys            |
| 13   | Drift over time         | An old scanner, a stale schema, pins without Dependabot             |
| 14   | Silenced by settings    | `.gitleaksignore`, `continue-on-error`, path filters, `git replace` |
| 15   | Tampering with the gate | A weakened copy of the gate must be noticed                         |

**Look-alikes** are the opposite test: things that resemble a problem but aren't (`.env.example`,
a noreply address, `tsconfig.json` with comments, a placeholder token). Every gate must pass them,
because a gate that cries wolf gets switched off.

## The bar

- **Gates: 100%.** Every planted failure is caught and every look-alike passes, or the case is a
  documented limit below. A gate is code with an exact answer, so anything less is a bug. (For
  comparison, mutation-testing tools such as Stryker call 80% of planted bugs caught "high"; a
  gate that guards a public release needs all of them.)
- **Results now:** 100 of the 105 caught, 5 documented limits, every look-alike passes.

## Documented limits

A limit is a case no file check can decide. Each one names the control that covers it instead,
and the suite reports it as LIMIT (and fails if a gate starts catching it, so this list stays
true).

| Gate | Kind | Case                                      | Covered by                                                 |
|------|------|-------------------------------------------|------------------------------------------------------------|
| GP3  | 11   | A token assembled in code from two pieces | Secrets only in Actions secrets, push protection, rotation |
| GP5  | 4    | A broken file only in old history         | GP5 runs on every pull request, so it can't reach main     |
| GP6  | 14   | An approval note written by someone else  | Branch protection: only the owner merges                   |
| GP7  | 8    | A pinned remote action that uses tags     | Review the pinned commit; zizmor online in CI              |
| GP7  | 10   | A pin to a commit that doesn't exist      | zizmor's online impostor-commit audit in CI (GP8)          |

## Tampering (kind 15)

- The suite makes a weakened copy of each gate and checks the planted failure gets through it:
  proof the suite would notice.
- In CI, the **tamper guard** runs `main`'s test suite against the pull request's gates
  (`GATES=<path> bash test-gates.sh`). A pull request that weakens a gate and edits the tests to
  match still fails, because `main`'s tests are the judge.

## Settings

| Setting                   | Effect                                                                       |
|---------------------------|------------------------------------------------------------------------------|
| `GATES=<path>`            | test-gates.sh tests that copy of the gates                                   |
| `REQUIRE_TOOLS=1`         | test-gates.sh fails, instead of skipping, when gitleaks or zizmor is missing |
| `GH_TOKEN`                | GP8 runs zizmor's online audits                                              |
| `ZIZMOR_REQUIRE_ONLINE=1` | GP8 fails without a token (CI sets it)                                       |
| `ZIZMOR_OFFLINE=1`        | GP8 runs offline even with a token                                           |

## Tools

`git`, `python3`, [gitleaks](https://github.com/gitleaks/gitleaks) 8.30.1 or newer, and
[zizmor](https://docs.zizmor.sh) 1.32.0 or newer with PyYAML and jsonschema. CI installs gitleaks
from its release with a checksum check, and the Python tools from
[`scripts/requirements-gates.txt`](../scripts/requirements-gates.txt) with hashes:

```bash
pip install --require-hashes --no-deps -r scripts/requirements-gates.txt
```
