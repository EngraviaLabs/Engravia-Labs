'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartCount, toggleCart } from '../../store/slices/cartSlice';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();

  const tabs = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/product', label: 'Products', icon: '🛍️' },
    { href: '/collection', label: 'Collections', icon: '💎' },
    { href: '/custom-order', label: 'Custom Order', icon: '🛠️' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0D]/98 border-t border-[rgba(212,175,55,0.2)] backdrop-blur-lg px-1 py-1.5 flex items-center justify-around shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
      {tabs.map(tab => {
        const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
              isActive ? 'text-[#D4AF37] bg-[rgba(212,175,55,0.08)]' : 'text-[rgba(255,255,255,0.6)] hover:text-white'
            }`}
          >
            <span className="text-base leading-none mb-0.5">{tab.icon}</span>
            <span className="text-[9.5px] font-medium tracking-wider uppercase font-poppins">{tab.label}</span>
          </Link>
        );
      })}

      {/* Cart Button Tab */}
      <button
        onClick={() => dispatch(toggleCart())}
        className="relative flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[rgba(255,255,255,0.6)] hover:text-white transition-all"
      >
        <div className="relative">
          <span className="text-base leading-none mb-0.5">🛒</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#D4AF37] text-[#0D0D0D] text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-md">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </div>
        <span className="text-[9.5px] font-medium tracking-wider uppercase font-poppins">Cart</span>
      </button>
    </div>
  );
}
