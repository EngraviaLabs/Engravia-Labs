'use client';
import Link from 'next/link';
import { useSettings } from '../../hooks/useSettings';
import { useCategories } from '../../hooks/useProducts';

export default function Footer() {
  const { data: settings } = useSettings();
  const { data: categories } = useCategories();

  const displayCollections = categories && categories.length > 0
    ? categories.slice(0, 8).map((c: any) => ({ name: c.name, href: `/collection/${c.slug}` }))
    : [
        { name: 'Marble Name Plates', href: '/collection' },
        { name: 'House Number Plates', href: '/collection' },
        { name: 'Memorial Stones', href: '/collection' },
        { name: 'Corporate Signages', href: '/collection' },
        { name: 'Stone Scriptures', href: '/collection' },
        { name: 'Custom Gifts', href: '/collection' }
      ];

  const phone = settings?.contact_phone || '+91 98765 43210';
  const email = settings?.contact_email || 'hello@engravialabs.com';
  const address = settings?.address || 'Makrana Road, Kishangarh, Rajasthan 305801';
  const whatsapp = settings?.whatsapp_number || '919876543210';
  const instagram = settings?.instagram_url || 'https://instagram.com';
  const facebook = settings?.facebook_url || 'https://facebook.com';
  const youtube = settings?.youtube_url || 'https://youtube.com';

  return (
    <footer className="bg-[#0A0A0A] border-t border-[rgba(212,175,55,0.1)]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 pb-12 border-b border-[rgba(212,175,55,0.08)]">
          <div>
            <Link href="/" className="flex items-center gap-3.5 mb-4 group">
              <img src="/images/logo-emblem.png" alt="Engravia Labs Seal" className="h-11 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-all" />
              <div className="flex flex-col">
                <span className="font-cinzel text-lg font-bold text-[#D4AF37] tracking-[3px] leading-none">ENGRAVIA LABS</span>
                <div className="w-full flex justify-between items-center text-[8px] font-medium text-[rgba(255,255,255,0.45)] uppercase mt-1 select-none">
                  <span>PRECISION</span>
                  <span className="text-[#D4AF37]/50 text-[6px]">•</span>
                  <span>PERMANENCE</span>
                  <span className="text-[#D4AF37]/50 text-[6px]">•</span>
                  <span>ART</span>
                </div>
              </div>
            </Link>
            <p className="text-[13px] text-[rgba(255,255,255,0.45)] leading-relaxed max-w-[280px] mb-6">
              India's premier luxury stone engraving studio. Crafting heritage, one stone at a time since 2018.
            </p>
            <div className="flex gap-3">
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[rgba(212,175,55,0.25)] flex items-center justify-center text-[rgba(212,175,55,0.7)] hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-all" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[rgba(212,175,55,0.25)] flex items-center justify-center text-[rgba(212,175,55,0.7)] hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-all" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a href={youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[rgba(212,175,55,0.25)] flex items-center justify-center text-[rgba(212,175,55,0.7)] hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-all" aria-label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-[rgba(212,175,55,0.25)] flex items-center justify-center text-[rgba(212,175,55,0.7)] hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-all" aria-label="WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.285-.143-1.689-.834-1.951-.929-.262-.095-.453-.143-.644.143-.191.286-.74.929-.907 1.119-.167.19-.334.214-.619.071-.285-.143-1.204-.444-2.293-1.415-.848-.756-1.42-1.69-1.587-1.976-.167-.286-.018-.44.125-.582.129-.129.285-.334.428-.5.143-.167.19-.286.285-.476.095-.19.048-.357-.024-.5-.071-.143-.644-1.552-.882-2.122-.231-.557-.466-.481-.644-.49-.167-.008-.357-.01-.548-.01-.19 0-.5.071-.762.357-.262.286-1.001.977-1.001 2.385 0 1.408 1.025 2.769 1.168 2.96.143.19 2.017 3.08 4.887 4.318.683.295 1.217.471 1.633.603.686.218 1.311.187 1.805.114.551-.082 1.689-.69 1.927-1.357.238-.667.238-1.238.167-1.357-.071-.119-.262-.19-.547-.333z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <div className="font-cinzel text-[13px] font-semibold text-[#D4AF37] tracking-[2px] uppercase mb-5">Collections</div>
            <ul className="space-y-2">
              {displayCollections.map((c: { name: string; href: string }) => (
                <li key={c.name}>
                  <Link href={c.href} className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-[#D4AF37] transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-cinzel text-[13px] font-semibold text-[#D4AF37] tracking-[2px] uppercase mb-5">Company</div>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-[#D4AF37] transition-colors">Our Story</Link></li>
              <li><Link href="/about#craftsmanship" className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-[#D4AF37] transition-colors">Craftsmanship</Link></li>
              <li><Link href="/custom-order" className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-[#D4AF37] transition-colors">Custom Orders</Link></li>
              <li><Link href="/about#testimonials" className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-[#D4AF37] transition-colors">Testimonials</Link></li>
              <li><Link href="/blog" className="text-[13px] text-[rgba(255,255,255,0.45)] hover:text-[#D4AF37] transition-colors">Blog</Link></li>
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
              <div className="text-[13px] text-[rgba(255,255,255,0.4)] leading-relaxed">
                <span className="block mb-1">{address}</span>
                <span>{phone}</span><br />
                <span>{email}</span>
              </div>
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
