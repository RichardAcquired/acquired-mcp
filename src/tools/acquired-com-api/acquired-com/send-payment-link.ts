import { getAccessToken } from './payment-link.js';
import { SendPaymentLinkRequest, SendPaymentLinkResponse } from '../../../types/index.js';
import { sendPaymentLinkSchema } from '../../../utils/validation.js';

/**
 * Function to send a payment link via email or SMS using Acquired.com API.
 */
const executeFunction = async ({
  link_id,
  type,
  email,
  phone,
  message
}: SendPaymentLinkRequest): Promise<SendPaymentLinkResponse> => {
  const url = `https://test-api.acquired.com/v1/payment-links/${link_id}/send`;
  const companyId = '';
  const mid = '';

  try {
    // Validate input using Zod schema
    const validationResult = sendPaymentLinkSchema.safeParse({ link_id, type, email, phone, message });
    if (!validationResult.success) {
      return { 
        status: 0,
        message: validationResult.error.message 
      };
    }

    // Format phone number for UK (country code 44)
    let formattedPhone = null;
    const countryCode = '44'; // API requires UK country code

    if (phone) {
      // Remove leading 0 from the number
      formattedPhone = phone.number.toString().replace(/^0+/, '');
      
      // If the number starts with 44, remove it as we'll add it back
      if (formattedPhone.startsWith('44')) {
        formattedPhone = formattedPhone.substring(2);
      }
    }

    // Prepare the request body
    const body = {
      link_id,
      type,
      ...(type === 'email' && email ? { email } : {}),
      ...(type === 'sms' && formattedPhone ? { 
        phone: {
          country_code: countryCode,
          number: formattedPhone
        }
      } : {}),
      ...(message ? { message } : {})
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
    const data = await response.json() as SendPaymentLinkResponse;
    return data;
  } catch (error) {
    console.error('Error sending payment link:', error);
    return { 
      status: 0,
      message: error instanceof Error ? error.message : 'An error occurred while sending the payment link.'
    };
  }
};

/**
 * Tool configuration for sending a payment link using Acquired.com API.
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'send_payment_link',
      description: 'Send a payment link via email or SMS using Acquired.com API.',
      parameters: {
        type: 'object',
        properties: {
          link_id: {
            type: 'string',
            description: 'The ID of the payment link to send.'
          },
          type: {
            type: 'string',
            description: "The media type to use for sending ('email' or 'sms').",
            enum: ['email', 'sms']
          },
          email: {
            type: 'string',
            description: 'Email address to send the payment link to (for type email).'
          },
          phone: {
            type: 'object',
            properties: {
              country_code: {
                type: 'string',
                description: 'Country code for the phone number (e.g., "44" for UK).'
              },
              number: {
                type: 'string',
                description: 'Phone number without leading 0 (e.g., "7763270200" for UK number).'
              }
            },
            required: ['number']
          },
          message: {
            type: 'string',
            description: 'The message to include with the payment link.'
          }
        },
        required: ['link_id', 'type', 'message'],
        oneOf: [
          { required: ['email'], properties: { type: { const: 'email' } } },
          { required: ['phone'], properties: { type: { const: 'sms' } } }
        ]
      }
    }
  }
};

export { apiTool, executeFunction }; 