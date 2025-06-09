import { config, getApiCredentials } from '../config/index.js';

export async function getBearerToken(): Promise<string> {
  const { appId, appKey } = getApiCredentials();
  const url = `${config.API_BASE_URL}/v1/login`;
  const requestBody = {
    app_id: appId,
    app_key: appKey
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (!data.access_token) {
    throw new Error('No access_token in /login response');
  }
  return data.access_token;
} 