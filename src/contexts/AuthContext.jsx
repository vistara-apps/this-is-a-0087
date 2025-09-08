import React, { createContext, useContext, useState, useEffect } from 'react';
import xApiService from '../services/xApi';
import supabaseService from '../services/supabaseService';
import stripeService from '../services/stripeService';
import turnkeyService from '../services/turnkeyService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize X OAuth flow
  const connectXAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Generate OAuth URL and redirect user
      const oauthUrl = xApiService.generateOAuthUrl();
      window.location.href = oauthUrl;
    } catch (error) {
      console.error('Failed to initiate X OAuth:', error);
      setError('Failed to connect to X. Please try again.');
      setLoading(false);
    }
  };

  // Handle OAuth callback
  const handleOAuthCallback = async (code, state) => {
    setLoading(true);
    setError(null);

    try {
      // Verify state parameter
      const savedState = localStorage.getItem('oauth_state');
      if (state !== savedState) {
        throw new Error('Invalid OAuth state parameter');
      }

      // Exchange code for access token
      const tokenData = await xApiService.exchangeCodeForToken(code, state);
      
      // Get user profile from X API
      const xUserData = await xApiService.getUserByUsername(tokenData.username);
      
      // Create or update user in our database
      const userData = {
        xHandle: `@${xUserData.data.username}`,
        email: tokenData.email || `${xUserData.data.username}@x.temp`, // X doesn't always provide email
        profileData: {
          name: xUserData.data.name,
          username: xUserData.data.username,
          description: xUserData.data.description,
          profileImageUrl: xUserData.data.profile_image_url,
          verified: xUserData.data.verified,
          publicMetrics: xUserData.data.public_metrics,
          xUserId: xUserData.data.id
        }
      };

      // Create Stripe customer
      try {
        const stripeCustomer = await stripeService.createCustomer({
          email: userData.email,
          name: userData.profileData.name,
          metadata: {
            xHandle: userData.xHandle,
            xUserId: userData.profileData.xUserId
          }
        });
        userData.stripeCustomerId = stripeCustomer.id;
      } catch (stripeError) {
        console.warn('Failed to create Stripe customer:', stripeError);
      }

      // Create Turnkey wallet
      try {
        const wallet = await turnkeyService.createWallet(
          userData.profileData.xUserId,
          `${userData.xHandle}-wallet`
        );
        userData.turnkeyWalletId = wallet.walletId;
        userData.alchemyWalletAddress = wallet.address;
      } catch (walletError) {
        console.warn('Failed to create crypto wallet:', walletError);
      }

      // Save user to database
      const dbUser = await supabaseService.createUser(userData);
      
      // Create user session
      const userSession = {
        id: dbUser.id,
        xHandle: userData.xHandle,
        email: userData.email,
        profileImage: userData.profileData.profileImageUrl,
        name: userData.profileData.name,
        followers: userData.profileData.publicMetrics?.followers_count || 0,
        following: userData.profileData.publicMetrics?.following_count || 0,
        posts: userData.profileData.publicMetrics?.tweet_count || 0,
        verified: userData.profileData.verified,
        token: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        stripeCustomerId: userData.stripeCustomerId,
        walletAddress: userData.alchemyWalletAddress,
        walletId: userData.turnkeyWalletId
      };

      setUser(userSession);
      localStorage.setItem('xstore_user', JSON.stringify(userSession));
      localStorage.removeItem('oauth_state');

    } catch (error) {
      console.error('Failed to complete X OAuth:', error);
      setError('Failed to complete authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const updatedUser = await supabaseService.getUserById(user.id);
      const updatedSession = {
        ...user,
        ...updatedUser,
        profileImage: updatedUser.profile_data?.profileImageUrl || user.profileImage,
        name: updatedUser.profile_data?.name || user.name,
        followers: updatedUser.profile_data?.publicMetrics?.followers_count || user.followers,
        following: updatedUser.profile_data?.publicMetrics?.following_count || user.following,
        posts: updatedUser.profile_data?.publicMetrics?.tweet_count || user.posts,
        verified: updatedUser.profile_data?.verified || user.verified
      };

      setUser(updatedSession);
      localStorage.setItem('xstore_user', JSON.stringify(updatedSession));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('xstore_user');
    localStorage.removeItem('oauth_state');
  };

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('xstore_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('xstore_user');
      }
    }

    // Handle OAuth callback if present in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      handleOAuthCallback(code, state);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    connectXAccount,
    refreshUserData,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
