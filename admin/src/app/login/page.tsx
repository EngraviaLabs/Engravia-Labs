'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser, hydrate, user, isLoading } = useAuthStore();

  useEffect(() => { hydrate(); }, []);
  useEffect(() => { if (!isLoading && user) router.push('/'); }, [user, isLoading]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (!['admin', 'super_admin'].includes(data.user?.role)) {
        setErrorMsg('This account does not have admin access.');
        toast.error('This account does not have admin access.');
        setLoading(false);
        return;
      }
      localStorage.setItem('admin_accessToken', data.accessToken);
      localStorage.setItem('admin_refreshToken', data.refreshToken);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}`);
      window.location.href = '/';
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials and server connection.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg,#D4AF37 0,#D4AF37 1px,transparent 1px,transparent 60px)' }} />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/images/logo-transparent.png" alt="Engravia Labs Logo" className="h-28 w-auto object-contain mb-3 filter drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]" />
          <div className="text-[11px] text-[rgba(255,255,255,0.4)] tracking-[3px] uppercase">Admin Console</div>
        </div>
        <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.15)] p-8">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="label-field">Admin Email</label>
              <input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="admin@engravialabs.com" required />
            </div>
            <div>
              <label className="label-field">Password</label>
              <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
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
