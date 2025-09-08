import React, { createContext, useContext, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import stripeService from '../services/stripeService';
import turnkeyService from '../services/turnkeyService';
import supabaseService from '../services/supabaseService';
import { useAuth } from './AuthContext';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Process Stripe payment
  const processStripePayment = async (productId, amount, customerData) => {
    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const paymentIntent = await stripeService.createPaymentIntent(
        productId,
        amount,
        'usd',
        customerData.email
      );

      // Get Stripe instance
      const stripe = await stripeService.getStripe();
      
      // Create elements (this would typically be done in the component)
      const elements = stripe.elements({
        clientSecret: paymentIntent.client_secret
      });

      // Process payment
      const result = await stripeService.processPayment(
        stripe,
        elements,
        paymentIntent.client_secret,
        customerData
      );

      if (result.status === 'succeeded') {
        // Record sale in database
        await supabaseService.createSale({
          productId,
          storefrontId: result.metadata?.storefrontId,
          userId: user?.id,
          amount,
          currency: 'USD',
          paymentMethod: 'stripe',
          stripePaymentIntentId: result.id,
          customerEmail: customerData.email,
          customerData
        });

        return {
          success: true,
          transactionId: result.id,
          paymentMethod: 'stripe'
        };
      } else {
        throw new Error('Payment failed');
      }

    } catch (error) {
      console.error('Stripe payment failed:', error);
      setError(error.message);
      return {
        success: false,
        error: error.message,
        paymentMethod: 'stripe'
      };
    } finally {
      setLoading(false);
    }
  };

  // Process crypto payment with Turnkey
  const processCryptoPayment = async (productId, amount, recipientAddress, storefrontId) => {
    setLoading(true);
    setError(null);

    try {
      if (!user?.walletId) {
        throw new Error('No crypto wallet found. Please connect your wallet.');
      }

      // Convert amount to USDC (6 decimals)
      const usdcAmount = turnkeyService.parseAmount(amount.toString(), 6);

      // Create payment transaction
      const transaction = await turnkeyService.createPaymentTransaction(
        user.walletId,
        recipientAddress,
        usdcAmount,
        productId
      );

      // Sign and broadcast transaction
      const result = await turnkeyService.signAndBroadcastTransaction(
        user.walletId,
        transaction
      );

      if (result.success) {
        // Record sale in database
        await supabaseService.createSale({
          productId,
          storefrontId,
          userId: user.id,
          amount,
          currency: 'USDC',
          paymentMethod: 'crypto',
          transactionHash: result.transactionHash,
          customerEmail: user.email,
          customerData: {
            walletAddress: user.walletAddress,
            chainId: import.meta.env.VITE_BASE_CHAIN_ID
          }
        });

        return {
          success: true,
          transactionId: result.transactionHash,
          paymentMethod: 'crypto',
          explorerUrl: `https://basescan.org/tx/${result.transactionHash}`
        };
      } else {
        throw new Error(result.error || 'Transaction failed');
      }

    } catch (error) {
      console.error('Crypto payment failed:', error);
      setError(error.message);
      return {
        success: false,
        error: error.message,
        paymentMethod: 'crypto'
      };
    } finally {
      setLoading(false);
    }
  };

  // Create Stripe checkout session for multiple products
  const createCheckoutSession = async (items, customerEmail, successUrl, cancelUrl) => {
    setLoading(true);
    setError(null);

    try {
      const session = await stripeService.createCheckoutSession(
        items,
        customerEmail,
        successUrl,
        cancelUrl
      );

      return {
        success: true,
        sessionId: session.id,
        url: session.url
      };

    } catch (error) {
      console.error('Failed to create checkout session:', error);
      setError(error.message);
      return {
        success: false,
        error: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Get user's crypto wallet balance
  const getWalletBalance = async () => {
    if (!user?.walletAddress) {
      return { balance: '0', symbol: 'USDC' };
    }

    try {
      const balance = await turnkeyService.getWalletBalance(user.walletAddress);
      return {
        balance: turnkeyService.formatAmount(balance.balance, 6),
        symbol: 'USDC',
        raw: balance.balance
      };
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return { balance: '0', symbol: 'USDC' };
    }
  };

  // Estimate gas fees for crypto payment
  const estimateGasFees = async (toAddress, amount) => {
    if (!user?.walletAddress) {
      throw new Error('No wallet connected');
    }

    try {
      const gasEstimate = await turnkeyService.estimateGasFees(
        user.walletAddress,
        toAddress,
        amount
      );

      return {
        gasPrice: gasEstimate.gasPrice,
        gasLimit: gasEstimate.gasLimit,
        totalFee: gasEstimate.totalFee,
        totalFeeFormatted: turnkeyService.formatAmount(gasEstimate.totalFee, 18) // ETH has 18 decimals
      };
    } catch (error) {
      console.error('Failed to estimate gas fees:', error);
      throw error;
    }
  };

  // Verify payment completion
  const verifyPayment = async (transactionId, paymentMethod) => {
    try {
      if (paymentMethod === 'stripe') {
        return await stripeService.verifyPayment(transactionId);
      } else if (paymentMethod === 'crypto') {
        return await turnkeyService.getTransactionStatus(transactionId);
      }
    } catch (error) {
      console.error('Failed to verify payment:', error);
      throw error;
    }
  };

  // Get payment history
  const getPaymentHistory = async (limit = 50) => {
    if (!user?.id) return [];

    try {
      const sales = await supabaseService.getUserSales(user.id, limit);
      return sales.map(sale => ({
        id: sale.id,
        amount: sale.amount,
        currency: sale.currency,
        paymentMethod: sale.payment_method,
        transactionId: sale.transaction_hash || sale.stripe_payment_intent_id,
        productTitle: sale.products?.title,
        productImage: sale.products?.image_url,
        storefrontName: sale.storefronts?.name,
        customerEmail: sale.customer_email,
        status: sale.status,
        createdAt: sale.created_at
      }));
    } catch (error) {
      console.error('Failed to get payment history:', error);
      return [];
    }
  };

  const value = {
    loading,
    error,
    processStripePayment,
    processCryptoPayment,
    createCheckoutSession,
    getWalletBalance,
    estimateGasFees,
    verifyPayment,
    getPaymentHistory
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
