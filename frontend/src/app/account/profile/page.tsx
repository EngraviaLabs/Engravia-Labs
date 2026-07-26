'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, clearCredentials, updateUser } from '../../../store/slices/authSlice';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) return null;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      dispatch(updateUser(data.user));
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); } finally { setLoading(false); }
  };

  const onLogout = () => { dispatch(clearCredentials()); router.push('/'); toast.success('Signed out'); };

  const inp = "w-full bg-[#111] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3 text-[13px] outline-none focus:border-[#D4AF37] transition-colors";
  const navLinks = [
    { href:'/account/profile', label:'My Profile' }, { href:'/account/orders', label:'Orders' },
    { href:'/account/wishlist', label:'Wishlist' }, { href:'/account/addresses', label:'Addresses' },
    { href:'/account/custom-requests', label:'Custom Requests' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <div className="font-cinzel text-2xl font-bold text-white mb-8">My <span className="text-[#D4AF37]">Account</span></div>
          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] overflow-hidden">
                <div className="p-5 border-b border-[rgba(212,175,55,0.1)]">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B7320] flex items-center justify-center font-cinzel text-xl font-bold text-[#0D0D0D] mb-3">{user.name?.[0]}</div>
                  <div className="font-cinzel text-[14px] font-semibold text-white">{user.name}</div>
                  <div className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">{user.email}</div>
                </div>
                <nav className="py-2">
                  {navLinks.map(l => (
                    <Link key={l.href} href={l.href} className="block px-5 py-3 text-[12px] tracking-widest uppercase text-[rgba(255,255,255,0.55)] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.04)] transition-all">{l.label}</Link>
                  ))}
                  <button onClick={onLogout} className="w-full text-left px-5 py-3 text-[12px] tracking-widest uppercase text-red-400/70 hover:text-red-400 transition-colors">Sign Out</button>
                </nav>
              </div>
            </aside>
            <div className="lg:col-span-3">
              <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-7">
                <div className="font-cinzel text-[16px] font-semibold text-white mb-6">Profile Information</div>
                <form onSubmit={onSave} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Full Name</label><input value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} className={inp} /></div>
                    <div><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Phone</label><input value={form.phone} onChange={e => setForm(f => ({...f, phone:e.target.value}))} className={inp} /></div>
                    <div><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Email</label><input value={user.email} disabled className={`${inp} opacity-50 cursor-not-allowed`} /></div>
                    <div><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Role</label><input value={user.role} disabled className={`${inp} opacity-50 cursor-not-allowed capitalize`} /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[rgba(212,175,55,0.08)]">
                    <div className="text-center"><div className="font-cinzel text-xl font-bold text-[#D4AF37]">{user.totalOrders}</div><div className="text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-widest mt-1">Orders</div></div>
                    <div className="text-center"><div className="font-cinzel text-xl font-bold text-[#D4AF37]">₹{(user.totalSpent||0).toLocaleString()}</div><div className="text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-widest mt-1">Spent</div></div>
                    <div className="text-center"><div className="font-cinzel text-xl font-bold text-[#D4AF37]">{user.addresses?.length || 0}</div><div className="text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-widest mt-1">Addresses</div></div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-luxury disabled:opacity-60">{loading ? 'Saving...' : 'Save Changes'}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
