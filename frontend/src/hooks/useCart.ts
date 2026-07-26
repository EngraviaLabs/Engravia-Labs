import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, selectCartCount, addToCart, removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { Product } from '../types';
import toast from 'react-hot-toast';

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);

  const add = (product: Product, quantity = 1, customization?: Record<string, string>) => {
    dispatch(addToCart({ product, quantity, customization }));
    toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added to cart`, {
      style: { background: '#1A1A1A', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' },
    });
  };

  const remove = (productId: string, customization?: Record<string, string>) => {
    dispatch(removeFromCart({ productId, customization }));
  };

  const update = (productId: string, quantity: number, customization?: Record<string, string>) => {
    dispatch(updateQuantity({ productId, quantity, customization }));
  };

  const clear = () => dispatch(clearCart());

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingCharge = subtotal > 999 ? 0 : 99;
  const tax = Math.round((subtotal + shippingCharge) * 0.18);
  const grandTotal = subtotal + shippingCharge + tax;

  return { items, total, count, subtotal, shippingCharge, tax, grandTotal, add, remove, update, clear };
};
