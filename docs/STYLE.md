# Style and working rules

How everything under Cornerstone is written and how work is reported. These apply to people and
AI agents alike.

## Writing

- **American English:** color, gray, behavior, center, favorite.
- **Plain words.** Write for someone reading on a phone between other things: short sentences,
  the point first, no jargon without a one-line explanation.
- **Name things by what people recognize,** not by how the system is built ("notifications", not
  "webhook config").
- **Markdown tables are space-padded** so columns line up when read as plain text in a terminal,
  a diff or an editor.

## Honesty

- **Report what actually happened.** If a test fails, say so with the output. If a step was
  skipped, say which and why. If something is done and checked, say so plainly.
- **Never invent data.** Numbers, sources and quotes come from somewhere real, with a link and a
  date. If data doesn't exist, say that instead of filling the gap.
- **Label taste as taste.** A designer's pick is not "what most people choose" unless data says so.
- **Correct mistakes in the open,** including in work already shared.

## Quality

- **Prove it, don't claim it.** Visual changes come with before/after screenshots or a comparison
  script; readability claims come with measured contrast; a "no change" claim comes with a
  control run showing the method adds no noise.
- **Never weaken a test to make it pass.** Fix the cause.
- **One source of truth.** The app, the CLI and the MCP server call the same core code.

## Working with other people's projects

- Contributions to someone else's repo go in as pull requests they can accept or decline.
- Keep what they approved as they approved it; improvements come as the next version.
- Offer fixes for problems you find in their code as take-it-or-leave-it suggestions.
- Disclose AI help in contributions: "Built with help from Claude (Anthropic's AI coding
  assistant); I review and stand behind every change."
