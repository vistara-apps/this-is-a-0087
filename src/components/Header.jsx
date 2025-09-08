import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '../contexts/AuthContext';
import { X, User, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md flex items-center justify-center">
              <X className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">XStore Weaver</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Home
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <ConnectButton />
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img 
                    src={user.profileImage} 
                    alt={user.xHandle}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-text-primary hidden sm:block">
                    {user.xHandle}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;