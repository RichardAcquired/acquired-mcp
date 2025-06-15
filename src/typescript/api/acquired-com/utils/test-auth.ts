import { makeApiRequest } from './api-client.js';

async function testAuthentication(): Promise<void> {
  try {
    // Try to make a simple API request to verify authentication
    const response = await makeApiRequest('/customers', {
      method: 'GET',
    });
    
    console.log('Authentication successful!');
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}

// Run the test
testAuthentication().catch(console.error); 