import { AcquiredConfig } from '../types/payment';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['ACQUIRED_APP_ID', 'ACQUIRED_APP_KEY'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export const config = {
  api: {
    appId: process.env.ACQUIRED_APP_ID!,
    appKey: process.env.ACQUIRED_APP_KEY!,
    environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'production' | 'sandbox',
    apiVersion: process.env.ACQUIRED_API_VERSION || '1'
  } as AcquiredConfig,
  
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost'
  }
}; 