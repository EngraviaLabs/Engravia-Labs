'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const SETTING_GROUPS = [
  {
    key: 'general', label: 'General', icon: '⚙️',
    fields: [
      { key: 'site_name', label: 'Site Name', type: 'text', default: 'Engravia Labs' },
      { key: 'site_tagline', label: 'Site Tagline', type: 'text', default: 'Luxury Stone Engraving Studio' },
      { key: 'contact_email', label: 'Contact Email', type: 'email', default: 'hello@engravialabs.com' },
      { key: 'contact_phone', label: 'Contact Phone', type: 'text', default: '+91 98765 43210' },
      { key: 'whatsapp_number', label: 'WhatsApp Number', type: 'text', default: '919876543210' },
      { key: 'address', label: 'Business Address', type: 'textarea', default: 'Makrana Road, Kishangarh, Rajasthan 305801' },
    ],
  },
  {
    key: 'shipping', label: 'Shipping', icon: '🚚',
    fields: [
      { key: 'free_shipping_threshold', label: 'Free Shipping Above (₹)', type: 'number', default: '999' },
      { key: 'default_shipping_charge', label: 'Default Shipping Charge (₹)', type: 'number', default: '99' },
      { key: 'cod_charge', label: 'COD Extra Charge (₹)', type: 'number', default: '50' },
      { key: 'processing_days', label: 'Default Processing Days', type: 'number', default: '2' },
    ],
  },
  {
    key: 'seo', label: 'SEO', icon: '🔍',
    fields: [
      { key: 'seo_title', label: 'Default SEO Title', type: 'text', default: 'ENGRAVIA LABS – Luxury Black Marble Engravings' },
      { key: 'seo_description', label: 'Default Meta Description', type: 'textarea', default: "India's premier luxury stone engraving studio." },
      { key: 'google_analytics_id', label: 'Google Analytics ID', type: 'text', default: 'G-XXXXXXXXXX' },
      { key: 'google_verification', label: 'Google Search Console Verification', type: 'text', default: '' },
    ],
  },
  {
    key: 'social', label: 'Social Media', icon: '📱',
    fields: [
      { key: 'instagram_url', label: 'Instagram URL', type: 'url', default: '' },
      { key: 'facebook_url', label: 'Facebook URL', type: 'url', default: '' },
      { key: 'youtube_url', label: 'YouTube URL', type: 'url', default: '' },
    ],
  },
  {
    key: 'policies', label: 'Store Policies', icon: '📜',
    fields: [
      { key: 'privacy_policy', label: 'Privacy Policy', type: 'textarea', default: 'Engravia Labs is committed to protecting your privacy. We collect personal information solely for processing your orders and improving your experience.' },
      { key: 'terms_conditions', label: 'Terms & Conditions', type: 'textarea', default: 'By accessing or making a purchase on Engravia Labs, you agree to be bound by these terms. All designs and stone craftsmanship are proprietary property of Engravia Labs.' },
      { key: 'shipping_delivery_policy', label: 'Shipping & Delivery Policy', type: 'textarea', default: 'We offer insured worldwide shipping. Orders are processed within 2-4 business days. Standard delivery takes 3-7 business days across India.' },
      { key: 'return_refund_policy', label: 'Return, Replacement & Refund Policy', type: 'textarea', default: 'Due to the custom engraved nature of our products, items are replaced free of charge if damaged during transit. Please notify us within 48 hours with unboxing photos.' },
      { key: 'cancellation_policy', label: 'Cancellation Policy', type: 'textarea', default: 'Orders can be cancelled within 12 hours of placement before design proof approval. Once engraving begins, cancellations cannot be processed.' },
    ],
  },
  {
    key: 'payment', label: 'Payment & UPI', icon: '💳',
    fields: [
      { key: 'store_upi_id', label: 'Store UPI ID / VPA (e.g. engravialabs@upi)', type: 'text', default: 'engravialabs@upi' },
      { key: 'enable_direct_upi_qr', label: 'Enable UPI QR & VPA Payment Gateway', type: 'text', default: 'true' },
      { key: 'razorpay_key_id', label: 'Razorpay Key ID', type: 'text', default: 'rzp_test_T4jYhLKhRcdUW5' },
    ],
  },
  {
    key: 'faqs', label: 'Manage FAQs', icon: '❓',
    fields: [
      { key: 'faqs_content', label: 'Frequently Asked Questions (Q: Question | A: Answer)', type: 'textarea', default: 'Q: How long does custom stone engraving take?\nA: Design proofs are shared within 24-48 hours. Once approved, production and finishing take 2-4 business days.\n\nQ: Is black marble suitable for outdoor name plates?\nA: Yes! All our stones are treated with weather-proof, UV-resistant sealing.\n\nQ: Do you deliver across India & internationally?\nA: Yes, we ship insured packages across India and globally.' },
    ],
  },
];

export default function SettingsPage() {
  const qc = useQueryClient();
  const [activeGroup, setActiveGroup] = useState('general');
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await api.get('/users/admin/settings');
      const flat: Record<string, string> = {};
      Object.values(data.settings || {}).forEach((group: any) => Object.entries(group).forEach(([k, v]) => { flat[k] = String(v); }));
      setValues(flat);
      setLoaded(true);
      return data;
    },
  });

  const saveSettings = async () => {
    setSaving(true);
    try {
      await api.put('/users/admin/settings', values);
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Settings saved');
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const group = SETTING_GROUPS.find(g => g.key === activeGroup)!;

  return (
    <AdminShell>
      <div className="grid lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] overflow-hidden">
            {SETTING_GROUPS.map(g => (
              <button key={g.key} onClick={() => setActiveGroup(g.key)} className={`w-full flex items-center gap-3 px-4 py-3.5 text-[13px] text-left transition-all border-l-2 ${activeGroup === g.key ? 'text-[#D4AF37] border-[#D4AF37] bg-[rgba(212,175,55,0.06)]' : 'text-[rgba(255,255,255,0.55)] border-transparent hover:text-white'}`}>
                <span>{g.icon}</span>{g.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6">
            <div className="font-cinzel text-[15px] font-semibold text-white mb-6 pb-4 border-b border-[rgba(212,175,55,0.08)]">{group.icon} {group.label} Settings</div>
            {!loaded ? (
              <div className="space-y-4">{Array.from({length:4}).map((_,i) => <div key={i} className="h-14 skeleton" />)}</div>
            ) : (
              <div className="space-y-5">
                {group.fields.map(field => (
                  <div key={field.key}>
                    <label className="label-field">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea value={values[field.key] ?? field.default} onChange={e => setValues(v => ({...v, [field.key]: e.target.value}))} className="input-field min-h-[140px] font-sans text-sm" />
                    ) : (
                      <input type={field.type} value={values[field.key] ?? field.default} onChange={e => setValues(v => ({...v, [field.key]: e.target.value}))} className="input-field" placeholder={field.default} />
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-[rgba(212,175,55,0.08)]">
                  <button onClick={saveSettings} disabled={saving} className="btn-luxury disabled:opacity-60">{saving ? 'Saving...' : 'Save Settings'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
