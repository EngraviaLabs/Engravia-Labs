'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../store/slices/authSlice';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import { getImageUrl } from '../../../../lib/utils';
import Navbar from '../../../../components/layout/Navbar';
import Footer from '../../../../components/layout/Footer';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    api.get(`/orders/my/${params.orderId}`).then(r => setOrder(r.data.order)).catch(() => router.push('/account/orders')).finally(() => setLoading(false));
  }, [user, params.orderId]);

  const cancelOrder = async () => {
    if (!confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const { data } = await api.patch(`/orders/my/${params.orderId}/cancel`, { reason: 'Cancelled by customer' });
      setOrder(data.order);
      toast.success('Order cancelled');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Cannot cancel'); } finally { setCancelling(false); }
  };

  const statusColors: Record<string,string> = { placed:'text-yellow-400', confirmed:'text-blue-400', processing:'text-purple-400', shipped:'text-cyan-400', delivered:'text-green-400', cancelled:'text-red-400' };

  if (loading) return <div className="min-h-screen bg-[#0D0D0D] pt-24 flex items-center justify-center"><div className="font-cinzel text-[#D4AF37]">Loading order...</div></div>;
  if (!order) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/account/orders" className="text-[rgba(212,175,55,0.6)] hover:text-[#D4AF37] text-sm">← Orders</Link>
            <div className="font-cinzel text-2xl font-bold text-white">Order <span className="text-[#D4AF37]">#{order.orderNumber}</span></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Items */}
              <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6">
                <div className="font-cinzel text-[14px] font-semibold text-white mb-4">Order Items</div>
                <div className="space-y-4">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex gap-4 pb-4 border-b border-[rgba(255,255,255,0.04)] last:border-0 last:pb-0">
                      <div className="w-16 h-16 bg-[#111] flex-shrink-0 overflow-hidden border border-[rgba(212,175,55,0.1)]">
                        {item.image ? <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-cinzel text-xs">EL</div>}
                      </div>
                      <div className="flex-1">
                        <div className="font-cinzel text-[13px] text-white font-semibold">{item.name}</div>
                        <div className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</div>
                        {item.customization && <div className="text-[10px] text-[rgba(212,175,55,0.5)] mt-1">{Object.entries(item.customization).map(([k,v])=>`${k}: ${v}`).join(' · ')}</div>}
                      </div>
                      <div className="font-cinzel text-[#D4AF37] font-bold">₹{item.subtotal?.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6">
                <div className="font-cinzel text-[14px] font-semibold text-white mb-3">Shipping Address</div>
                <div className="text-[13px] text-[rgba(255,255,255,0.65)] leading-relaxed">
                  <div className="font-semibold text-white">{order.shippingAddress?.fullName}</div>
                  <div>{order.shippingAddress?.phone}</div>
                  <div>{order.shippingAddress?.line1}{order.shippingAddress?.line2 ? `, ${order.shippingAddress.line2}` : ''}</div>
                  <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6">
                <div className="font-cinzel text-[14px] font-semibold text-white mb-4">Order Timeline</div>
                <div className="space-y-3">
                  {order.statusHistory?.map((s: any, i: number) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
                      <div>
                        <div className={`text-[12px] font-semibold capitalize ${statusColors[s.status] || 'text-white'}`}>{s.status}</div>
                        <div className="text-[11px] text-[rgba(255,255,255,0.4)]">{new Date(s.timestamp).toLocaleString('en-IN')}</div>
                        {s.note && <div className="text-[11px] text-[rgba(255,255,255,0.5)] mt-0.5">{s.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-5">
              <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6">
                <div className="font-cinzel text-[14px] font-semibold text-white mb-4">Order Summary</div>
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between text-[rgba(255,255,255,0.6)]"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString()}</span></div>
                  {order.discountAmount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>−₹{order.discountAmount?.toLocaleString()}</span></div>}
                  <div className="flex justify-between text-[rgba(255,255,255,0.6)]"><span>Shipping</span><span>{order.shippingCharge === 0 ? 'Free' : `₹${order.shippingCharge}`}</span></div>
                  <div className="flex justify-between text-[rgba(255,255,255,0.6)]"><span>GST</span><span>₹{order.taxAmount?.toLocaleString()}</span></div>
                  <div className="h-px bg-[rgba(212,175,55,0.1)] my-2" />
                  <div className="flex justify-between font-bold"><span className="font-cinzel text-white">Total</span><span className="font-cinzel text-[#D4AF37] text-lg">₹{order.total?.toLocaleString()}</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-[rgba(212,175,55,0.08)] space-y-1 text-[12px] text-[rgba(255,255,255,0.5)]">
                  <div>Payment: <span className="text-white capitalize">{order.paymentMethod}</span></div>
                  <div>Status: <span className={`font-semibold capitalize ${statusColors[order.paymentStatus]||'text-white'}`}>{order.paymentStatus}</span></div>
                </div>
              </div>
              {['placed','confirmed'].includes(order.orderStatus) && (
                <button onClick={cancelOrder} disabled={cancelling} className="btn-outline-luxury w-full text-[10px] border-red-400/30 text-red-400 hover:bg-red-400/05 disabled:opacity-60">
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
              {order.trackingNumber && (
                <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5">
                  <div className="font-cinzel text-[13px] font-semibold text-white mb-2">Tracking</div>
                  <div className="text-[12px] text-[rgba(255,255,255,0.6)]"><span className="text-[#D4AF37]">{order.courierName}</span> – {order.trackingNumber}</div>
                  {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="btn-luxury mt-3 block text-center text-[10px] py-2">Track Now</a>}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
