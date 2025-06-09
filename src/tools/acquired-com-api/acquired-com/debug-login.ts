import { config, getApiCredentials } from '../../../config/index.js';

(async () => {
  const { appId, appKey } = getApiCredentials();
  const url = `${config.API_BASE_URL}/v1/login`;

  const requestBody = {
    app_id: appId,
    app_key: appKey
  };

  console.log('POST', url);
  console.log('Request body:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    const text = await response.text();
    console.log('Status:', response.status, response.statusText);
    console.log('Response:', text);
  } catch (error) {
    console.error('Error during /login request:', error);
  }
})(); 