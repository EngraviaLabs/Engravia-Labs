'use client';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '../ui/SectionHeader';
import { getImageUrl } from '../../lib/utils';

const fallbackCategories = [
  { name:'Marble Name Plates', count:'48', slug:'marble-name-plates', icon:'◈' },
  { name:'Stone Scriptures', count:'24', slug:'stone-scriptures', icon:'✦' },
  { name:'Metal Wall Art', count:'36', slug:'metal-wall-art', icon:'⬡' },
  { name:'Custom Gifts', count:'52', slug:'custom-gifts', icon:'◇' },
  { name:'Memorial Stones', count:'18', slug:'memorial-stones', icon:'✧' },
  { name:'Corporate Signages', count:'31', slug:'corporate-signages', icon:'▣' },
  { name:'House Number Plates', count:'29', slug:'house-number-plates', icon:'⌂' },
  { name:'Business Signs', count:'44', slug:'business-signs', icon:'◉' },
];

export default function CollectionsGrid({ categories }: { categories?: any[] }) {
  const data = categories?.length ? categories : fallbackCategories;
  return (
    <section className="bg-[#0D0D0D] py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeader eyebrow="Curated Exclusively For You" title="Explore Our Collections" subtitle="Eight distinct categories of stone mastery. Each collection tells a story of heritage, precision, and enduring luxury." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {data.map((cat) => (
            <Link key={cat.slug||cat._id} href={`/collection/${cat.slug}`}
              className="group relative aspect-[3/4] bg-[#1A1A1A] border border-[rgba(212,175,55,0.15)] rounded-2xl overflow-hidden hover:border-[rgba(212,175,55,0.5)] hover:-translate-y-1.5 shadow-xl transition-all duration-300 flex flex-col justify-end">
              {cat.image?.url ? (
                <Image src={getImageUrl(cat.image.url)} alt={cat.name} fill unoptimized className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500 rounded-2xl" sizes="(max-width:768px) 50vw, 25vw" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:'repeating-linear-gradient(-45deg,#D4AF37 0px,#D4AF37 1px,transparent 1px,transparent 20px)'}} />
                  <div className="relative z-10 w-20 h-20 border border-[rgba(212,175,55,0.3)] flex items-center justify-center rounded-xl">
                    <span className="text-3xl text-[rgba(212,175,55,0.6)]">{cat.icon||'◈'}</span>
                  </div>
                </div>
              )}
              {/* Product Count Badge */}
              <div className="absolute top-3 right-3 z-20 bg-[#0D0D0D]/85 border border-[rgba(212,175,55,0.3)] text-[#D4AF37] px-2.5 py-1 text-[10px] font-semibold tracking-wider rounded-full backdrop-blur-md shadow-md">
                {cat.count||cat.productCount||0} Products
              </div>
              {/* Card Footer Info */}
              <div className="relative z-10 bg-gradient-to-t from-[rgba(13,13,13,0.95)] via-[rgba(13,13,13,0.6)] to-transparent p-4 pt-12 flex items-center justify-between">
                <div>
                  <div className="font-cinzel text-[13px] font-bold text-white group-hover:text-[#D4AF37] transition-colors">{cat.name}</div>
                  <div className="text-[10px] text-[rgba(255,255,255,0.5)] tracking-widest uppercase">Explore →</div>
                </div>
                <div className="w-7 h-7 border border-[rgba(212,175,55,0.3)] rounded-full flex items-center justify-center text-[#D4AF37] text-xs group-hover:bg-[#D4AF37] group-hover:text-[#0D0D0D] transition-all">→</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
