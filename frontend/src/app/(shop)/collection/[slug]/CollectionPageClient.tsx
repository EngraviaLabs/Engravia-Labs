'use client';
import { useState } from 'react';
import { useProducts } from '../../../../hooks/useProducts';
import ProductCard from '../../../../components/ui/ProductCard';

const SORT_OPTIONS = [
  { value:'-createdAt',label:'Latest First' },
  { value:'price',label:'Price: Low to High' },
  { value:'-price',label:'Price: High to Low' },
  { value:'-rating',label:'Top Rated' },
  { value:'-salesCount',label:'Most Popular' },
];

export default function CollectionPageClient({ slug }: { slug: string }) {
  const [sort, setSort] = useState('-createdAt');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProducts({ slug, sort, minPrice:minPrice||undefined, maxPrice:maxPrice||undefined, page, limit:12 });
  const products = data?.products || [];
  const pagination = data?.pagination;
  const title = slug.replace(/-/g,' ').replace(/\b\w/g, c=>c.toUpperCase());

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
      <div className="mb-12">
        <div className="text-[11px] font-semibold tracking-[5px] uppercase text-[#D4AF37] mb-3 flex items-center gap-4">
          <span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" /> Explore
        </div>
        <h1 className="font-cinzel text-4xl font-bold text-white">{title}</h1>
        <p className="text-[rgba(255,255,255,0.5)] mt-2">{pagination?.total||0} handcrafted pieces</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-60 flex-shrink-0">
          <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5 space-y-5">
            <div className="font-cinzel text-[12px] font-semibold text-[#D4AF37] tracking-[2px] uppercase">Filters</div>
            <div>
              <div className="text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Price Range</div>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={e=>setMinPrice(e.target.value)} className="w-full bg-[#0D0D0D] border border-[rgba(212,175,55,0.2)] text-white text-[12px] px-2 py-2 outline-none focus:border-[#D4AF37]" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} className="w-full bg-[#0D0D0D] border border-[rgba(212,175,55,0.2)] text-white text-[12px] px-2 py-2 outline-none focus:border-[#D4AF37]" />
              </div>
            </div>
            <button onClick={()=>{setMinPrice('');setMaxPrice('');setPage(1);}} className="text-[10px] text-[rgba(212,175,55,0.6)] hover:text-[#D4AF37] tracking-widest uppercase">Clear Filters</button>
          </div>
        </aside>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[13px] text-[rgba(255,255,255,0.5)]">{pagination?.total||0} products</span>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white text-[12px] px-4 py-2 outline-none focus:border-[#D4AF37]">
              {SORT_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">{Array.from({length:6}).map((_,i)=><div key={i} className="h-64 skeleton" />)}</div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">{products.map((p:any)=><ProductCard key={p._id} product={p} />)}</div>
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({length:pagination.pages}).map((_,i)=>(
                    <button key={i} onClick={()=>setPage(i+1)} className={`w-9 h-9 text-[12px] font-semibold border transition-all ${page===i+1?'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37]':'border-[rgba(212,175,55,0.25)] text-[rgba(255,255,255,0.6)] hover:border-[#D4AF37]'}`}>{i+1}</button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-[rgba(255,255,255,0.4)]"><div className="font-cinzel text-lg">No products found</div></div>
          )}
        </div>
      </div>
    </div>
  );
}
