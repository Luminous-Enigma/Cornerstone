# The Baseline Rule: everything is agent-ready

**Applies to:** everything made under Cornerstone, in every session, every repo, every language:
apps, libraries, theme engines, scripts, data sets, documents meant to be used by software.
**Status:** In force since November 21, 2026.

> Every piece of work must be usable by a person, by a command line, by an automated check,
> and by an AI agent. If one of those four can't use it, it isn't finished.

This rule sits above the rest of the standard. [`AGENT_READY.md`](AGENT_READY.md)
adds what apps need on top (the Agent Contract, the doors, the safety gates); this rule says
that nothing, app or not, ships without the five pieces below.

## The five pieces

| Piece                            | What it is                                                                                                                                                                               | What it lets an agent or a person do                                                                |
|----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| **1. Data, not just code**       | What the work produces or uses (a theme, a list, settings, results) is a plain file in a documented format: JSON with a schema, or an existing standard such as W3C Design Tokens.       | Read, write, share and check it without running the app.                                            |
| **2. CLI**                       | A command-line tool for every main action, with `--help`, `--json` output, and exit code 0 for success and non-zero for failure.                                                         | Any script, CI job or AI can do the work from a terminal.                                           |
| **3. CI**                        | A GitHub Actions workflow that runs the tests and the work's own checks on every pull request, using the CLI.                                                                            | Nothing that breaks the promise (readability, data validity, behavior) can merge, whoever wrote it. |
| **4. MCP**                       | An MCP server exposing the same actions as tools, each with a plain description. Local first; remote only when it's worth the hosting cost.                                              | Any AI assistant can use it directly: "make me a theme in deep green and check it."                 |
| **5. Skill and docs for agents** | A `SKILL.md` that teaches an AI how to use the work well, an `AGENTS.md`/`CLAUDE.md` with how to build, test and contribute, and a README that starts with what it is and how to run it. | Agents use it correctly, not just mechanically, and pick up where the last session stopped.         |

One source of truth: the CLI, the MCP tools and the app all call the same core code, and the
data format is the same everywhere. Nothing is written twice.

## The safety rule still applies

**An agent can read and draft. A person approves anything that changes, spends, sends, or
deletes.** CLI and MCP actions that only compute, check, read or export need no approval.
Anything that writes outside the work itself (pushes, posts, deletes, spends) follows the
`effect` and confirmation rules in [`AGENT_READY.md`](AGENT_READY.md).

## How it applies to each kind of work

| Kind of work                            | 1. Data                          | 2. CLI                                                        | 3. CI                           | 4. MCP                                          | 5. Skill                     |
|-----------------------------------------|----------------------------------|---------------------------------------------------------------|---------------------------------|-------------------------------------------------|------------------------------|
| Library or engine (e.g. a theme engine) | Theme/preset files with a schema | compose, check, export, list                                  | Tests + the engine's own checks | Same actions as tools                           | How to design with it        |
| Android app                             | Exported settings and records    | A desktop/Termux tool for the app's data where it makes sense | Gates + tests on every PR       | AppFunctions and/or MCP, per the Agent Contract | How to use the app's surface |
| Web app or server                       | API schemas                      | Admin and data commands                                       | Gates + tests                   | MCP server over the API                         | How to use the API           |
| Script or one-off tool                  | Its inputs and outputs as files  | It *is* the CLI                                               | A smoke test in CI              | Only when it would be called by an agent        | A short usage note           |

## Existing work

Work that was already accepted by someone else stays as it was accepted (for example, code
already merged into another project). The agent-ready version comes as the next version in your
own repo, so nothing already approved changes under anyone.

## Checklist for every new piece of work

Paste into every plan and every pull request description:

```
## Agent-ready (per BASELINE_RULE.md)
- [ ] Data: format + schema: [file / standard]
- [ ] CLI: [commands]; --help, --json, exit codes
- [ ] CI: [workflow file]; runs tests + CLI checks on every PR
- [ ] MCP: [tools]; local / remote, and why
- [ ] Skill + AGENTS.md/CLAUDE.md + README
- [ ] Safety: every action's effect; person approves anything that changes, spends, sends or deletes
```
