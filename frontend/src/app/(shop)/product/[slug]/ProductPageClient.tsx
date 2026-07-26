'use client';
import { useState } from 'react';
import { useProduct, useProductReviews } from '../../../../hooks/useProducts';
import { useCart } from '../../../../hooks/useCart';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ProductPageClient({ slug }: { slug: string }) {
  const { data: product, isLoading } = useProduct(slug);
  const { data: reviewData } = useProductReviews(product?._id || '');
  const { add } = useCart();
  const router = useRouter();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [customization, setCustomization] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('description');

  if (isLoading) return (
    <div className="max-w-[1280px] mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16">
      <div className="aspect-square skeleton" />
      <div className="space-y-4"><div className="h-8 skeleton w-3/4" /><div className="h-4 skeleton w-1/2" /><div className="h-20 skeleton" /></div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-32"><div className="font-cinzel text-2xl text-white mb-4">Product not found</div><Link href="/collection" className="btn-outline-luxury">Browse Collections</Link></div>
  );

  const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  const reviews = reviewData?.reviews || [];

  const handleAddToCart = () => {
    const missing = product.customizationFields?.filter((f: any) => f.required && !customization[f.name]);
    if (missing?.length) { toast.error(`Please fill: ${missing.map((f:any)=>f.label).join(', ')}`); return; }
    add(product, qty, customization);
  };

  const handleBuyNow = () => {
    const missing = product.customizationFields?.filter((f: any) => f.required && !customization[f.name]);
    if (missing?.length) { toast.error(`Please fill: ${missing.map((f:any)=>f.label).join(', ')}`); return; }
    add(product, qty, customization);
    router.push('/checkout');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-[rgba(255,255,255,0.4)] mb-8 tracking-widest uppercase">
        <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/collection" className="hover:text-[#D4AF37] transition-colors">Collections</Link>
        <span>/</span>
        <span className="text-[rgba(212,175,55,0.7)]">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 mb-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-[#111] overflow-hidden border border-[rgba(212,175,55,0.1)]">
            {product.images?.[activeImg] ? (
              <Image src={product.images[activeImg].url} alt={product.name} fill className="object-cover" sizes="50vw" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="border border-[rgba(212,175,55,0.2)] p-12 text-center">
                  <div className="font-cinzel text-[#D4AF37] text-2xl tracking-[4px]">EL</div>
                </div>
              </div>
            )}
            {discount > 0 && <span className="absolute top-4 left-4 bg-[#D4AF37] text-[#0D0D0D] text-[10px] font-bold px-3 py-1 tracking-widest uppercase">{discount}% OFF</span>}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img: any, i: number) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 flex-shrink-0 relative border-2 transition-all ${activeImg===i?'border-[#D4AF37]':'border-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.4)]'}`}>
                  <Image src={img.url} alt={`View ${i+1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="text-[10px] text-[rgba(212,175,55,0.6)] tracking-[3px] uppercase mb-2">{product.category?.name}</div>
          <h1 className="font-cinzel text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">{product.name}</h1>
          <div className="text-[11px] text-[rgba(255,255,255,0.4)] mb-4">SKU: {product.sku}</div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><span key={s} className={`text-sm ${s<=Math.round(product.rating)?'text-[#D4AF37]':'text-[rgba(212,175,55,0.2)]'}`}>★</span>)}</div>
            <span className="text-[12px] text-[rgba(255,255,255,0.5)]">({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[rgba(212,175,55,0.1)]">
            <span className="font-cinzel text-3xl font-bold text-[#D4AF37]">₹{price.toLocaleString()}</span>
            {product.salePrice && <span className="text-lg text-[rgba(255,255,255,0.3)] line-through">₹{product.price.toLocaleString()}</span>}
          </div>

          {/* Customization Fields */}
          {product.customizationFields?.length > 0 && (
            <div className="mb-6 space-y-4">
              <div className="font-cinzel text-[13px] font-semibold text-[#D4AF37] tracking-[2px] uppercase">Customization</div>
              {product.customizationFields.map((field: any) => (
                <div key={field.name}>
                  <label className="block text-[11px] text-[rgba(255,255,255,0.6)] tracking-widest uppercase mb-2">
                    {field.label}{field.required && <span className="text-[#D4AF37] ml-1">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select value={customization[field.name]||''} onChange={e=>setCustomization(c=>({...c,[field.name]:e.target.value}))}
                      className="w-full bg-[#111] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3 text-[13px] outline-none focus:border-[#D4AF37]">
                      <option value="">Select {field.label}</option>
                      {field.options?.map((o:string)=><option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea value={customization[field.name]||''} onChange={e=>setCustomization(c=>({...c,[field.name]:e.target.value}))}
                      placeholder={field.placeholder} maxLength={field.maxLength}
                      className="w-full bg-[#111] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3 text-[13px] outline-none focus:border-[#D4AF37] resize-none h-24" />
                  ) : (
                    <input type={field.type==='number'?'number':'text'} value={customization[field.name]||''} onChange={e=>setCustomization(c=>({...c,[field.name]:e.target.value}))}
                      placeholder={field.placeholder} maxLength={field.maxLength}
                      className="w-full bg-[#111] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3 text-[13px] outline-none focus:border-[#D4AF37]" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-[11px] text-[rgba(255,255,255,0.5)] tracking-widest uppercase">Quantity</div>
            <div className="flex items-center border border-[rgba(212,175,55,0.25)]">
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="w-10 h-10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all text-lg flex items-center justify-center">−</button>
              <span className="w-12 text-center text-white font-semibold">{qty}</span>
              <button onClick={()=>setQty(q=>Math.min(product.stock||99,q+1))} className="w-10 h-10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D0D0D] transition-all text-lg flex items-center justify-center">+</button>
            </div>
            <span className={`text-[11px] ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 mb-6">
            <button onClick={handleAddToCart} disabled={product.stock===0} className="flex-1 btn-outline-luxury disabled:opacity-40">Add to Cart</button>
            <button onClick={handleBuyNow} disabled={product.stock===0} className="flex-1 btn-luxury disabled:opacity-40">Buy Now</button>
          </div>

          {/* Features */}
          {product.features?.length > 0 && (
            <div className="space-y-2">
              {product.features.map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-[12px] text-[rgba(255,255,255,0.6)]">
                  <span className="text-[#D4AF37] text-[10px]">✦</span> {f}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border border-[rgba(212,175,55,0.1)]">
        <div className="flex border-b border-[rgba(212,175,55,0.1)]">
          {['description','specifications','reviews','shipping'].map(t=>(
            <button key={t} onClick={()=>setActiveTab(t)} className={`px-6 py-4 text-[11px] font-semibold tracking-[1.5px] uppercase transition-all border-b-2 -mb-px ${activeTab===t?'text-[#D4AF37] border-[#D4AF37]':'text-[rgba(255,255,255,0.4)] border-transparent hover:text-white'}`}>{t}</button>
          ))}
        </div>
        <div className="p-8">
          {activeTab==='description' && <div className="text-[14px] text-[rgba(255,255,255,0.65)] leading-relaxed">{product.description}</div>}
          {activeTab==='specifications' && (
            <div className="space-y-3">
              {product.specifications?.map((s: any, i: number) => (
                <div key={i} className="flex gap-4 py-3 border-b border-[rgba(255,255,255,0.04)]">
                  <span className="text-[12px] text-[rgba(212,175,55,0.7)] w-40 flex-shrink-0 font-semibold">{s.key}</span>
                  <span className="text-[13px] text-[rgba(255,255,255,0.65)]">{s.value}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab==='reviews' && (
            <div className="space-y-6">
              {reviews.length === 0 ? <p className="text-[rgba(255,255,255,0.4)]">No reviews yet. Be the first to review this product.</p> : reviews.map((r: any) => (
                <div key={r._id} className="border-b border-[rgba(255,255,255,0.06)] pb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0D0D0D] text-xs font-bold">{r.user.name[0]}</div>
                    <div>
                      <div className="text-[13px] font-semibold text-white">{r.user.name}</div>
                      <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><span key={s} className={`text-[10px] ${s<=r.rating?'text-[#D4AF37]':'text-[rgba(212,175,55,0.2)]'}`}>★</span>)}</div>
                    </div>
                    {r.isVerifiedPurchase && <span className="text-[10px] text-green-400 border border-green-400/30 px-2 py-0.5">Verified Purchase</span>}
                  </div>
                  <div className="font-semibold text-white mb-1">{r.title}</div>
                  <div className="text-[13px] text-[rgba(255,255,255,0.6)]">{r.body}</div>
                </div>
              ))}
            </div>
          )}
          {activeTab==='shipping' && (
            <div className="space-y-4 text-[13px] text-[rgba(255,255,255,0.65)]">
              <div className="flex items-start gap-3"><span className="text-[#D4AF37]">✦</span><div><strong className="text-white">Processing Time:</strong> {product.shippingInfo?.processingDays || 2}–{(product.shippingInfo?.processingDays||2)+1} business days for crafting</div></div>
              <div className="flex items-start gap-3"><span className="text-[#D4AF37]">✦</span><div><strong className="text-white">Shipping:</strong> {product.shippingInfo?.freeShipping ? 'Free shipping on this item' : `₹${product.shippingInfo?.shippingCharge || 99} shipping · Free above ₹999`}</div></div>
              <div className="flex items-start gap-3"><span className="text-[#D4AF37]">✦</span><div><strong className="text-white">Packaging:</strong> Premium gift-ready packaging with protective foam lining</div></div>
              <div className="flex items-start gap-3"><span className="text-[#D4AF37]">✦</span><div><strong className="text-white">Returns:</strong> 7-day return policy for manufacturing defects only</div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
