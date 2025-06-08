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
  transaction: z.object({
    amount: z.number().positive(),
    currency: z.string().optional(),
    order_id: z.string().optional()
  })
});

export const sendPaymentLinkSchema = z.object({
  link_id: z.string(),
  type: z.enum(['email', 'sms']),
  email: z.string().email().optional(),
  phone: z.object({
    country_code: z.string().optional(),
    number: z.string()
  }).optional(),
  message: z.string().min(1)
}); 