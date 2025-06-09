import { toolPaths } from "../tools/paths.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

interface ToolModule {
  apiTool: Tool;
}

/**
 * Discovers and loads available tools from the tools directory
 * @returns {Promise<Tool[]>} Array of tool objects
 */
export async function discoverTools(): Promise<Tool[]> {
  const toolPromises = toolPaths.map(async (file) => {
    const module = await import(`../tools/${file}`) as ToolModule;
    return {
      ...module.apiTool,
      path: file,
    };
  });
  return Promise.all(toolPromises);
} 