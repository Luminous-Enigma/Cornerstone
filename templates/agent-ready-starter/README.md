# Agent-ready starter

A small, complete example of the [Baseline Rule](../../docs/BASELINE_RULE.md): a tool that checks
whether text in one color is readable on another (WCAG AA), usable by a person, a command line,
CI and an AI agent. Copy this folder to start a new project, then replace the contrast check
with your own core.

| Piece             | Here                                                                                             |
|-------------------|--------------------------------------------------------------------------------------------------|
| 1. Data           | [`schema/contrast-result.schema.json`](schema/contrast-result.schema.json) (JSON Schema 2020-12) |
| 2. CLI            | `npx contrast check "#FFFFFF" "#101B44" --json` ([`src/cli.js`](src/cli.js))                     |
| 3. CI             | [`.github/workflows/ci.yml`](.github/workflows/ci.yml)                                           |
| 4. MCP            | `npm run mcp` ([`src/mcp.js`](src/mcp.js)): tool `check_contrast`                                |
| 5. Skill and docs | [`SKILL.md`](SKILL.md), [`AGENTS.md`](AGENTS.md)                                                 |
| 6. Versions       | `package.json` version, [`CHANGELOG.md`](CHANGELOG.md)                                           |
| Agent tests       | [`evals/`](evals/): tasks, graders written in code, and tests for the graders                    |

One source of truth: the CLI and the MCP server both call [`src/core.js`](src/core.js).

## Run it

Needs Node 20 or newer.

```bash
npm install
```

```bash
npm test
```

```bash
npx contrast check 777 FFF
```

To use the MCP server from Claude Code: `claude mcp add contrast -- node src/mcp.js`.

## Every check is proven to catch something

The tests include planted failures: an unreadable pair the checker must reject, bad input the
CLI must refuse with exit code 2, annotations that must match the tool's effect, and runs the
graders must fail. Breaking the code on purpose (a wrong threshold, a tool that claims to
write, a grader that stops checking) makes `npm test` fail.

## MCP version

Built with the official TypeScript SDK 1.32.2, which supports MCP protocol versions up to
2025-11-25. The 2026-07-28 specification makes MCP stateless; move to it when the SDK does.
