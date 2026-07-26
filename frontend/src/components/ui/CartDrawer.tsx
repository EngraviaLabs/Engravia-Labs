'use client';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartOpen, setCartOpen } from '../../store/slices/cartSlice';
import { useCart } from '../../hooks/useCart';

export default function CartDrawer() {
  const isOpen = useSelector(selectCartOpen);
  const dispatch = useDispatch();
  const { items, subtotal, shippingCharge, tax, grandTotal, remove, update } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={() => dispatch(setCartOpen(false))} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0D0D0D] border-l border-[rgba(212,175,55,0.15)] z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(212,175,55,0.1)]">
          <div className="font-cinzel text-lg font-bold text-white tracking-wider">Your Cart <span className="text-[#D4AF37]">({items.length})</span></div>
          <button onClick={() => dispatch(setCartOpen(false))} className="text-[rgba(255,255,255,0.5)] hover:text-white text-2xl transition-colors">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🛍</div>
              <p className="font-cinzel text-white/60 mb-6">Your cart is empty</p>
              <button onClick={() => dispatch(setCartOpen(false))} className="btn-outline-luxury text-[11px]">Browse Products</button>
            </div>
          ) : items.map((item, i) => (
            <div key={i} className="flex gap-4 p-4 bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)]">
              <div className="w-16 h-16 bg-[#111] flex-shrink-0 flex items-center justify-center border border-[rgba(212,175,55,0.1)]">
                {item.product.images?.[0] ? (
                  <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#D4AF37] text-xs font-cinzel">EL</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-cinzel text-[12px] font-semibold text-white mb-1 truncate">{item.product.name}</div>
                {item.customization && Object.keys(item.customization).length > 0 && (
                  <div className="text-[10px] text-[rgba(212,175,55,0.6)] mb-2">{Object.entries(item.customization).map(([k,v])=>`${k}: ${v}`).join(' · ')}</div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => update(item.product._id, item.quantity - 1, item.customization)} className="w-6 h-6 border border-[rgba(212,175,55,0.3)] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all text-sm flex items-center justify-center">−</button>
                    <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => update(item.product._id, item.quantity + 1, item.customization)} className="w-6 h-6 border border-[rgba(212,175,55,0.3)] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all text-sm flex items-center justify-center">+</button>
                  </div>
                  <span className="font-cinzel text-[#D4AF37] font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => remove(item.product._id, item.customization)} className="text-[rgba(255,255,255,0.3)] hover:text-red-400 transition-colors text-lg self-start">✕</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[rgba(212,175,55,0.1)] space-y-3">
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between text-[rgba(255,255,255,0.6)]"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-[rgba(255,255,255,0.6)]"><span>Shipping</span><span>{shippingCharge === 0 ? <span className="text-green-400">Free</span> : `₹${shippingCharge}`}</span></div>
              <div className="flex justify-between text-[rgba(255,255,255,0.6)]"><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
              <div className="h-px bg-[rgba(212,175,55,0.15)] my-2" />
              <div className="flex justify-between font-bold"><span className="font-cinzel text-white">Total</span><span className="font-cinzel text-[#D4AF37] text-lg">₹{grandTotal.toLocaleString()}</span></div>
            </div>
            <Link href="/checkout" onClick={() => dispatch(setCartOpen(false))} className="btn-luxury w-full block text-center mt-4">Proceed to Checkout</Link>
            <Link href="/cart" onClick={() => dispatch(setCartOpen(false))} className="btn-outline-luxury w-full block text-center text-[11px]">View Cart</Link>
          </div>
        )}
      </div>
    </>
  );
}
