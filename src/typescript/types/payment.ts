/**
 * Payment-related types for the Acquired.com payment gateway integration
 */

export interface PaymentRequest {
  transaction: {
    order_id: string;
    amount: number;
    currency: string;
    capture: boolean;
    custom_data: string;
  };
  payment: {
    reference: string;
    card_id: string;
  };
  customer: {
    customer_id: string;
  };
  tds: {
    is_active: boolean;
    challenge_preference: string;
    contact_url: string;
  };
}

export interface PaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaymentLinkParams {
  amount: number;
  currency: string;
  description: string;
  customer_email?: string;
  customer_name?: string;
  return_url?: string;
  cancel_url?: string;
}

export interface PaymentLinkResponse {
  success: boolean;
  payment_link: string;
  payment_id: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface AcquiredConfig {
  appId: string;
  appKey: string;
  environment: 'sandbox' | 'production';
  apiVersion: string;
}

export interface PaymentGatewayError {
  code: string;
  message: string;
  details?: unknown;
}

export type PaymentStatus = 
  | 'pending'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  description?: string;
  customer_email?: string;
  customer_name?: string;
} 