'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../store/slices/authSlice';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import CartDrawer from '../../../components/ui/CartDrawer';
import ProductCard from '../../../components/ui/ProductCard';
import Link from 'next/link';

export default function WishlistPage() {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    api.get('/users/wishlist').then(r => setWishlist(r.data.wishlist)).finally(() => setLoading(false));
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="font-cinzel text-2xl font-bold text-white mb-8">My <span className="text-[#D4AF37]">Wishlist</span></div>
          {loading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{[1,2,3,4].map(i=><div key={i} className="aspect-square skeleton" />)}</div>
          : wishlist.length === 0 ? (
            <div className="text-center py-20 bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)]">
              <div className="text-4xl mb-4">♡</div>
              <div className="font-cinzel text-xl text-white mb-3">Your wishlist is empty</div>
              <Link href="/collection" className="btn-luxury mt-4 inline-block">Explore Collections</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {wishlist.map((p: any) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
