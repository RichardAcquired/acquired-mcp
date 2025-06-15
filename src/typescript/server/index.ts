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
import { config } from '../config';
import { AcquiredPaymentGateway } from '../server/acquired-gateway';

// Debug logging
console.error('Starting MCP server...');
console.error('Environment variables:', {
  ACQUIRED_APP_ID: process.env.ACQUIRED_APP_ID,
  ACQUIRED_APP_KEY: process.env.ACQUIRED_APP_KEY
});

const server = new McpServer({
  name: 'payment-link',
  version: '1.0.0',
  description: 'MCP server for payment link generation using Acquired.com',
  functions: {
    generatePaymentLink: async (params: { amount: number; currency: string; description: string }) => {
      console.error('Generating payment link with params:', params);
      const gateway = new AcquiredPaymentGateway(config.api);
      return gateway.generatePaymentLink(params);
    }
  }
});

console.error('MCP server initialized, connecting to stdio transport...');
(async () => {
  await server.connect(new StdioServerTransport());
  console.error('MCP server connected to stdio transport.');
})(); 