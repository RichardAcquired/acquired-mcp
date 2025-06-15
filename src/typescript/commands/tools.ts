import { Tool } from '../types/tool.js';
import { createPaymentLinkTool } from '../api/acquired-com/payment-link.js';

export async function registerToolsCommand(): Promise<Tool[]> {
  return [createPaymentLinkTool()];
} 