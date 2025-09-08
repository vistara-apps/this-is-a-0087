import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Zap, 
  ShoppingBag, 
  BarChart3, 
  CreditCard, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp
} from 'lucide-react';

const Landing = () => {
  const { user, connectXAccount, loading } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      await connectXAccount();
      navigate('/dashboard');
    }
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Product Discovery",
      description: "Automatically scan your top X posts to identify sellable products and services"
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "One-Click Storefront",
      description: "Generate a fully functional, mobile-responsive storefront in seconds"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Integrated Payments",
      description: "Accept both fiat and cryptocurrency payments seamlessly"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Track sales, traffic, and your most profitable content"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Storefronts Created" },
    { value: "$2.5M+", label: "Revenue Generated" },
    { value: "95%", label: "User Satisfaction" },
    { value: "24h", label: "Average Setup Time" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 w-full py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4 mr-2" />
              Transform Your X Influence Into Revenue
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight mb-6">
              Weave your X influence into{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                shoppable storefronts
              </span>{' '}
              instantly
            </h1>
            
            <p className="text-xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
              Automatically generate shoppable storefronts by analyzing your most-liked X posts. 
              Turn your social influence into sales with AI-powered product discovery and integrated payments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                disabled={loading}
                className="btn-primary flex items-center space-x-2 text-lg px-8 py-4 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>{user ? 'Go to Dashboard' : 'Connect X Account'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              <div className="flex items-center space-x-2 text-text-secondary">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Free to start • No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-text-secondary font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything you need to monetize your X presence
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Our AI-powered platform handles the heavy lifting so you can focus on creating great content
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-modal transition-shadow duration-300">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              See XStore Weaver in action
            </h2>
            <p className="text-xl text-text-secondary">
              Watch how we transform social posts into profitable storefronts
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-1">
              <div className="bg-surface rounded-lg p-8">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <p className="text-text-secondary">
                      Interactive demo coming soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Ready to turn your X influence into revenue?
            </h2>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already monetizing their social presence with XStore Weaver
            </p>
            
            <button
              onClick={handleGetStarted}
              disabled={loading}
              className="btn-primary flex items-center space-x-2 text-lg px-8 py-4 mx-auto disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>{user ? 'Go to Dashboard' : 'Get Started Free'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;