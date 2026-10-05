import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Heart,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '../types';
import api from '../services/api';
import { ProductCard } from '../components/products/ProductCard';
import { EmptyState } from '../components/common/EmptyState';

export const CartPage: React.FC = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    tax,
    discount,
    grandTotal,
    applyPromoCode,
    promoCode
  } = useCart();

  const { toggleWishlist } = useWishlist();
  const [promoInput, setPromoInput] = useState('');
  const [recommended, setRecommended] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await api.get('/products?limit=4');
        setRecommended(res.data.products || []);
      } catch (err) {
        console.error('Failed to load recommended items:', err);
      }
    };
    fetchRecommended();
  }, []);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
    }
  };

  const handleSaveForLater = (product: Product, itemId?: string) => {
    toggleWishlist(product);
    if (itemId) removeFromCart(itemId);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any items to your shopping cart yet. Explore our top products and start shopping!"
          actionText="Start Shopping"
          actionLink="/shop"
          icon={<ShoppingBag className="w-8 h-8 text-violet-400" />}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Title */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-white">Shopping Cart</h1>
        <p className="text-xs text-slate-400 mt-1">Review your selected items and proceed to multi-step checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Items List */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-400">
            <span>{cartItems.length} Product(s) in Cart</span>
            <button onClick={clearCart} className="hover:text-rose-400 transition-colors">Clear Cart</button>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={item._id || product._id}
                  className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 hover:border-slate-700 transition-all shadow-md"
                >
                  {/* Product Thumbnail */}
                  <Link to={`/product/${product._id}`} className="w-24 h-24 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 space-y-1 text-center sm:text-left min-w-0">
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">{product.brand}</span>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-sm font-bold text-white truncate hover:text-violet-400 transition-colors">{product.name}</h3>
                    </Link>

                    <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 pt-1">
                      {item.selectedColor && <span>Color: <strong className="text-slate-200">{item.selectedColor}</strong></span>}
                      {item.selectedSize && <span>Size: <strong className="text-slate-200">{item.selectedSize}</strong></span>}
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-4 pt-3">
                      <button
                        onClick={() => handleSaveForLater(product, item._id)}
                        className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Save for later</span>
                      </button>

                      <button
                        onClick={() => item._id && removeFromCart(item._id)}
                        className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto gap-4 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() => item._id && updateQuantity(item._id, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-400 hover:text-white font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => item._id && updateQuantity(item._id, item.quantity + 1)}
                        className="px-2.5 py-1 text-slate-400 hover:text-white font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-black text-white">${(product.finalPrice * item.quantity).toFixed(0)}</p>
                      <p className="text-[10px] text-slate-500">${product.finalPrice} each</p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Order Summary Card */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-6 sticky top-28 shadow-xl">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">Order Summary</h2>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-violet-400" />
                <span>Promo Code</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SHOPSPHERE10"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white uppercase rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
                >
                  Apply
                </button>
              </div>
              {promoCode && (
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Code '{promoCode}' active
                </p>
              )}
            </form>

            {/* Subtotal Calculations */}
            <div className="space-y-3 text-xs border-t border-b border-slate-800 py-4">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span className="font-bold text-white">${subtotal}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promo Discount</span>
                  <span>-${discount}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-300">
                <span>Estimated Shipping</span>
                <span className="font-bold text-white">{shippingFee === 0 ? 'FREE' : `$${shippingFee}`}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Estimated Tax (18%)</span>
                <span className="font-bold text-white">${tax}</span>
              </div>

              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="text-violet-400">${grandTotal}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-violet-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Encrypted & Secure Checkout</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recommended Products Shelf */}
      {recommended.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-900">
          <h3 className="text-xl font-black text-white">Recommended for You</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommended.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
