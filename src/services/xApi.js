import axios from 'axios';
import apiClient from './api.js';

const X_API_BASE_URL = 'https://api.twitter.com/2';
const BEARER_TOKEN = import.meta.env.VITE_X_BEARER_TOKEN;

// X API client with bearer token authentication
const xApiClient = axios.create({
  baseURL: X_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const xApiService = {
  // Get user by username
  async getUserByUsername(username) {
    try {
      const response = await xApiClient.get(`/users/by/username/${username}`, {
        params: {
          'user.fields': 'id,name,username,description,public_metrics,profile_image_url,verified'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Get user's tweets
  async getUserTweets(userId, maxResults = 100) {
    try {
      const response = await xApiClient.get(`/users/${userId}/tweets`, {
        params: {
          max_results: maxResults,
          'tweet.fields': 'id,text,created_at,public_metrics,context_annotations,entities',
          'expansions': 'attachments.media_keys',
          'media.fields': 'url,preview_image_url'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user tweets:', error);
      throw error;
    }
  },

  // Get tweets that user liked
  async getUserLikedTweets(userId, maxResults = 100) {
    try {
      const response = await xApiClient.get(`/users/${userId}/liked_tweets`, {
        params: {
          max_results: maxResults,
          'tweet.fields': 'id,text,created_at,public_metrics,context_annotations,entities',
          'expansions': 'author_id,attachments.media_keys',
          'user.fields': 'id,name,username,profile_image_url',
          'media.fields': 'url,preview_image_url'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching liked tweets:', error);
      throw error;
    }
  },

  // Get tweet replies
  async getTweetReplies(tweetId) {
    try {
      const response = await xApiClient.get(`/tweets/search/recent`, {
        params: {
          query: `conversation_id:${tweetId}`,
          'tweet.fields': 'id,text,created_at,public_metrics,in_reply_to_user_id',
          'expansions': 'author_id',
          'user.fields': 'id,name,username,profile_image_url'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tweet replies:', error);
      throw error;
    }
  },

  // OAuth URL generation (for frontend redirect)
  generateOAuthUrl() {
    const clientId = import.meta.env.VITE_X_API_KEY;
    const redirectUri = encodeURIComponent(`${import.meta.env.VITE_APP_URL}/auth/callback`);
    const state = Math.random().toString(36).substring(2, 15);
    const codeChallenge = 'challenge'; // In production, generate proper PKCE challenge
    
    localStorage.setItem('oauth_state', state);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'tweet.read users.read offline.access',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'plain'
    });

    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  },

  // Exchange authorization code for access token (backend endpoint)
  async exchangeCodeForToken(code, state) {
    try {
      const response = await apiClient.post('/auth/x/callback', {
        code,
        state
      });
      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }
};

export default xApiService;
