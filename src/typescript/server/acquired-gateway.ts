import { AcquiredConfig, PaymentLinkParams, PaymentLinkResponse, PaymentGatewayError } from '../types/payment';
import axios from 'axios';

/**
 * Implementation of the Acquired.com payment gateway
 */
export class AcquiredPaymentGateway {
  private readonly baseUrl: string;
  private readonly config: AcquiredConfig;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  constructor(config: AcquiredConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'production'
      ? 'https://api.acquired.com'
      : 'https://api.sandbox.acquired.com';
  }

  /**
   * Generates a payment link for the given parameters
   */
  public async generatePaymentLink(params: PaymentLinkParams): Promise<PaymentLinkResponse> {
    try {
      const response = await this.makeRequest({
        method: 'POST',
        url: `${this.baseUrl}/v${this.config.apiVersion}/payment-links`,
        data: {
          amount: params.amount,
          currency: params.currency,
          description: params.description,
          customer_email: params.customer_email,
          customer_name: params.customer_name,
          return_url: params.return_url,
          cancel_url: params.cancel_url
        }
      });

      return {
        success: true,
        payment_link: response.data.payment_link,
        payment_id: response.data.payment_id
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Makes an HTTP request with retry logic
   */
  private async makeRequest(options: any, retryCount = 0): Promise<any> {
    try {
      const response = await axios({
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-App-ID': this.config.appId,
          'X-App-Key': this.config.appKey
        }
      });
      return response;
    } catch (error) {
      if (retryCount < this.maxRetries && this.isRetryableError(error)) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
        return this.makeRequest(options, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Determines if an error is retryable
   */
  private isRetryableError(error: any): boolean {
    if (!error.response) return true; // Network errors are retryable
    const status = error.response.status;
    return status >= 500 || status === 429; // Retry on server errors or rate limits
  }

  /**
   * Handles errors and formats them consistently
   */
  private handleError(error: any): PaymentLinkResponse {
    console.error('Payment gateway error:', error);

    const gatewayError: PaymentGatewayError = {
      code: error.response?.data?.error_code || 'UNKNOWN_ERROR',
      message: error.response?.data?.message || error.message || 'An unknown error occurred',
      details: error.response?.data
    };

    return {
      success: false,
      payment_link: '',
      payment_id: '',
      error: {
        code: gatewayError.code,
        message: gatewayError.message
      }
    };
  }
} 