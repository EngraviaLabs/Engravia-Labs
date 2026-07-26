'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import Modal from '../../components/Modal';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const empty = { name: '', location: '', rating: '5', title: '', text: '', productName: '', isPublished: true, displayOrder: '0' };

export default function TestimonialsPage() {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => (await api.get('/testimonials/admin')).data.testimonials,
  });

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (t: any) => {
    setEditing(t);
    setForm({ name: t.name, location: t.location || '', rating: String(t.rating), title: t.title || '', text: t.text, productName: t.productName || '', isPublished: t.isPublished, displayOrder: String(t.displayOrder) });
    setModal(true);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, rating: Number(form.rating), displayOrder: Number(form.displayOrder) };
    try {
      if (editing) await api.put(`/testimonials/admin/${editing._id}`, payload);
      else await api.post('/testimonials/admin', payload);
      toast.success(editing ? 'Updated' : 'Created');
      qc.invalidateQueries({ queryKey: ['admin-testimonials'] });
      setModal(false);
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await api.delete(`/testimonials/admin/${id}`);
    qc.invalidateQueries({ queryKey: ['admin-testimonials'] });
    toast.success('Deleted');
  };

  return (
    <AdminShell>
      <div className="flex justify-between items-center mb-5">
        <div className="text-[rgba(255,255,255,0.5)] text-sm">{testimonials.length} testimonials</div>
        <button onClick={openCreate} className="btn-luxury">+ Add Testimonial</button>
      </div>

      {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 skeleton" />)}</div> : (
        <div className="space-y-4">
          {testimonials.map((t: any) => (
            <div key={t._id} className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B7320] flex items-center justify-center font-cinzel text-sm font-bold text-[#0D0D0D] flex-shrink-0">{t.name?.[0]}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="font-cinzel text-[14px] font-semibold text-white">{t.name}</div>
                  <div className="text-[11px] text-[rgba(255,255,255,0.4)]">{t.location}</div>
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <span key={s} className={`text-[11px] ${s <= t.rating ? 'text-[#D4AF37]' : 'text-[rgba(255,255,255,0.15)]'}`}>★</span>)}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 border ml-auto ${t.isPublished ? 'text-green-400 border-green-400/30 bg-green-400/10' : 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'}`}>{t.isPublished ? 'Published' : 'Hidden'}</span>
                </div>
                <div className="text-[13px] text-[rgba(255,255,255,0.6)] mb-3">{t.text}</div>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(t)} className="text-[11px] text-[#D4AF37] hover:text-[#F5E6A3]">Edit</button>
                  <button onClick={() => onDelete(t._id)} className="text-[11px] text-red-400/70 hover:text-red-400">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && <div className="text-center py-16 text-[rgba(255,255,255,0.3)] bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)]">No testimonials yet</div>}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Testimonial' : 'New Testimonial'}>
        <form onSubmit={onSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-field">Name *</label><input value={form.name} onChange={e => setForm((f:any) => ({...f, name: e.target.value}))} className="input-field" required /></div>
            <div><label className="label-field">Location</label><input value={form.location} onChange={e => setForm((f:any) => ({...f, location: e.target.value}))} className="input-field" placeholder="Mumbai" /></div>
            <div><label className="label-field">Rating *</label><select value={form.rating} onChange={e => setForm((f:any) => ({...f, rating: e.target.value}))} className="input-field">{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}</select></div>
            <div><label className="label-field">Display Order</label><input type="number" value={form.displayOrder} onChange={e => setForm((f:any) => ({...f, displayOrder: e.target.value}))} className="input-field" /></div>
          </div>
          <div><label className="label-field">Review Title</label><input value={form.title} onChange={e => setForm((f:any) => ({...f, title: e.target.value}))} className="input-field" /></div>
          <div><label className="label-field">Review Text *</label><textarea value={form.text} onChange={e => setForm((f:any) => ({...f, text: e.target.value}))} className="input-field resize-none h-24" required /></div>
          <div><label className="label-field">Product Name</label><input value={form.productName} onChange={e => setForm((f:any) => ({...f, productName: e.target.value}))} className="input-field" placeholder="Black Marble Name Plate" /></div>
          <label className="flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.7)]"><input type="checkbox" checked={form.isPublished} onChange={e => setForm((f:any) => ({...f, isPublished: e.target.checked}))} className="accent-[#D4AF37]" />Published (visible on website)</label>
          <div className="flex gap-3 pt-2"><button type="submit" disabled={saving} className="btn-luxury flex-1 disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Add Testimonial'}</button><button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button></div>
        </form>
      </Modal>
    </AdminShell>
  );
}
