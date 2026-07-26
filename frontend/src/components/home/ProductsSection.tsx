'use client';
import { useState } from 'react';
import ProductCard from '../ui/ProductCard';
import SectionHeader from '../ui/SectionHeader';
import Link from 'next/link';
import { useBestSellers, useFeaturedProducts } from '../../hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

export default function ProductsSection() {
  const [tab, setTab] = useState<'bestsellers'|'featured'|'new'>('bestsellers');
  const { data: bestsellers=[] } = useBestSellers();
  const { data: featured=[] } = useFeaturedProducts();
  const { data: newArrivals=[] } = useQuery({ queryKey:['new-arrivals'], queryFn: async()=>{ const {data}=await api.get('/products/new-arrivals'); return data.products; } });

  const products = tab==='bestsellers' ? bestsellers : tab==='featured' ? featured : newArrivals;

  return (
    <section className="bg-[#111] py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeader eyebrow="Handpicked For Excellence" title="Our Finest Pieces" />
        {/* Tabs */}
        <div className="flex border-b border-[rgba(212,175,55,0.15)] mb-10">
          {[['bestsellers','Best Sellers'],['featured','Featured'],['new','New Arrivals']].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k as any)} className={`px-7 py-3.5 text-[12px] font-semibold tracking-[1.5px] uppercase transition-all border-b-2 -mb-px font-poppins ${tab===k?'text-[#D4AF37] border-[#D4AF37]':'text-[rgba(255,255,255,0.4)] border-transparent hover:text-white'}`}>{l}</button>
          ))}
        </div>
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.slice(0,8).map((p: any) => <ProductCard key={p._id} product={p} />)}
            </div>
            <div className="text-center mt-10">
              <Link href="/collection" className="btn-outline-luxury">View All Products →</Link>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({length:4}).map((_,i)=>(
              <div key={i} className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)] animate-pulse">
                <div className="aspect-square skeleton" />
                <div className="p-4 space-y-2"><div className="h-3 skeleton rounded w-1/2" /><div className="h-4 skeleton rounded w-3/4" /><div className="h-3 skeleton rounded w-1/3" /></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
