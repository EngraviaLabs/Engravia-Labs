'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';

export default function FAQsPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/settings/public')
      .then(({ data }) => {
        setContent(data.settings?.faqs?.faqs_content || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const defaultFaqs = [
    { q: 'How long does custom stone engraving take?', a: 'Digital design proofs are sent for approval within 24-48 hours. Once approved, production and finishing take 2-4 business days.' },
    { q: 'Is black marble & granite suitable for outdoor name plates?', a: 'Yes! All our natural stones undergo deep precision etching and are sealed with weather-resistant, UV-proof protective coats.' },
    { q: 'Do you deliver across India & internationally?', a: 'Yes! We provide fully insured nationwide delivery across India as well as express international shipping.' },
    { q: 'Can I request custom fonts, logos, or religious symbols?', a: 'Absolutely! Our studio specializes in bespoke custom orders. You can upload custom vector logos, family emblems, fonts, or symbols.' },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-[#0D0D0D] min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] text-[#D4AF37] tracking-[4px] uppercase font-semibold block mb-3">Help Center</span>
            <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-white">Frequently Asked Questions</h1>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
          </div>
          <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.15)] rounded-xl p-8 md:p-12 text-[14px] text-[rgba(255,255,255,0.7)] leading-relaxed space-y-6 shadow-2xl">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-[#222] rounded w-1/3" />
                <div className="h-20 bg-[#222] rounded w-full" />
              </div>
            ) : content ? (
              <div className="whitespace-pre-line leading-relaxed">{content}</div>
            ) : (
              <div className="space-y-6">
                {defaultFaqs.map((faq, i) => (
                  <div key={i} className="border-b border-[rgba(212,175,55,0.1)] pb-6 last:border-0 last:pb-0">
                    <h3 className="font-cinzel text-base font-bold text-[#D4AF37] mb-2">{faq.q}</h3>
                    <p className="text-[14px] text-[rgba(255,255,255,0.65)] leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
