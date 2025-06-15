import { Tool } from '../types/tool.js';
import { loadTools } from './acquired-com/tools.js';

/**
 * Discovers and loads available tools from the API
 * @returns {Promise<Tool[]>} Array of tool objects
 */
export async function discoverTools(): Promise<Tool[]> {
  return loadTools();
} 