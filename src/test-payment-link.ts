import { apiTool } from './tools/acquired-com-api/acquired-com/payment-link.js';

async function testPaymentLink() {
  try {
    const result = await apiTool.function({
      amount: 20.00,
      currency: 'GBP',
      reference: 'TEST-ORDER-123',
      description: 'Test payment link',
      customer: {
        email: 'test@example.com',
        name: 'Test Customer'
      }
    });
    console.log('Payment Link Created Successfully:', result);
  } catch (error) {
    console.error('Error creating payment link:', error);
  }
}

testPaymentLink(); 