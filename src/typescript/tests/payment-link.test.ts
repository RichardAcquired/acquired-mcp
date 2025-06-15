import { createPaymentLinkTool } from '../api/acquired-com/payment-link.js';

async function testCreatePaymentLink() {
  const tool = createPaymentLinkTool();
  const args = {
    transaction: {
      order_id: 'test-order-001',
      amount: 50.00, // £50.00 as a float
      currency: 'GBP',
      capture: true,
      custom_data: 'test-payment-link',
    },
    payment: {
      reference: 'test-payment',
    },
    tds: {
      is_active: false,
      challenge_preference: 'no_preference',
      contact_url: 'https://example.com/contact',
    },
    is_recurring: false,
    count_retry: 1,
    expires_in: 3600, // 1 hour
    redirect_url: 'https://example.com/redirect',
    webhook_url: 'https://example.com/webhook',
    payment_methods: ['card'],
    submit_type: 'pay',
  };

  try {
    const result = await tool.function(args);
    console.log('Payment link created:', result);
  } catch (error) {
    console.error('Failed to create payment link:', error);
  }
}

testCreatePaymentLink(); 