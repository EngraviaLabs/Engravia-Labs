'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

export default function CancellationPolicyPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/settings/public')
      .then(({ data }) => {
        setContent(data.settings?.policies?.cancellation_policy || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const defaultPolicy = `1. Cancellation Window
Orders can be cancelled free of charge within 12 hours of placement or before your design proof has been confirmed for production.

2. How to Request Cancellation
To cancel your order, please contact our support team immediately:
- Email: hello@engravialabs.com
- WhatsApp: +91 98765 43210

3. After Engraving Commences
Once physical laser etching or stone cutting has commenced, orders cannot be cancelled due to the permanent nature of stone engraving.`;

  return (
    <>
      <Navbar />
      <main className="bg-[#0D0D0D] min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] text-[#D4AF37] tracking-[4px] uppercase font-semibold block mb-3">Order Flexibility</span>
            <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-white">Cancellation Policy</h1>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
          </div>
          <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.15)] rounded-xl p-8 md:p-12 text-[14px] text-[rgba(255,255,255,0.7)] leading-relaxed space-y-6 whitespace-pre-line shadow-2xl">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-[#222] rounded w-1/3" />
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
