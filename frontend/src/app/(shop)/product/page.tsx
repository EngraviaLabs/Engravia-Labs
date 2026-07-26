'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import CartDrawer from '../../../components/ui/CartDrawer';
import ProductCard from '../../../components/ui/ProductCard';
import { useProducts } from '../../../hooks/useProducts';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Latest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-rating', label: 'Top Rated' },
  { value: '-salesCount', label: 'Most Popular' },
];

function ProductsList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [sort, setSort] = useState('-createdAt');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  // Fetch all products with search & filters
  const { data, isLoading } = useProducts({
    sort,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    page,
    limit: 12,
    search: searchQuery || undefined,
  });

  const products = data?.products || [];
  const pagination = data?.pagination;

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
    if (searchQuery) {
      window.location.href = '/product';
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          
          {/* Header */}
          <div className="mb-12">
            <div className="text-[11px] font-semibold tracking-[5px] uppercase text-[#D4AF37] mb-3 flex items-center gap-4">
              <span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" /> Handcarved Perfection
            </div>
            <h1 className="font-cinzel text-4xl font-bold text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="text-[rgba(255,255,255,0.5)] mt-2">
              {pagination?.total || 0} handcrafted premium pieces
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-60 flex-shrink-0">
              <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5 space-y-5">
                <div className="font-cinzel text-[12px] font-semibold text-[#D4AF37] tracking-[2px] uppercase">Filters</div>
                
                <div>
                  <div className="text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Price Range</div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={e => { setMinPrice(e.target.value); setPage(1); }}
                      className="w-full bg-[#0D0D0D] border border-[rgba(212,175,55,0.2)] text-white text-[12px] px-2 py-2 outline-none focus:border-[#D4AF37]"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
                      className="w-full bg-[#0D0D0D] border border-[rgba(212,175,55,0.2)] text-white text-[12px] px-2 py-2 outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="text-[10px] text-[rgba(212,175,55,0.6)] hover:text-[#D4AF37] tracking-widest uppercase block"
                >
                  {searchQuery || minPrice || maxPrice ? 'Clear All Filters' : 'Reset'}
                </button>
              </div>
            </aside>

            {/* Product Grid Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[13px] text-[rgba(255,255,255,0.5)]">{pagination?.total || 0} products</span>
                <select
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1); }}
                  className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white text-[12px] px-4 py-2 outline-none focus:border-[#D4AF37]"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-64 skeleton bg-[#1A1A1A] rounded-sm border border-[rgba(212,175,55,0.05)]" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {products.map((p: any) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                  
                  {pagination && pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                      {Array.from({ length: pagination.pages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i + 1)}
                          className={`w-9 h-9 text-[12px] font-semibold border transition-all ${
                            page === i + 1
                              ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37]'
                              : 'border-[rgba(212,175,55,0.25)] text-[rgba(255,255,255,0.6)] hover:border-[#D4AF37]'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 text-[rgba(255,255,255,0.4)]">
                  <div className="font-cinzel text-lg mb-2">No products found</div>
                  <p className="text-sm">Try searching for other items or clearing your filters.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center font-cinzel text-[#D4AF37] animate-pulse">Loading products...</div>}>
      <ProductsList />
    </Suspense>
  );
}
