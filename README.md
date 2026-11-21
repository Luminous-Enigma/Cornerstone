# Cornerstone

The foundation every project is built on: how to make software that people, command lines,
automated checks and AI agents can all use, safely.

Cornerstone is a set of rules, checks and templates. It holds no app code and no private plans.
Any repo can follow it, public or private, by pointing to it.

## The rules

| Rule                                                            | In one line                                                                                     |
|-----------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| [Baseline Rule](docs/BASELINE_RULE.md)                          | Everything ships agent-ready: data files with a schema, a CLI, CI checks, MCP, a skill and docs |
| [Safety rule](docs/AGENT_READY.md#the-rule-that-protects-users) | An agent can read and draft; a person approves anything that changes, spends, sends or deletes  |
| [Agent-ready apps](docs/AGENT_READY.md)                         | What apps add on top: the Agent Contract, the doors, the effects, and gates AG1 to AG7          |
| [Going Public](docs/GOING_PUBLIC.md)                            | The checklist and gates every repo passes before it is made public                              |
| [Style and working rules](docs/STYLE.md)                        | American English, plain words, honest reporting, prove claims, never weaken a test              |

## Using it

Add the snippet in [`templates/CLAUDE-snippet.md`](templates/CLAUDE-snippet.md) to a repo's
`CLAUDE.md` or `AGENTS.md`, put the checklists in plans and pull requests, and copy the templates
the repo needs. Step by step: [`docs/USING_CORNERSTONE.md`](docs/USING_CORNERSTONE.md).

## Checks

The Going Public gates run on every pull request here, and any repo can run them. A self-test
first proves each gate catches a planted failure, so a gate can't quietly stop working:

```bash
bash scripts/test-gates.sh
```

```bash
bash scripts/public-gates.sh
```

They need `git`, `python3` and [gitleaks](https://github.com/gitleaks/gitleaks) v8 or newer.

## What it is not

A design standard for software. Not legal advice, not a security certification, and not an
emergency service.

## License

[MIT](LICENSE): use it, change it, share it, for free. Keep the copyright line, so the credit
travels with it.
