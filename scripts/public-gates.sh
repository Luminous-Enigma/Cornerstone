#!/usr/bin/env bash
# Going Public gates. Run locally or in CI:  bash scripts/public-gates.sh
# Fails (exit 1) if any check fails. Requires: git, gitleaks (v8+), python3.
set -uo pipefail

fail=0
pass() { printf 'PASS  %s\n' "$1"; }
bad()  { printf 'FAIL  %s\n' "$1"; fail=1; }

# GP1: commit identity: every author/committer email in history is a noreply address.
allowed='(@users\.noreply\.github\.com|^noreply@github\.com|^noreply@anthropic\.com)$'
emails=$(git log --all --format='%ae%n%ce' | sort -u)
offenders=$(printf '%s\n' "$emails" | grep -Ev "$allowed" | grep -v '^$' || true)
if [ -z "$offenders" ]; then pass "GP1 commit identity (noreply only)"
else bad "GP1 commit identity: non-noreply emails in history:"; printf '      %s\n' $offenders; fi

# GP2: no forbidden file types are tracked (in case .gitignore was bypassed with -f).
forbidden='(^|/)(local\.properties|google-services\.json|GoogleService-Info\.plist|\.env(\..*)?)$|\.(jks|keystore|p12|pfx|pem|litertlm|tflite|bin|onnx|gguf|pmtiles|apk|aab)$'
tracked=$(git ls-files | grep -E "$forbidden" | grep -v '\.env\.example$' || true)
if [ -z "$tracked" ]; then pass "GP2 no forbidden files tracked"
else bad "GP2 forbidden files tracked:"; printf '      %s\n' $tracked; fi

# GP3: secret scan over the FULL git history (all refs).
if command -v gitleaks >/dev/null 2>&1; then
  if gitleaks git --log-opts="--all" --redact --no-banner -v . ; then pass "GP3 gitleaks full history"
  else bad "GP3 gitleaks found possible secrets (see above)"; fi
else bad "GP3 gitleaks not installed"; fi

# GP4: workflows never use pull_request_target.
if grep -rInE '^[^#]*pull_request_target' .github/workflows templates 2>/dev/null; then
  bad "GP4 pull_request_target found in a workflow (listed above)"
else pass "GP4 no pull_request_target"; fi

# GP5: every JSON file parses.
jbad=0
while IFS= read -r f; do
  python3 -c 'import json,sys; json.load(open(sys.argv[1]))' "$f" 2>/dev/null || { echo "      $f"; jbad=1; }
done < <(git ls-files '*.json')
[ $jbad -eq 0 ] && pass "GP5 JSON files parse" || bad "GP5 invalid JSON (listed above)"

# GP6: no LICENSE file without the owner's decision (remove this check once decided).
if git ls-files | grep -Eiq '^(LICENSE|COPYING)(\.|$)'; then
  if [ -f .license-approved ]; then pass "GP6 LICENSE present and approved"
  else bad "GP6 LICENSE file present without owner approval (.license-approved missing)"; fi
else pass "GP6 no LICENSE added without owner decision"; fi

exit $fail
