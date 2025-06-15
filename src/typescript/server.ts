/**
 * MCP server entry point using stdio transport.
 *
 * This server uses the Model Context Protocol (MCP) TypeScript SDK and exposes
 * payment gateway functionality via the AcquiredPaymentGateway abstraction.
 *
 * The server is started using the StdioServerTransport, which is suitable for
 * CLI/agent integration and local development. This replaces the legacy .start() method.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { config } from './server/config';
import { AcquiredPaymentGateway } from './server/acquired-gateway';
import { PaymentLinkParams } from './types/payment';

// Debug logging
console.error('Starting MCP server...');
console.error('Environment variables:', {
  ACQUIRED_APP_ID: process.env.ACQUIRED_APP_ID,
  ACQUIRED_APP_KEY: process.env.ACQUIRED_APP_KEY,
  NODE_ENV: process.env.NODE_ENV
});

const server = new McpServer({
  name: 'acquired-payment-gateway',
  version: '1.0.0',
  description: 'MCP server for payment processing using Acquired.com',
  functions: {
    generatePaymentLink: async (params: PaymentLinkParams) => {
      console.error('Generating payment link with params:', params);
      const gateway = new AcquiredPaymentGateway(config.api);
      const result = await gateway.generatePaymentLink(params);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to generate payment link');
      }
      
      return {
        payment_link: result.payment_link,
        payment_id: result.payment_id
      };
    }
  }
});

console.error('MCP server initialized, connecting to stdio transport...');
(async () => {
  await server.connect(new StdioServerTransport());
  console.error('MCP server connected to stdio transport.');
})(); 