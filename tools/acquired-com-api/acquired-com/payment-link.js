/**
 * Function to create a payment link using Acquired.com API.
 *
 * @param {Object} args - Arguments for creating a payment link.
 * @param {string} args.transaction.order_id - The unique order ID for the transaction.
 * @param {number} args.transaction.amount - The amount for the transaction.
 * @param {string} args.transaction.currency - The currency for the transaction.
 * @param {boolean} args.transaction.capture - Whether to capture the payment immediately.
 * @param {string} args.transaction.custom_data - Custom data associated with the transaction.
 * @param {string} args.payment.reference - A reference for the payment.
 * @param {string} args.payment.card_id - The ID of the card to be used for payment.
 * @param {string} args.customer.customer_id - The ID of the customer.
 * @param {boolean} args.tds.is_active - Whether 3-D Secure is active.
 * @param {string} args.tds.challenge_preference - The challenge preference for 3-D Secure.
 * @param {string} args.tds.contact_url - The contact URL for customer inquiries.
 * @param {boolean} args.is_recurring - Whether the payment is recurring.
 * @param {number} args.count_retry - The number of retry attempts for the payment.
 * @param {number} args.expires_in - The expiration time for the payment link in seconds.
 * @param {string} args.redirect_url - The URL to redirect the customer after payment.
 * @param {string} args.webhook_url - The URL for webhook notifications.
 * @param {Array<string>} args.payment_methods - The payment methods to be accepted.
 * @param {string} args.submit_type - The type of submission for the payment.
 * @returns {Promise<Object>} - The result of the payment link creation.
 */
const executeFunction = async (args) => {
  const url = 'https://test-api.acquired.com/v1/payment-links';
  const token = process.env.ACQUIRED_COM_API_API_KEY;
  const companyId = ''; // will be provided by the user
  const mid = ''; // will be provided by the user

  try {
    // Prepare the request body
    const body = {
      transaction: {
        order_id: args.transaction.order_id,
        amount: args.transaction.amount,
        currency: args.transaction.currency,
        capture: args.transaction.capture,
        custom_data: args.transaction.custom_data,
      },
      payment: {
        reference: args.payment.reference,
        card_id: args.payment.card_id,
      },
      customer: {
        customer_id: args.customer.customer_id,
      },
      tds: {
        is_active: args.tds.is_active,
        challenge_preference: args.tds.challenge_preference,
        contact_url: args.tds.contact_url,
      },
      is_recurring: args.is_recurring,
      count_retry: args.count_retry,
      expires_in: args.expires_in,
      redirect_url: args.redirect_url,
      webhook_url: args.webhook_url,
      payment_methods: args.payment_methods,
      submit_type: args.submit_type,
    };

    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Company-Id': companyId,
      'Mid': mid,
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating payment link:', error);
    return { error: 'An error occurred while creating the payment link.' };
  }
};

/**
 * Tool configuration for creating a payment link using Acquired.com API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'create_payment_link',
      description: 'Create a payment link using Acquired.com API.',
      parameters: {
        type: 'object',
        properties: {
          transaction: {
            type: 'object',
            properties: {
              order_id: { type: 'string', description: 'The unique order ID for the transaction.' },
              amount: { type: 'number', description: 'The amount for the transaction.' },
              currency: { type: 'string', description: 'The currency for the transaction.' },
              capture: { type: 'boolean', description: 'Whether to capture the payment immediately.' },
              custom_data: { type: 'string', description: 'Custom data associated with the transaction.' },
            },
            required: ['order_id', 'amount', 'currency', 'capture', 'custom_data'],
          },
          payment: {
            type: 'object',
            properties: {
              reference: { type: 'string', description: 'A reference for the payment.' },
              card_id: { type: 'string', description: 'The ID of the card to be used for payment.' },
            },
            required: ['reference', 'card_id'],
          },
          customer: {
            type: 'object',
            properties: {
              customer_id: { type: 'string', description: 'The ID of the customer.' },
            },
            required: ['customer_id'],
          },
          tds: {
            type: 'object',
            properties: {
              is_active: { type: 'boolean', description: 'Whether 3-D Secure is active.' },
              challenge_preference: { type: 'string', description: 'The challenge preference for 3-D Secure.' },
              contact_url: { type: 'string', description: 'The contact URL for customer inquiries.' },
            },
            required: ['is_active', 'challenge_preference', 'contact_url'],
          },
          is_recurring: { type: 'boolean', description: 'Whether the payment is recurring.' },
          count_retry: { type: 'number', description: 'The number of retry attempts for the payment.' },
          expires_in: { type: 'number', description: 'The expiration time for the payment link in seconds.' },
          redirect_url: { type: 'string', description: 'The URL to redirect the customer after payment.' },
          webhook_url: { type: 'string', description: 'The URL for webhook notifications.' },
          payment_methods: {
            type: 'array',
            items: { type: 'string' },
            description: 'The payment methods to be accepted.',
          },
          submit_type: { type: 'string', description: 'The type of submission for the payment.' },
        },
        required: ['transaction', 'payment', 'customer', 'tds', 'is_recurring', 'count_retry', 'expires_in', 'redirect_url', 'webhook_url', 'payment_methods', 'submit_type'],
      }
    }
  }
};

export { apiTool };