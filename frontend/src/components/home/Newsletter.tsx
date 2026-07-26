'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setEmail('');
    toast.success('Welcome to the Engravia Circle!', { style:{background:'#0D0D0D',color:'#D4AF37',border:'1px solid rgba(212,175,55,0.3)'} });
  };

  return (
    <section className="bg-gradient-to-r from-[#D4AF37] to-[#8B7320] py-16 px-10 text-center">
      <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-[#0D0D0D] mb-3">Join the Engravia Circle</h2>
      <p className="text-[14px] text-[rgba(13,13,13,0.65)] mb-8">Exclusive launches, early access, and design inspiration — delivered to your inbox.</p>
      <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email address" required
          className="flex-1 bg-[rgba(13,13,13,0.12)] border-none text-[#0D0D0D] px-5 py-4 text-sm font-poppins outline-none placeholder:text-[rgba(13,13,13,0.45)]" />
        <button type="submit" disabled={loading} className="bg-[#0D0D0D] text-[#D4AF37] px-7 py-4 text-[11px] font-bold tracking-[2px] uppercase font-poppins hover:bg-[#1A1A1A] transition-colors disabled:opacity-60 whitespace-nowrap">
          {loading ? '...' : 'Subscribe'}
        </button>
      </form>
    </section>
  );
}
