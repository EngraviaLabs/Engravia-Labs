'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import DataTable from '../../components/DataTable';
import { Pagination, StatusBadge } from '../../components/UIPrimitives';
import api from '../../lib/api';
import Link from 'next/link';

const ORDER_STATUSES = ['', 'placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, status, search],
    queryFn: async () => (await api.get('/orders/admin', { params: { page, limit: 20, status: status || undefined, search: search || undefined } })).data,
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search order # or email..." className="input-field max-w-xs" />
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="input-field w-48">
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}</option>)}
        </select>
        <div className="ml-auto text-[13px] text-[rgba(255,255,255,0.4)]">{pagination?.total || 0} orders</div>
      </div>

      <DataTable
        loading={isLoading}
        data={orders}
        rowKey={(o: any) => o._id}
        emptyMessage="No orders found."
        columns={[
          { key: 'orderNumber', label: 'Order', render: (o: any) => <span className="font-cinzel text-[#D4AF37] text-[12px]">#{o.orderNumber}</span> },
          { key: 'customer', label: 'Customer', render: (o: any) => <div><div className="text-white text-[13px]">{o.user?.name || o.guestName || 'Guest'}</div><div className="text-[11px] text-[rgba(255,255,255,0.4)]">{o.user?.email || o.guestEmail}</div></div> },
          { key: 'items', label: 'Items', render: (o: any) => <span className="text-[rgba(255,255,255,0.6)]">{o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</span> },
          { key: 'total', label: 'Total', render: (o: any) => <span className="font-cinzel text-[#D4AF37]">₹{o.total?.toLocaleString()}</span> },
          { key: 'paymentMethod', label: 'Payment', render: (o: any) => <span className="text-[12px] text-[rgba(255,255,255,0.6)] uppercase">{o.paymentMethod}</span> },
          { key: 'orderStatus', label: 'Status', render: (o: any) => <StatusBadge status={o.orderStatus} /> },
          { key: 'createdAt', label: 'Date', render: (o: any) => <span className="text-[12px] text-[rgba(255,255,255,0.5)]">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span> },
          { key: 'actions', label: '', render: (o: any) => <Link href={`/orders/${o._id}`} className="text-[11px] text-[#D4AF37] hover:text-[#F5E6A3] whitespace-nowrap">Manage ›</Link> },
        ]}
      />
      {pagination && <Pagination page={page} pages={pagination.pages} onChange={setPage} />}
    </AdminShell>
  );
}
