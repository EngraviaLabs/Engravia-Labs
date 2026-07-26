'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Pagination } from '../../components/UIPrimitives';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [approved, setApproved] = useState('');
  const [replyModal, setReplyModal] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', page, approved],
    queryFn: async () => (await api.get('/reviews/admin/all', { params: { page, limit: 20, approved: approved || undefined } })).data,
  });

  const reviews = data?.reviews || [];
  const pagination = data?.pagination;

  const approveReview = async (id: string) => {
    await api.patch(`/reviews/admin/${id}/approve`);
    qc.invalidateQueries({ queryKey: ['admin-reviews'] });
    toast.success('Review approved and published');
  };

  const sendReply = async () => {
    if (!replyText.trim()) return;
    await api.post(`/reviews/admin/${replyModal._id}/reply`, { text: replyText });
    qc.invalidateQueries({ queryKey: ['admin-reviews'] });
    toast.success('Reply sent');
    setReplyModal(null); setReplyText('');
  };

  return (
    <AdminShell>
      <div className="flex items-center gap-3 mb-5">
        <select value={approved} onChange={e => { setApproved(e.target.value); setPage(1); }} className="input-field w-44">
          <option value="">All Reviews</option>
          <option value="false">Pending Approval</option>
          <option value="true">Approved</option>
        </select>
        <div className="ml-auto text-[13px] text-[rgba(255,255,255,0.4)]">{pagination?.total || 0} reviews</div>
      </div>

      <DataTable
        loading={isLoading}
        data={reviews}
        rowKey={(r: any) => r._id}
        emptyMessage="No reviews found."
        columns={[
          { key: 'product', label: 'Product', render: (r: any) => <div className="text-white max-w-[160px] truncate">{r.product?.name}</div> },
          { key: 'user', label: 'Author', render: (r: any) => <div><div className="text-white">{r.user?.name}</div><div className="text-[11px] text-[rgba(255,255,255,0.4)]">{r.user?.email}</div></div> },
          { key: 'rating', label: 'Rating', render: (r: any) => <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s <= r.rating ? 'text-[#D4AF37]' : 'text-[rgba(255,255,255,0.15)]'}`}>★</span>)}</div> },
          { key: 'title', label: 'Title', render: (r: any) => <div className="max-w-[180px]"><div className="text-white text-[13px] truncate">{r.title}</div><div className="text-[11px] text-[rgba(255,255,255,0.4)] truncate">{r.body?.slice(0, 60)}...</div></div> },
          { key: 'status', label: 'Status', render: (r: any) => <span className={`text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 border ${r.isApproved ? 'text-green-400 border-green-400/30 bg-green-400/10' : 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'}`}>{r.isApproved ? 'Approved' : 'Pending'}</span> },
          {
            key: 'actions', label: '', render: (r: any) => (
              <div className="flex gap-3">
                {!r.isApproved && <button onClick={() => approveReview(r._id)} className="text-[11px] text-green-400 hover:text-green-300">Approve</button>}
                <button onClick={() => { setReplyModal(r); setReplyText(r.adminReply?.text || ''); }} className="text-[11px] text-[#D4AF37] hover:text-[#F5E6A3]">Reply</button>
              </div>
            ),
          },
        ]}
      />
      {pagination && <Pagination page={page} pages={pagination.pages} onChange={setPage} />}

      <Modal open={!!replyModal} onClose={() => setReplyModal(null)} title="Reply to Review" maxWidth="max-w-lg">
        {replyModal && (
          <div className="space-y-4">
            <div className="bg-[#0D0D0D] border border-[rgba(212,175,55,0.1)] p-4">
              <div className="text-[13px] font-semibold text-white">{replyModal.title}</div>
              <div className="text-[12px] text-[rgba(255,255,255,0.55)] mt-1">{replyModal.body}</div>
            </div>
            <div>
              <label className="label-field">Your Reply</label>
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} className="input-field resize-none h-24" placeholder="Write a professional reply..." />
            </div>
            <div className="flex gap-3">
              <button onClick={sendReply} className="btn-luxury flex-1">Send Reply</button>
              <button onClick={() => setReplyModal(null)} className="btn-outline">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}
