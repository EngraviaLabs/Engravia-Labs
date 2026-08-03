'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email'|'otp'|'reset'>('email');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const inp = "w-full bg-[#111] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3.5 text-[13px] outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[rgba(255,255,255,0.25)]";

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      if (data.userId) { setUserId(data.userId); setStep('otp'); toast.success('OTP sent!'); }
      else toast.error('Email not found');
    } catch { toast.error('Failed to send OTP'); } finally { setLoading(false); }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault(); if (otp.length < 6) return;
    setStep('reset');
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { userId, otp, newPassword });
      toast.success('Password reset! Please login.');
      router.push('/auth/login');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Reset failed'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="inline-block mb-3 group">
            <img src="/images/logo-transparent.png" alt="Engravia Labs Logo" className="h-28 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(212,175,55,0.5)] group-hover:scale-105 transition-all duration-300" />
          </Link>
          <h1 className="font-cinzel text-2xl font-bold text-white mt-4 mb-2">Reset Password</h1>
        </div>
        <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.12)] p-8">
          {step === 'email' && (
            <form onSubmit={sendOTP} className="space-y-5">
              <div><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Registered Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inp} placeholder="you@example.com" required /></div>
              <button type="submit" disabled={loading} className="btn-luxury w-full disabled:opacity-60">{loading ? 'Sending...' : 'Send OTP'}</button>
            </form>
          )}
          {step === 'otp' && (
            <form onSubmit={verifyOTP} className="space-y-5">
              <div><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Enter OTP</label>
              <input type="text" inputMode="numeric" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} className={`${inp} text-center text-3xl tracking-[1em] font-mono`} maxLength={6} required /></div>
              <button type="submit" disabled={otp.length < 6} className="btn-luxury w-full disabled:opacity-60">Verify OTP</button>
            </form>
          )}
          {step === 'reset' && (
            <form onSubmit={resetPassword} className="space-y-5">
              <div><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inp} placeholder="Min 8 characters" required minLength={8} /></div>
              <div><label className="block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2">Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className={inp} placeholder="Repeat password" required /></div>
              <button type="submit" disabled={loading} className="btn-luxury w-full disabled:opacity-60">{loading ? 'Resetting...' : 'Reset Password'}</button>
            </form>
          )}
          <p className="text-center mt-6 pt-5 border-t border-[rgba(212,175,55,0.1)] text-[13px] text-[rgba(255,255,255,0.4)]">
            Remember it?{' '}<Link href="/auth/login" className="text-[#D4AF37] font-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
