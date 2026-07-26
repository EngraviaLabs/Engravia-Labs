'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/settings/public')
      .then(({ data }) => {
        setContent(data.settings?.policies?.privacy_policy || data.settings?.general?.privacy_policy || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const defaultPolicy = `At Engravia Labs, we respect your privacy and are committed to protecting your personal information.

1. Information We Collect
We collect details such as your name, email address, phone number, shipping address, and payment information when you place an order or create an account.

2. How We Use Your Information
Your information is used exclusively to fulfill orders, provide customer support, send order updates/OTPs, and improve our stone engraving services.

3. Data Security
We implement strict industry-standard SSL encryption and security measures. Payment transactions are securely processed through Razorpay & Stripe. We never store raw credit card or debit card numbers.

4. Third-Party Sharing
We do not sell, trade, or rent your personal information to third parties. Information is only shared with trusted courier partners for order delivery.`;

  return (
    <>
      <Navbar />
      <main className="bg-[#0D0D0D] min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] text-[#D4AF37] tracking-[4px] uppercase font-semibold block mb-3">Legal & Governance</span>
            <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
          </div>
          <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.15)] rounded-xl p-8 md:p-12 text-[14px] text-[rgba(255,255,255,0.7)] leading-relaxed space-y-6 whitespace-pre-line shadow-2xl">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-[#222] rounded w-1/3" />
                <div className="h-20 bg-[#222] rounded w-full" />
                <div className="h-20 bg-[#222] rounded w-full" />
              </div>
            ) : (
              content || defaultPolicy
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
