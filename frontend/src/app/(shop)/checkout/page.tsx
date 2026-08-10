'use client';
import { useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import { useCart } from '../../../hooks/useCart';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../store/slices/authSlice';
import api from '../../../lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../../lib/utils';

const INDIAN_STATES = ['Andhra Pradesh','Delhi','Gujarat','Karnataka','Kerala','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

export default function CheckoutPage() {
  const { items, subtotal, shippingCharge, tax, grandTotal, clear } = useCart();
  const user = useSelector(selectUser);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay'|'stripe'|'cod'>('razorpay');
  const [address, setAddress] = useState({ fullName: user?.name||'', phone: user?.phone||'', line1:'', line2:'', city:'', state:'Rajasthan', pincode:'', country:'India' });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    setAddress(a => ({ ...a, [e.target.name]: e.target.value }));
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async () => {
    if (!items.length) return;

    // Validate 10-digit phone number
    const phoneDigits = (address.phone || '').replace(/\D/g, '');
    const cleanPhone = (phoneDigits.length === 12 && phoneDigits.startsWith('91')) ? phoneDigits.slice(2) : ((phoneDigits.length === 11 && phoneDigits.startsWith('0')) ? phoneDigits.slice(1) : phoneDigits);
    if (cleanPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number in shipping address');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: items.map(i => ({ productId: i.product._id, quantity: i.quantity, customization: i.customization })),
        shippingAddress: { ...address, phone: cleanPhone },
        paymentMethod,
        guestEmail: !user ? prompt('Enter your email for order confirmation:') : undefined,
        guestName: !user ? address.fullName : undefined,
      };
      const { data } = await api.post('/orders', orderPayload);
      const order = data.order;

      if (paymentMethod === 'razorpay') {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error('Failed to load Razorpay payment gateway. Please check your network connection.');
          return;
        }

        const { data: rzp } = await api.post('/payments/razorpay/create', { orderId: order._id });
        const options = {
          key: rzp.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_T4jYhLKhRcdUW5',
          amount: rzp.amount,
          currency: rzp.currency || 'INR',
          name: 'ENGRAVIA LABS',
          description: `Order #${order.orderNumber}`,
          image: '/images/logo.jpg',
          order_id: rzp.order_id || rzp.razorpayOrderId,
          handler: async (response: any) => {
            try {
              toast.loading('Verifying payment signature...', { id: 'rzp-verify' });
              await api.post('/payments/razorpay/verify', {
                orderId: order._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              toast.success('Payment verified & order confirmed! 🎉', { id: 'rzp-verify' });
              clear();
              router.push(`/account/orders/${order._id}?payment=success`);
            } catch (err: any) {
              toast.error(err.response?.data?.message || 'Payment verification failed. Please contact support.', { id: 'rzp-verify' });
            }
          },
          modal: {
            ondismiss: async () => {
              await api.post('/payments/payment-failed', { orderId: order._id, reason: 'Payment modal closed by user' }).catch(() => {});
              toast.error('Payment checkout cancelled. Order remains unconfirmed until payment is completed.');
            }
          },
          prefill: {
            name: address.fullName,
            contact: cleanPhone,
            email: user?.email || '',
          },
          theme: { color: '#D4AF37' },
        };

        const rzpInstance = new (window as any).Razorpay(options);
        rzpInstance.on('payment.failed', async function (resp: any) {
          const reason = resp.error?.description || 'Transaction unsuccessful';
          await api.post('/payments/payment-failed', { orderId: order._id, reason }).catch(() => {});
          toast.error(`Payment failed: ${reason}. Order is unconfirmed.`);
        });
        rzpInstance.open();
      } else if (paymentMethod === 'cod') {
        clear();
        toast.success('Order placed! Pay on delivery.');
        router.push(`/account/orders/${order._id}`);
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-[#0D0D0D] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3 text-[13px] outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[rgba(255,255,255,0.25)]";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="font-cinzel text-3xl font-bold text-white mb-10">Checkout</div>

          {/* Steps */}
          <div className="flex items-center gap-0 mb-10">
            {['Shipping','Payment','Review'].map((s,i)=>(
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 ${step>=i+1?'text-[#D4AF37]':'text-[rgba(255,255,255,0.3)]'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step>=i+1?'border-[#D4AF37] bg-[rgba(212,175,55,0.1)]':'border-[rgba(255,255,255,0.2)]'}`}>{i+1}</div>
                  <span className="text-[12px] font-semibold tracking-widest uppercase hidden md:block">{s}</span>
                </div>
                {i<2 && <div className={`w-16 h-px mx-3 ${step>i+1?'bg-[#D4AF37]':'bg-[rgba(255,255,255,0.1)]'}`} />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-7">
                  <div className="font-cinzel text-[16px] font-semibold text-white mb-6">Shipping Address</div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Full Name *</label><input name="fullName" value={address.fullName} onChange={handleAddressChange} className={inputCls} placeholder="As on ID" required /></div>
                    <div><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Phone *</label><input name="phone" value={address.phone} onChange={handleAddressChange} className={inputCls} placeholder="+91 XXXXX XXXXX" required /></div>
                    <div><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Pincode *</label><input name="pincode" value={address.pincode} onChange={handleAddressChange} className={inputCls} placeholder="110001" required /></div>
                    <div className="md:col-span-2"><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Address Line 1 *</label><input name="line1" value={address.line1} onChange={handleAddressChange} className={inputCls} placeholder="House / Building / Street" required /></div>
                    <div className="md:col-span-2"><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Address Line 2</label><input name="line2" value={address.line2} onChange={handleAddressChange} className={inputCls} placeholder="Area / Locality (optional)" /></div>
                    <div><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">City *</label><input name="city" value={address.city} onChange={handleAddressChange} className={inputCls} placeholder="City" required /></div>
                    <div><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">State *</label>
                      <select name="state" value={address.state} onChange={handleAddressChange} className={inputCls}>
                        {INDIAN_STATES.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <button onClick={()=>setStep(2)} className="btn-luxury mt-6 px-10">Continue to Payment →</button>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-7">
                  <div className="font-cinzel text-[16px] font-semibold text-white mb-6">Payment Method</div>
                  <div className="space-y-3 mb-8">
                    {[['razorpay','Razorpay (UPI, Cards, Net Banking)','Recommended'],['stripe','Stripe (International Cards)',''],['cod','Cash on Delivery','Extra ₹50 charge']].map(([val,label,note])=>(
                      <label key={val} className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${paymentMethod===val?'border-[#D4AF37] bg-[rgba(212,175,55,0.05)]':'border-[rgba(212,175,55,0.1)] hover:border-[rgba(212,175,55,0.3)]'}`}>
                        <input type="radio" name="payment" value={val} checked={paymentMethod===val} onChange={()=>setPaymentMethod(val as any)} className="accent-[#D4AF37]" />
                        <div>
                          <div className="text-[13px] font-semibold text-white">{label}</div>
                          {note && <div className="text-[11px] text-[rgba(212,175,55,0.6)]">{note}</div>}
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={()=>setStep(1)} className="btn-outline-luxury px-8 text-[11px]">← Back</button>
                    <button onClick={()=>setStep(3)} className="btn-luxury px-10">Review Order →</button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-7">
                  <div className="font-cinzel text-[16px] font-semibold text-white mb-5">Review Your Order</div>
                  <div className="space-y-3 mb-6">
                    {items.map((item,i)=>(
                      <div key={i} className="flex items-center gap-4 py-3 border-b border-[rgba(255,255,255,0.04)]">
                        <div className="w-12 h-12 bg-[#111] flex-shrink-0">{item.product.images?.[0]&&<img src={getImageUrl(item.product.images[0].url)} className="w-full h-full object-cover" />}</div>
                        <div className="flex-1"><div className="text-[13px] font-semibold text-white">{item.product.name}</div><div className="text-[11px] text-[rgba(255,255,255,0.4)]">Qty: {item.quantity}</div></div>
                        <div className="font-cinzel text-[#D4AF37] font-bold">₹{(item.price*item.quantity).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={()=>setStep(2)} className="btn-outline-luxury px-8 text-[11px]">← Back</button>
                    <button onClick={placeOrder} disabled={loading} className="btn-luxury px-10 flex-1 disabled:opacity-60">
                      {loading?'Processing...':'Place Order & Pay →'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6 h-fit">
              <div className="font-cinzel text-[14px] font-semibold text-white mb-4 pb-4 border-b border-[rgba(212,175,55,0.1)]">Order Summary</div>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between text-[rgba(255,255,255,0.6)]"><span>Items ({items.length})</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-[rgba(255,255,255,0.6)]"><span>Shipping</span><span>{shippingCharge===0?'Free':`₹${shippingCharge}`}</span></div>
                <div className="flex justify-between text-[rgba(255,255,255,0.6)]"><span>GST</span><span>₹{tax.toLocaleString()}</span></div>
                <div className="h-px bg-[rgba(212,175,55,0.1)] my-2" />
                <div className="flex justify-between font-bold"><span className="font-cinzel text-white text-base">Total</span><span className="font-cinzel text-[#D4AF37] text-lg">₹{grandTotal.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </>
  );
}
