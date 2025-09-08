import { loadStripe } from '@stripe/stripe-js';
import apiClient from './api.js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const stripeService = {
  // Initialize Stripe
  async getStripe() {
    return await stripePromise;
  },

  // Create payment intent for a product
  async createPaymentIntent(productId, amount, currency = 'usd', customerEmail = null) {
    try {
      const response = await apiClient.post('/payments/create-intent', {
        productId,
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        customerEmail
      });

      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  // Process payment with Stripe Elements
  async processPayment(stripe, elements, clientSecret, customerData) {
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
          payment_method_data: {
            billing_details: {
              name: customerData.name,
              email: customerData.email,
            },
          },
        },
        redirect: 'if_required'
      });

      if (error) {
        throw error;
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Create Stripe customer
  async createCustomer(customerData) {
    try {
      const response = await apiClient.post('/payments/create-customer', {
        email: customerData.email,
        name: customerData.name,
        metadata: customerData.metadata
      });

      return response.data;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw error;
    }
  },

  // Get customer payment methods
  async getCustomerPaymentMethods(customerId) {
    try {
      const response = await apiClient.get(`/payments/customer/${customerId}/payment-methods`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  // Create checkout session for multiple products
  async createCheckoutSession(items, customerEmail, successUrl, cancelUrl) {
    try {
      const response = await apiClient.post('/payments/create-checkout-session', {
        items,
        customerEmail,
        successUrl,
        cancelUrl,
        mode: 'payment'
      });

      return response.data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },

  // Redirect to Stripe Checkout
  async redirectToCheckout(sessionId) {
    try {
      const stripe = await this.getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  },

  // Verify payment status
  async verifyPayment(paymentIntentId) {
    try {
      const response = await apiClient.get(`/payments/verify/${paymentIntentId}`);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  },

  // Get payment history for user
  async getPaymentHistory(userId, limit = 50) {
    try {
      const response = await apiClient.get(`/payments/history/${userId}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  },

  // Process refund
  async processRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const response = await apiClient.post('/payments/refund', {
        paymentIntentId,
        amount: amount ? Math.round(amount * 100) : null, // Convert to cents if specified
        reason
      });

      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  },

  // Create Express account for seller (for marketplace functionality)
  async createExpressAccount(userEmail, country = 'US') {
    try {
      const response = await apiClient.post('/payments/create-express-account', {
        email: userEmail,
        country,
        type: 'express'
      });

      return response.data;
    } catch (error) {
      console.error('Error creating Express account:', error);
      throw error;
    }
  },

  // Get Express account onboarding link
  async getAccountOnboardingLink(accountId, refreshUrl, returnUrl) {
    try {
      const response = await apiClient.post('/payments/account-onboarding-link', {
        accountId,
        refreshUrl,
        returnUrl
      });

      return response.data;
    } catch (error) {
      console.error('Error getting onboarding link:', error);
      throw error;
    }
  }
};

export default stripeService;
