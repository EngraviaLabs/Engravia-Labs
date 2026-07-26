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

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-16 items-center py-24 pt-32">
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
          <div className="flex flex-wrap gap-4 mb-14 relative z-20">
            <Link href="/collection" className="btn-luxury inline-block cursor-pointer">Shop Collection</Link>
            <Link href="/custom-order" className="btn-outline-luxury inline-block cursor-pointer">Custom Order</Link>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 pt-10 border-t border-[rgba(212,175,55,0.12)]">
            {[['12,000+','Happy Clients'],['99.8%','Satisfaction'],['48 hrs','Design Proof'],['Lifetime','Guarantee']].map(([n,l]) => (
              <div key={l}>
                <div className="font-cinzel text-[22px] font-bold text-[#D4AF37]">{n}</div>
                <div className="text-[11px] text-[rgba(255,255,255,0.45)] tracking-widest uppercase mt-1">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right — Laser Engraving Artwork Image */}
        <motion.div className="flex items-center justify-center" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:0.8,delay:0.2}}>
          <div className="relative">
            <div className="w-[360px] sm:w-[440px] h-[360px] sm:h-[440px] rounded-xl overflow-hidden border border-[rgba(212,175,55,0.3)] shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative group">
              <img
                src="/images/craft-legacy.jpg"
                alt="Engravia Labs Precision Laser Engraving"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <span className="text-[10px] tracking-[3px] uppercase text-[#D4AF37] font-semibold block mb-1">Precision Laser Technology</span>
                <h3 className="font-cinzel text-lg font-bold text-white leading-snug">Permanent Artistry in Stone & Metal</h3>
              </div>
            </div>
            {/* Badge */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-[#D4AF37] flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(212,175,55,0.4)] z-20">
              <div className="font-cinzel text-xl font-black text-[#0D0D0D]">4.9</div>
              <div className="text-[8px] font-bold text-[#0D0D0D] tracking-wide text-center leading-tight">STAR<br/>RATING</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
