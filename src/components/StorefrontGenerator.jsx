import React, { useState } from 'react';
import { X, Zap, Loader, CheckCircle, Twitter, Image } from 'lucide-react';

const StorefrontGenerator = ({ onClose, onGenerated, user }) => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedPosts, setAnalyzedPosts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [storefrontName, setStorefrontName] = useState('');

  const mockPosts = [
    {
      id: '1',
      content: 'Just launched my new online course on digital marketing! 🚀 Learn how to grow your business with social media strategies that actually work.',
      likes: 1250,
      retweets: 324,
      suggestedProduct: {
        title: 'Digital Marketing Mastery Course',
        description: 'Complete guide to growing your business with proven social media strategies',
        price: 97,
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
      }
    },
    {
      id: '2',
      content: 'Been getting tons of DMs about 1-on-1 consultations. If you need personalized business advice, I\'m opening up a few slots this month!',
      likes: 892,
      retweets: 156,
      suggestedProduct: {
        title: 'Business Strategy Consultation',
        description: '60-minute one-on-one session to discuss your business growth strategy',
        price: 150,
        imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop'
      }
    },
    {
      id: '3',
      content: 'My productivity toolkit template has helped 500+ entrepreneurs organize their workflow. Simple but effective! ⚡',
      likes: 678,
      retweets: 89,
      suggestedProduct: {
        title: 'Productivity Toolkit Template',
        description: 'Proven workflow organization system used by 500+ entrepreneurs',
        price: 29,
        imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop'
      }
    }
  ];

  const handleAnalyzePosts = async () => {
    setIsAnalyzing(true);
    setStep(2);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAnalyzedPosts(mockPosts);
    setIsAnalyzing(false);
    setStep(3);
  };

  const toggleProductSelection = (post) => {
    const product = { ...post.suggestedProduct, id: post.id, xPostId: post.id };
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleCreateStorefront = () => {
    if (!storefrontName || selectedProducts.length === 0) return;

    const newStorefront = {
      id: Date.now().toString(),
      name: storefrontName,
      ownerHandle: user.xHandle,
      products: selectedProducts,
      createdAt: new Date().toLocaleDateString(),
      url: `https://xstore.weaver.com/${user.xHandle.replace('@', '')}/${Date.now()}`
    };

    onGenerated(newStorefront);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-text-primary">Create New Storefront</h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Introduction */}
        {step === 1 && (
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                AI-Powered Storefront Generation
              </h3>
              <p className="text-text-secondary max-w-2xl mx-auto">
                We'll analyze your most popular X posts to identify potential products and services you can sell. 
                Our AI will generate product listings based on your content.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Twitter className="w-6 h-6" />
                </div>
                <h4 className="font-medium text-text-primary mb-1">Analyze Posts</h4>
                <p className="text-sm text-text-secondary">Scan your top-performing X posts</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="font-medium text-text-primary mb-1">Generate Products</h4>
                <p className="text-sm text-text-secondary">AI creates sellable product listings</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-medium text-text-primary mb-1">Launch Store</h4>
                <p className="text-sm text-text-secondary">Deploy your shoppable storefront</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleAnalyzePosts}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Zap className="w-5 h-5" />
                <span>Analyze My X Posts</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Analyzing */}
        {step === 2 && (
          <div className="p-6 text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader className="w-8 h-8 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Analyzing Your Content
              </h3>
              <p className="text-text-secondary">
                Our AI is scanning your posts and identifying monetization opportunities...
              </p>
            </div>

            <div className="space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-sm text-text-secondary">Fetching your top posts...</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-300"></div>
                <span className="text-sm text-text-secondary">Analyzing engagement patterns...</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-500"></div>
                <span className="text-sm text-text-secondary">Generating product suggestions...</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Product Selection */}
        {step === 3 && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Select Products for Your Storefront
              </h3>
              <p className="text-text-secondary">
                We found {analyzedPosts.length} potential products based on your posts. Select which ones to include:
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {analyzedPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.some(p => p.id === post.id)}
                      onChange={() => toggleProductSelection(post)}
                      className="mt-1 text-accent"
                    />
                    <div className="flex-1">
                      <div className="mb-3">
                        <p className="text-sm text-text-secondary mb-2">Original Post:</p>
                        <p className="text-text-primary italic">"{post.content}"</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-text-secondary">
                          <span>❤️ {post.likes}</span>
                          <span>🔄 {post.retweets}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-text-secondary mb-2">Suggested Product:</p>
                        <div className="flex items-center space-x-4">
                          <img
                            src={post.suggestedProduct.imageUrl}
                            alt={post.suggestedProduct.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-text-primary">
                              {post.suggestedProduct.title}
                            </h4>
                            <p className="text-sm text-text-secondary mb-1">
                              {post.suggestedProduct.description}
                            </p>
                            <span className="text-lg font-bold text-accent">
                              ${post.suggestedProduct.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-text-primary">
                  Selected Products: {selectedProducts.length}
                </span>
                <span className="text-text-secondary">
                  Step 3 of 4
                </span>
              </div>
              
              <button
                onClick={() => setStep(4)}
                disabled={selectedProducts.length === 0}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Storefront Setup
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Storefront Configuration */}
        {step === 4 && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Configure Your Storefront
              </h3>
              <p className="text-text-secondary">
                Give your storefront a name and review your products before launching.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Storefront Name
              </label>
              <input
                type="text"
                value={storefrontName}
                onChange={(e) => setStorefrontName(e.target.value)}
                placeholder="e.g., My Digital Products Store"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-text-primary mb-3">Selected Products ({selectedProducts.length})</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-text-primary truncate">
                          {product.title}
                        </h5>
                        <p className="text-sm text-accent font-medium">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-text-secondary hover:text-text-primary transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCreateStorefront}
                disabled={!storefrontName || selectedProducts.length === 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Storefront
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorefrontGenerator;