'use client';
import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function CustomOrderPage() {
  const [form, setForm] = useState({ productType:'', material:'Black Marble', size:'', color:'Gold', textRequirement:'', fontStyle:'', additionalNotes:'', guestName:'', guestEmail:'', guestPhone:'' });
  const [files, setFiles] = useState<FileList|null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (files) Array.from(files).forEach(f => fd.append('referenceImages', f));
      await api.post('/custom-orders', fd, { headers:{'Content-Type':'multipart/form-data'} });
      setSubmitted(true);
      toast.success('Custom order request submitted!');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  const inputCls = "w-full bg-[#111] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3.5 text-[13px] outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[rgba(255,255,255,0.25)] font-poppins";
  const labelCls = "block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-2";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-[11px] text-[#D4AF37] tracking-[5px] uppercase mb-4 flex items-center justify-center gap-4"><span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" />Bespoke Creation<span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" /></div>
            <h1 className="font-cinzel text-4xl font-bold text-white mb-4">Custom Order Request</h1>
            <p className="text-[rgba(255,255,255,0.5)] max-w-lg mx-auto text-[14px] leading-relaxed">Tell us your vision. Our master artisans will bring it to life in premium stone.</p>
          </div>

          {submitted ? (
            <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] p-12 text-center">
              <div className="text-5xl mb-6">✦</div>
              <div className="font-cinzel text-2xl text-[#D4AF37] mb-3">Request Received!</div>
              <p className="text-[rgba(255,255,255,0.6)] mb-6 text-[14px]">Our design team will review your request and send a quotation within 24–48 hours.</p>
              <div className="text-[12px] text-[rgba(255,255,255,0.4)] space-y-1">
                <div>What happens next?</div>
                <div className="text-[#D4AF37]">Review → Quotation → Approval → Production → Delivery</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.12)] p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className={labelCls}>Your Name *</label><input name="guestName" value={form.guestName} onChange={handleChange} className={inputCls} placeholder="Full name" required /></div>
                <div><label className={labelCls}>Email *</label><input name="guestEmail" type="email" value={form.guestEmail} onChange={handleChange} className={inputCls} placeholder="your@email.com" required /></div>
                <div><label className={labelCls}>Phone</label><input name="guestPhone" value={form.guestPhone} onChange={handleChange} className={inputCls} placeholder="+91 XXXXX XXXXX" /></div>
                <div><label className={labelCls}>Product Type *</label>
                  <select name="productType" value={form.productType} onChange={handleChange} className={inputCls} required>
                    <option value="">Select product type</option>
                    {['Name Plate','House Number Plate','Memorial Stone','Corporate Signage','Business Sign','Wall Plaque','Stone Scripture','Custom Gift','Other'].map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div><label className={labelCls}>Material *</label>
                  <select name="material" value={form.material} onChange={handleChange} className={inputCls}>
                    {['Black Marble','Black Granite','White Marble','Green Marble','Red Granite','Sandstone'].map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div><label className={labelCls}>Size</label><input name="size" value={form.size} onChange={handleChange} className={inputCls} placeholder='e.g. 12" x 6"' /></div>
                <div><label className={labelCls}>Engraving Color</label>
                  <select name="color" value={form.color} onChange={handleChange} className={inputCls}>
                    {['Gold','Silver','White','Black','Copper','Bronze'].map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div><label className={labelCls}>Font Style</label>
                  <select name="fontStyle" value={form.fontStyle} onChange={handleChange} className={inputCls}>
                    <option value="">Select font style</option>
                    {['Classic Serif','Modern Sans','Calligraphy','Roman','Arabic','Devanagari','Custom'].map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div><label className={labelCls}>Text Requirement</label><textarea name="textRequirement" value={form.textRequirement} onChange={handleChange} className={`${inputCls} resize-none h-24`} placeholder="Exact text to be engraved (name, quote, date, etc.)" maxLength={500} /></div>
              <div><label className={labelCls}>Additional Notes</label><textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} className={`${inputCls} resize-none h-28`} placeholder="Special requirements, design preferences, urgency, etc." maxLength={1000} /></div>
              <div>
                <label className={labelCls}>Reference Images (optional, max 5)</label>
                <label className="block border-2 border-dashed border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.5)] p-8 text-center cursor-pointer transition-colors">
                  <input type="file" accept="image/*" multiple onChange={e=>setFiles(e.target.files)} className="hidden" />
                  <div className="text-2xl mb-2 text-[rgba(212,175,55,0.4)]">📁</div>
                  <div className="text-[13px] text-[rgba(255,255,255,0.5)]">{files ? `${files.length} file(s) selected` : 'Click to upload reference images'}</div>
                  <div className="text-[11px] text-[rgba(255,255,255,0.3)] mt-1">JPG, PNG up to 8MB each</div>
                </label>
              </div>
              <button type="submit" disabled={loading} className="btn-luxury w-full py-4 text-[13px] disabled:opacity-60">{loading?'Submitting Request...':'Submit Custom Order Request'}</button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
