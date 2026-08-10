'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import Modal from '../../components/Modal';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../lib/utils';

interface CategoryForm {
  name: string; description: string; displayOrder: string; isVisible: boolean;
  metaTitle: string; metaDescription: string;
}

const empty: CategoryForm = { name: '', description: '', displayOrder: '0', isVisible: true, metaTitle: '', metaDescription: '' };

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<CategoryForm>(empty);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => (await api.get('/categories/admin/all')).data.categories,
  });

  const openCreate = () => { setEditing(null); setForm(empty); setImageFile(null); setModal(true); };
  const openEdit = (cat: any) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || '', displayOrder: String(cat.displayOrder), isVisible: cat.isVisible, metaTitle: cat.seo?.metaTitle || '', metaDescription: cat.seo?.metaDescription || '' });
    setImageFile(null);
    setModal(true);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      fd.append('seo', JSON.stringify({ metaTitle: form.metaTitle, metaDescription: form.metaDescription }));
      if (imageFile) fd.append('image', imageFile);
      if (editing) await api.put(`/categories/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(editing ? 'Category updated' : 'Category created');
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      setModal(false);
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  const onDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/categories/${id}`); qc.invalidateQueries({ queryKey: ['admin-categories'] }); toast.success('Deleted'); }
    catch (err: any) { toast.error(err.response?.data?.message || 'Cannot delete'); }
  };

  const toggleVisible = async (id: string) => {
    await api.patch(`/categories/${id}/toggle-visibility`);
    qc.invalidateQueries({ queryKey: ['admin-categories'] });
  };

  const inp = 'input-field';

  return (
    <AdminShell>
      <div className="flex justify-between items-center mb-5">
        <div className="text-[rgba(255,255,255,0.5)] text-sm">{categories.length} categories</div>
        <button onClick={openCreate} className="btn-luxury">+ New Category</button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-40 skeleton" />)}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat: any) => (
            <div key={cat._id} className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] hover:border-[rgba(212,175,55,0.3)] transition-colors overflow-hidden">
              <div className="aspect-video bg-[#111] relative flex items-center justify-center">
                {cat.image?.url ? (
                  <img src={getImageUrl(cat.image.url)} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-[rgba(212,175,55,0.3)]">◈</span>
                )}
              </div>
              <div className="p-4">
                <div className="font-cinzel text-[14px] font-semibold text-white mb-1">{cat.name}</div>
                <div className="text-[11px] text-[rgba(255,255,255,0.4)] mb-3">{cat.productCount} products · Order #{cat.displayOrder}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(cat)} className="text-[11px] text-[#D4AF37] hover:text-[#F5E6A3]">Edit</button>
                  <span className="text-[rgba(255,255,255,0.2)]">·</span>
                  <button onClick={() => toggleVisible(cat._id)} className={`text-[11px] ${cat.isVisible ? 'text-green-400' : 'text-red-400/70'}`}>{cat.isVisible ? 'Visible' : 'Hidden'}</button>
                  <span className="text-[rgba(255,255,255,0.2)]">·</span>
                  <button onClick={() => onDelete(cat._id, cat.name)} className="text-[11px] text-red-400/70 hover:text-red-400">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Category' : 'New Category'}>
        <form onSubmit={onSave} className="space-y-4">
          <div><label className="label-field">Category Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inp} required /></div>
          <div><label className="label-field">Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field resize-none h-20" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-field">Display Order</label><input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: e.target.value }))} className={inp} /></div>
            <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.7)] cursor-pointer"><input type="checkbox" checked={form.isVisible} onChange={e => setForm(f => ({ ...f, isVisible: e.target.checked }))} className="accent-[#D4AF37]" />Visible on site</label></div>
          </div>
          <div><label className="label-field">SEO Title</label><input value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} className={inp} placeholder="For search engines" /></div>
          <div><label className="label-field">SEO Description</label><textarea value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))} className="input-field resize-none h-16" /></div>
          <div>
            <label className="label-field">Category Image</label>
            {editing?.image?.url && !imageFile && <img src={getImageUrl(editing.image.url)} alt="" className="h-20 object-cover mb-2 border border-[rgba(212,175,55,0.2)]" />}
            <label className="block border-dashed border border-[rgba(212,175,55,0.2)] p-4 text-center cursor-pointer hover:border-[#D4AF37] transition-colors">
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              <div className="text-[12px] text-[rgba(255,255,255,0.4)]">{imageFile ? imageFile.name : 'Click to upload image'}</div>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-luxury flex-1 disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create Category'}</button>
            <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      </Modal>
    </AdminShell>
  );
}
