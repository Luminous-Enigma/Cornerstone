# Where Cornerstone's rules come from

Each rule points to a public standard, so it can be checked against the source instead of taken
on trust. Checked November 2026; recheck a standard before relying on a detail of it.

| Standard                                                             | What we take from it                                                   | Where in Cornerstone                    |
|----------------------------------------------------------------------|------------------------------------------------------------------------|-----------------------------------------|
| [OpenSSF Scorecard](https://scorecard.dev)                           | Pinned dependencies, token permissions, dangerous workflows, binaries  | GP2, GP4, GP7, `scorecard.yml` workflow |
| [zizmor](https://docs.zizmor.sh)                                     | GitHub Actions audits: triggers, injection, impostor commits, cooldown | GP4, GP7, GP8                           |
| [gitleaks](https://github.com/gitleaks/gitleaks)                     | Secret scanning over full history, inside archives and encodings       | GP3                                     |
| [NIST SSDF, SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final) | Prepare, protect, produce, respond: protect code, verify releases      | Going Public checklist, gates in CI     |
| [NIST SP 800-218A](https://csrc.nist.gov/pubs/sp/800/218/a/final)    | The same practices extended to AI models and AI-built software         | Agent tests, safety rule                |
| [OWASP Top 10 for LLM Applications](https://genai.owasp.org)         | Prompt injection (LLM01), excessive agency                             | Untrusted text rule, AG9, safety rule   |
| [OWASP Top 10 for Agentic Applications](https://genai.owasp.org)     | Agent goal hijack (ASI01)                                              | AG9, "must not be fooled" agent tests   |
| [Model Context Protocol](https://modelcontextprotocol.io)            | Tool annotations, OAuth sign-in, stateless design                      | Baseline Rule piece 4, Agent-ready apps |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                            | Text contrast of at least 4.5:1 (AA)                                   | Style guide, contrast checker starter   |
| Mutation testing ([Stryker](https://stryker-mutator.io))             | Plant bugs on purpose and count how many the tests catch               | Planted failures, the 15 kinds          |
| pass^k ([τ-bench](https://arxiv.org/abs/2406.12045))                 | An agent must succeed on every one of k runs, not just once            | Agent test thresholds                   |

## Where Cornerstone is stricter

- **Gates catch 100%** of planted failures. Stryker's default calls 80% "high" and 60% "low";
  a gate guarding a public release has an exact answer, so anything below 100% is a bug.
- **Safety agent tests pass every run** (10 of 10). τ-bench showed agents that pass a task once
  often fail it on repeat runs; one unsafe action is one too many.
- **Dependabot waits 7 days** before adopting a release, so a bad release has time to be caught.
