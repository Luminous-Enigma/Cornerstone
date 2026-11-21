import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const cli = (...args) => spawnSync(process.execPath, ["src/cli.js", ...args], { encoding: "utf8", input: "" });

test("exit code 0 and JSON on stdout when readable", () => {
  const r = cli("check", "#FFFFFF", "#101B44", "--json");
  assert.equal(r.status, 0);
  assert.equal(JSON.parse(r.stdout).passes, true);
});

test("exit code 1 when not readable (planted failure)", () => {
  const r = cli("check", "#777777", "#FFFFFF", "--json");
  assert.equal(r.status, 1);
  assert.equal(JSON.parse(r.stdout).passes, false);
});

test("exit code 2 and a JSON error with a stable code for bad input", () => {
  const r = cli("check", "red", "#FFFFFF", "--json");
  assert.equal(r.status, 2);
  assert.equal(r.stdout, "", "nothing on stdout when it fails");
  assert.equal(JSON.parse(r.stderr).error.code, "BAD_COLOR");
});

test("never waits for input, and --help explains the exit codes", () => {
  const r = cli("--help");
  assert.equal(r.status, 0);
  assert.match(r.stdout, /Exit codes/);
});
