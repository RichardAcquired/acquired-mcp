import { Tool } from '../../types/tool.js';

export function createPaymentTool(): Tool {
  return {
    name: 'create_payment',
    description: 'Create a payment using Acquired.com API.',
    inputSchema: {
      type: 'object',
      required: ['transaction', 'payment', 'customer', 'tds'],
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
      },
    },
    function: async (args: Record<string, unknown>) => {
      const url = process.env.ACQUIRED_API_BASE_URL || 'https://test-api.acquired.com/v1/payments';
      const appId = process.env.ACQUIRED_APP_ID;
      const appKey = process.env.ACQUIRED_APP_KEY;
      if (!appId || !appKey) {
        throw new Error('Missing Acquired.com API credentials in environment variables.');
      }
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-APP-ID': appId,
            'X-APP-KEY': appKey,
          },
          body: JSON.stringify(args),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(JSON.stringify(errorData));
        }
        return await response.json();
      } catch (error) {
        console.error('Error creating payment:', error);
        return { error: 'An error occurred while creating the payment.' };
      }
    },
  };
} 