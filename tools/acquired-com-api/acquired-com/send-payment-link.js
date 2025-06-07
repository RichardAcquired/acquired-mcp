import { getAccessToken } from './payment-link.js';

/**
 * Function to send a payment link via email or SMS using Acquired.com API.
 *
 * @param {Object} args - Arguments for sending a payment link.
 * @param {string} args.link_id - The ID of the payment link to send.
 * @param {string} args.type - The media type to use for sending ('email' or 'sms').
 * @param {string} [args.email] - Email address to send the payment link to (for type 'email').
 * @param {string} [args.phone] - Phone number to send the payment link to (for type 'sms').
 * @param {string} args.message - The message to include with the payment link.
 * @returns {Promise<Object>} - The result of sending the payment link.
 */
const executeFunction = async ({
  link_id,
  type,
  email,
  phone,
  message
}) => {
  const url = `https://test-api.acquired.com/v1/payment-links/${link_id}/send`;
  const companyId = '';
  const mid = '';

  // Validate link_id
  if (!link_id) {
    return { error: 'The link_id field is required.' };
  }

  // Validate type
  if (type !== 'email' && type !== 'sms') {
    return { error: "The type field is required and must be either 'email' or 'sms'." };
  }

  // Validate email/phone
  if (type === 'email' && (!email || typeof email !== 'string' || email.trim() === '')) {
    return { error: 'A valid email address must be provided for type email.' };
  }
  if (type === 'sms' && (!phone || typeof phone !== 'string' || phone.trim() === '')) {
    return { error: 'A valid phone number must be provided for type sms.' };
  }

  // Validate message
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return { error: 'The message field is required and cannot be empty.' };
  }

  // Prepare the request body
  const body = {
    type,
    message,
    ...(email && { email }),
    ...(phone && { phone })
  };

  try {
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
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending payment link:', error);
    return { error: 'An error occurred while sending the payment link.' };
  }
};

/**
 * Tool configuration for sending a payment link using Acquired.com API.
 * @type {Object}
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
            type: 'string',
            description: 'Phone number to send the payment link to (for type sms).'
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