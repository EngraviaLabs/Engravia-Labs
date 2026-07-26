'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import DataTable from '../../components/DataTable';
import { Pagination } from '../../components/UIPrimitives';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', page, search],
    queryFn: async () => (await api.get('/users/admin', { params: { page, limit: 20, search: search || undefined, role: 'customer' } })).data,
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  const toggleStatus = async (id: string, name: string) => {
    if (!confirm(`Toggle active status for "${name}"?`)) return;
    try {
      await api.patch(`/users/admin/${id}/toggle-status`);
      qc.invalidateQueries({ queryKey: ['admin-customers'] });
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  return (
    <AdminShell>
      <div className="flex items-center gap-3 mb-5">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." className="input-field max-w-xs" />
        <div className="ml-auto text-[13px] text-[rgba(255,255,255,0.4)]">{pagination?.total || 0} customers</div>
      </div>

      <DataTable
        loading={isLoading}
        data={users}
        rowKey={(u: any) => u._id}
        emptyMessage="No customers found."
        columns={[
          {
            key: 'name', label: 'Customer', render: (u: any) => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center font-cinzel text-xs font-bold text-[#0D0D0D] flex-shrink-0">{u.name?.[0]}</div>
                <div><div className="text-white">{u.name}</div><div className="text-[11px] text-[rgba(255,255,255,0.4)]">{u.email}</div></div>
              </div>
            ),
          },
          { key: 'phone', label: 'Phone', render: (u: any) => <span className="text-[rgba(255,255,255,0.6)]">{u.phone || '—'}</span> },
          { key: 'totalOrders', label: 'Orders', render: (u: any) => <span className="font-cinzel text-[#D4AF37]">{u.totalOrders}</span> },
          { key: 'totalSpent', label: 'Spent', render: (u: any) => <span className="font-cinzel text-[#D4AF37]">₹{(u.totalSpent || 0).toLocaleString()}</span> },
          { key: 'isVerified', label: 'Verified', render: (u: any) => <span className={u.isVerified ? 'text-green-400' : 'text-red-400'}>{u.isVerified ? '✓' : '✗'}</span> },
          { key: 'createdAt', label: 'Joined', render: (u: any) => <span className="text-[12px] text-[rgba(255,255,255,0.4)]">{new Date(u.createdAt).toLocaleDateString('en-IN')}</span> },
          {
            key: 'actions', label: '', render: (u: any) => (
              <button onClick={() => toggleStatus(u._id, u.name)} className={`text-[11px] ${u.isActive ? 'text-red-400/70 hover:text-red-400' : 'text-green-400/70 hover:text-green-400'}`}>
                {u.isActive ? 'Deactivate' : 'Activate'}
              </button>
            ),
          },
        ]}
      />
      {pagination && <Pagination page={page} pages={pagination.pages} onChange={setPage} />}
    </AdminShell>
  );
}
