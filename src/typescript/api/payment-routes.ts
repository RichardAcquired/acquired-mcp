import { Router } from 'express';
import { AcquiredPaymentGateway } from '../server/acquired-gateway';
import { config } from '../server/config';
import { PaymentLinkParams } from '../types/payment';

const router = Router();
const gateway = new AcquiredPaymentGateway(config.api);

/**
 * Generate a payment link
 * POST /api/v1/payment-links
 */
router.post('/payment-links', async (req, res) => {
  try {
    const params: PaymentLinkParams = {
      amount: req.body.amount,
      currency: req.body.currency,
      description: req.body.description,
      customer_email: req.body.customer_email,
      customer_name: req.body.customer_name,
      return_url: req.body.return_url,
      cancel_url: req.body.cancel_url
    };

    // Validate required fields
    if (!params.amount || !params.currency || !params.description) {
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'INVALID_PARAMS',
          message: 'Missing required fields: amount, currency, and description are required'
        }
      });
    }

    const result = await gateway.generatePaymentLink(params);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        error: result.error
      });
    }

    return res.json({
      status: 'success',
      data: {
        payment_link: result.payment_link,
        payment_id: result.payment_id
      }
    });
  } catch (error) {
    console.error('Error generating payment link:', error);
    return res.status(500).json({
      status: 'error',
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An internal server error occurred'
      }
    });
  }
});

export default router; 