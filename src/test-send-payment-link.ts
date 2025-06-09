import { apiTool as sendPaymentLinkTool } from './tools/acquired-com-api/acquired-com/send-payment-link.js';

async function testSendPaymentLink() {
  try {
    const result = await sendPaymentLinkTool.function({
      link_id: '01975497-1132-7284-9d6c-75afad9c020c', // Using the link ID from the previous test
      type: 'email',
      email: 'test@example.com',
      message: 'Please find your payment link below.'
    });
    console.log('Payment Link Sent Successfully:', result);
  } catch (error) {
    console.error('Error sending payment link:', error);
  }
}

testSendPaymentLink(); 