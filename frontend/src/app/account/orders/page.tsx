'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../store/slices/authSlice';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Link from 'next/link';

const STATUS_COLORS: Record<string,string> = {
  placed:'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  confirmed:'text-blue-400 bg-blue-400/10 border-blue-400/30',
  processing:'text-purple-400 bg-purple-400/10 border-purple-400/30',
  shipped:'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  delivered:'text-green-400 bg-green-400/10 border-green-400/30',
  cancelled:'text-red-400 bg-red-400/10 border-red-400/30',
};

export default function OrdersPage() {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    api.get('/orders/my').then(r => setOrders(r.data.orders)).finally(() => setLoading(false));
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <div className="font-cinzel text-2xl font-bold text-white mb-8">My <span className="text-[#D4AF37]">Orders</span></div>
          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-28 skeleton" />)}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)]">
              <div className="text-4xl mb-4">📦</div>
              <div className="font-cinzel text-xl text-white mb-3">No orders yet</div>
              <Link href="/collection" className="btn-luxury mt-4 inline-block">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order._id} className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5 hover:border-[rgba(212,175,55,0.3)] transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="font-cinzel text-[#D4AF37] font-semibold text-sm">#{order.orderNumber}</div>
                      <div className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 border ${STATUS_COLORS[order.orderStatus] || 'text-white border-white/20'}`}>{order.orderStatus}</span>
                      <span className="font-cinzel text-[#D4AF37] font-bold">₹{order.total?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {order.items?.slice(0,3).map((item: any, i: number) => (
                      <div key={i} className="text-[12px] text-[rgba(255,255,255,0.6)]">{item.name} <span className="text-[rgba(255,255,255,0.3)]">×{item.quantity}</span></div>
                    ))}
                    {order.items?.length > 3 && <span className="text-[12px] text-[rgba(212,175,55,0.6)]">+{order.items.length-3} more</span>}
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/account/orders/${order._id}`} className="btn-outline-luxury text-[10px] py-2 px-4">View Details</Link>
                    {order.trackingNumber && <a href={order.trackingUrl || '#'} target="_blank" rel="noreferrer" className="btn-outline-luxury text-[10px] py-2 px-4">Track Package</a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
