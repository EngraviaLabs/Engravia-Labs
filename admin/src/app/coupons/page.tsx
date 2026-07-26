'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import Modal from '../../components/Modal';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const emptyForm = { code: '', description: '', type: 'percentage', value: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', startsAt: '', expiresAt: '', isActive: true };

export default function CouponsPage() {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => (await api.get('/coupons/admin')).data.coupons,
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (c: any) => {
    setEditing(c);
    setForm({ code: c.code, description: c.description || '', type: c.type, value: String(c.value), minOrderAmount: String(c.minOrderAmount || ''), maxDiscount: c.maxDiscount ? String(c.maxDiscount) : '', usageLimit: c.usageLimit ? String(c.usageLimit) : '', startsAt: c.startsAt?.slice(0,10) || '', expiresAt: c.expiresAt?.slice(0,10) || '', isActive: c.isActive });
    setModal(true);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, value: Number(form.value), minOrderAmount: Number(form.minOrderAmount || 0), maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined, usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined };
    try {
      if (editing) await api.put(`/coupons/admin/${editing._id}`, payload);
      else await api.post('/coupons/admin', payload);
      toast.success(editing ? 'Coupon updated' : 'Coupon created');
      qc.invalidateQueries({ queryKey: ['admin-coupons'] });
      setModal(false);
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  const onDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    await api.delete(`/coupons/admin/${id}`);
    qc.invalidateQueries({ queryKey: ['admin-coupons'] });
    toast.success('Deleted');
  };

  const inp = 'input-field';

  return (
    <AdminShell>
      <div className="flex justify-between items-center mb-5">
        <div className="text-[rgba(255,255,255,0.5)] text-sm">{coupons.length} coupons</div>
        <button onClick={openCreate} className="btn-luxury">+ New Coupon</button>
      </div>

      {isLoading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 skeleton"/>)}</div> : (
        <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-[rgba(212,175,55,0.08)]">{['Code','Type','Value','Min Order','Usage','Expires','Status',''].map(h=><th key={h} className="px-4 py-3 text-left text-[10px] font-bold tracking-wide uppercase text-[rgba(255,255,255,0.35)]">{h}</th>)}</tr></thead>
            <tbody>
              {coupons.map((c: any) => (
                <tr key={c._id} className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(212,175,55,0.02)]">
                  <td className="px-4 py-3 font-cinzel text-[#D4AF37] text-[13px] font-bold">{c.code}</td>
                  <td className="px-4 py-3 text-[12px] text-[rgba(255,255,255,0.6)] capitalize">{c.type.replace('_',' ')}</td>
                  <td className="px-4 py-3 font-cinzel text-[13px] text-white">{c.type === 'percentage' ? `${c.value}%` : c.type === 'fixed' ? `₹${c.value}` : 'Free Ship'}</td>
                  <td className="px-4 py-3 text-[12px] text-[rgba(255,255,255,0.5)]">₹{c.minOrderAmount || 0}</td>
                  <td className="px-4 py-3 text-[12px] text-[rgba(255,255,255,0.5)]">{c.usedCount}/{c.usageLimit || '∞'}</td>
                  <td className="px-4 py-3 text-[12px] text-[rgba(255,255,255,0.5)]">{new Date(c.expiresAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 border ${c.isActive && new Date(c.expiresAt) > new Date() ? 'text-green-400 border-green-400/30 bg-green-400/10' : 'text-red-400 border-red-400/30 bg-red-400/10'}`}>{c.isActive && new Date(c.expiresAt) > new Date() ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-3"><button onClick={() => openEdit(c)} className="text-[11px] text-[#D4AF37]">Edit</button><button onClick={() => onDelete(c._id, c.code)} className="text-[11px] text-red-400/70 hover:text-red-400">Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && <div className="text-center py-12 text-[rgba(255,255,255,0.3)] text-sm">No coupons created yet</div>}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Coupon' : 'New Coupon'}>
        <form onSubmit={onSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-field">Code *</label><input value={form.code} onChange={e => setForm((f:any) => ({...f, code: e.target.value.toUpperCase()}))} className={inp} required placeholder="SUMMER20" /></div>
            <div><label className="label-field">Type *</label><select value={form.type} onChange={e => setForm((f:any) => ({...f, type: e.target.value}))} className={inp}><option value="percentage">Percentage %</option><option value="fixed">Fixed ₹</option><option value="free_shipping">Free Shipping</option></select></div>
            <div><label className="label-field">Value *</label><input type="number" value={form.value} onChange={e => setForm((f:any) => ({...f, value: e.target.value}))} className={inp} required placeholder="20" /></div>
            <div><label className="label-field">Min Order (₹)</label><input type="number" value={form.minOrderAmount} onChange={e => setForm((f:any) => ({...f, minOrderAmount: e.target.value}))} className={inp} placeholder="0" /></div>
            <div><label className="label-field">Max Discount (₹)</label><input type="number" value={form.maxDiscount} onChange={e => setForm((f:any) => ({...f, maxDiscount: e.target.value}))} className={inp} placeholder="No limit" /></div>
            <div><label className="label-field">Usage Limit</label><input type="number" value={form.usageLimit} onChange={e => setForm((f:any) => ({...f, usageLimit: e.target.value}))} className={inp} placeholder="Unlimited" /></div>
            <div><label className="label-field">Starts At *</label><input type="date" value={form.startsAt} onChange={e => setForm((f:any) => ({...f, startsAt: e.target.value}))} className={inp} required /></div>
            <div><label className="label-field">Expires At *</label><input type="date" value={form.expiresAt} onChange={e => setForm((f:any) => ({...f, expiresAt: e.target.value}))} className={inp} required /></div>
          </div>
          <div><label className="label-field">Description</label><input value={form.description} onChange={e => setForm((f:any) => ({...f, description: e.target.value}))} className={inp} placeholder="Optional internal note" /></div>
          <label className="flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.7)]"><input type="checkbox" checked={form.isActive} onChange={e => setForm((f:any) => ({...f, isActive: e.target.checked}))} className="accent-[#D4AF37]" />Active</label>
          <div className="flex gap-3 pt-2"><button type="submit" disabled={saving} className="btn-luxury flex-1 disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create Coupon'}</button><button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button></div>
        </form>
      </Modal>
    </AdminShell>
  );
}
