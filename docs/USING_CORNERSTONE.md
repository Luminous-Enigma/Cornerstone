# Using Cornerstone in a repo

Cornerstone is public, so any repo can follow it, private ones included. Nothing needs to be
installed.

## 1. Point the repo at it

Add this to the repo's `CLAUDE.md` (and/or `AGENTS.md`), near the top:

```markdown
## Foundation
This repo follows Cornerstone: https://github.com/Luminous-Enigma/Cornerstone
- Baseline Rule (docs/BASELINE_RULE.md): data files, CLI, CI, MCP, and a skill plus agent docs.
- Safety rule: an agent can read and draft; a person approves anything that changes, spends,
  sends, or deletes.
- Style (docs/STYLE.md): American English, plain words, honest reporting.
Put the Baseline Rule checklist in every plan and pull request.
```

The same text is in [`templates/CLAUDE-snippet.md`](../templates/CLAUDE-snippet.md).

## 2. Put the checklists in plans and pull requests

- Every plan and pull request: the **Agent-ready** checklist from
  [`BASELINE_RULE.md`](BASELINE_RULE.md).
- Apps: the **Agent surface** template from [`AGENT_READY.md`](AGENT_READY.md).
- Before going public: the template from [`GOING_PUBLIC.md`](GOING_PUBLIC.md).

## 3. Copy the pieces the repo needs

| Need                       | Copy from Cornerstone                                             |
|----------------------------|-------------------------------------------------------------------|
| Going-public checks        | `scripts/public-gates.sh`, `templates/github/workflows/gates.yml` |
| Safe `.gitignore`          | `templates/gitignore`                                             |
| Security policy and issues | `templates/SECURITY.md`, `templates/github/ISSUE_TEMPLATE/`       |
| Dependency updates         | `templates/github/dependabot.yml`                                 |
| Signed Android releases    | `templates/github/workflows/release.yml`                          |
| An app's agent surface     | `templates/agent-contract.json`                                   |
| Copies of private code     | `templates/SHARED_SOURCES.md`                                     |

## Private notes stay private

Cornerstone holds rules only. A project's own plans, inventory, costs and decisions belong in that
project's private repo (or a private planning repo), which points back here for the rules.
