import { config } from '../config.js';
import { makeApiRequest } from '../api/acquired-com/utils/api-client.js';

async function testAuth() {
  try {
    console.log('Testing Acquired.com API Authentication and customer listing...');
    console.log('Environment:', config.api.environment);
    console.log('API Version:', config.api.apiVersion);
    
    // Fetch a list of customers
    const customers = await makeApiRequest('/customers', {
      method: 'GET'
    });
    
    console.log('Authentication successful!');
    console.log('Customers:', customers);
  } catch (error) {
    console.error('Authentication or API request failed:', error);
  }
}

// Run the test
testAuth(); 