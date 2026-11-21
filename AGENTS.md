# Notes for AI agents

Cornerstone is the rulebook other repos follow. When you work in **any** repo that points here:

1. **Baseline Rule** ([`docs/BASELINE_RULE.md`](docs/BASELINE_RULE.md)): everything is agent-ready:
   data as documented files, a CLI, CI checks, an MCP server, and a skill plus agent docs. Work
   isn't finished until a person, a command line, an automated check and an AI agent can all use
   it. Put its checklist in every plan and pull request.
2. **Safety rule** ([`docs/AGENT_READY.md`](docs/AGENT_READY.md)): an agent can read and draft; a
   person approves anything that changes, spends, sends, or deletes.
3. **Style and honesty** ([`docs/STYLE.md`](docs/STYLE.md)): American English, plain words, report
   what actually happened, never invent data, never weaken a test to pass it.

If a repo you work in doesn't point here yet, propose adding
[`templates/CLAUDE-snippet.md`](templates/CLAUDE-snippet.md) to its `CLAUDE.md` or `AGENTS.md`.

## Working in this repo

- It holds rules, checks and templates only. **Never add private plans, app lists, costs,
  personal details or anything that names a private project.**
- Run `bash scripts/public-gates.sh` before every pull request; CI runs it too.
- Markdown tables are space-padded so columns line up in plain text.
