import apiClient from './api.js';

const TURNKEY_API_KEY = import.meta.env.VITE_TURNKEY_API_KEY;
const TURNKEY_ORG_ID = import.meta.env.VITE_TURNKEY_ORGANIZATION_ID;
const BASE_RPC_URL = import.meta.env.VITE_BASE_RPC_URL;
const BASE_CHAIN_ID = import.meta.env.VITE_BASE_CHAIN_ID;

export const turnkeyService = {
  // Create a new wallet for user
  async createWallet(userId, walletName) {
    try {
      const response = await apiClient.post('/crypto/create-wallet', {
        userId,
        walletName,
        organizationId: TURNKEY_ORG_ID
      });

      return response.data;
    } catch (error) {
      console.error('Error creating Turnkey wallet:', error);
      throw error;
    }
  },

  // Get wallet information
  async getWallet(walletId) {
    try {
      const response = await apiClient.get(`/crypto/wallet/${walletId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching wallet:', error);
      throw error;
    }
  },

  // Get wallet balance (USDC on Base)
  async getWalletBalance(walletAddress) {
    try {
      const response = await apiClient.get(`/crypto/balance/${walletAddress}`, {
        params: {
          chainId: BASE_CHAIN_ID,
          tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' // USDC on Base
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  },

  // Create payment transaction
  async createPaymentTransaction(fromWalletId, toAddress, amount, productId) {
    try {
      const response = await apiClient.post('/crypto/create-transaction', {
        fromWalletId,
        toAddress,
        amount: amount.toString(),
        tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
        chainId: BASE_CHAIN_ID,
        productId,
        metadata: {
          paymentType: 'product_purchase',
          timestamp: Date.now()
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating payment transaction:', error);
      throw error;
    }
  },

  // Sign and broadcast transaction
  async signAndBroadcastTransaction(walletId, transactionData) {
    try {
      const response = await apiClient.post('/crypto/sign-transaction', {
        walletId,
        transactionData,
        organizationId: TURNKEY_ORG_ID
      });

      return response.data;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  },

  // Get transaction status
  async getTransactionStatus(transactionHash) {
    try {
      const response = await apiClient.get(`/crypto/transaction/${transactionHash}/status`, {
        params: {
          chainId: BASE_CHAIN_ID
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching transaction status:', error);
      throw error;
    }
  },

  // Get transaction history for wallet
  async getTransactionHistory(walletAddress, limit = 50) {
    try {
      const response = await apiClient.get(`/crypto/wallet/${walletAddress}/transactions`, {
        params: {
          chainId: BASE_CHAIN_ID,
          limit
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  },

  // Estimate gas fees
  async estimateGasFees(fromAddress, toAddress, amount) {
    try {
      const response = await apiClient.post('/crypto/estimate-gas', {
        fromAddress,
        toAddress,
        amount: amount.toString(),
        tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
        chainId: BASE_CHAIN_ID
      });

      return response.data;
    } catch (error) {
      console.error('Error estimating gas fees:', error);
      throw error;
    }
  },

  // Create payment request (for receiving payments)
  async createPaymentRequest(walletAddress, amount, productId, description) {
    try {
      const paymentRequest = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        walletAddress,
        amount: amount.toString(),
        tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
        chainId: BASE_CHAIN_ID,
        productId,
        description,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };

      // Store payment request (in real app, this would be stored in database)
      localStorage.setItem(`payment_request_${paymentRequest.id}`, JSON.stringify(paymentRequest));

      return paymentRequest;
    } catch (error) {
      console.error('Error creating payment request:', error);
      throw error;
    }
  },

  // Verify payment completion
  async verifyPayment(paymentRequestId, transactionHash) {
    try {
      const response = await apiClient.post('/crypto/verify-payment', {
        paymentRequestId,
        transactionHash,
        chainId: BASE_CHAIN_ID
      });

      return response.data;
    } catch (error) {
      console.error('Error verifying crypto payment:', error);
      throw error;
    }
  },

  // Get supported tokens on Base
  getSupportedTokens() {
    return [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        decimals: 6,
        chainId: BASE_CHAIN_ID
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        address: '0x0000000000000000000000000000000000000000', // Native ETH
        decimals: 18,
        chainId: BASE_CHAIN_ID
      }
    ];
  },

  // Format amount for display
  formatAmount(amount, decimals = 6) {
    const divisor = Math.pow(10, decimals);
    return (parseInt(amount) / divisor).toFixed(2);
  },

  // Parse amount for transaction
  parseAmount(amount, decimals = 6) {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(parseFloat(amount) * multiplier).toString();
  }
};

export default turnkeyService;
