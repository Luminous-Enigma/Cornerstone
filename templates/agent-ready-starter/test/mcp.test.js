import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/mcp.js";

async function connect() {
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test", version: "0" });
  await Promise.all([createServer().connect(a), client.connect(b)]);
  return client;
}

// effect -> annotations, as in Cornerstone's Baseline Rule (piece 4). This is gate AG8.
const EXPECTED = { check_contrast: { effect: "READ", readOnlyHint: true, openWorldHint: false } };

test("every tool declares annotations that match its effect, and an output schema", async () => {
  const { tools } = await (await connect()).listTools();
  assert.deepEqual(tools.map((t) => t.name).sort(), Object.keys(EXPECTED).sort(), "no undeclared tools");
  for (const t of tools) {
    const want = EXPECTED[t.name];
    assert.equal(t.annotations?.readOnlyHint, want.readOnlyHint, `${t.name} readOnlyHint`);
    assert.equal(t.annotations?.openWorldHint, want.openWorldHint, `${t.name} openWorldHint`);
    assert.ok(t.outputSchema, `${t.name} has an outputSchema`);
    assert.ok(t.description.length > 60, `${t.name} has a real description`);
  }
});

test("returns structured content that matches the published JSON Schema", async () => {
  const r = await (await connect()).callTool({ name: "check_contrast", arguments: { foreground: "#fff", background: "#101b44" } });
  const schema = JSON.parse(readFileSync(new URL("../schema/contrast-result.schema.json", import.meta.url)));
  assert.deepEqual(Object.keys(r.structuredContent).sort(), [...schema.required].sort());
  assert.match(r.structuredContent.foreground, new RegExp(schema.properties.foreground.pattern));
  assert.equal(r.structuredContent.passes, true);
});

test("bad input is a clean tool error, not a crash", async () => {
  const r = await (await connect()).callTool({ name: "check_contrast", arguments: { foreground: "red", background: "#FFF" } });
  assert.equal(r.isError, true);
  assert.match(r.content[0].text, /BAD_COLOR/);
});
