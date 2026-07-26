'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

export default function ShippingPolicyPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/settings/public')
      .then(({ data }) => {
        setContent(data.settings?.policies?.shipping_delivery_policy || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const defaultPolicy = `We offer insured nationwide delivery across India as well as worldwide international shipping.

1. Order Processing Time
Custom stone items are handcrafted and laser-etched. Production typically takes 2 to 4 business days following your design proof approval.

2. Delivery Timelines
- India Metro Cities: 3 - 5 business days
- India Other Locations: 5 - 7 business days
- International Delivery: 7 - 12 business days

3. Insured Packaging
Stone items are fragile and valuable. All packages are encased in heavy-duty multi-layer protective foam and wooden crate reinforcement for zero transit damage.

4. Tracking
Once dispatched, tracking links are instantly sent via SMS, WhatsApp, and Email.`;

  return (
    <>
      <Navbar />
      <main className="bg-[#0D0D0D] min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] text-[#D4AF37] tracking-[4px] uppercase font-semibold block mb-3">Delivery Information</span>
            <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-white">Shipping & Delivery Policy</h1>
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
