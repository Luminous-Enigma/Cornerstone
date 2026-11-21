# Going Public checklist

**Applies to:** every repo before it is made public, including this one.
**Rule:** the repo stays **private** until every item passes and the results have been shown to
the owner. **Only the owner makes a repo public.**

1. **Commit identity.** Every commit uses a GitHub noreply address (`<id>+<user>@users.noreply.github.com`) or a bot's noreply. No personal email in any commit.
   - *Checked by:* Gate GP1 scans every author and committer email in the full history.
   - *In Cornerstone:* [`scripts/public-gates.sh`](../scripts/public-gates.sh)

2. **.gitignore** excludes `local.properties`, keystores (`*.jks`, `*.keystore`), signing configs, `.env` files, `google-services.json`, model files, map files, build outputs.
   - *Checked by:* Gate GP2 fails if any such file is tracked anyway.
   - *In Cornerstone:* [`templates/gitignore`](../templates/gitignore)

3. **Secrets** (signing keys, tokens) live only in GitHub Actions secrets. A secret scanner runs over the **full** history. Anything ever committed is **replaced (rotated)**, not just deleted.
   - *Checked by:* Gate GP3: `gitleaks git --log-opts=--all`.
   - *In Cornerstone:* [`scripts/public-gates.sh`](../scripts/public-gates.sh)

4. **GitHub settings** the owner turns on: secret scanning, push protection, Dependabot alerts, security and version updates, private vulnerability reporting, approval for workflows from first-time contributors.
   - *Checked by:* Manual, owner.
   - *In Cornerstone:* [`templates/github/dependabot.yml`](../templates/github/dependabot.yml)

5. **Workflows** use `pull_request`, never `pull_request_target`. Forked pull requests never get secrets. Release signing runs only on the owner's manual trigger, from `main`. Every third-party action is **pinned to an exact commit** (`uses: actions/checkout@<40-character commit> # v7.0.1`), so a hijacked release tag can't slip new code into the build; Dependabot keeps the pins up to date.
   - *Checked by:* Gate GP4 (no `pull_request_target`) and gate GP7 (every `uses:` is pinned to a full commit).
   - *In Cornerstone:* [`templates/github/workflows/`](../templates/github/workflows/)

6. **Shared code** from private repos is copied into `/shared` and listed in `SHARED_SOURCES.md` with source and date. Switch to depending on it if it goes public.
   - *Checked by:* Review.
   - *In Cornerstone:* [`templates/SHARED_SOURCES.md`](../templates/SHARED_SOURCES.md)

7. **No real personal data.** Test data is made up. The issue template and `SECURITY.md` warn against posting real documents, addresses or personal details, and explain private security reporting.
   - *Checked by:* Review, plus gates GP2 and GP3.
   - *In Cornerstone:* [`templates/SECURITY.md`](../templates/SECURITY.md), [`templates/github/ISSUE_TEMPLATE/`](../templates/github/ISSUE_TEMPLATE/)

8. **License.** Stop and ask the owner before adding a LICENSE file. Check every dependency's license automatically, not by hand: copyleft licenses (GPL, AGPL, LGPL) can decide the project's own license (GPL-3.0 code generally means the app is GPL-3.0 too), and some licenses aren't free to use at all.
   - *Checked by:* Gate GP6 (no LICENSE without a `.license-approved` file), plus a dependency license report in CI for the repo's ecosystem: `npx license-checker-rseidelsohn --summary` (npm), `pip-licenses` (Python), the `licensee` Gradle plugin (Android), failing on any license not on the repo's allowed list.
   - *In Cornerstone:* —

9. **README:** what it does, any disclaimer that applies ("not legal advice", "not an emergency service"), how to build it, the copyright line.
   - *Checked by:* Review.
   - *In Cornerstone:* This repo's [`README.md`](../README.md) as an example

## Applying it to a repo

1. Copy from `templates/`: `gitignore` (as `.gitignore`), `github/` (as `.github/`, adding the
   app's ecosystems to `dependabot.yml`, e.g. `gradle`, `npm`, `pip`), `SECURITY.md` (adjust its
   Scope section), `SHARED_SOURCES.md` (fill in the table), and `scripts/public-gates.sh`. For
   Android apps, `github/workflows/release.yml` signs releases.
2. Have the repo's own checks call `scripts/public-gates.sh`.
3. Run the gates, fix every FAIL, and show the owner the scanner output, the final `.gitignore`,
   the settings list and `SHARED_SOURCES.md`.
4. The owner makes the repo public.

## Template for every plan

```
## Going public (per Cornerstone docs/GOING_PUBLIC.md)
- Disclaimer: [not legal advice / not an emergency service / none]
- Shared copies needed: [list / none]
- License: [owner decides; note any copyleft dependencies]
- Visibility: private until the checklist passes and the owner makes it public
```
