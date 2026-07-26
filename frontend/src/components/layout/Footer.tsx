import Link from 'next/link';

export default function Footer() {
  const collections = ['Marble Name Plates','House Number Plates','Memorial Stones','Corporate Signages','Stone Scriptures','Custom Gifts'];
  const company = ['Our Story','Craftsmanship','Custom Orders','Testimonials','Blog'];
  const support = ['Track Your Order','Return Policy','Shipping Info','FAQ','Contact Us'];

  return (
    <footer className="bg-[#0A0A0A] border-t border-[rgba(212,175,55,0.1)]">
      <div className="max-w-[1280px] mx-auto px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 pb-12 border-b border-[rgba(212,175,55,0.08)]">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img src="/images/logo.jpg" alt="Engravia Labs Logo" className="h-11 w-auto object-contain mix-blend-screen brightness-110 contrast-125 filter drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]" />
              <span className="font-cinzel text-lg font-bold text-[#D4AF37] tracking-[3px]">ENGRAVIA LABS</span>
            </Link>
            <p className="text-[13px] text-[rgba(255,255,255,0.45)] leading-relaxed max-w-[280px] mb-6">
              India's premier luxury stone engraving studio. Crafting heritage, one stone at a time since 2018.
            </p>
            <div className="flex gap-3">
              {['Instagram','Facebook','YouTube','WhatsApp'].map(s => (
                <button key={s} className="w-9 h-9 border border-[rgba(212,175,55,0.25)] flex items-center justify-center text-[rgba(212,175,55,0.6)] hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.05)] transition-all text-xs" aria-label={s}>
                  {s[0]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-cinzel text-[13px] font-semibold text-[#D4AF37] tracking-[2px] uppercase mb-5">Collections</div>
            <ul className="space-y-2">
              {collections.map(l => (
                <li key={l}><Link href="/collection" className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-[#D4AF37] transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-cinzel text-[13px] font-semibold text-[#D4AF37] tracking-[2px] uppercase mb-5">Company</div>
            <ul className="space-y-2">
              {company.map(l => (
                <li key={l}><Link href="#" className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-[#D4AF37] transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-cinzel text-[13px] font-semibold text-[#D4AF37] tracking-[2px] uppercase mb-5">Customer Support & Policies</div>
            <ul className="space-y-2">
              <li><Link href="/faqs" className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-[#D4AF37] transition-colors">FAQs</Link></li>
              <li><Link href="/shipping-policy" className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-[#D4AF37] transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/return-refund-policy" className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-[#D4AF37] transition-colors">Return, Replacement & Refund</Link></li>
              <li><Link href="/cancellation-policy" className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-[#D4AF37] transition-colors">Cancellation Policy</Link></li>
              <li><Link href="/contact" className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-[#D4AF37] transition-colors">Contact Support</Link></li>
            </ul>
            <div className="mt-6 pt-5 border-t border-[rgba(212,175,55,0.08)]">
              <div className="text-[11px] text-[rgba(212,175,55,0.6)] tracking-widest uppercase mb-2">Reach Us</div>
              <div className="text-[13px] text-[rgba(255,255,255,0.4)] leading-relaxed">+91 98765 43210<br/>hello@engravialabs.com</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[rgba(255,255,255,0.3)]">
          <span>© 2025 Engravia Labs. All rights reserved.</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
            <Link href="/terms-conditions" className="hover:text-[#D4AF37] transition-colors">Terms & Conditions</Link>
            <Link href="/shipping-policy" className="hover:text-[#D4AF37] transition-colors">Shipping Policy</Link>
            <Link href="/return-refund-policy" className="hover:text-[#D4AF37] transition-colors">Return Policy</Link>
            <Link href="/cancellation-policy" className="hover:text-[#D4AF37] transition-colors">Cancellation Policy</Link>
            <Link href="/faqs" className="hover:text-[#D4AF37] transition-colors">FAQs</Link>
          </div>
          <span className="font-medium text-[rgba(255,255,255,0.5)]">Made with ♥ in India</span>
        </div>
      </div>
    </footer>
  );
}
