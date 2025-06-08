import { randomUUID } from 'crypto';
import { AccessTokenResponse, PaymentLinkRequest, PaymentLinkResponse } from '../../../types/index.js';
import { paymentLinkSchema } from '../../../utils/validation.js';

/**
 * Function to get an access token from Acquired.com API.
 * @returns {Promise<string>} The access token
 */
const getAccessToken = async (): Promise<string> => {
  const url = 'https://test-api.acquired.com/v1/login';
  const appId = process.env.ACQUIRED_COM_APP_ID;
  const appKey = process.env.ACQUIRED_COM_APP_KEY;

  if (!appId || !appKey) {
    throw new Error('Missing required environment variables: ACQUIRED_COM_APP_ID and ACQUIRED_COM_APP_KEY');
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_id: appId,
        app_key: appKey
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get access token');
    }

    const data = await response.json() as AccessTokenResponse;
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

/**
 * Function to create a payment link using Acquired.com API.
 */
const executeFunction = async ({
  transaction
}: PaymentLinkRequest): Promise<PaymentLinkResponse> => {
  const url = 'https://test-api.acquired.com/v1/payment-links';
  const companyId = '';
  const mid = '';

  try {
    // Validate input using Zod schema
    const validationResult = paymentLinkSchema.safeParse({ transaction });
    if (!validationResult.success) {
      return { 
        status: 'error',
        link_id: '',
        error: validationResult.error.message 
      };
    }

    // Prepare the request body
    const body = {
      transaction: {
        amount: transaction.amount,
        order_id: randomUUID(),
        currency: transaction.currency || 'GBP'
      },
      redirect_url: 'https://acquired.com',
      payment: {
        reference: 'MCP Server'
      }
    };

    console.log('Request body:', JSON.stringify(body, null, 2));

    // Get access token
    const accessToken = await getAccessToken();

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Company-Id': companyId,
      'Mid': mid
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    // Check if the response was successful
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = await response.text();
      }
      console.error('API Error Response:', errorData);
      throw new Error(JSON.stringify(errorData));
    }

    // Parse and return the response data
    const data = await response.json() as PaymentLinkResponse;
    if (data.link_id) {
      data.full_url = `https://test-pay.acquired.com/v1/${data.link_id}`;
    }
    return data;
  } catch (error) {
    console.error('Error creating payment link:', error);
    return { 
      status: 'error',
      link_id: '',
      error: error instanceof Error ? error.message : 'An error occurred while creating the payment link.'
    };
  }
};

/**
 * Tool configuration for creating a payment link using Acquired.com API.
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_payment_link',
      description: 'Create a payment link using Acquired.com API. Amount should be in the base currency unit (e.g., 30.00 for £30.00).',
      parameters: {
        type: 'object',
        properties: {
          transaction: {
            type: 'object',
            properties: {
              amount: { 
                type: 'number', 
                description: 'The amount in the base currency unit (e.g., 30.00 for £30.00). Do not use minor units (pence/cents).',
                minimum: 0.00,
                example: 30.00
              }
            },
            required: ['amount']
          }
        },
        required: ['transaction']
      }
    }
  }
};

export { apiTool, getAccessToken }; 