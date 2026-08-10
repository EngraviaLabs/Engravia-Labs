'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import api from '../../../lib/api';
import { setCredentials } from '../../../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [step, setStep] = useState<'form'|'otp'>('form');
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const dispatch = useDispatch();
  const router = useRouter();

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.phone) { toast.error('Both email and phone number are required'); return; }
    
    const phoneDigits = form.phone.replace(/\D/g, '');
    const cleanPhone = (phoneDigits.length === 12 && phoneDigits.startsWith('91')) ? phoneDigits.slice(2) : ((phoneDigits.length === 11 && phoneDigits.startsWith('0')) ? phoneDigits.slice(1) : phoneDigits);
    if (cleanPhone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name: form.name, email: form.email, phone: form.phone, password: form.password });
      setUserId(data.userId);
      setStep('otp');
      toast.success('OTP sent to your email!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { userId, otp });
      dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
      localStorage.setItem('refreshToken', data.refreshToken);
      toast.success('Account created! Welcome to Engravia Labs.');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const inp = "w-full bg-[#111] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3.5 text-[13px] outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[rgba(255,255,255,0.25)]";
  const lbl = "block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2";

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="inline-block mb-3 group">
            <img src="/images/logo-transparent.png" alt="Engravia Labs Logo" className="h-28 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(212,175,55,0.5)] group-hover:scale-105 transition-all duration-300" />
          </Link>
          <h1 className="font-cinzel text-2xl font-bold text-white mt-4 mb-2">{step === 'form' ? 'Create Account' : 'Verify Your Email'}</h1>
          <p className="text-[rgba(255,255,255,0.5)] text-sm">{step === 'form' ? 'Join the Engravia Circle' : `Enter the 6-digit OTP sent to ${form.email}`}</p>
        </div>
        <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.12)] p-8">
          {step === 'form' ? (
            <form onSubmit={onRegister} className="space-y-4">
              {[['name','Full Name *','text','Your full name'],['email','Email Address *','email','you@example.com'],['phone','Phone Number *','tel','+91 XXXXX XXXXX'],['password','Password *','password','Min 8 characters'],['confirm','Confirm Password *','password','Repeat password']].map(([k,l,t,p]) => (
                <div key={k}>
                  <label className={lbl}>{l}</label>
                  <input type={t} value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className={inp} placeholder={p} required />
                </div>
              ))}
              <button type="submit" disabled={loading} className="btn-luxury w-full mt-2 disabled:opacity-60">{loading ? 'Creating Account...' : 'Create Account'}</button>
            </form>
          ) : (
            <form onSubmit={onVerify} className="space-y-5">
              <div>
                <label className={lbl}>6-Digit OTP</label>
                <input type="text" inputMode="numeric" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} className={`${inp} text-center text-3xl tracking-[1em] font-mono`} placeholder="000000" maxLength={6} required />
              </div>
              <button type="submit" disabled={loading || otp.length < 6} className="btn-luxury w-full disabled:opacity-60">{loading ? 'Verifying...' : 'Verify & Continue'}</button>
              <button type="button" onClick={async () => { await api.post('/auth/resend-otp', { userId }); toast.success('OTP resent!'); }} className="w-full text-[11px] text-[rgba(212,175,55,0.6)] hover:text-[#D4AF37] tracking-widest uppercase">Resend OTP</button>
            </form>
          )}
          {step === 'form' && (
            <p className="text-center mt-6 pt-6 border-t border-[rgba(212,175,55,0.1)] text-[13px] text-[rgba(255,255,255,0.4)]">
              Already have an account?{' '}<Link href="/auth/login" className="text-[#D4AF37] font-semibold">Sign In</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
