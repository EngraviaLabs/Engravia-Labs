'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../store/authStore';

const NAV_GROUPS = [
  { section: null, items: [{ icon: '📊', label: 'Dashboard', href: '/' }] },
  {
    section: 'Catalogue',
    items: [
      { icon: '🏷', label: 'Categories', href: '/categories' },
      { icon: '📦', label: 'Products', href: '/products' },
    ],
  },
  {
    section: 'Sales',
    items: [
      { icon: '🛒', label: 'Orders', href: '/orders' },
      { icon: '🎟', label: 'Coupons', href: '/coupons' },
    ],
  },
  {
    section: 'Customers',
    items: [
      { icon: '👥', label: 'Customers', href: '/customers' },
      { icon: '⭐', label: 'Reviews', href: '/reviews' },
      { icon: '📋', label: 'Custom Orders', href: '/custom-orders' },
    ],
  },
  {
    section: 'Content',
    items: [
      { icon: '🏠', label: 'Homepage Builder', href: '/homepage-builder' },
      { icon: '📝', label: 'Blog', href: '/blog' },
      { icon: '💬', label: 'Testimonials', href: '/testimonials' },
    ],
  },
  {
    section: 'System',
    items: [
      { icon: '📈', label: 'Analytics', href: '/analytics' },
      { icon: '⚙️', label: 'Settings', href: '/settings' },
    ],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, hydrate, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { hydrate(); }, []);
  useEffect(() => { if (!isLoading && !user) router.push('/login'); }, [user, isLoading]);
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (isLoading) {
    return <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center"><div className="font-cinzel text-[#D4AF37] animate-pulse">Loading console...</div></div>;
  }
  if (!user) return null;

  const currentPage = NAV_GROUPS.flatMap(g => g.items).find(i => i.href === pathname);

  return (
    <div className="flex min-h-screen bg-[#0D0D0D]">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-50 w-64 bg-[#111] border-r border-[rgba(212,175,55,0.1)] flex-shrink-0 flex flex-col h-screen transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="px-5 py-5 border-b border-[rgba(212,175,55,0.1)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/images/logo-emblem.png" alt="Engravia Logo" className="h-9 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <div>
              <div className="font-cinzel text-[13px] font-bold text-[#D4AF37] tracking-[2px] leading-tight">ENGRAVIA LABS</div>
              <div className="text-[9px] text-[rgba(255,255,255,0.4)] tracking-[2px] uppercase mt-0.5 font-medium">Admin Console</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-[rgba(255,255,255,0.5)] hover:text-white p-1 text-lg">✕</button>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi}>
              {group.section && <div className="px-5 pt-4 pb-1.5 text-[9px] font-bold tracking-[2.5px] uppercase text-[rgba(212,175,55,0.4)]">{group.section}</div>}
              {group.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-5 py-2.5 text-[13px] transition-all border-l-2 ${pathname === item.href ? 'text-[#D4AF37] border-[#D4AF37] bg-[rgba(212,175,55,0.06)]' : 'text-[rgba(255,255,255,0.55)] border-transparent hover:text-white hover:bg-[rgba(212,175,55,0.03)]'}`}
                >
                  <span className="text-[15px]">{item.icon}</span>{item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-[rgba(212,175,55,0.1)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center font-cinzel text-xs font-bold text-[#0D0D0D]">{user.name?.[0]}</div>
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-[rgba(255,255,255,0.4)] capitalize">{user.role.replace('_',' ')}</div>
            </div>
          </div>
          <button onClick={() => { logout(); router.push('/login'); }} className="w-full text-left text-[11px] text-red-400/70 hover:text-red-400 tracking-wide uppercase transition-colors">Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="h-16 border-b border-[rgba(212,175,55,0.08)] flex items-center justify-between px-4 sm:px-8 sticky top-0 bg-[#0D0D0D] z-10">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button onClick={() => setSidebarOpen(s => !s)} className="text-[rgba(255,255,255,0.7)] hover:text-[#D4AF37] transition-colors p-1.5 text-xl">☰</button>
            <div className="font-cinzel text-base sm:text-[17px] font-semibold text-white truncate">{currentPage?.label || 'Dashboard'}</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="hidden sm:inline-block text-[11px] bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] text-[#D4AF37] px-3 py-1 font-semibold tracking-wide">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5" />LIVE
            </span>
            <a href={process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'} target="_blank" rel="noreferrer" className="btn-outline text-[10px] py-1.5 px-2.5 sm:px-3 whitespace-nowrap">View Store ↗</a>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
