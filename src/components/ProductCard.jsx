import React from 'react';
import { ExternalLink, Star, Heart } from 'lucide-react';

const ProductCard = ({ product, variant = 'default', onAddToCart, onView }) => {
  const isCompact = variant === 'compact';

  return (
    <div className={`card hover:shadow-modal transition-shadow ${isCompact ? 'p-4' : ''}`}>
      <div className={`aspect-video bg-gray-100 rounded-md mb-4 overflow-hidden ${isCompact ? 'aspect-square' : ''}`}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="flex items-start justify-between mb-2">
        <h3 className={`font-semibold text-text-primary ${isCompact ? 'text-sm' : 'text-base'}`}>
          {product.title}
        </h3>
        <button className="p-1 text-text-secondary hover:text-red-500 transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>
      
      <p className={`text-text-secondary mb-4 ${isCompact ? 'text-xs line-clamp-2' : 'text-sm line-clamp-3'}`}>
        {product.description}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <span className={`font-bold text-text-primary ${isCompact ? 'text-lg' : 'text-xl'}`}>
          ${product.price}
        </span>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm text-text-secondary">4.8</span>
        </div>
      </div>
      
      <div className={`flex gap-2 ${isCompact ? 'flex-col' : ''}`}>
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            className={`btn-primary flex-1 ${isCompact ? 'text-sm py-2' : ''}`}
          >
            Add to Cart
          </button>
        )}
        {onView && (
          <button
            onClick={() => onView(product)}
            className={`p-2 text-text-secondary hover:text-text-primary transition-colors border border-gray-300 rounded-md ${isCompact ? 'w-full' : ''}`}
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;