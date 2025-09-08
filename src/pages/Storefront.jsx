import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePaymentContext } from '../contexts/PaymentContext';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  CreditCard, 
  Wallet,
  ExternalLink,
  Star,
  Heart,
  Share,
  Twitter
} from 'lucide-react';

const Storefront = () => {
  const { id } = useParams();
  const [storefront, setStorefront] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [paid, setPaid] = useState(false);
  const { createSession } = usePaymentContext();

  useEffect(() => {
    // Load storefront data (in real app, this would be from API)
    const allStorefronts = JSON.parse(localStorage.getItem('storefronts_1') || '[]');
    const currentStorefront = allStorefronts.find(s => s.id === id);
    setStorefront(currentStorefront);
  }, [id]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (paymentMethod === 'crypto') {
      try {
        await createSession(`$${getTotalPrice().toFixed(2)}`);
        setPaid(true);
        setCart([]);
        setShowCheckout(false);
      } catch (error) {
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again.');
      }
    } else {
      // Simulate Stripe payment
      alert('Stripe payment integration would be implemented here');
      setPaid(true);
      setCart([]);
      setShowCheckout(false);
    }
  };

  if (!storefront) {
    return (
      <div className="max-w-4xl mx-auto px-4 w-full py-16 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Storefront not found</h2>
        <p className="text-text-secondary">The storefront you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 w-full py-8">
      {/* Storefront Header */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Twitter className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{storefront.name}</h1>
              <p className="text-text-secondary">Curated by {storefront.ownerHandle}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-text-secondary">
                  {storefront.products?.length || 0} products
                </span>
                <span className="text-sm text-text-secondary">•</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-text-secondary">4.9 (127 reviews)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-text-secondary hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Share className="w-5 h-5" />
            </button>
            <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {paid && (
        <div className="card mb-8 border-2 border-green-200 bg-green-50">
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
            <p className="text-green-700">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Products Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-text-primary mb-6">Featured Products</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {storefront.products?.map((product) => (
              <div key={product.id} className="card hover:shadow-modal transition-shadow">
                <div className="aspect-video bg-gray-100 rounded-md mb-4 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{product.title}</h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-text-primary">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart */}
        <div>
          <div className="card sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Shopping Cart</h3>
              <div className="flex items-center space-x-1">
                <ShoppingCart className="w-5 h-5 text-text-secondary" />
                <span className="text-sm text-text-secondary">
                  {cart.reduce((total, item) => total + item.quantity, 0)} items
                </span>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-50" />
                <p className="text-text-secondary">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-text-primary truncate">
                          {item.title}
                        </h4>
                        <p className="text-sm text-text-secondary">
                          ${item.price} each
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-text-primary"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-text-primary"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-text-primary">Total:</span>
                    <span className="text-xl font-bold text-text-primary">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Checkout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg max-w-md w-full p-6 shadow-modal">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Complete Your Purchase</h3>
            
            <div className="mb-6">
              <p className="text-text-secondary mb-2">Order Summary:</p>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.title} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-text-secondary mb-3">Payment Method:</p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary"
                  />
                  <CreditCard className="w-4 h-4" />
                  <span>Credit Card (Stripe)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="crypto"
                    checked={paymentMethod === 'crypto'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-primary"
                  />
                  <Wallet className="w-4 h-4" />
                  <span>Cryptocurrency</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 btn-primary"
              >
                Pay ${getTotalPrice().toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Storefront;