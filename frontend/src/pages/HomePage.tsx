import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Clock,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Zap,
  TrendingUp,
  Star
} from 'lucide-react';
import { Product, Category } from '../types';
import api from '../services/api';
import { ProductCard } from '../components/products/ProductCard';
import { QuickViewModal } from '../components/products/QuickViewModal';
import { ProductGridSkeleton } from '../components/products/ProductGridSkeleton';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [flashDeals, setFlashDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, featRes, flashRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?isFeatured=true&limit=8'),
          api.get('/products?isFlashDeal=true&limit=4')
        ]);
        setCategories(catRes.data || []);
        setFeaturedProducts(featRes.data.products || []);
        setFlashDeals(flashRes.data.products || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Flash Deals Countdown timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 pt-12 pb-20 border-b border-slate-900">
        {/* Decorative background gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation Shopping Experience</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Discover Everything <br />
                <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  You Love.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Shop premium noise-canceling audio, luxury fashion, modern sneakers, and home essentials with instant shipping and total peace of mind.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/shop?isFlashDeal=true"
                  className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 transition-all hover:border-slate-700 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Explore Deals</span>
                </Link>
              </div>

              {/* Stats Ribbon */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-900 max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white">50k+</p>
                  <p className="text-xs text-slate-500 font-medium">Happy Customers</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Authentic Products</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white">4.9 ★</p>
                  <p className="text-xs text-slate-500 font-medium">Overall Rating</p>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Banner */}
            <div className="relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/60 p-4">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000"
                  alt="ShopSphere Hero Showcase"
                  className="w-full h-[400px] sm:h-[480px] object-cover rounded-2xl"
                />

                {/* Floating Discount Card Badge */}
                <div className="absolute top-8 right-8 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-bounce-short">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-sm">
                    30%
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Season Super Sale</p>
                    <p className="text-[10px] text-slate-400">Up to 30% OFF selected lines</p>
                  </div>
                </div>

                {/* Floating Product Highlight */}
                <div className="absolute bottom-8 left-8 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 max-w-xs">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200"
                      alt="Sony Headphones"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">Sony WH-1000XM5</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-black text-violet-400">$339</span>
                      <span className="text-[10px] text-slate-500 line-through">$399</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">Shop by Category</h2>
            <p className="text-xs text-slate-400 mt-1">Browse our curated collection across top categories</p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id || category.name}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center hover:border-violet-500/50 hover:bg-slate-900 transition-all duration-300 flex flex-col items-center gap-3 shadow-md"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform duration-300">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-violet-400 transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-violet-950/80 via-slate-900 to-indigo-950/80 border border-violet-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-violet-900/40 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Flash Deals</h2>
                <p className="text-xs text-slate-400">Limited stock discounts — ending soon!</p>
              </div>
            </div>

            {/* Live Countdown Timer */}
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-2xl">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-400 mr-1">Ends In:</span>
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-white">
                <span className="bg-violet-600 px-2 py-1 rounded-lg">{String(timeLeft.hours).padStart(2, '0')}</span>:
                <span className="bg-violet-600 px-2 py-1 rounded-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>:
                <span className="bg-violet-600 px-2 py-1 rounded-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* Deals Grid */}
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {flashDeals.map((product) => (
                <div key={product._id} className="relative">
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                  {/* Stock progress indicator */}
                  <div className="mt-2 px-1">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-semibold">
                      <span>Available: {product.stock} left</span>
                      <span className="text-amber-400">Selling Fast</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">Featured Products</h2>
            <p className="text-xs text-slate-400 mt-1">Handpicked favorites selected for exceptional quality</p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            <span>Explore Catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">100% Secure Payment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We process encrypted checkout with SSL technology protecting every single transaction.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Fast & Reliable Shipping</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enjoy express door-to-door delivery with real-time tracking for every step.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">30-Day Easy Returns</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Not completely satisfied? Return your items hassle-free within 30 days for a full refund.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">24/7 Dedicated Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our customer service specialists are ready around the clock to help with any inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

    </div>
  );
};
