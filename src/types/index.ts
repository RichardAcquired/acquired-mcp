export interface PaymentLinkResponse {
  status: string;
  link_id: string;
  full_url?: string;
  error?: string;
}

export interface SendPaymentLinkResponse {
  status: number;
  message: string;
  error?: string;
}

export interface Transaction {
  amount: number;
  currency?: string;
  order_id?: string;
}

export interface PaymentLinkRequest {
  transaction: Transaction;
  redirect_url?: string;
  payment?: {
    reference?: string;
  };
}

export interface SendPaymentLinkRequest {
  link_id: string;
  type: 'email' | 'sms';
  email?: string;
  phone?: {
    country_code: string;
    number: string;
  };
  message: string;
}

export interface AccessTokenResponse {
  access_token: string;
  error?: string;
} 