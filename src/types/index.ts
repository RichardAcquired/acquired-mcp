export interface PaymentLinkResponse {
  status: 'success' | 'error';
  link_id: string;
}

export interface SendPaymentLinkResponse {
  status: 'success' | 'error';
  message?: string;
  error?: string;
}

export interface Transaction {
  amount: number;
  currency?: string;
  order_id?: string;
}

export interface PaymentLinkRequest {
  amount: number;
  currency: string;
  reference: string;
  description?: string;
  customer?: {
    email?: string;
    phone?: string;
    name?: string;
  };
  expires_at?: string;
}

export interface SendPaymentLinkRequest {
  link_id: string;
  type: 'email' | 'sms';
  email?: string;
  phone?: {
    number: string;
    country_code?: string;
  };
  message: string;
}

export interface AccessTokenResponse {
  access_token: string;
  error?: string;
} 