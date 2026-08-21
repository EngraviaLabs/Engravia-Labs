'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection({ banner }: { banner?: any }) {
  const title = banner?.title || 'Craft Your Legacy\nIn Black Marble';
  const subtitle = banner?.subtitle || "Bespoke stone engravings that command respect, define spaces, and endure centuries. Handcrafted in Rajasthan's finest studios.";

  return (
    <section className="relative min-h-screen flex items-center bg-[#0D0D0D] overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'repeating-linear-gradient(45deg,#D4AF37 0px,#D4AF37 1px,transparent 1px,transparent 60px)'}} />
      {/* Gold glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{background:'radial-gradient(circle,rgba(212,175,55,0.1) 0%,transparent 70%)'}} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{background:'radial-gradient(circle,rgba(212,175,55,0.05) 0%,transparent 70%)'}} />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-16 items-center py-28 lg:py-36 pt-36 lg:pt-44">
        {/* Left */}
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.7}}>
          <div className="text-[11px] font-semibold tracking-[5px] uppercase text-[#D4AF37] mb-6 flex items-center gap-3">
            <span className="block w-10 h-px bg-[#D4AF37]" />
            India's Premier Engraving Studio
            <span className="block w-10 h-px bg-[#D4AF37]" />
          </div>
          <h1 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white mb-6 whitespace-pre-line">
            {title.split('\n')[0]}<br />{title.split('\n')[1]?.split(' ').map((w: string, i: number) => i === (title.split('\n')[1].split(' ').length-1) ? <span key={i} className="text-[#D4AF37]"> {w}</span> : (i===0?w:' '+w))}
          </h1>
          <p className="text-[15px] text-[rgba(255,255,255,0.6)] leading-relaxed mb-10 max-w-[480px]">{subtitle}</p>
          <div className="flex flex-row items-center gap-2.5 sm:gap-4 mb-14 relative z-20 w-full sm:w-auto">
            <Link href={banner?.ctaLink || "/collection"} className="btn-luxury flex-1 sm:flex-none text-center px-2.5 xs:px-4 sm:px-8 py-3.5 text-[10.5px] xs:text-[11.5px] sm:text-xs tracking-wider sm:tracking-[2px] whitespace-nowrap cursor-pointer">
              {banner?.ctaText || "Shop Collection"}
            </Link>
            <Link href={banner?.ctaSecondaryLink || "/custom-order"} className="btn-outline-luxury flex-1 sm:flex-none text-center px-2.5 xs:px-4 sm:px-8 py-3.5 text-[10.5px] xs:text-[11.5px] sm:text-xs tracking-wider sm:tracking-[2px] whitespace-nowrap cursor-pointer">
              {banner?.ctaSecondaryText || "Custom Order"}
            </Link>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-10 border-t border-[rgba(212,175,55,0.12)]">
            {[['12,000+','Happy Clients'],['99.8%','Satisfaction Rate'],['48 hrs','Design Proof']].map(([n,l]) => (
              <div key={l} className="min-w-0">
                <div className="font-cinzel text-xl sm:text-2xl font-bold text-[#D4AF37]">{n}</div>
                <div className="text-[10px] sm:text-[11px] text-[rgba(255,255,255,0.45)] tracking-wider uppercase mt-1 leading-tight">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Laser Engraving Artwork Image */}
        <motion.div className="flex items-center justify-center" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:0.8,delay:0.2}}>
          <div className="relative max-w-full">
            <div className="w-[300px] xs:w-[360px] sm:w-[460px] lg:w-[500px] h-[300px] xs:h-[360px] sm:h-[460px] lg:h-[500px] rounded-2xl overflow-hidden border border-[rgba(212,175,55,0.3)] shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative group">
              <img
                src="/images/craft-legacy.jpg"
                alt="Engravia Labs Precision Laser Engraving"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7 pr-24 sm:pr-32 text-left">
                <span className="text-[10px] sm:text-[11px] lg:text-[12px] tracking-[2.5px] sm:tracking-[3.5px] lg:tracking-[4px] uppercase text-[#D4AF37] font-bold block mb-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  <span className="text-[#D4AF37] mr-1.5">✦</span>Precision Laser Technology
                </span>
                <h3 className="font-cinzel text-base sm:text-lg lg:text-xl font-bold text-white leading-snug drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
                  Permanent Artistry in Stone & Metal
                </h3>
              </div>
            </div>
            {/* Prominent 4.9 Star Rating Badge */}
            <div className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#D4AF37] border-4 border-[#0D0D0D] flex flex-col items-center justify-center shadow-[0_12px_40px_rgba(212,175,55,0.5)] z-30 transition-transform duration-300 hover:scale-105">
              <div className="font-cinzel text-xl sm:text-2xl font-black text-[#0D0D0D] leading-none flex items-center gap-0.5">
                <span>4.9</span>
                <span className="text-xs sm:text-sm">★</span>
              </div>
              <div className="text-[7.5px] sm:text-[9px] font-extrabold text-[#0D0D0D] tracking-wider text-center leading-tight mt-0.5">CUSTOMER<br/>RATING</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
