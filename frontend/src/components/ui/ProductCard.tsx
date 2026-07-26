'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import api from '../../lib/api';
import toast from 'react-hot-toast';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { add } = useCart();
  const user = useSelector(selectUser);

  const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  const primaryImage = product.images?.find(i => i.isPrimary) || product.images?.[0];

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to save items'); return; }
    try {
      await api.post('/users/wishlist/toggle', { productId: product._id });
      setWishlisted(w => !w);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist ♥', {
        style: { background: '#1A1A1A', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' },
      });
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    add(product, 1);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)] rounded-xl overflow-hidden hover:border-[rgba(212,175,55,0.4)] hover:shadow-2xl transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#111] rounded-t-xl">
        {primaryImage && !imgError ? (
          <Image src={primaryImage.url} alt={primaryImage.alt || product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" onError={() => setImgError(true)} sizes="(max-width:768px) 50vw, 25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1e1e1e] to-[#111]">
            <div className="border border-[rgba(212,175,55,0.2)] p-6 text-center">
              <div className="font-cinzel text-[10px] text-[rgba(212,175,55,0.6)] tracking-[3px] uppercase">{product.name.split(' ').slice(0,2).join('\n')}</div>
            </div>
          </div>
        )}
        {discount > 0 && <span className="absolute top-3 left-3 bg-[#D4AF37] text-[#0D0D0D] text-[10px] font-bold px-2 py-1 tracking-widest uppercase">{discount}% OFF</span>}
        {product.isBestSeller && !discount && <span className="absolute top-3 left-3 bg-[#D4AF37] text-[#0D0D0D] text-[10px] font-bold px-2 py-1 tracking-widest uppercase">Best Seller</span>}
        <button onClick={handleWishlist} className={`absolute top-3 right-3 w-8 h-8 border flex items-center justify-center text-sm transition-all ${wishlisted ? 'border-[#D4AF37] bg-[rgba(212,175,55,0.15)] text-[#D4AF37]' : 'border-[rgba(212,175,55,0.3)] bg-[rgba(13,13,13,0.8)] text-[rgba(212,175,55,0.6)] hover:border-[#D4AF37] hover:text-[#D4AF37]'}`} aria-label="Wishlist">
          {wishlisted ? '♥' : '♡'}
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="text-[10px] text-[rgba(212,175,55,0.6)] tracking-[2px] uppercase mb-1">{product.category?.name}</div>
        <h3 className="font-cinzel text-[13px] font-semibold text-white mb-2 leading-snug line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map(s => (
            <span key={s} className={`text-[11px] ${s <= Math.round(product.rating) ? 'text-[#D4AF37]' : 'text-[rgba(212,175,55,0.2)]'}`}>★</span>
          ))}
          <span className="text-[11px] text-[rgba(255,255,255,0.35)] ml-1">({product.numReviews})</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="font-cinzel text-[17px] font-bold text-[#D4AF37]">₹{price.toLocaleString()}</span>
          {product.salePrice && <span className="text-[12px] text-[rgba(255,255,255,0.3)] line-through">₹{product.price.toLocaleString()}</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={handleAddToCart} className="flex-1 border border-[rgba(212,175,55,0.4)] text-[#D4AF37] text-[10px] font-bold tracking-[1.5px] uppercase py-2.5 rounded-lg hover:bg-[#D4AF37] hover:text-[#0D0D0D] hover:border-[#D4AF37] transition-all duration-200">
            Add to Cart
          </button>
          <Link href={`/product/${product.slug}`} onClick={e => e.stopPropagation()} className="flex-1 bg-[#D4AF37] text-[#0D0D0D] text-[10px] font-bold tracking-[1.5px] uppercase py-2.5 text-center rounded-lg hover:bg-[#F5E6A3] transition-all duration-200">
            Buy Now
          </Link>
        </div>
      </div>
    </Link>
  );
}
