import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define the configuration schema
const configSchema = z.object({
  // API Credentials
  ACQUIRED_COM_APP_ID: z.string().min(1, 'ACQUIRED_COM_APP_ID is required'),
  ACQUIRED_COM_APP_KEY: z.string().min(1, 'ACQUIRED_COM_APP_KEY is required'),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Server Configuration
  PORT: z.string().transform(Number).default('3000'),
  
  // API Configuration
  API_BASE_URL: z.string().url().default('https://test-api.acquired.com'),
  API_VERSION: z.string().default('v1'),
});

// Create a type from the schema
export type Config = z.infer<typeof configSchema>;

// Parse and validate the configuration
export const config = configSchema.parse(process.env);

// Export a function to get the full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.API_BASE_URL}/${config.API_VERSION}/${endpoint}`;
};

// Export a function to get the API credentials
export const getApiCredentials = (): { appId: string; appKey: string } => {
  return {
    appId: config.ACQUIRED_COM_APP_ID,
    appKey: config.ACQUIRED_COM_APP_KEY,
  };
}; 