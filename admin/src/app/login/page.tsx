'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser, hydrate, user, isLoading } = useAuthStore();

  useEffect(() => { hydrate(); }, []);
  useEffect(() => { if (!isLoading && user) router.push('/'); }, [user, isLoading]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (!['admin', 'super_admin'].includes(data.user.role)) {
        toast.error('This account does not have admin access.');
        setLoading(false);
        return;
      }
      localStorage.setItem('admin_accessToken', data.accessToken);
      localStorage.setItem('admin_refreshToken', data.refreshToken);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}`);
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg,#D4AF37 0,#D4AF37 1px,transparent 1px,transparent 60px)' }} />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <div className="font-cinzel text-2xl font-bold text-[#D4AF37] tracking-[4px]">ENGRAVIA <span className="text-white">LABS</span></div>
          <div className="text-[11px] text-[rgba(255,255,255,0.4)] tracking-[3px] uppercase mt-2">Admin Console</div>
        </div>
        <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.15)] p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="label-field">Admin Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="admin@engravialabs.com" required />
            </div>
            <div>
              <label className="label-field">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-luxury w-full py-3.5">
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
        <div className="text-center mt-6 text-[11px] text-[rgba(255,255,255,0.3)]">Restricted access — Engravia Labs staff only</div>
      </div>
    </div>
  );
}
