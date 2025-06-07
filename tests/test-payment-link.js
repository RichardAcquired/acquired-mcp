import dotenv from 'dotenv';
import { apiTool } from './tools/acquired-com-api/acquired-com/payment-link.js';

// Load environment variables
dotenv.config();

const testPaymentLink = async () => {
  try {
    const result = await apiTool.function({
      transaction: {
        amount: 30.00 // £30.00 in base currency unit
      }
    });

    console.log('Payment Link Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

testPaymentLink(); 