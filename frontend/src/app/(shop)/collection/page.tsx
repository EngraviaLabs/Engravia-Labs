'use client';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import CartDrawer from '../../../components/ui/CartDrawer';
import { useCategories } from '../../../hooks/useProducts';
import { getImageUrl } from '../../../lib/utils';

export default function CollectionsPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="text-[11px] font-semibold tracking-[6px] uppercase text-[#D4AF37] mb-3 flex items-center justify-center gap-4">
              <span className="block w-8 h-px bg-[rgba(212,175,55,0.4)]" /> Handcrafted Stone Art <span className="block w-8 h-px bg-[rgba(212,175,55,0.4)]" />
            </div>
            <h1 className="font-cinzel text-4xl lg:text-5xl font-bold text-white tracking-[2px] mb-4">Explore Our Collections</h1>
            <p className="text-[rgba(255,255,255,0.5)] max-w-2xl mx-auto text-sm leading-relaxed">
              Discover distinct categories of stone mastery. Each collection tells a story of heritage, precision, and enduring luxury.
            </p>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] skeleton rounded-sm" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((cat: any) => (
                <Link
                  key={cat.slug || cat._id}
                  href={`/collection/${cat.slug}`}
                  className="group relative aspect-[3/4] bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] overflow-hidden hover:border-[rgba(212,175,55,0.5)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-end"
                >
                  {cat.image?.url ? (
                    <Image
                      src={getImageUrl(cat.image.url)}
                      alt={cat.name}
                      fill
                      unoptimized
                      className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg,#D4AF37 0px,#D4AF37 1px,transparent 1px,transparent 20px)' }} />
                      <div className="relative z-10 w-20 h-20 border border-[rgba(212,175,55,0.3)] flex items-center justify-center">
                        <span className="text-3xl text-[rgba(212,175,55,0.6)]">◈</span>
                      </div>
                    </div>
                  )}
                  <div className="relative z-10 bg-gradient-to-t from-[rgba(13,13,13,0.97)] to-transparent p-4 pt-10">
                    <div className="font-cinzel text-[13px] font-semibold text-white mb-1">{cat.name}</div>
                    <div className="text-[10px] text-[rgba(212,175,55,0.7)] tracking-widest uppercase">{cat.productCount || 0} Products</div>
                    <div className="w-7 h-7 border border-[rgba(212,175,55,0.3)] flex items-center justify-center mt-3 text-[#D4AF37] text-xs group-hover:bg-[#D4AF37] group-hover:text-[#0D0D0D] transition-all">→</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[rgba(255,255,255,0.4)]">
              <div className="font-cinzel text-lg mb-2">No Collections Found</div>
              <p className="text-sm">Check back later or contact us for custom work.</p>
            </div>
          )}

        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
