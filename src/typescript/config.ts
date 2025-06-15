import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Since dotenv-cli is already loading the .env file, we don't need to load it again
// Just use the environment variables that are already set

export const config = {
  api: {
    appId: process.env.ACQUIRED_APP_ID!,
    appKey: process.env.ACQUIRED_APP_KEY!,
    environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'production' | 'sandbox',
    apiVersion: process.env.ACQUIRED_API_VERSION || '1'
  },
  server: {
    port: process.env.PORT || 3001,
    name: 'acquired-mcp-server',
    version: '0.1.0',
  },
};

// Validate required environment variables
if (!config.api.appId || !config.api.appKey) {
  throw new Error('ACQUIRED_APP_ID and ACQUIRED_APP_KEY environment variables are required');
}

// Custom error class for API errors
export class AcquiredApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'AcquiredApiError';
  }
} 