import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Send,
  Sparkles,
  ChevronRight,
  Package
} from 'lucide-react';
import { Product, Review } from '../types';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/products/ProductCard';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // User interactions
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews' | 'shipping'>('description');

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        const prodData: Product = res.data;
        setProduct(prodData);
        setSelectedImage(prodData.images[0]);
        if (prodData.colors && prodData.colors.length > 0) setSelectedColor(prodData.colors[0]);
        if (prodData.sizes && prodData.sizes.length > 0) setSelectedSize(prodData.sizes[0]);

        // Fetch related products from same category
        const relRes = await api.get(`/products?category=${encodeURIComponent(prodData.category)}&limit=4`);
        setRelatedProducts((relRes.data.products || []).filter((p: Product) => p._id !== prodData._id));

        // Fetch reviews
        const revRes = await api.get(`/products/${id}/reviews`);
        setReviews(revRes.data || []);
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-96 bg-slate-900 rounded-3xl max-w-2xl mx-auto mb-8"></div>
        <div className="h-8 bg-slate-900 rounded w-1/3 mx-auto"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-xs text-slate-400">The product you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-violet-600 text-white font-bold text-xs rounded-xl">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to leave a review', 'error');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      showToast('Please enter a review comment', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating: newRating,
        comment: newComment
      });
      setReviews(res.data.reviews || []);
      showToast('Thank you! Your review has been published.', 'success');
      setNewComment('');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-white">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-white">{product.category}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-200 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-violet-600 text-white text-xs font-bold rounded-xl shadow-lg">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl border-2 overflow-hidden shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-violet-500 shadow-lg shadow-violet-500/20'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Buying Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
              {product.brand} · {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 leading-tight">{product.name}</h1>

            {/* Ratings & Reviews Counter */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-sm font-bold ml-1 text-slate-100">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400 font-medium">{product.numReviews} Verified Reviews</span>
              <span className="text-slate-600">|</span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} left)
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-baseline gap-4">
            <span className="text-3xl font-black text-white">${product.finalPrice}</span>
            {product.discount > 0 && (
              <span className="text-base text-slate-500 line-through">${product.price}</span>
            )}
            {product.discount > 0 && (
              <span className="px-2.5 py-1 bg-violet-600/20 border border-violet-500/30 text-violet-400 text-xs font-bold rounded-lg">
                Save ${(product.price - product.finalPrice).toFixed(0)}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Selected Color: <span className="text-violet-400">{selectedColor}</span></label>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedColor === c
                        ? 'border-violet-500 bg-violet-600/20 text-white shadow-md'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Selected Size: <span className="text-violet-400">{selectedSize}</span></label>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === s
                        ? 'border-violet-500 bg-violet-600/20 text-white shadow-md'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper & Wishlist */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 text-slate-400 hover:text-white flex items-center justify-center font-bold text-lg"
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-white text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 text-slate-400 hover:text-white flex items-center justify-center font-bold text-lg"
              >
                +
              </button>
            </div>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3.5 rounded-2xl border transition-all ${
                isSaved
                  ? 'bg-rose-500/20 text-rose-500 border-rose-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-rose-400'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="py-4 px-6 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-violet-600/30 transition-all hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="py-4 px-6 rounded-2xl bg-slate-100 hover:bg-white text-slate-950 text-sm font-bold flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.02]"
            >
              Buy Now
            </button>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-violet-400" />
              <span>Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-violet-400" />
              <span>30 Days Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>2 Year Warranty</span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabbed Product Information Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 overflow-x-auto gap-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'description'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'specifications'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Shipping & Returns
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'description' && (
          <div className="space-y-4 text-sm text-slate-300 leading-relaxed max-w-3xl">
            <p>{product.description}</p>
            <p>
              Built with premium quality materials, this product offers extraordinary durability and sleek elegance tailored to suit your daily lifestyle. Every unit undergoes rigorous quality testing before shipment.
            </p>
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === 'specifications' && (
          <div className="max-w-2xl">
            {product.specifications && product.specifications.length > 0 ? (
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex justify-between p-3.5 text-xs bg-slate-900/40">
                    <span className="font-semibold text-slate-400">{spec.key}</span>
                    <span className="font-bold text-slate-100">{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Standard specifications apply for this model.</p>
            )}
          </div>
        )}

        {/* Tab 3: Customer Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-8 max-w-4xl">
            {/* Submit Review Form */}
            <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>Write a Customer Review</span>
              </h4>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Your Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 text-amber-400"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-slate-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share your experience with this product..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </form>
            </div>

            {/* Existing Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to leave a review!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 font-bold text-xs flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-white">{rev.userName}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <p className="text-[10px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Shipping */}
        {activeTab === 'shipping' && (
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-w-2xl">
            <p className="font-bold text-white">Standard Delivery (3-5 Business Days)</p>
            <p>Free standard shipping on orders over $150. Orders placed before 2 PM EST are dispatched on the same business day.</p>
            
            <p className="font-bold text-white pt-2">Hassle-Free Returns</p>
            <p>Return any unused product in original packaging within 30 days for a instant replacement or full money refund.</p>
          </div>
        )}

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white">You Might Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
