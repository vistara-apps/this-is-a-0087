import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const connectXAccount = async () => {
    setLoading(true);
    try {
      // Simulate X OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockUser = {
        id: '1',
        xHandle: '@johndoe',
        email: 'john@example.com',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        followers: 12500,
        following: 892,
        posts: 3241
      };
      setUser(mockUser);
      localStorage.setItem('xstore_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Failed to connect X account:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('xstore_user');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('xstore_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const value = {
    user,
    loading,
    connectXAccount,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};