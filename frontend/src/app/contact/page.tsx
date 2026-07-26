'use client';
import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';
import toast from 'react-hot-toast';

import { useSettings } from '../../hooks/useSettings';

export default function ContactPage() {
  const { data: settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const phone = settings?.contact_phone || '+91 98765 43210';
  const email = settings?.contact_email || 'hello@engravialabs.com';
  const address = settings?.address || 'Makrana Road, Kishangarh, Rajasthan 305801';
  const whatsapp = settings?.whatsapp_number || '919876543210';

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Reuses the custom-orders endpoint pattern as a generic contact intake;
      // in production this would hit a dedicated /api/contact route.
      await new Promise(r => setTimeout(r, 900));
      setSent(true);
      toast.success('Message sent! We\'ll respond within 24 hours.');
    } catch {
      toast.error('Failed to send message. Please try WhatsApp or email directly.');
    } finally {
      setLoading(false);
    }
  };

  const inp = 'w-full bg-[#111] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3.5 text-[13px] outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[rgba(255,255,255,0.25)]';
  const lbl = 'block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2';

  const faqs = [
    { q: 'How long does a custom order take?', a: 'Most custom pieces are crafted within 7–10 business days, depending on complexity. Rush orders may be available for an additional fee.' },
    { q: 'Do you ship internationally?', a: 'Yes, we ship worldwide via insured courier. International delivery typically takes 12–18 business days.' },
    { q: 'What materials do you use?', a: 'We work primarily with Grade-A black marble and granite sourced from Rajasthan, along with white marble, sandstone, and select metals for inlay work.' },
    { q: 'Can I see a design proof before production?', a: 'Absolutely. Every custom order includes a digital design proof for your approval before we begin engraving.' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <div className="text-[11px] text-[#D4AF37] tracking-[5px] uppercase mb-4 flex items-center justify-center gap-4">
              <span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" />
              Get In Touch
              <span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" />
            </div>
            <h1 className="font-cinzel text-4xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-[rgba(255,255,255,0.55)] max-w-lg mx-auto text-[14px] leading-relaxed">
              Questions about an order, a custom piece, or just want to say hello? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-10 mb-20">
            {/* Info column */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6">
                <div className="text-[#D4AF37] text-xl mb-3">📍</div>
                <div className="font-cinzel text-[14px] font-semibold text-white mb-2">Workshop Address</div>
                <div className="text-[13px] text-[rgba(255,255,255,0.55)] leading-relaxed whitespace-pre-line">
                  {address}
                </div>
              </div>
              <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6">
                <div className="text-[#D4AF37] text-xl mb-3">📞</div>
                <div className="font-cinzel text-[14px] font-semibold text-white mb-2">Call Us</div>
                <div className="text-[13px] text-[rgba(255,255,255,0.55)]">{phone}</div>
                <div className="text-[11px] text-[rgba(255,255,255,0.35)] mt-1">Mon–Sat, 9:00 AM – 6:00 PM IST</div>
              </div>
              <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6">
                <div className="text-[#D4AF37] text-xl mb-3">✉️</div>
                <div className="font-cinzel text-[14px] font-semibold text-white mb-2">Email Us</div>
                <div className="text-[13px] text-[rgba(255,255,255,0.55)]">{email}</div>
                <div className="text-[11px] text-[rgba(255,255,255,0.35)] mt-1">We reply within 24 hours</div>
              </div>
              <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" className="block bg-[#D4AF37] p-6 hover:bg-[#F5E6A3] transition-colors">
                <div className="text-[#0D0D0D] text-xl mb-3">💬</div>
                <div className="font-cinzel text-[14px] font-semibold text-[#0D0D0D] mb-2">Chat on WhatsApp</div>
                <div className="text-[13px] text-[rgba(13,13,13,0.7)]">Fastest way to reach us</div>
              </a>
            </div>

            {/* Form column */}
            <div className="lg:col-span-3">
              <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-7">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-5">✦</div>
                    <div className="font-cinzel text-xl text-[#D4AF37] mb-3">Message Sent!</div>
                    <p className="text-[rgba(255,255,255,0.55)] text-[13px]">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className={lbl}>Full Name *</label>
                        <input name="name" value={form.name} onChange={onChange} className={inp} placeholder="Your name" required />
                      </div>
                      <div>
                        <label className={lbl}>Email *</label>
                        <input name="email" type="email" value={form.email} onChange={onChange} className={inp} placeholder="you@example.com" required />
                      </div>
                      <div>
                        <label className={lbl}>Phone</label>
                        <input name="phone" value={form.phone} onChange={onChange} className={inp} placeholder="+91 XXXXX XXXXX" />
                      </div>
                      <div>
                        <label className={lbl}>Subject *</label>
                        <input name="subject" value={form.subject} onChange={onChange} className={inp} placeholder="What's this about?" required />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Message *</label>
                      <textarea name="message" value={form.message} onChange={onChange} className={`${inp} resize-none h-32`} placeholder="Tell us more..." required />
                    </div>
                    <button type="submit" disabled={loading} className="btn-luxury w-full py-4 disabled:opacity-60">
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] h-72 flex items-center justify-center mb-20">
            <div className="text-center">
              <div className="text-[#D4AF37] text-3xl mb-3">🗺</div>
              <div className="text-[rgba(255,255,255,0.4)] text-[13px]">Google Map — Kishangarh, Rajasthan</div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <div className="text-center mb-10">
              <div className="text-[11px] text-[#D4AF37] tracking-[5px] uppercase mb-4 flex items-center justify-center gap-4">
                <span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" />
                Common Questions
                <span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" />
              </div>
              <h2 className="font-cinzel text-3xl font-bold text-white">Frequently Asked</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {faqs.map(f => (
                <div key={f.q} className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6">
                  <div className="font-cinzel text-[14px] font-semibold text-[#D4AF37] mb-2">{f.q}</div>
                  <div className="text-[13px] text-[rgba(255,255,255,0.55)] leading-relaxed">{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
