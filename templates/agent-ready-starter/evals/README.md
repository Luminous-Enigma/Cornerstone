# Agent tests

Tasks an AI agent must complete using only this project's skill and tools, graded by code.
The rules are in Cornerstone's [Baseline Rule](https://github.com/Luminous-Enigma/Cornerstone/blob/main/docs/BASELINE_RULE.md#agent-tests-evals).

| File                      | What it proves                                                                     |
|---------------------------|------------------------------------------------------------------------------------|
| `tasks/*.json`            | The tasks: prompt, how to grade, the broken variant that must fail, pass-rate rule |
| `graders.js`              | Pass or fail, decided by code from the agent's tool calls and answer               |
| `../test/graders.test.js` | The graders pass good runs and fail known-bad ones                                 |

## Running them

A runner gives each task to an AI agent connected to `src/mcp.js` with `SKILL.md` loaded, records
its tool calls and final answer, and calls `grade(task, run)`: 3 times per task in the quick tier
and 10 in the full tier, then runs each broken variant the same way to prove the task can fail.

The runner calls a paid AI model, so it isn't run automatically here: running it spends money,
which the safety rule says a person approves. Add it when a project wires up its model and API
key (kept in GitHub Actions secrets), and write the cost per run in the project's README.
