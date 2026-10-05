import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isSaved = isInWishlist(product._id);

  return (
    <div className="group relative bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-2xl hover:shadow-violet-900/10 transition-all duration-300 flex flex-col h-full">
      {/* Discount & Deal Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.discount > 0 && (
          <span className="px-2.5 py-1 bg-violet-600 text-white text-xs font-bold rounded-lg shadow-md">
            -{product.discount}% OFF
          </span>
        )}
        {product.isFlashDeal && (
          <span className="px-2 py-0.5 bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-md">
            Flash Deal
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md border transition-all ${
          isSaved
            ? 'bg-rose-500/20 text-rose-500 border-rose-500/40'
            : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:text-rose-400 hover:bg-slate-900'
        }`}
        title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-950/50 flex items-center justify-center">
        <Link to={`/product/${product._id}`} className="w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Quick View Button Overlay */}
        {onQuickView && (
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
            <button
              onClick={() => onQuickView(product)}
              className="px-4 py-2 bg-slate-900/90 text-white text-xs font-semibold rounded-xl border border-slate-700 shadow-xl flex items-center gap-1.5 hover:bg-violet-600 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-300"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
            {product.brand}
          </span>
          <Link to={`/product/${product._id}`}>
            <h3 className="text-sm font-bold text-slate-100 line-clamp-2 hover:text-violet-400 transition-colors mt-0.5">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="text-xs font-bold ml-1 text-slate-200">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-slate-500">({product.numReviews} reviews)</span>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-white">${product.finalPrice}</span>
              {product.discount > 0 && (
                <span className="text-xs text-slate-500 line-through">${product.price}</span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl font-medium flex items-center justify-center transition-all ${
              product.stock <= 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 active:scale-95'
            }`}
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
