import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_KEY =
  process.env.FIGMA_API_KEY ||
  process.argv.find((a) => a.startsWith("--figma-api-key="))?.split("=")[1];

if (!API_KEY) {
  process.stderr.write(
    "ERROR: Figma API key required via --figma-api-key=<key> or FIGMA_API_KEY env var\n"
  );
  process.exit(1);
}

const FIGMA_BASE = "https://api.figma.com/v1";
const headers = { "X-Figma-Token": API_KEY };

async function figmaGet(path) {
  const res = await fetch(`${FIGMA_BASE}${path}`, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API ${res.status}: ${text}`);
  }
  return res.json();
}

const server = new McpServer({
  name: "figma-image-urls",
  version: "1.0.0",
});

server.tool(
  "get_figma_image_urls",
  "Get hosted CDN URLs for images in a Figma file without downloading. " +
    "Returns temporary URLs (~14 days) for image fills (by imageRef) and/or " +
    "rendered node exports (by nodeId). Use these URLs directly as <img> src values.",
  {
    fileKey: z
      .string()
      .describe(
        "The Figma file key, found in the URL: figma.com/design/<fileKey>/..."
      ),
    imageRefs: z
      .array(z.string())
      .optional()
      .describe(
        "imageRef hashes from get_figma_data fill data. " +
          "The tool will return CDN URLs for these image fills."
      ),
    nodeIds: z
      .array(z.string())
      .optional()
      .describe(
        "Node IDs (e.g. '12267:22931') to render as exported images. " +
          "Use colon format, not hyphen."
      ),
    format: z
      .enum(["png", "svg", "jpg", "pdf"])
      .default("png")
      .describe("Export format for node renders"),
    scale: z
      .number()
      .min(0.01)
      .max(4)
      .default(2)
      .describe("Export scale for node renders (0.01–4, default 2)"),
  },
  async ({ fileKey, imageRefs, nodeIds, format, scale }) => {
    const results = {};

    if (imageRefs?.length) {
      const data = await figmaGet(`/files/${fileKey}/images`);
      const allFills = data.meta?.images || {};
      results.imageFills = {};
      for (const ref of imageRefs) {
        results.imageFills[ref] = allFills[ref] || null;
      }
    }

    if (nodeIds?.length) {
      const ids = nodeIds.join(",");
      const data = await figmaGet(
        `/images/${fileKey}?ids=${encodeURIComponent(ids)}&format=${format}&scale=${scale}`
      );
      results.nodeRenders = data.images || {};
    }

    if (!imageRefs?.length && !nodeIds?.length) {
      return {
        content: [
          {
            type: "text",
            text: "Provide at least one of imageRefs or nodeIds to get URLs.",
          },
        ],
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
