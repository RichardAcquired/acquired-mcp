interface AcquiredConfig {
  baseUrl: string;
  appId: string | undefined;
  appKey: string | undefined;
}

interface PaymentLinkParams {
  amount: number;
  currency: string;
  description: string;
}

export class AcquiredPaymentGateway {
  private config: AcquiredConfig;

  constructor(config: AcquiredConfig) {
    this.config = config;
  }

  async generatePaymentLink(params: PaymentLinkParams): Promise<string> {
    console.error('Generating payment link with config:', {
      baseUrl: this.config.baseUrl,
      appId: this.config.appId,
      appKey: this.config.appKey ? '***' : undefined
    });

    // TODO: Implement actual API call to Acquired.com
    // For now, return a mock payment link
    return `https://pay.acquired.com/pay/${params.amount}${params.currency}/${params.description}`;
  }
} 