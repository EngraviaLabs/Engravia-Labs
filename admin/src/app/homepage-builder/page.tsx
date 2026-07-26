'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import Modal from '../../components/Modal';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function HomepageBuilderPage() {
  const qc = useQueryClient();
  const [bannerModal, setBannerModal] = useState(false);
  const [editBanner, setEditBanner] = useState<any>(null);
  const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', description: '', ctaText: '', ctaLink: '', ctaSecondaryText: '', ctaSecondaryLink: '', placement: 'hero', isActive: true });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: heroBanners = [] } = useQuery({ queryKey: ['banners-hero'], queryFn: async () => (await api.get('/banners/placement/hero')).data.banners });
  const { data: stripBanners = [] } = useQuery({ queryKey: ['banners-strip'], queryFn: async () => (await api.get('/banners/placement/banner_strip')).data.banners });
  const { data: allBanners = [] } = useQuery({ queryKey: ['admin-banners'], queryFn: async () => (await api.get('/banners/admin')).data.banners });

  const openCreate = (placement = 'hero') => {
    setEditBanner(null);
    setBannerForm({ title: '', subtitle: '', description: '', ctaText: '', ctaLink: '', ctaSecondaryText: '', ctaSecondaryLink: '', placement, isActive: true });
    setImageFile(null);
    setBannerModal(true);
  };

  const openEdit = (b: any) => {
    setEditBanner(b);
    setBannerForm({ title: b.title, subtitle: b.subtitle || '', description: b.description || '', ctaText: b.ctaText || '', ctaLink: b.ctaLink || '', ctaSecondaryText: b.ctaSecondaryText || '', ctaSecondaryLink: b.ctaSecondaryLink || '', placement: b.placement, isActive: b.isActive });
    setImageFile(null);
    setBannerModal(true);
  };

  const onSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(bannerForm).forEach(([k, v]) => fd.append(k, String(v)));
      if (imageFile) fd.append('image', imageFile);
      if (editBanner) await api.put(`/banners/admin/${editBanner._id}`, bannerForm);
      else await api.post('/banners/admin', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(editBanner ? 'Banner updated' : 'Banner created');
      ['banners-hero', 'banners-strip', 'admin-banners'].forEach(k => qc.invalidateQueries({ queryKey: [k] }));
      setBannerModal(false);
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    await api.delete(`/banners/admin/${id}`);
    ['banners-hero', 'banners-strip', 'admin-banners'].forEach(k => qc.invalidateQueries({ queryKey: [k] }));
    toast.success('Deleted');
  };

  const inp = 'input-field';

  const SECTIONS = [
    { key: 'hero', label: 'Hero Banners', desc: 'Full-width cinematic hero section banners', placement: 'hero', banners: heroBanners },
    { key: 'strip', label: 'Banner Strip', desc: 'Announcement bar at the top of pages', placement: 'banner_strip', banners: stripBanners },
  ];

  return (
    <AdminShell>
      <div className="space-y-8">
        <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5">
          <div className="font-cinzel text-[15px] font-semibold text-white mb-2">Homepage Builder</div>
          <div className="text-[13px] text-[rgba(255,255,255,0.5)]">Manage all homepage sections: banners, featured categories, testimonials, and more. Categories and products are configured in their respective modules.</div>
        </div>

        {SECTIONS.map(section => (
          <div key={section.key} className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)]">
            <div className="px-5 py-4 border-b border-[rgba(212,175,55,0.08)] flex items-center justify-between">
              <div>
                <div className="font-cinzel text-[14px] font-semibold text-white">{section.label}</div>
                <div className="text-[12px] text-[rgba(255,255,255,0.4)] mt-0.5">{section.desc}</div>
              </div>
              <button onClick={() => openCreate(section.placement)} className="btn-luxury text-[11px] py-2 px-4">+ Add Banner</button>
            </div>
            <div className="p-5">
              {section.banners.length === 0 ? (
                <div className="text-center py-8 text-[rgba(255,255,255,0.3)] text-sm border-2 border-dashed border-[rgba(212,175,55,0.1)]">No banners yet — click Add Banner</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {section.banners.map((b: any) => (
                    <div key={b._id} className="border border-[rgba(212,175,55,0.1)] overflow-hidden">
                      {b.image?.url && <img src={b.image.url} alt={b.title} className="w-full h-32 object-cover" />}
                      <div className="p-4">
                        <div className="font-cinzel text-[13px] font-semibold text-white mb-1">{b.title}</div>
                        {b.subtitle && <div className="text-[12px] text-[rgba(255,255,255,0.5)] mb-2">{b.subtitle}</div>}
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 border ${b.isActive ? 'text-green-400 border-green-400/30' : 'text-red-400 border-red-400/30'}`}>{b.isActive ? 'Active' : 'Inactive'}</span>
                          <button onClick={() => openEdit(b)} className="text-[11px] text-[#D4AF37]">Edit</button>
                          <button onClick={() => deleteBanner(b._id)} className="text-[11px] text-red-400/70 hover:text-red-400">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Quick links to other content */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Manage Categories', desc: 'Edit order, visibility, and images of homepage collection grid', href: '/categories', icon: '🏷' },
            { label: 'Featured Products', desc: 'Toggle featured/bestseller flags on individual products', href: '/products', icon: '📦' },
            { label: 'Testimonials', desc: 'Add, edit, and reorder homepage testimonials', href: '/testimonials', icon: '💬' },
          ].map(l => (
            <a key={l.href} href={l.href} className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5 hover:border-[rgba(212,175,55,0.35)] transition-colors block">
              <div className="text-2xl mb-2">{l.icon}</div>
              <div className="font-cinzel text-[13px] font-semibold text-white mb-1">{l.label}</div>
              <div className="text-[12px] text-[rgba(255,255,255,0.45)]">{l.desc}</div>
            </a>
          ))}
        </div>
      </div>

      <Modal open={bannerModal} onClose={() => setBannerModal(false)} title={editBanner ? 'Edit Banner' : 'New Banner'}>
        <form onSubmit={onSaveBanner} className="space-y-4">
          <div><label className="label-field">Title *</label><input value={bannerForm.title} onChange={e => setBannerForm(f => ({...f, title: e.target.value}))} className={inp} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-field">Subtitle</label><input value={bannerForm.subtitle} onChange={e => setBannerForm(f => ({...f, subtitle: e.target.value}))} className={inp} /></div>
            <div><label className="label-field">Placement</label>
              <select value={bannerForm.placement} onChange={e => setBannerForm(f => ({...f, placement: e.target.value}))} className={inp}>
                {['hero','collection','product','popup','banner_strip'].map(p => <option key={p} value={p}>{p.replace('_',' ')}</option>)}
              </select>
            </div>
            <div><label className="label-field">CTA Button Text</label><input value={bannerForm.ctaText} onChange={e => setBannerForm(f => ({...f, ctaText: e.target.value}))} className={inp} placeholder="Shop Collection" /></div>
            <div><label className="label-field">CTA Button Link</label><input value={bannerForm.ctaLink} onChange={e => setBannerForm(f => ({...f, ctaLink: e.target.value}))} className={inp} placeholder="/collection" /></div>
            <div><label className="label-field">Secondary CTA Text</label><input value={bannerForm.ctaSecondaryText} onChange={e => setBannerForm(f => ({...f, ctaSecondaryText: e.target.value}))} className={inp} placeholder="Custom Order" /></div>
            <div><label className="label-field">Secondary CTA Link</label><input value={bannerForm.ctaSecondaryLink} onChange={e => setBannerForm(f => ({...f, ctaSecondaryLink: e.target.value}))} className={inp} placeholder="/custom-order" /></div>
          </div>
          <div><label className="label-field">Description</label><textarea value={bannerForm.description} onChange={e => setBannerForm(f => ({...f, description: e.target.value}))} className="input-field resize-none h-16" /></div>
          {!editBanner && (
            <div><label className="label-field">Banner Image *</label>
              <label className="block border-dashed border border-[rgba(212,175,55,0.2)] p-4 text-center cursor-pointer hover:border-[#D4AF37] transition-colors">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" required={!editBanner} />
                <div className="text-[12px] text-[rgba(255,255,255,0.4)]">{imageFile ? imageFile.name : 'Click to upload (recommended: 1920×600px)'}</div>
              </label>
            </div>
          )}
          <label className="flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.7)]"><input type="checkbox" checked={bannerForm.isActive} onChange={e => setBannerForm(f => ({...f, isActive: e.target.checked}))} className="accent-[#D4AF37]" />Active</label>
          <div className="flex gap-3 pt-2"><button type="submit" disabled={saving} className="btn-luxury flex-1 disabled:opacity-60">{saving ? 'Saving...' : editBanner ? 'Update Banner' : 'Create Banner'}</button><button type="button" onClick={() => setBannerModal(false)} className="btn-outline">Cancel</button></div>
        </form>
      </Modal>
    </AdminShell>
  );
}
