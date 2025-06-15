import { Tool } from '../../types/tool.js';
import { config, AcquiredApiError } from '../../config.js';
import { makeApiRequest } from './utils/api-client.js';

export function createPaymentLinkTool(): Tool {
  return {
    name: 'create_payment_link',
    description: 'Create a payment link using Acquired.com API.',
    inputSchema: {
      type: 'object',
      required: ['transaction', 'payment', 'tds', 'is_recurring', 'count_retry', 'expires_in', 'redirect_url', 'webhook_url', 'payment_methods', 'submit_type'],
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
          },
          required: ['reference'],
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
    },
    function: async (args: Record<string, unknown>) => {
      try {
        const result = await makeApiRequest('/payment-links', {
          method: 'POST',
          body: JSON.stringify(args),
        });
        return result;
      } catch (error) {
        console.error('Error creating payment link:', error);
        throw error;
      }
    },
  };
} 