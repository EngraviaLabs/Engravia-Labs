'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import DataTable from '../../components/DataTable';
import { Pagination } from '../../components/UIPrimitives';
import api from '../../lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: async () => (await api.get('/products', { params: { page, limit: 15, search: search || undefined } })).data,
  });

  const products = data?.products || [];
  const pagination = data?.pagination;

  const toggleFlag = async (id: string, flag: 'featured' | 'bestseller') => {
    await api.patch(`/products/${id}/toggle/${flag}`);
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    toast.success('Updated');
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-5 gap-4">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..." className="input-field max-w-xs" />
        <Link href="/products/new" className="btn-luxury whitespace-nowrap">+ Add Product</Link>
      </div>

      <DataTable
        loading={isLoading}
        data={products}
        rowKey={(p: any) => p._id}
        emptyMessage="No products found. Create your first product."
        columns={[
          {
            key: 'product', label: 'Product', render: (p: any) => (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#111] border border-[rgba(212,175,55,0.1)] flex-shrink-0 overflow-hidden">
                  {p.images?.[0] ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-[#D4AF37] font-cinzel">EL</div>}
                </div>
                <div className="min-w-0">
                  <div className="text-white truncate max-w-[220px]">{p.name}</div>
                  <div className="text-[11px] text-[rgba(255,255,255,0.4)]">{p.sku}</div>
                </div>
              </div>
            ),
          },
          { key: 'category', label: 'Category', render: (p: any) => <span className="text-[rgba(255,255,255,0.6)]">{p.category?.name}</span> },
          { key: 'price', label: 'Price', render: (p: any) => <span className="font-cinzel text-[#D4AF37]">₹{(p.salePrice || p.price)?.toLocaleString()}</span> },
          { key: 'stock', label: 'Stock', render: (p: any) => <span className={p.stock > 5 ? 'text-green-400' : p.stock > 0 ? 'text-yellow-400' : 'text-red-400'}>{p.stock}</span> },
          {
            key: 'flags', label: 'Flags', render: (p: any) => (
              <div className="flex gap-1.5">
                <button onClick={() => toggleFlag(p._id, 'featured')} className={`text-[10px] px-2 py-0.5 border ${p.isFeatured ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37]' : 'border-[rgba(212,175,55,0.25)] text-[rgba(255,255,255,0.4)]'}`}>Featured</button>
                <button onClick={() => toggleFlag(p._id, 'bestseller')} className={`text-[10px] px-2 py-0.5 border ${p.isBestSeller ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37]' : 'border-[rgba(212,175,55,0.25)] text-[rgba(255,255,255,0.4)]'}`}>Best Seller</button>
              </div>
            ),
          },
          {
            key: 'actions', label: '', render: (p: any) => (
              <div className="flex gap-3">
                <Link href={`/products/${p._id}`} className="text-[11px] text-[#D4AF37] hover:text-[#F5E6A3]">Edit</Link>
                <button onClick={() => deleteProduct(p._id, p.name)} className="text-[11px] text-red-400/70 hover:text-red-400">Delete</button>
              </div>
            ),
          },
        ]}
      />
      {pagination && <Pagination page={page} pages={pagination.pages} onChange={setPage} />}
    </AdminShell>
  );
}
