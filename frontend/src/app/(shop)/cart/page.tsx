'use client';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { useCart } from '../../../hooks/useCart';
import Link from 'next/link';
import { useState } from 'react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, subtotal, shippingCharge, tax, grandTotal, remove, update } = useCart();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');

  const applyCoupon = async () => {
    try {
      const { data } = await api.post('/coupons/validate', { code: coupon, orderAmount: subtotal });
      setDiscount(data.coupon.discount);
      setCouponApplied(data.coupon.code);
      toast.success(`Coupon applied! You save ₹${data.coupon.discount}`);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Invalid coupon');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="font-cinzel text-3xl font-bold text-white mb-8">Your <span className="text-[#D4AF37]">Cart</span></div>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-6">🛍</div>
              <div className="font-cinzel text-2xl text-white mb-3">Your cart is empty</div>
              <p className="text-[rgba(255,255,255,0.5)] mb-8">Discover our handcrafted stone engravings</p>
              <Link href="/collection" className="btn-luxury">Browse Collections</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, i) => (
                  <div key={i} className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5 flex gap-5">
                    <div className="w-24 h-24 flex-shrink-0 bg-[#111] border border-[rgba(212,175,55,0.1)] overflow-hidden">
                      {item.product.images?.[0] ? <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-cinzel text-[#D4AF37] text-xs">EL</div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-cinzel text-[14px] font-semibold text-white mb-1">{item.product.name}</div>
                      <div className="text-[11px] text-[rgba(212,175,55,0.6)] mb-2">{item.product.category?.name}</div>
                      {item.customization && Object.keys(item.customization).length > 0 && (
                        <div className="text-[11px] text-[rgba(255,255,255,0.4)] mb-3">{Object.entries(item.customization).map(([k,v])=>`${k}: ${v}`).join(' · ')}</div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-[rgba(212,175,55,0.25)]">
                          <button onClick={()=>update(item.product._id,item.quantity-1,item.customization)} className="w-8 h-8 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all flex items-center justify-center">−</button>
                          <span className="w-10 text-center text-white text-sm">{item.quantity}</span>
                          <button onClick={()=>update(item.product._id,item.quantity+1,item.customization)} className="w-8 h-8 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all flex items-center justify-center">+</button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-cinzel text-[#D4AF37] font-bold">₹{(item.price*item.quantity).toLocaleString()}</span>
                          <button onClick={()=>remove(item.product._id,item.customization)} className="text-[rgba(255,255,255,0.3)] hover:text-red-400 transition-colors">✕</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coupon */}
                <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5">
                  <div className="font-cinzel text-[13px] font-semibold text-white mb-3">Have a coupon?</div>
                  <div className="flex gap-3">
                    <input type="text" value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())} placeholder="Enter coupon code" disabled={!!couponApplied}
                      className="flex-1 bg-[#0D0D0D] border border-[rgba(212,175,55,0.2)] text-white px-4 py-2.5 text-[13px] outline-none focus:border-[#D4AF37] placeholder:text-[rgba(255,255,255,0.3)]" />
                    {couponApplied ? (
                      <button onClick={()=>{setCouponApplied('');setDiscount(0);setCoupon('');}} className="btn-outline-luxury text-[11px] py-2 px-4">Remove</button>
                    ) : (
                      <button onClick={applyCoupon} className="btn-luxury text-[11px] py-2 px-4">Apply</button>
                    )}
                  </div>
                  {couponApplied && <div className="text-green-400 text-[12px] mt-2">✓ Coupon {couponApplied} applied — you save ₹{discount}</div>}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6 h-fit">
                <div className="font-cinzel text-[15px] font-semibold text-white mb-5 pb-4 border-b border-[rgba(212,175,55,0.1)]">Order Summary</div>
                <div className="space-y-3 text-[13px] mb-5">
                  <div className="flex justify-between text-[rgba(255,255,255,0.65)]"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                  {discount>0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>−₹{discount}</span></div>}
                  <div className="flex justify-between text-[rgba(255,255,255,0.65)]"><span>Shipping</span><span>{shippingCharge===0?<span className="text-green-400">Free</span>:`₹${shippingCharge}`}</span></div>
                  <div className="flex justify-between text-[rgba(255,255,255,0.65)]"><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
                  <div className="h-px bg-[rgba(212,175,55,0.1)]" />
                  <div className="flex justify-between font-bold text-lg"><span className="font-cinzel text-white">Total</span><span className="font-cinzel text-[#D4AF37]">₹{(grandTotal-discount).toLocaleString()}</span></div>
                </div>
                <Link href="/checkout" className="btn-luxury w-full block text-center">Proceed to Checkout</Link>
                <Link href="/collection" className="btn-outline-luxury w-full block text-center mt-3 text-[11px]">Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
