import { z } from 'zod';
import { getApiUrl } from '../../../config/index.js';
import { paymentLinkSchema } from '../../../utils/validation.js';
import { getBearerToken } from '../../../utils/acquired-auth.js';
import { makeApiRequest, ApiError } from '../../../utils/api-utils.js';
import type { PaymentLinkRequest, PaymentLinkResponse } from '../../../types/index.js';

const paymentLinkResponseSchema = z.object({
  status: z.string(),
  link_id: z.string()
});

export const apiTool = {
  name: 'create_payment_link',
  description: 'Create a payment link using the Acquired.com API',
  parameters: {
    type: 'object',
    properties: {
      amount: { type: 'number', description: 'The amount to charge' },
      currency: { type: 'string', description: 'The currency code (e.g., GBP, USD)' },
      reference: { type: 'string', description: 'A unique reference for the payment' },
      description: { type: 'string', description: 'A description of the payment' },
      customer: {
        type: 'object',
        properties: {
          email: { type: 'string', description: 'Customer email address' },
          phone: { type: 'string', description: 'Customer phone number' },
          name: { type: 'string', description: 'Customer name' }
        }
      },
      expires_at: { type: 'string', description: 'Expiration date for the payment link' }
    },
    required: ['amount', 'currency', 'reference']
  },
  function: async (params: PaymentLinkRequest): Promise<PaymentLinkResponse> => {
    try {
      // Validate input parameters
      const validatedParams = paymentLinkSchema.parse(params);

      // Get Bearer token
      const accessToken = await getBearerToken();

      // Make API request using the utility function
      let apiResponse;
      try {
        apiResponse = await makeApiRequest(
          'payment-links',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            body: {
              transaction: {
                amount: validatedParams.amount,
                currency: validatedParams.currency,
                order_id: validatedParams.reference
              },
              payment: {
                reference: validatedParams.reference,
                description: validatedParams.description
              },
              customer: validatedParams.customer
            },
            schema: paymentLinkResponseSchema
          }
        );
      } catch (error) {
        if (error instanceof ApiError) {
          // Log the raw API error response for debugging
          console.error('Raw API error response:', error.responseBody);
          throw error;
        }
        throw new ApiError(
          'Failed to create payment link',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
      const { data } = apiResponse;

      return {
        status: data.status === 'success' ? 'success' : 'error',
        link_id: data.link_id
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Failed to create payment link',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}; 