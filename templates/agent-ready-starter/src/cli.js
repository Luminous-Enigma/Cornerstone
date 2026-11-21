#!/usr/bin/env node
// CLI: never interactive, --json on every command, JSON errors, exit codes 0 / 1 / 2.
import { check, InputError } from "./core.js";

const HELP = `contrast: checks whether text in one color is readable on another (WCAG AA).

Usage:
  contrast check <foreground> <background> [--large] [--json]
  contrast --help

Examples:
  contrast check "#FFFFFF" "#101B44"
  contrast check 777 FFF --json

Exit codes:
  0  readable (passes WCAG AA)
  1  not readable
  2  bad input or usage`;

const args = process.argv.slice(2);
const json = args.includes("--json");
const large = args.includes("--large");
const words = args.filter((a) => !a.startsWith("--"));

function fail(code, message) {
  if (json) process.stderr.write(JSON.stringify({ error: { code, message } }) + "\n");
  else process.stderr.write(`${message}\nRun "contrast --help" for usage.\n`);
  process.exit(2);
}

if (args.includes("--help") || args.length === 0) {
  process.stdout.write(HELP + "\n");
  process.exit(0);
}
if (words[0] !== "check" || words.length !== 3) fail("USAGE", "Expected: contrast check <foreground> <background>");

try {
  const result = check(words[1], words[2], { large });
  if (json) process.stdout.write(JSON.stringify(result) + "\n");
  else process.stdout.write(`${result.ratio}:1, needs ${result.needed}:1: ${result.passes ? "readable" : "NOT readable"}\n`);
  process.exit(result.passes ? 0 : 1);
} catch (e) {
  if (e instanceof InputError) fail(e.code, e.message);
  throw e;
}
