'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import api from '../../../lib/api';
import { setCredentials } from '../../../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
      localStorage.setItem('refreshToken', data.refreshToken);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const inp = "w-full bg-[#111] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3.5 text-[13px] outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[rgba(255,255,255,0.25)]";

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="inline-block mb-3 group">
            <img src="/images/logo-transparent.png" alt="Engravia Labs Logo" className="h-28 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(212,175,55,0.5)] group-hover:scale-105 transition-all duration-300" />
          </Link>
          <h1 className="font-cinzel text-2xl font-bold text-white mt-4 mb-2">Welcome Back</h1>
          <p className="text-[rgba(255,255,255,0.5)] text-sm">Sign in to your account</p>
        </div>
        <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.12)] p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inp} placeholder="you@example.com" required />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase">Password</label>
                <Link href="/auth/forgot-password" className="text-[11px] text-[rgba(212,175,55,0.6)] hover:text-[#D4AF37]">Forgot?</Link>
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inp} placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-luxury w-full disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center mt-6 pt-6 border-t border-[rgba(212,175,55,0.1)] text-[13px] text-[rgba(255,255,255,0.4)]">
            No account?{' '}<Link href="/auth/register" className="text-[#D4AF37] font-semibold hover:text-[#F5E6A3]">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
