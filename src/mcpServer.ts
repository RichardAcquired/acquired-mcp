#!/usr/bin/env node

import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { discoverTools } from "../lib/tools.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SERVER_NAME = "generated-mcp-server";

interface TransformedTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

interface ToolWithDefinition extends Tool {
  definition: {
    function: {
      name: string;
      description?: string;
      parameters?: {
        required?: string[];
        properties?: Record<string, unknown>;
      };
    };
  };
  function: (args: Record<string, unknown>) => Promise<unknown>;
}

async function transformTools(tools: ToolWithDefinition[]): Promise<TransformedTool[]> {
  return tools
    .map((tool) => {
      const definitionFunction = tool.definition?.function;
      if (!definitionFunction) return;
      return {
        name: definitionFunction.name,
        description: definitionFunction.description,
        inputSchema: definitionFunction.parameters,
      };
    })
    .filter((tool): tool is TransformedTool => Boolean(tool));
}

async function setupServerHandlers(server: Server, tools: ToolWithDefinition[]): Promise<void> {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: await transformTools(tools),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const tool = tools.find((t) => t.definition.function.name === toolName);
    if (!tool) {
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
    }
    const args = request.params.arguments || {};
    const requiredParameters =
      tool.definition?.function?.parameters?.required || [];
    for (const requiredParameter of requiredParameters) {
      if (!(requiredParameter in args)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Missing required parameter: ${requiredParameter}`
        );
      }
    }
    try {
      const result = await tool.function(args);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("[Error] Failed to fetch data:", error);
      throw new McpError(
        ErrorCode.InternalError,
        `API error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });
}

interface ServerInstances {
  [key: string]: {
    transport: SSEServerTransport;
    server: Server;
  };
}

async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const isSSE = args.includes("--sse");
  const tools = await discoverTools() as ToolWithDefinition[];

  if (isSSE) {
    const app = express();
    const instances: ServerInstances = {};

    app.get("/sse", async (_req: Request, res: Response) => {
      // Create a new Server instance for each session
      const server = new Server(
        {
          name: SERVER_NAME,
          version: "0.1.0",
        },
        {
          capabilities: {
            tools: {},
          },
        }
      );
      server.onerror = (error) => console.error("[Error]", error);
      await setupServerHandlers(server, tools);

      const transport = new SSEServerTransport("/messages", res);
      const sessionId = transport.sessionId;
      instances[sessionId] = { transport, server };

      res.on("close", async () => {
        await server.close();
        delete instances[sessionId];
      });

      await server.connect(transport);
    });

    app.post("/messages", async (req: Request, res: Response) => {
      const sessionId = req.query.sessionId as string;
      const instance = instances[sessionId];

      if (instance) {
        await instance.transport.handlePostMessage(req, res);
      } else {
        res.status(400).send("No transport/server found for sessionId");
      }
    });

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`[SSE Server] running on port ${port}`);
    });
  } else {
    // stdio mode: single server instance
    const server = new Server(
      {
        name: SERVER_NAME,
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    server.onerror = (error) => console.error("[Error]", error);
    await setupServerHandlers(server, tools);

    process.on("SIGINT", async () => {
      await server.close();
      process.exit(0);
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
}

run().catch(console.error); 