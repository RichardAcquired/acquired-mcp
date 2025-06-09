import { z } from 'zod';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/^0+/, ''));
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000;
};

export const validateCurrency = (currency: string): boolean => {
  const validCurrencies = ['GBP', 'EUR', 'USD'];
  return validCurrencies.includes(currency.toUpperCase());
};

export const paymentLinkSchema = z.object({
  amount: z.number().positive(),
  currency: z.string(),
  reference: z.string(),
  description: z.string().optional(),
  customer: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    name: z.string().optional()
  }).optional(),
  expires_at: z.string().optional()
});

export const sendPaymentLinkSchema = z.object({
  link_id: z.string(),
  type: z.enum(['email', 'sms']),
  email: z.string().email().optional(),
  phone: z.object({
    number: z.string(),
    country_code: z.string().optional()
  }).optional(),
  message: z.string()
}).refine(
  (data) => {
    if (data.type === 'email') return !!data.email;
    if (data.type === 'sms') return !!data.phone;
    return false;
  },
  {
    message: 'Email is required for email type, phone is required for SMS type'
  }
); 