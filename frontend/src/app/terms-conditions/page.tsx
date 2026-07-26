'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

export default function TermsConditionsPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/settings/public')
      .then(({ data }) => {
        setContent(data.settings?.policies?.terms_conditions || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const defaultTerms = `Welcome to Engravia Labs. By placing an order or using our website, you agree to these Terms & Conditions.

1. Product Natural Variations
Natural stones like Black Marble, Granite, Slate, and Sandstone possess unique natural veining, textures, and mineral specks. Slight natural variations in stone tone and grain are inherent markers of genuine natural stone.

2. Design Approval & Proofing
Before final engraving begins, our design team shares a digital design proof via WhatsApp/Email. Production starts only after customer proof confirmation.

3. Intellectual Property
All design concepts, engravings, product photographs, and text content on Engravia Labs are proprietary property of Engravia Labs.

4. Pricing & Payments
All prices are displayed in Indian Rupees (₹) including applicable taxes unless otherwise noted. Payments must be completed at the time of purchase.`;

  return (
    <>
      <Navbar />
      <main className="bg-[#0D0D0D] min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] text-[#D4AF37] tracking-[4px] uppercase font-semibold block mb-3">Legal Agreement</span>
            <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-white">Terms & Conditions</h1>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
          </div>
          <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.15)] rounded-xl p-8 md:p-12 text-[14px] text-[rgba(255,255,255,0.7)] leading-relaxed space-y-6 whitespace-pre-line shadow-2xl">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-[#222] rounded w-1/3" />
                <div className="h-20 bg-[#222] rounded w-full" />
              </div>
            ) : (
              content || defaultTerms
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
