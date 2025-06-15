import { config, AcquiredApiError } from '../../../config.js';

const API_BASE_URL = config.api.environment === 'production'
  ? 'https://api.acquired.com'
  : 'https://test-api.acquired.com';
const API_VERSION = config.api.apiVersion;
const APP_ID = config.api.appId;
const APP_KEY = config.api.appKey;

interface RequestOptions {
  method: string;
  headers?: Record<string, string>;
  body?: string;
}

interface AuthResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
}

let currentToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken(): Promise<string> {
  // Check if we have a valid token
  if (currentToken && tokenExpiry && Date.now() < tokenExpiry) {
    return currentToken;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: APP_ID,
        app_key: APP_KEY,
      }),
    });

    if (!response.ok) {
      throw new AcquiredApiError('Failed to obtain access token', response.status);
    }

    const data = (await response.json()) as AuthResponse;
    currentToken = data.access_token;
    // Set token expiry to 50 minutes (giving 10-minute buffer before 1-hour expiry)
    tokenExpiry = Date.now() + (data.expires_in - 600) * 1000;
    return currentToken;
  } catch (error) {
    console.error('Authentication error:', error);
    throw new AcquiredApiError('Failed to authenticate with Acquired.com API');
  }
}

export async function makeApiRequest<T>(endpoint: string, options: RequestOptions): Promise<T> {
  const url = `${API_BASE_URL}/v${API_VERSION}${endpoint}`;
  
  try {
    // Get fresh access token
    const accessToken = await getAccessToken();
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token might be expired, clear it and retry once
      currentToken = null;
      tokenExpiry = null;
      return makeApiRequest(endpoint, options);
    }

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error Response:', error);
      throw new AcquiredApiError(error.message || 'API request failed', response.status);
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
} 