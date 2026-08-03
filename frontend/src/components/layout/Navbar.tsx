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
      <nav className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <img 
            src="/images/logo-emblem.png" 
            alt="Engravia Labs Monogram" 
            className="h-10 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(212,175,55,0.4)] group-hover:scale-105 group-hover:drop-shadow-[0_0_18px_rgba(212,175,55,0.7)] transition-all duration-300" 
          />
          <div className="flex flex-col">
            <span className="font-cinzel text-[17px] font-bold tracking-[3.5px] text-[#D4AF37] leading-none group-hover:text-[#F5E6A3] transition-colors">
              ENGRAVIA <span className="text-white">LABS</span>
            </span>
            <span className="text-[8px] tracking-[2.5px] text-[rgba(255,255,255,0.45)] uppercase mt-1 font-medium hidden sm:block">
              Precision · Permanence · Art
            </span>
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
        <div className="flex items-center gap-5">
          <button onClick={() => setSearchOpen(!searchOpen)} className="text-[rgba(255,255,255,0.7)] hover:text-[#D4AF37] transition-colors text-lg" aria-label="Search">
            🔍
          </button>
          <Link href="/account/wishlist" className="text-[rgba(255,255,255,0.7)] hover:text-[#D4AF37] transition-colors text-lg" aria-label="Wishlist">
            ♡
          </Link>
          <button onClick={() => dispatch(toggleCart())} className="relative text-[rgba(255,255,255,0.8)] hover:text-[#D4AF37] transition-colors p-1" aria-label="Cart">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#D4AF37] text-[#0D0D0D] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
          {user ? (
            <Link href="/account/profile" className="text-[rgba(255,255,255,0.7)] hover:text-[#D4AF37] transition-colors text-lg" aria-label="Account">
              👤
            </Link>
          ) : (
            <Link href="/auth/login" className="btn-outline-luxury text-[11px] py-2 px-4">Sign In</Link>
          )}
          {/* Hamburger */}
          <button className="lg:hidden text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">☰</button>
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#111] border-t border-[rgba(212,175,55,0.1)]">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="block px-6 py-4 text-[rgba(255,255,255,0.7)] hover:text-[#D4AF37] text-sm font-medium tracking-widest uppercase border-b border-[rgba(255,255,255,0.04)] transition-colors" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
