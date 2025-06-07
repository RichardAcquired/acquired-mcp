import dotenv from 'dotenv';
import { apiTool as paymentLinkTool } from './tools/acquired-com-api/acquired-com/payment-link.js';
import { apiTool as sendPaymentLinkTool } from './tools/acquired-com-api/acquired-com/send-payment-link.js';

dotenv.config();

const testSendPaymentLink = async () => {
  try {
    // First create a payment link
    const paymentLinkResult = await paymentLinkTool.function({
      transaction: {
        amount: 30.00 // £30.00 in base currency unit
      }
    });

    console.log('Payment Link Created:', JSON.stringify(paymentLinkResult, null, 2));

    if (paymentLinkResult.error) {
      throw new Error(paymentLinkResult.error);
    }

    // Then send the payment link
    const sendResult = await sendPaymentLinkTool.function({
      link_id: paymentLinkResult.link_id,
      type: 'email',
      email: 'rmurphy@acquired.com',
      message: 'Here is your payment link.'
    });

    console.log('Send Payment Link Result:', JSON.stringify(sendResult, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

testSendPaymentLink(); 