# Notes for AI agents

This project follows Cornerstone: https://github.com/Luminous-Enigma/Cornerstone
(Baseline Rule, safety rule, style). Put the Baseline Rule checklist in every pull request.

- **Core:** `src/core.js`. The CLI (`src/cli.js`) and the MCP server (`src/mcp.js`) only call it;
  never put logic in them.
- **Test:** `npm test`. Every check has a planted failure it must catch; if you add a check, add
  its planted failure too. Never weaken a test to make it pass.
- **Contracts:** the CLI's flags, JSON output and exit codes, the MCP tool's name, schemas and
  annotations, and `schema/` are public. Changing them is a breaking change: bump the major
  version and say so in `CHANGELOG.md`.
- **Agent tests:** `evals/`. New features get a *can-do* task; anything that writes, spends,
  sends or deletes also gets a *must-refuse-or-ask* task.
