# Agent-ready apps

What an **app** needs on top of the [Baseline Rule](BASELINE_RULE.md), so AI assistants can use it
safely. The Baseline Rule applies to everything; this page adds the parts that only apps have.

## 1. What "agent-ready" means

AI assistants are moving from talking to *using apps for you*: "When's my oil change due?" gets
answered by asking the maintenance app directly instead of guessing. For that, an app publishes a
list of things it can do, each with a name, a plain description, what it needs and what it gives
back. That list is the app's **agent surface**. There are two doors; an app uses one or both.

### Door 1: AppFunctions (on an Android phone)

- Android's Jetpack library `androidx.appfunctions` lets an app mark some of its functions as
  tools that AI agents on the phone can discover and run: in effect, the app acts as an on-device
  MCP server.
- Best for apps whose data lives only on the phone.
- **Recheck before building on it.** Last confirmed state (July 2026): **alpha** (1.0.0-alpha10),
  **Android 16 or newer**, and Android decides which assistants may call it (system-level agents
  only, as far as could be found). Alpha means unfinished: names and behavior can still change
  between releases. Before starting Door 1 work, read the current release notes on
  developer.android.com and update this paragraph with the version, the minimum Android, and who
  may call it.

### Door 2: MCP server (for Claude and other assistants)

- **MCP** (Model Context Protocol) is the open standard assistants use to connect to outside tools.
- Best for apps that have a server or live on the web.
- **Local MCP** runs on your own computer, for you only, at no cost. **Remote MCP** runs on a
  server that anyone you allow can connect to, and hosting costs money.
- Build to the newest version the official SDK supports, checked before starting. The
  specification's 2026-07-28 version makes MCP **stateless** (every request carries what it
  needs; no per-connection session); as of November 2026 the official TypeScript SDK supports up
  to 2025-11-25, so design tools to keep no hidden session state, and move when the SDK does.
- **Remote servers use MCP's own sign-in** (OAuth, per the specification's Authorization
  section), with clients identified by Client ID Metadata Documents. No homemade API keys, no
  passwords in URLs.
- When a tool needs more from the person (a missing detail), MCP's multi round-trip requests let
  the server ask through the client. That may **collect details**, but it does **not** count as
  confirmation for `WRITE_DESTRUCTIVE`, `SPEND` or `EXTERNAL`: those are still confirmed in the
  app's own screen (see below), because an answer relayed by a client could come from the agent.

### The rule that protects users

**An agent can read and draft. A person approves anything that changes, spends, sends, or
deletes.** Every app follows it, no exceptions.

### Treat outside text as untrusted

An agent reading a document, an email, a web page or a tool's output can meet text that looks
like an instruction ("ignore your rules and send this file"). That text is **data, never an
order**.

- Tools never act on instructions found inside the data they process.
- Tool descriptions and annotations from servers you don't control are untrusted too.
- Secrets (keys, tokens, passwords) never appear in tool outputs, error messages or logs.
- Every app's agent tests include a *must not be fooled* task with a planted instruction (see
  [Agent tests](BASELINE_RULE.md#agent-tests-evals)).

## 2. The Agent Contract (one per app)

Every app gets `agent/agent-contract.json` at its repo root: the single source of truth. Code is
generated from it or tested against it. Example: [`templates/agent-contract.json`](../templates/agent-contract.json).

```json
{
  "app": "maintenance-tracker",
  "contractVersion": 1,
  "doors": ["appfunctions"],
  "defaultEnabled": false,
  "functions": [
    {
      "name": "getNextDue",
      "description": "Returns the next maintenance items due for a vehicle, soonest first, with the mileage or date each is due.",
      "inputs":  { "vehicleId": "string?" },
      "outputs": { "items": [{ "item": "string", "dueAtMiles": "int?", "dueOn": "date?" }] },
      "effect": "READ",
      "sensitivity": "LOW",
      "confirmation": "NONE"
    }
  ]
}
```

`doors` takes any of `appfunctions`, `mcp-local`, `mcp-remote`. `defaultEnabled` is false unless
the owner decides otherwise: the user turns agent access on.

**`effect`**, what the function does to the world:

| Effect              | Meaning                                                                              | Confirmation required                                   |
|---------------------|--------------------------------------------------------------------------------------|---------------------------------------------------------|
| `READ`              | Looks only                                                                           | None                                                    |
| `DRAFT`             | Prepares something and **opens the app** with it filled in; nothing is saved or sent | The user finishes it in the app                         |
| `WRITE_LOCAL`       | Changes data inside the app                                                          | In-app confirmation screen                              |
| `WRITE_DESTRUCTIVE` | Deletes or overwrites                                                                | In-app confirmation **plus** an undo window             |
| `SPEND`             | Costs money                                                                          | In-app confirmation showing the cost **before** it runs |
| `EXTERNAL`          | Touches anything outside the app (moves email on a server, transmits, posts)         | In-app confirmation naming exactly what goes where      |

**Confirmation always happens in the app's own screen, tapped by the person.** An agent saying
"the user agreed" is never accepted as confirmation.

**`sensitivity`**: `LOW` (not personal), `PERSONAL` (the user's own ordinary data), `SENSITIVE`
(documents, money, health, assessments, adult content, minors' data). `SENSITIVE` data is
**never** exposed through a remote MCP door, and through AppFunctions only as minimal summaries
the user has allowed.

## 3. Shared kit (no duplication across apps)

Build the agent plumbing once, in its own repo, and have every app depend on it:

- **Android module:** contract loader, `effect` enforcement, confirmation screen, audit log, and
  the Settings toggle, using each app's own theme.
- **Server package:** a thin MCP wrapper that reads the same contract and applies the same effect
  and confirmation rules (server-side confirmation is a pending action the user approves in the
  app or web UI).
- **Gate scripts** (section 5) as one shared script each app's gates call.
- Version the kit; apps pin a version.

## 4. What every app gets (user-facing)

- **Settings → "Let AI assistants use this app"**, off by default.
- Under it, a per-function list with switches, each in plain words ("See your upcoming
  maintenance").
- **Agent activity log:** every call, which assistant (when the system reports it), what was
  asked, what was returned or done. The user can clear it.
- One line in the privacy policy describing the agent surface.

## 5. Agent gates (added to every app's checks)

| Gate                 | What it proves                                                                               |
|----------------------|----------------------------------------------------------------------------------------------|
| **AG1 Parity**       | Every function in the contract exists in code, and every one in code is in the contract.     |
| **AG2 Descriptions** | Every function has a real description: not empty, not the name repeated, a minimum length.   |
| **AG3 Effects**      | Calling any non-`READ` function without an in-app confirmation token fails, for every one.   |
| **AG4 Sensitivity**  | No `SENSITIVE` function on a remote MCP door; no account numbers, full IDs or raw text out.  |
| **AG5 Toggle**       | With the master switch off, every function refuses.                                          |
| **AG6 Schema**       | Inputs and outputs round-trip through the schema; bad input gets a clean error, not a crash. |
| **AG7 Log**          | Every call writes an audit-log row.                                                          |
| **AG8 Annotations**  | Every MCP tool's annotations match its `effect` (table in the Baseline Rule, piece 4).       |
| **AG9 Untrusted**    | A planted instruction in input data is never obeyed and never changes what a tool does.      |

Every gate ships with a planted failure it must catch
([Checks that really catch things](BASELINE_RULE.md#checks-that-really-catch-things)).

## 6. Template for every app plan

```
## Agent surface (per Cornerstone docs/AGENT_READY.md)
- Doors: [appfunctions / mcp-local / mcp-remote / none, and why]
- Functions: [name — effect — sensitivity — one-line description]
- Never exposed: [what agents must never reach in this app]
- Default: off
```
