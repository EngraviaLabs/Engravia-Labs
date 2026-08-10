'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import AdminShell from '../../../components/AdminShell';
import { StatusBadge } from '../../../components/UIPrimitives';
import api from '../../../lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../../lib/utils';

const ORDER_STATUSES = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const qc = useQueryClient();
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', params.id],
    queryFn: async () => (await api.get(`/orders/admin/${params.id}`)).data.order,
  });

  const updateStatus = async () => {
    if (!newStatus) { toast.error('Select a status'); return; }
    setUpdating(true);
    try {
      await api.patch(`/orders/admin/${params.id}/status`, { status: newStatus, note, trackingNumber: trackingNumber || undefined, courierName: courierName || undefined });
      toast.success('Order status updated');
      qc.invalidateQueries({ queryKey: ['admin-order', params.id] });
      setNote(''); setTrackingNumber(''); setCourierName('');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Update failed'); } finally { setUpdating(false); }
  };

  if (isLoading) return <AdminShell><div className="space-y-4">{[1,2,3].map(i=><div key={i} className="h-32 skeleton"/>)}</div></AdminShell>;
  if (!order) return <AdminShell><div className="text-center py-20 text-[rgba(255,255,255,0.4)]">Order not found</div></AdminShell>;

  return (
    <AdminShell>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/orders" className="text-[rgba(212,175,55,0.6)] hover:text-[#D4AF37] text-sm">← Orders</Link>
        <h1 className="font-cinzel text-xl font-bold text-white">Order <span className="text-[#D4AF37]">#{order.orderNumber}</span></h1>
        <StatusBadge status={order.orderStatus} />
        <StatusBadge status={order.paymentStatus} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5">
            <div className="font-cinzel text-[14px] font-semibold text-white mb-4">Order Items</div>
            <div className="space-y-3">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex gap-4 py-3 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                  <div className="w-14 h-14 bg-[#111] flex-shrink-0 border border-[rgba(212,175,55,0.1)] overflow-hidden">
                    {item.image ? <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-[#D4AF37] font-cinzel">EL</div>}
                  </div>
                  <div className="flex-1">
                    <div className="font-cinzel text-[13px] text-white">{item.name}</div>
                    <div className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">SKU: {item.sku} · Qty: {item.quantity}</div>
                    {item.customization && Object.keys(item.customization).length > 0 && (
                      <div className="text-[11px] text-[rgba(212,175,55,0.6)] mt-0.5">{Object.entries(item.customization).map(([k,v])=>`${k}: ${v}`).join(' · ')}</div>
                    )}
                  </div>
                  <div className="font-cinzel text-[#D4AF37] font-bold">₹{item.subtotal?.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer + Address */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5">
              <div className="font-cinzel text-[13px] font-semibold text-white mb-3">Customer</div>
              <div className="text-[13px] text-[rgba(255,255,255,0.65)] space-y-1">
                <div className="font-semibold text-white">{order.user?.name || order.guestName}</div>
                <div>{order.user?.email || order.guestEmail}</div>
                <div>{order.user?.phone || order.guestPhone}</div>
              </div>
            </div>
            <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5">
              <div className="font-cinzel text-[13px] font-semibold text-white mb-3">Shipping Address</div>
              <div className="text-[13px] text-[rgba(255,255,255,0.65)] space-y-0.5">
                <div className="font-semibold text-white">{order.shippingAddress?.fullName}</div>
                <div>{order.shippingAddress?.phone}</div>
                <div>{order.shippingAddress?.line1}</div>
                {order.shippingAddress?.line2 && <div>{order.shippingAddress.line2}</div>}
                <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5">
            <div className="font-cinzel text-[13px] font-semibold text-white mb-4">Status Timeline</div>
            <div className="space-y-3">
              {order.statusHistory?.map((s: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-[12px] font-semibold text-[#D4AF37] capitalize">{s.status}</div>
                    <div className="text-[11px] text-[rgba(255,255,255,0.4)]">{new Date(s.timestamp).toLocaleString('en-IN')}</div>
                    {s.note && <div className="text-[11px] text-[rgba(255,255,255,0.5)] mt-0.5">{s.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-5">
          {/* Financials */}
          <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5">
            <div className="font-cinzel text-[13px] font-semibold text-white mb-4">Financials</div>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between text-[rgba(255,255,255,0.6)]"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString()}</span></div>
              {order.discountAmount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>−₹{order.discountAmount?.toLocaleString()}</span></div>}
              <div className="flex justify-between text-[rgba(255,255,255,0.6)]"><span>Shipping</span><span>{order.shippingCharge === 0 ? 'Free' : `₹${order.shippingCharge}`}</span></div>
              <div className="flex justify-between text-[rgba(255,255,255,0.6)]"><span>GST</span><span>₹{order.taxAmount?.toLocaleString()}</span></div>
              <div className="h-px bg-[rgba(212,175,55,0.1)] my-1" />
              <div className="flex justify-between font-bold"><span className="font-cinzel text-white">Total</span><span className="font-cinzel text-[#D4AF37] text-lg">₹{order.total?.toLocaleString()}</span></div>
            </div>
            <div className="mt-3 pt-3 border-t border-[rgba(212,175,55,0.08)] text-[12px] text-[rgba(255,255,255,0.5)] space-y-1">
              <div>Method: <span className="text-white uppercase">{order.paymentMethod}</span></div>
              {order.couponCode && <div>Coupon: <span className="text-[#D4AF37]">{order.couponCode}</span></div>}
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5">
            <div className="font-cinzel text-[13px] font-semibold text-white mb-4">Update Status</div>
            <div className="space-y-3">
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field">
                <option value="">Select new status</option>
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              {newStatus === 'shipped' && (
                <>
                  <input value={courierName} onChange={e => setCourierName(e.target.value)} className="input-field" placeholder="Courier name (e.g. BlueDart)" />
                  <input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} className="input-field" placeholder="Tracking number" />
                </>
              )}
              <textarea value={note} onChange={e => setNote(e.target.value)} className="input-field resize-none h-16" placeholder="Note for customer (optional)" />
              <button onClick={updateStatus} disabled={updating || !newStatus} className="btn-luxury w-full disabled:opacity-60">{updating ? 'Updating...' : 'Update Status'}</button>
            </div>
          </div>

          {/* Admin Notes */}
          {order.notes && (
            <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5">
              <div className="font-cinzel text-[13px] font-semibold text-white mb-2">Customer Notes</div>
              <div className="text-[13px] text-[rgba(255,255,255,0.55)]">{order.notes}</div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
