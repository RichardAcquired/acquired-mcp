import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { glob } from "glob";
import { readFile } from "fs/promises";
import { join } from "path";

/**
 * Discovers and loads available tools from the tools directory
 * @returns {Promise<Tool[]>} Array of tool objects
 */
export async function discoverTools(): Promise<Tool[]> {
  const tools: Tool[] = [];
  const toolFiles = await glob("tools/**/*.js");

  for (const file of toolFiles) {
    try {
      const content = await readFile(file, "utf-8");
      const tool = JSON.parse(content) as Tool;
      tools.push({
        ...tool,
        path: file,
      });
    } catch (error) {
      console.error(`Error loading tool from ${file}:`, error);
    }
  }

  return tools;
} 