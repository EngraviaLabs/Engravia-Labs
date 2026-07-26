'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import Modal from '../../components/Modal';
import { Pagination, StatusBadge } from '../../components/UIPrimitives';
import api from '../../lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [newModal, setNewModal] = useState(false);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', status: 'draft', categories: '', tags: '', metaTitle: '', metaDescription: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs', page, filter],
    queryFn: async () => (await api.get('/blogs/admin', { params: { page, limit: 15, status: filter || undefined } })).data,
  });

  const blogs = data?.blogs || [];
  const pagination = data?.pagination;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData();
    fd.append('title', form.title); fd.append('excerpt', form.excerpt); fd.append('content', form.content); fd.append('status', form.status);
    fd.append('categories', JSON.stringify(form.categories.split(',').map(s => s.trim()).filter(Boolean)));
    fd.append('tags', JSON.stringify(form.tags.split(',').map(s => s.trim()).filter(Boolean)));
    fd.append('seo', JSON.stringify({ metaTitle: form.metaTitle, metaDescription: form.metaDescription }));
    if (imageFile) fd.append('featuredImage', imageFile);
    try {
      await api.post('/blogs/admin', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Blog post created');
      qc.invalidateQueries({ queryKey: ['admin-blogs'] });
      setNewModal(false);
      setForm({ title: '', excerpt: '', content: '', status: 'draft', categories: '', tags: '', metaTitle: '', metaDescription: '' });
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    await api.delete(`/blogs/admin/${id}`);
    qc.invalidateQueries({ queryKey: ['admin-blogs'] });
    toast.success('Deleted');
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    await api.put(`/blogs/admin/${id}`, { status: newStatus });
    qc.invalidateQueries({ queryKey: ['admin-blogs'] });
    toast.success(`Post ${newStatus}`);
  };

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} className="input-field w-40">
          <option value="">All Posts</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        <div className="ml-auto"><button onClick={() => setNewModal(true)} className="btn-luxury">+ New Post</button></div>
      </div>

      {isLoading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 skeleton" />)}</div> : (
        <div className="space-y-3">
          {blogs.map((b: any) => (
            <div key={b._id} className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-5 flex gap-5 hover:border-[rgba(212,175,55,0.3)] transition-colors">
              {b.featuredImage?.url && <img src={b.featuredImage.url} alt={b.title} className="w-20 h-14 object-cover flex-shrink-0 border border-[rgba(212,175,55,0.1)]" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-1">
                  <div className="font-cinzel text-[14px] font-semibold text-white flex-1 truncate">{b.title}</div>
                  <StatusBadge status={b.status} />
                </div>
                <div className="text-[12px] text-[rgba(255,255,255,0.4)] mb-2">{b.excerpt?.slice(0,100)}...</div>
                <div className="text-[11px] text-[rgba(255,255,255,0.3)]">By {b.author?.name} · {new Date(b.createdAt).toLocaleDateString('en-IN')} · {b.viewCount} views</div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button onClick={() => toggleStatus(b._id, b.status)} className={`text-[11px] ${b.status === 'published' ? 'text-yellow-400' : 'text-green-400'}`}>{b.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => onDelete(b._id)} className="text-[11px] text-red-400/70 hover:text-red-400">Delete</button>
              </div>
            </div>
          ))}
          {blogs.length === 0 && <div className="text-center py-16 text-[rgba(255,255,255,0.3)] bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)]">No blog posts yet</div>}
        </div>
      )}
      {pagination && <Pagination page={page} pages={pagination.pages} onChange={setPage} />}

      <Modal open={newModal} onClose={() => setNewModal(false)} title="New Blog Post" maxWidth="max-w-4xl">
        <form onSubmit={onSave} className="space-y-4">
          <div><label className="label-field">Title *</label><input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="input-field" required placeholder="Blog post title" /></div>
          <div><label className="label-field">Excerpt *</label><textarea value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} className="input-field resize-none h-16" required placeholder="Short summary (max 300 chars)" maxLength={300} /></div>
          <div><label className="label-field">Content *</label><textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} className="input-field resize-none h-64" required placeholder="Full blog post content..." /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="label-field">Status</label><select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))} className="input-field"><option value="draft">Draft</option><option value="published">Published</option></select></div>
            <div><label className="label-field">Categories</label><input value={form.categories} onChange={e => setForm(f => ({...f, categories: e.target.value}))} className="input-field" placeholder="comma separated" /></div>
            <div><label className="label-field">Tags</label><input value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} className="input-field" placeholder="comma separated" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-field">SEO Title</label><input value={form.metaTitle} onChange={e => setForm(f => ({...f, metaTitle: e.target.value}))} className="input-field" /></div>
            <div><label className="label-field">SEO Description</label><input value={form.metaDescription} onChange={e => setForm(f => ({...f, metaDescription: e.target.value}))} className="input-field" /></div>
          </div>
          <div><label className="label-field">Featured Image</label>
            <label className="block border-dashed border border-[rgba(212,175,55,0.2)] p-4 text-center cursor-pointer hover:border-[#D4AF37] transition-colors">
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              <div className="text-[12px] text-[rgba(255,255,255,0.4)]">{imageFile ? imageFile.name : 'Click to upload featured image'}</div>
            </label>
          </div>
          <div className="flex gap-3 pt-2"><button type="submit" disabled={saving} className="btn-luxury flex-1 disabled:opacity-60">{saving ? 'Saving...' : 'Create Post'}</button><button type="button" onClick={() => setNewModal(false)} className="btn-outline">Cancel</button></div>
        </form>
      </Modal>
    </AdminShell>
  );
}
