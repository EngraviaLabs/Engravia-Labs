'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartCount, toggleCart } from '../../store/slices/cartSlice';
import { selectUser, clearCredentials } from '../../store/slices/authSlice';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartCount = useSelector(selectCartCount);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { href: '/collection', label: 'Collections' },
    { href: '/product', label: 'Products' },
    { href: '/custom-order', label: 'Custom Order' },
    { href: '/about', label: 'About Us' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0D0D0D]/98 shadow-2xl' : 'bg-[#0D0D0D]/95'} border-b border-[rgba(212,175,55,0.15)] backdrop-blur-lg`}>
      <nav className="max-w-[1280px] mx-auto px-3 sm:px-6 h-[64px] sm:h-[72px] flex items-center justify-between gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3.5 group shrink-0 min-w-0">
          <img 
            src="/images/logo-emblem.png" 
            alt="Engravia Labs Seal" 
            className="h-8 xs:h-9 sm:h-11 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] group-hover:scale-105 group-hover:drop-shadow-[0_0_18px_rgba(212,175,55,0.7)] transition-all duration-300 shrink-0" 
          />
          <div className="flex flex-col shrink-0 min-w-0">
            <span className="font-cinzel text-[13px] xs:text-[15px] sm:text-[17px] font-bold tracking-[1.5px] sm:tracking-[3px] text-[#D4AF37] leading-none group-hover:text-[#F5E6A3] transition-colors whitespace-nowrap">
              ENGRAVIA <span className="text-white">LABS</span>
            </span>
            <div className="w-full flex justify-between items-center text-[7.5px] font-medium text-[rgba(255,255,255,0.5)] uppercase mt-1 hidden sm:flex select-none">
              <span>PRECISION</span>
              <span className="text-[#D4AF37]/50 text-[6px]">•</span>
              <span>PERMANENCE</span>
              <span className="text-[#D4AF37]/50 text-[6px]">•</span>
              <span>ART</span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-[rgba(255,255,255,0.7)] text-[12px] font-medium tracking-[1.5px] uppercase font-poppins hover:text-[#D4AF37] transition-colors duration-200">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Icons */}
        <div className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-4 lg:gap-5 shrink-0">
          <button onClick={() => setSearchOpen(!searchOpen)} className="text-[rgba(255,255,255,0.7)] hover:text-[#D4AF37] transition-colors text-sm sm:text-base lg:text-lg p-1 shrink-0" aria-label="Search">
            🔍
          </button>
          <Link href="/account/wishlist" className="text-[rgba(255,255,255,0.7)] hover:text-[#D4AF37] transition-colors text-sm sm:text-base lg:text-lg p-1 shrink-0" aria-label="Wishlist">
            ♡
          </Link>
          <button onClick={() => dispatch(toggleCart())} className="relative text-[rgba(255,255,255,0.8)] hover:text-[#D4AF37] transition-colors p-1 shrink-0" aria-label="Cart">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-current" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#0D0D0D] text-[9px] font-extrabold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-md">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
          {user ? (
            <Link href="/account/profile" className="text-[rgba(255,255,255,0.7)] hover:text-[#D4AF37] transition-colors text-sm sm:text-base lg:text-lg p-1 shrink-0" aria-label="Account">
              👤
            </Link>
          ) : (
            <Link href="/auth/login" className="btn-outline-luxury text-[10px] sm:text-[11px] py-1.5 px-2.5 sm:px-4 whitespace-nowrap shrink-0">Sign In</Link>
          )}
          {/* Hamburger */}
          <button className="lg:hidden text-white p-1 text-lg sm:text-xl shrink-0" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">☰</button>
        </div>
      </nav>

      {/* Search Bar */}
      {searchOpen && (
        <div className="bg-[#111] border-t border-[rgba(212,175,55,0.1)] px-6 py-4">
          <div className="max-w-[600px] mx-auto flex gap-3">
            <input
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  window.location.href = `/product?search=${searchQuery}`;
                  setSearchOpen(false);
                }
              }}
              placeholder="Search marble name plates, memorial stones..."
              className="flex-1 bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3 text-sm font-poppins outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[rgba(255,255,255,0.3)]"
            />
            <Link href={`/product?search=${searchQuery}`} className="btn-luxury text-[11px] py-3 px-6 inline-block" onClick={() => setSearchOpen(false)}>Search</Link>
          </div>
        </div>
      )}

      {/* Mobile Full-Width Menu List */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0D0D0D] border-t border-b border-[rgba(212,175,55,0.2)] shadow-2xl animate-fadeInUp">
          <div className="max-w-[1280px] mx-auto px-5 py-6 space-y-2">
            {[
              { href: '/product', label: 'Products', icon: '🛍️', note: 'Explore Luxury Stone Products' },
              { href: '/collection', label: 'Collections', icon: '💎', note: 'Curated Stone Engraving Collections' },
              { href: '/custom-order', label: 'Custom Order', icon: '🛠️', note: 'Bespoke Personalized Engravings' },
              { href: '/about', label: 'About Us', icon: '📖', note: 'Our Heritage & Artisans' },
              { href: '/blog', label: 'Blog', icon: '✍️', note: 'Guides, Care & Stories' },
              { href: '/contact', label: 'Contact Us', icon: '✉️', note: 'Get in touch with our studio' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#1A1A1A]/80 hover:bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)] hover:border-[rgba(212,175,55,0.3)] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xl p-2 rounded-lg bg-[#0D0D0D] border border-[rgba(212,175,55,0.15)]">{link.icon}</span>
                  <div>
                    <div className="font-cinzel text-[13px] font-bold text-white group-hover:text-[#D4AF37] transition-colors">{link.label}</div>
                    <div className="text-[11px] text-[rgba(255,255,255,0.4)]">{link.note}</div>
                  </div>
                </div>
                <span className="text-[#D4AF37] text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}

            {/* Quick Action Buttons */}
            <div className="pt-3 grid grid-cols-2 gap-3">
              <Link
                href="/account/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white hover:text-[#D4AF37] text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <span>♡</span> Wishlist
              </Link>
              <button
                onClick={() => { setMenuOpen(false); dispatch(toggleCart()); }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] text-white hover:text-[#D4AF37] text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <span>🛒</span> Cart ({cartCount})
              </button>
            </div>

            {/* Account / Guest Authentication */}
            <div className="pt-2">
              {user ? (
                <div className="flex gap-2">
                  <Link
                    href="/account/profile"
                    onClick={() => setMenuOpen(false)}
                    className="btn-luxury flex-1 text-center py-3 text-[11px]"
                  >
                    👤 My Profile ({user.name})
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); dispatch(clearCredentials()); }}
                    className="btn-outline-luxury py-3 px-4 text-[11px]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-luxury w-full block text-center py-3 text-[11px]"
                >
                  🔑 Sign In / Register →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
