'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Pagination, StatusBadge } from '../../components/UIPrimitives';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../lib/utils';

const STATUSES = ['', 'pending', 'reviewing', 'quoted', 'approved', 'in_production', 'completed', 'rejected'];

export default function CustomOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [updateForm, setUpdateForm] = useState({ status: '', quotedPrice: '', quotationNote: '', note: '' });
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-custom-orders', page, status],
    queryFn: async () => (await api.get('/custom-orders/admin', { params: { page, limit: 20, status: status || undefined } })).data,
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  const openDetail = (order: any) => {
    setDetail(order);
    setUpdateForm({ status: '', quotedPrice: '', quotationNote: '', note: '' });
  };

  const onUpdate = async () => {
    if (!updateForm.status) { toast.error('Select a status'); return; }
    setSaving(true);
    try {
      await api.patch(`/custom-orders/admin/${detail._id}/status`, updateForm);
      toast.success('Updated');
      qc.invalidateQueries({ queryKey: ['admin-custom-orders'] });
      setDetail(null);
    } catch { toast.error('Update failed'); } finally { setSaving(false); }
  };

  return (
    <AdminShell>
      <div className="flex items-center gap-3 mb-5">
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="input-field w-44">
          {STATUSES.map(s => <option key={s} value={s}>{s ? s.replace('_',' ') : 'All Requests'}</option>)}
        </select>
        <div className="ml-auto text-[rgba(255,255,255,0.4)] text-sm">{pagination?.total || 0} requests</div>
      </div>

      <DataTable
        loading={isLoading}
        data={orders}
        rowKey={(o: any) => o._id}
        emptyMessage="No custom order requests."
        columns={[
          { key: 'customer', label: 'Customer', render: (o: any) => <div><div className="text-white">{o.user?.name || o.guestName}</div><div className="text-[11px] text-[rgba(255,255,255,0.4)]">{o.user?.email || o.guestEmail}</div></div> },
          { key: 'productType', label: 'Product', render: (o: any) => <span className="text-[rgba(255,255,255,0.8)]">{o.productType}</span> },
          { key: 'material', label: 'Material', render: (o: any) => <span className="text-[rgba(255,255,255,0.6)]">{o.material}</span> },
          { key: 'status', label: 'Status', render: (o: any) => <StatusBadge status={o.status} /> },
          { key: 'quotedPrice', label: 'Quote', render: (o: any) => o.quotedPrice ? <span className="font-cinzel text-[#D4AF37]">₹{o.quotedPrice.toLocaleString()}</span> : <span className="text-[rgba(255,255,255,0.3)]">—</span> },
          { key: 'createdAt', label: 'Date', render: (o: any) => <span className="text-[12px] text-[rgba(255,255,255,0.4)]">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span> },
          { key: 'actions', label: '', render: (o: any) => <button onClick={() => openDetail(o)} className="text-[11px] text-[#D4AF37] hover:text-[#F5E6A3]">Review ›</button> },
        ]}
      />
      {pagination && <Pagination page={page} pages={pagination.pages} onChange={setPage} />}

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Custom Order Review">
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              {[['Customer', detail.user?.name || detail.guestName], ['Email', detail.user?.email || detail.guestEmail], ['Phone', detail.guestPhone || detail.user?.phone || '—'], ['Product', detail.productType], ['Material', detail.material], ['Size', detail.size || '—'], ['Color', detail.color || '—'], ['Font', detail.fontStyle || '—']].map(([k,v]) => (
                <div key={k} className="bg-[#0D0D0D] p-3 border border-[rgba(212,175,55,0.08)]">
                  <div className="text-[10px] text-[rgba(212,175,55,0.6)] uppercase tracking-widest mb-0.5">{k}</div>
                  <div className="text-white">{v}</div>
                </div>
              ))}
            </div>
            {detail.textRequirement && <div className="bg-[#0D0D0D] p-3 border border-[rgba(212,175,55,0.08)]"><div className="text-[10px] text-[rgba(212,175,55,0.6)] uppercase tracking-widest mb-1">Text Requirement</div><div className="text-[rgba(255,255,255,0.7)] text-[13px]">{detail.textRequirement}</div></div>}
            {detail.additionalNotes && <div className="bg-[#0D0D0D] p-3 border border-[rgba(212,175,55,0.08)]"><div className="text-[10px] text-[rgba(212,175,55,0.6)] uppercase tracking-widest mb-1">Notes</div><div className="text-[rgba(255,255,255,0.7)] text-[13px]">{detail.additionalNotes}</div></div>}
            {detail.referenceImages?.length > 0 && (
              <div><div className="text-[10px] text-[rgba(212,175,55,0.6)] uppercase tracking-widest mb-2">Reference Images</div>
              <div className="flex gap-2">{detail.referenceImages.map((img: any, i: number) => <img key={i} src={getImageUrl(img.url)} alt="" className="w-20 h-20 object-cover border border-[rgba(212,175,55,0.2)]" />)}</div></div>
            )}
            <div className="pt-4 border-t border-[rgba(212,175,55,0.1)] space-y-3">
              <div className="font-cinzel text-[13px] text-white">Update Status</div>
              <select value={updateForm.status} onChange={e => setUpdateForm(f => ({...f, status: e.target.value}))} className="input-field">
                <option value="">Select status</option>
                {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
              </select>
              <input type="number" value={updateForm.quotedPrice} onChange={e => setUpdateForm(f => ({...f, quotedPrice: e.target.value}))} className="input-field" placeholder="Quoted price (₹)" />
              <textarea value={updateForm.quotationNote} onChange={e => setUpdateForm(f => ({...f, quotationNote: e.target.value}))} className="input-field resize-none h-16" placeholder="Quotation note / message to customer" />
              <div className="flex gap-3">
                <button onClick={onUpdate} disabled={saving || !updateForm.status} className="btn-luxury flex-1 disabled:opacity-60">{saving ? 'Saving...' : 'Update'}</button>
                <button onClick={() => setDetail(null)} className="btn-outline">Close</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}
