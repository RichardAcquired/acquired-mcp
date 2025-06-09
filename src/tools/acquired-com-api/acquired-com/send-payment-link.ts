import { z } from 'zod';
import { getApiUrl } from '../../../config/index.js';
import { sendPaymentLinkSchema } from '../../../utils/validation.js';
import { getBearerToken } from '../../../utils/acquired-auth.js';
import { makeApiRequest, ApiError } from '../../../utils/api-utils.js';
import type { SendPaymentLinkRequest, SendPaymentLinkResponse } from '../../../types/index.js';

const sendPaymentLinkResponseSchema = z.object({
  status: z.number(),
  message: z.string()
});

export const apiTool = {
  name: 'send_payment_link',
  description: 'Send a payment link via email or SMS using the Acquired.com API',
  parameters: {
    type: 'object',
    properties: {
      link_id: { type: 'string', description: 'The ID of the payment link to send' },
      type: { 
        type: 'string', 
        enum: ['email', 'sms'],
        description: 'The type of notification to send'
      },
      email: { 
        type: 'string', 
        description: 'The recipient\'s email address (required for email type)'
      },
      phone: {
        type: 'object',
        properties: {
          number: { type: 'string', description: 'The recipient\'s phone number (required for SMS type)' },
          country_code: { type: 'string', description: 'The country code (optional)' }
        },
        required: ['number']
      },
      message: { type: 'string', description: 'The message to send with the payment link' }
    },
    required: ['link_id', 'type', 'message']
  },
  function: async (params: SendPaymentLinkRequest): Promise<SendPaymentLinkResponse> => {
    try {
      // Validate input parameters
      const validatedParams = sendPaymentLinkSchema.parse(params);

      // Prepare request body
      const requestBody = {
        link_id: validatedParams.link_id,
        type: validatedParams.type,
        message: validatedParams.message,
        ...(validatedParams.type === 'email' && { email: validatedParams.email }),
        ...(validatedParams.type === 'sms' && { 
          phone: {
            number: validatedParams.phone?.number.replace(/^0/, '44'),
            country_code: validatedParams.phone?.country_code || '44'
          }
        })
      };

      // Get Bearer token
      const accessToken = await getBearerToken();

      // Make API request using the utility function
      const { data } = await makeApiRequest(
        `payment-links/${validatedParams.link_id}/send`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: requestBody,
          schema: sendPaymentLinkResponseSchema
        }
      );

      return {
        status: data.status === 1 ? 'success' : 'error',
        message: data.message
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Failed to send payment link',
        500,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}; 