'use client';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { getImageUrl } from '../lib/utils';
import toast from 'react-hot-toast';

interface CustomField { name: string; type: string; label: string; options?: string[]; required: boolean; }

interface Props {
  productId?: string;
}

export default function ProductForm({ productId }: Props) {
  const router = useRouter();
  const isEdit = !!productId;
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories-all'],
    queryFn: async () => (await api.get('/categories/admin/all')).data.categories,
  });

  const [form, setForm] = useState({
    name: '', category: '', description: '', shortDescription: '',
    price: '', salePrice: '', stock: '0', material: '', colors: '', sizes: '',
    isFeatured: false, isBestSeller: false, isCustomizable: false,
    features: '', tags: '',
  });
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${productId}`).then(({ data }) => {
        // Edit uses slug-based GET; but for admin we need ID lookup workaround:
      });
      // For admin edit, fetch by listing and filtering (since detail route is by slug)
      api.get('/products', { params: { limit: 1000 } }).then(({ data }) => {
        const p = data.products.find((x: any) => x._id === productId);
        if (p) {
          setForm({
            name: p.name, category: p.category?._id || '', description: p.description || '',
            shortDescription: p.shortDescription || '', price: String(p.price), salePrice: p.salePrice ? String(p.salePrice) : '',
            stock: String(p.stock), material: (p.material || []).join(', '), colors: (p.colors || []).join(', '),
            sizes: (p.sizes || []).join(', '), isFeatured: p.isFeatured, isBestSeller: p.isBestSeller,
            isCustomizable: p.isCustomizable, features: (p.features || []).join('\n'), tags: (p.tags || []).join(', '),
          });
          setCustomFields(p.customizationFields || []);
          setExistingImages(p.images || []);
        }
      });
    }
  }, [productId]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const addCustomField = () => setCustomFields(f => [...f, { name: '', type: 'text', label: '', required: false }]);
  const updateCustomField = (i: number, key: string, value: any) => setCustomFields(f => f.map((cf, idx) => idx === i ? { ...cf, [key]: value } : cf));
  const removeCustomField = (i: number) => setCustomFields(f => f.filter((_, idx) => idx !== i));

  const removeExistingImage = async (publicId: string) => {
    if (!productId) return;
    try {
      await api.delete(`/products/${productId}/image`, { data: { publicId } });
      setExistingImages(imgs => imgs.filter(img => img.publicId !== publicId));
      toast.success('Image removed');
    } catch { toast.error('Failed to remove image'); }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('category', form.category);
      fd.append('description', form.description);
      fd.append('shortDescription', form.shortDescription);
      fd.append('price', form.price);
      if (form.salePrice) fd.append('salePrice', form.salePrice);
      fd.append('stock', form.stock);
      fd.append('isFeatured', String(form.isFeatured));
      fd.append('isBestSeller', String(form.isBestSeller));
      fd.append('isCustomizable', String(form.isCustomizable));
      fd.append('material', JSON.stringify(form.material.split(',').map(s => s.trim()).filter(Boolean)));
      fd.append('colors', JSON.stringify(form.colors.split(',').map(s => s.trim()).filter(Boolean)));
      fd.append('sizes', JSON.stringify(form.sizes.split(',').map(s => s.trim()).filter(Boolean)));
      fd.append('features', JSON.stringify(form.features.split('\n').map(s => s.trim()).filter(Boolean)));
      fd.append('tags', JSON.stringify(form.tags.split(',').map(s => s.trim()).filter(Boolean)));
      fd.append('customizationFields', JSON.stringify(customFields.filter(f => f.name && f.label)));
      imageFiles.forEach(file => fd.append('images', file));

      if (isEdit) {
        await api.put(`/products/${productId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
      }
      router.push('/products');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
      {/* Basic Info */}
      <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6">
        <div className="font-cinzel text-[15px] font-semibold text-white mb-5">Basic Information</div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-field">Product Name *</label>
            <input name="name" value={form.name} onChange={onChange} className="input-field" placeholder="Premium Black Marble Name Plate" required />
          </div>
          <div>
            <label className="label-field">Category *</label>
            <select name="category" value={form.category} onChange={onChange} className="input-field" required>
              <option value="">Select category</option>
              {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Stock Quantity</label>
            <input name="stock" type="number" value={form.stock} onChange={onChange} className="input-field" />
          </div>
          <div>
            <label className="label-field">Price (₹) *</label>
            <input name="price" type="number" value={form.price} onChange={onChange} className="input-field" required />
          </div>
          <div>
            <label className="label-field">Sale Price (₹)</label>
            <input name="salePrice" type="number" value={form.salePrice} onChange={onChange} className="input-field" placeholder="Optional discount price" />
          </div>
          <div className="md:col-span-2">
            <label className="label-field">Short Description</label>
            <input name="shortDescription" value={form.shortDescription} onChange={onChange} className="input-field" placeholder="One-line summary for listings" />
          </div>
          <div className="md:col-span-2">
            <label className="label-field">Full Description *</label>
            <textarea name="description" value={form.description} onChange={onChange} className="input-field resize-none h-32" required />
          </div>
        </div>
      </div>

      {/* Attributes */}
      <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6">
        <div className="font-cinzel text-[15px] font-semibold text-white mb-5">Attributes</div>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div><label className="label-field">Material (comma-separated)</label><input name="material" value={form.material} onChange={onChange} className="input-field" placeholder="Black Marble, Granite" /></div>
          <div><label className="label-field">Colors (comma-separated)</label><input name="colors" value={form.colors} onChange={onChange} className="input-field" placeholder="Gold, Silver" /></div>
          <div><label className="label-field">Sizes (comma-separated)</label><input name="sizes" value={form.sizes} onChange={onChange} className="input-field" placeholder='12x6, 18x10' /></div>
        </div>
        <div className="mb-4">
          <label className="label-field">Features (one per line)</label>
          <textarea name="features" value={form.features} onChange={onChange} className="input-field resize-none h-24" placeholder="Weather-resistant&#10;Lifetime guarantee" />
        </div>
        <div>
          <label className="label-field">Tags (comma-separated, for search/SEO)</label>
          <input name="tags" value={form.tags} onChange={onChange} className="input-field" placeholder="luxury, name plate, marble" />
        </div>
        <div className="flex gap-6 mt-5 pt-5 border-t border-[rgba(212,175,55,0.08)]">
          <label className="flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.7)]"><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={onChange} className="accent-[#D4AF37]" />Featured Product</label>
          <label className="flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.7)]"><input type="checkbox" name="isBestSeller" checked={form.isBestSeller} onChange={onChange} className="accent-[#D4AF37]" />Best Seller</label>
          <label className="flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.7)]"><input type="checkbox" name="isCustomizable" checked={form.isCustomizable} onChange={onChange} className="accent-[#D4AF37]" />Customizable</label>
        </div>
      </div>

      {/* Customization Fields */}
      <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="font-cinzel text-[15px] font-semibold text-white">Customization Fields</div>
          <button type="button" onClick={addCustomField} className="btn-outline text-[10px] py-1.5 px-3">+ Add Field</button>
        </div>
        <div className="space-y-3">
          {customFields.map((field, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center bg-[#0D0D0D] p-3 border border-[rgba(212,175,55,0.08)]">
              <input value={field.name} onChange={e => updateCustomField(i, 'name', e.target.value)} placeholder="field_name" className="input-field col-span-3 text-[12px]" />
              <input value={field.label} onChange={e => updateCustomField(i, 'label', e.target.value)} placeholder="Display Label" className="input-field col-span-4 text-[12px]" />
              <select value={field.type} onChange={e => updateCustomField(i, 'type', e.target.value)} className="input-field col-span-2 text-[12px]">
                {['text', 'select', 'textarea', 'upload', 'number', 'color'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <label className="col-span-2 flex items-center gap-1.5 text-[11px] text-[rgba(255,255,255,0.6)]"><input type="checkbox" checked={field.required} onChange={e => updateCustomField(i, 'required', e.target.checked)} className="accent-[#D4AF37]" />Required</label>
              <button type="button" onClick={() => removeCustomField(i)} className="col-span-1 text-red-400/70 hover:text-red-400 text-sm">✕</button>
            </div>
          ))}
          {customFields.length === 0 && <div className="text-[12px] text-[rgba(255,255,255,0.3)] text-center py-4">No customization fields. Add one if this product supports personalization.</div>}
        </div>
      </div>

      {/* Images */}
      <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6">
        <div className="font-cinzel text-[15px] font-semibold text-white mb-5">Product Images</div>
        {existingImages.length > 0 && (
          <div className="grid grid-cols-6 gap-3 mb-4">
            {existingImages.map(img => (
              <div key={img.publicId} className="relative aspect-square border border-[rgba(212,175,55,0.1)] group">
                <img src={getImageUrl(img.url)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeExistingImage(img.publicId)} className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-red-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              </div>
            ))}
          </div>
        )}
        <label className="block border-2 border-dashed border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.5)] p-8 text-center cursor-pointer transition-colors">
          <input type="file" accept="image/*" multiple onChange={e => setImageFiles(Array.from(e.target.files || []))} className="hidden" />
          <div className="text-[13px] text-[rgba(255,255,255,0.5)]">{imageFiles.length > 0 ? `${imageFiles.length} new file(s) selected` : 'Click to upload product images'}</div>
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-luxury">{loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}</button>
        <button type="button" onClick={() => router.push('/products')} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
