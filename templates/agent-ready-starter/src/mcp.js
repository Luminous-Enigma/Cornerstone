#!/usr/bin/env node
// MCP server: the same core as the CLI, as a tool with an output schema and honest annotations.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { check, InputError } from "./core.js";

export function createServer() {
  const server = new McpServer({ name: "agent-ready-starter", version: "0.1.0" });
  server.registerTool(
    "check_contrast",
    {
      title: "Check text contrast",
      description:
        "Checks whether text in the foreground color is readable on the background color, using the WCAG AA standard (4.5:1, or 3:1 for large text). Use it before choosing colors for any text. Returns the ratio, the ratio needed, and whether it passes.",
      inputSchema: {
        foreground: z.string().describe('Text color as hex, for example "#FFFFFF".'),
        background: z.string().describe('Background color as hex, for example "#101B44".'),
        large: z.boolean().optional().describe("True for large text (18pt, or 14pt bold), which needs only 3:1."),
      },
      outputSchema: {
        foreground: z.string(),
        background: z.string(),
        ratio: z.number().describe("Contrast ratio, from 1 to 21."),
        needed: z.number().describe("The ratio WCAG AA requires for this text size."),
        passes: z.boolean(),
      },
      // effect READ: changes nothing, talks to nothing outside, same answer every time.
      annotations: { readOnlyHint: true, openWorldHint: false, idempotentHint: true },
    },
    async ({ foreground, background, large }) => {
      try {
        const result = check(foreground, background, { large: Boolean(large) });
        return { content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result };
      } catch (e) {
        if (e instanceof InputError) return { isError: true, content: [{ type: "text", text: `${e.code}: ${e.message}` }] };
        throw e;
      }
    },
  );
  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await createServer().connect(new StdioServerTransport());
}
