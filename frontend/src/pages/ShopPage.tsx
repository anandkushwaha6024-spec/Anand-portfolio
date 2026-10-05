import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  RotateCcw
} from 'lucide-react';
import { Product } from '../types';
import api from '../services/api';
import { ProductCard } from '../components/products/ProductCard';
import { QuickViewModal } from '../components/products/QuickViewModal';
import { ProductGridSkeleton } from '../components/products/ProductGridSkeleton';
import { EmptyState } from '../components/common/EmptyState';

const CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Shoes',
  'Beauty',
  'Home & Kitchen',
  'Accessories',
  'Sports',
  'Books'
];

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filter States initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'All');
  const [maxPrice, setMaxPrice] = useState<number>(Number(searchParams.get('maxPrice')) || 3000);
  const [minRating, setMinRating] = useState<number>(Number(searchParams.get('rating')) || 0);
  const [minDiscount, setMinDiscount] = useState<number>(Number(searchParams.get('discount')) || 0);
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Sync URL search params with filter states
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    if (searchParams.get('category')) setSelectedCategory(searchParams.get('category') || 'All');
    if (searchParams.get('isFlashDeal') === 'true') setMinDiscount(10);
  }, [searchParams]);

  // Fetch products from backend whenever filter parameters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (selectedCategory && selectedCategory !== 'All') queryParams.append('category', selectedCategory);
        if (selectedBrand && selectedBrand !== 'All') queryParams.append('brand', selectedBrand);
        if (maxPrice < 3000) queryParams.append('maxPrice', maxPrice.toString());
        if (minRating > 0) queryParams.append('rating', minRating.toString());
        if (minDiscount > 0) queryParams.append('discount', minDiscount.toString());
        if (sort) queryParams.append('sort', sort);
        queryParams.append('page', page.toString());
        queryParams.append('limit', '12');

        const res = await api.get(`/products?${queryParams.toString()}`);
        setProducts(res.data.products || []);
        setTotalPages(res.data.pages || 1);
        setTotalProducts(res.data.totalProducts || 0);
        if (res.data.brands) setAvailableBrands(['All', ...res.data.brands]);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, selectedCategory, selectedBrand, maxPrice, minRating, minDiscount, sort, page]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setMaxPrice(3000);
    setMinRating(0);
    setMinDiscount(0);
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Shop Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing <strong className="text-slate-200">{totalProducts}</strong> products
          </p>
        </div>

        {/* Top Controls (Search, Sort, Mobile Filter Button) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="lg:hidden px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-violet-400" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-6 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 h-fit sticky top-28">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Filter className="w-4 h-4 text-violet-400" />
              <span>Filter Options</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-violet-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</label>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-violet-600/20 text-violet-400 font-bold border border-violet-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 border-t border-slate-800 pt-4">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold uppercase tracking-wider text-slate-400">Max Price</label>
              <span className="font-bold text-violet-400">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="20"
              max="3000"
              step="50"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setPage(1);
              }}
              className="w-full accent-violet-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Brand Filter */}
          {availableBrands.length > 1 && (
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Brands</label>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {availableBrands.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setSelectedBrand(b);
                      setPage(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedBrand === b
                        ? 'bg-violet-600/20 text-violet-400 font-bold border border-violet-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rating Filter */}
          <div className="space-y-2 border-t border-slate-800 pt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Minimum Rating</label>
            <div className="space-y-1">
              {[4, 3, 2, 1].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setMinRating(minRating === r ? 0 : r);
                    setPage(1);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    minRating === r
                      ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                  <span>{r} Stars & Above</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Product Grid Container */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Active Filter Badges */}
          {(selectedCategory !== 'All' || selectedBrand !== 'All' || search || minRating > 0 || minDiscount > 0) && (
            <div className="flex flex-wrap items-center gap-2 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-600/20 text-violet-400 text-xs font-semibold rounded-xl border border-violet-500/30">
                  {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
                </span>
              )}
              {selectedBrand !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-600/20 text-violet-400 text-xs font-semibold rounded-xl border border-violet-500/30">
                  Brand: {selectedBrand}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrand('All')} />
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-600/20 text-violet-400 text-xs font-semibold rounded-xl border border-violet-500/30">
                  "{search}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearch('')} />
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-xl border border-amber-500/30">
                  {minRating}+ Stars
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(0)} />
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-xs text-rose-400 hover:underline ml-auto font-medium"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No Products Match Your Criteria"
              description="Try adjusting your filter options or search term to discover available products."
              actionText="Reset Filters"
              actionLink="#"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className={`p-2.5 rounded-xl border transition-all ${
                  page <= 1
                    ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                      page === pageNum
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className={`p-2.5 rounded-xl border transition-all ${
                  page >= totalPages
                    ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xs bg-slate-900 border-l border-slate-800 h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-base font-bold text-white">Filter Options</span>
              <button onClick={() => setIsFilterDrawerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Max Price (${maxPrice})</label>
              <input
                type="range"
                min="20"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>

            <button
              onClick={() => {
                setIsFilterDrawerOpen(false);
              }}
              className="w-full py-3 bg-violet-600 text-white font-bold text-xs rounded-xl"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

    </div>
  );
};
