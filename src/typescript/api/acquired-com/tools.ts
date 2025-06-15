import { Tool } from '../../types/tool.js';
import { createPaymentLinkTool } from './payment-link';

export async function loadTools(): Promise<Tool[]> {
  return [createPaymentLinkTool()];
} 