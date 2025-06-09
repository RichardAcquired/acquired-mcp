import dotenv from "dotenv";
dotenv.config();
import { apiTool as createPaymentLinkTool } from '../tools/acquired-com-api/acquired-com/payment-link.js';
import { apiTool as sendPaymentLinkTool } from '../tools/acquired-com-api/acquired-com/send-payment-link.js';

interface PaymentLinkResult {
  link_id?: string;
  error?: string;
  [key: string]: any;
}

interface ApiTool {
  function: (args: any) => Promise<PaymentLinkResult>;
  definition: {
    type: string;
    function: {
      name: string;
      description: string;
      parameters: {
        type: string;
        properties: Record<string, any>;
        required: string[];
      };
    };
  };
}

async function testPaymentLink() {
  try {
    // First, create a payment link
    const createResult = await (createPaymentLinkTool as ApiTool).function({
      transaction: {
        amount: 30.00 // £30.00
      }
    });

    console.log('Payment Link Creation Result:', createResult);

    if (createResult.error) {
      throw new Error(`Failed to create payment link: ${createResult.error}`);
    }

    if (!createResult.link_id) {
      throw new Error('No link_id returned from payment link creation');
    }

    // Then, send the payment link via email
    const sendResult = await (sendPaymentLinkTool as ApiTool).function({
      link_id: createResult.link_id,
      type: 'email',
      email: 'test@example.com',
      message: 'Please complete your payment using this link.'
    });

    console.log('Payment Link Send Result:', sendResult);

    if (sendResult.error) {
      throw new Error(`Failed to send payment link: ${sendResult.error}`);
    }

    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testPaymentLink(); 