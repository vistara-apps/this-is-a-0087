import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye,
  ShoppingBag,
  ExternalLink,
  BarChart3,
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react';
import AnalyticsChart from '../components/AnalyticsChart';
import ProductCard from '../components/ProductCard';
import StorefrontGenerator from '../components/StorefrontGenerator';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [storefronts, setStorefronts] = useState([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Load existing storefronts from localStorage
    const savedStorefronts = localStorage.getItem(`storefronts_${user.id}`);
    if (savedStorefronts) {
      setStorefronts(JSON.parse(savedStorefronts));
    }
  }, [user, navigate]);

  const handleCreateStorefront = () => {
    setShowGenerator(true);
  };

  const handleStorefrontGenerated = (newStorefront) => {
    const updatedStorefronts = [...storefronts, newStorefront];
    setStorefronts(updatedStorefronts);
    localStorage.setItem(`storefronts_${user.id}`, JSON.stringify(updatedStorefronts));
    setShowGenerator(false);
  };

  if (!user) {
    return null;
  }

  const stats = [
    {
      title: "Total Revenue",
      value: "$3,247",
      change: "+12.5%",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-green-600"
    },
    {
      title: "Storefronts",
      value: storefronts.length.toString(),
      change: "+2",
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "text-blue-600"
    },
    {
      title: "Total Views",
      value: "12.4K",
      change: "+8.2%",
      icon: <Eye className="w-5 h-5" />,
      color: "text-purple-600"
    },
    {
      title: "Conversions",
      value: "3.2%",
      change: "+0.4%",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-accent"
    }
  ];

  const recentActivities = [
    { type: "sale", message: "New sale: Digital Marketing Course", time: "2 hours ago", amount: "$97" },
    { type: "view", message: "Storefront viewed 15 times", time: "4 hours ago" },
    { type: "product", message: "Product added: Consultation Call", time: "1 day ago" },
    { type: "storefront", message: "New storefront created", time: "2 days ago" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 w-full py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              Welcome back, {user.xHandle}
            </h1>
            <p className="text-text-secondary">
              Here's what's happening with your storefronts today
            </p>
          </div>
          <button
            onClick={handleCreateStorefront}
            className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5" />
            <span>Create Storefront</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-sm text-green-600 font-medium">
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1">
              {stat.value}
            </div>
            <div className="text-text-secondary text-sm">
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Revenue Overview</h3>
            <BarChart3 className="w-5 h-5 text-text-secondary" />
          </div>
          <AnalyticsChart type="revenue" />
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Storefront Traffic</h3>
            <TrendingUp className="w-5 h-5 text-text-secondary" />
          </div>
          <AnalyticsChart type="traffic" />
        </div>
      </div>

      {/* Storefronts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Your Storefronts</h3>
            {storefronts.length > 0 && (
              <button
                onClick={handleCreateStorefront}
                className="text-accent hover:text-accent/80 text-sm font-medium flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            )}
          </div>
          
          {storefronts.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-text-primary mb-2">
                No storefronts yet
              </h4>
              <p className="text-text-secondary mb-6">
                Create your first storefront by analyzing your X posts
              </p>
              <button
                onClick={handleCreateStorefront}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Zap className="w-5 h-5" />
                <span>Create Your First Storefront</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {storefronts.map((storefront) => (
                <div key={storefront.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">
                          {storefront.name}
                        </h4>
                        <p className="text-sm text-text-secondary">
                          {storefront.products?.length || 0} products • Created {storefront.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/storefront/${storefront.id}`)}
                        className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                        title="View Storefront"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="card">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'sale' ? 'bg-green-100 text-green-600' :
                    activity.type === 'view' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'product' ? 'bg-purple-100 text-purple-600' :
                    'bg-accent/10 text-accent'
                  }`}>
                    {activity.type === 'sale' ? <DollarSign className="w-4 h-4" /> :
                     activity.type === 'view' ? <Eye className="w-4 h-4" /> :
                     activity.type === 'product' ? <Plus className="w-4 h-4" /> :
                     <CheckCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary font-medium">
                      {activity.message}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-text-secondary">
                        {activity.time}
                      </p>
                      {activity.amount && (
                        <span className="text-xs font-medium text-green-600">
                          {activity.amount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Storefront Generator Modal */}
      {showGenerator && (
        <StorefrontGenerator
          onClose={() => setShowGenerator(false)}
          onGenerated={handleStorefrontGenerated}
          user={user}
        />
      )}
    </div>
  );
};

export default Dashboard;