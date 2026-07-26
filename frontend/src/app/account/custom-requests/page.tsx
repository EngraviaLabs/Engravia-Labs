'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../store/slices/authSlice';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Link from 'next/link';

const STATUS_COLORS: Record<string,string> = {
  pending:'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  reviewing:'text-blue-400 border-blue-400/30 bg-blue-400/10',
  quoted:'text-purple-400 border-purple-400/30 bg-purple-400/10',
  approved:'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  in_production:'text-orange-400 border-orange-400/30 bg-orange-400/10',
  completed:'text-green-400 border-green-400/30 bg-green-400/10',
  rejected:'text-red-400 border-red-400/30 bg-red-400/10',
};

export default function CustomRequestsPage() {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    api.get('/custom-orders/my').then(r => setRequests(r.data.orders)).finally(() => setLoading(false));
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <div className="font-cinzel text-2xl font-bold text-white">Custom <span className="text-[#D4AF37]">Requests</span></div>
            <Link href="/custom-order" className="btn-luxury text-[11px] py-2.5 px-5">New Request</Link>
          </div>
          {loading ? <div className="space-y-4">{[1,2].map(i=><div key={i} className="h-32 skeleton"/>)}</div>
          : requests.length === 0 ? (
            <div className="text-center py-20 bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)]">
              <div className="text-4xl mb-4">✦</div>
              <div className="font-cinzel text-xl text-white mb-3">No custom requests yet</div>
              <Link href="/custom-order" className="btn-luxury mt-4 inline-block">Create Custom Order</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req: any) => (
                <div key={req._id} className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] p-6 hover:border-[rgba(212,175,55,0.3)] transition-colors">
                  <div className="flex flex-wrap justify-between gap-3 mb-3">
                    <div>
                      <div className="font-cinzel text-white font-semibold">{req.productType}</div>
                      <div className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">{new Date(req.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 border self-start ${STATUS_COLORS[req.status]||'text-white border-white/20'}`}>{req.status.replace('_',' ')}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-[12px] text-[rgba(255,255,255,0.55)]">
                    <div><span className="text-[rgba(212,175,55,0.6)]">Material:</span> {req.material}</div>
                    {req.size && <div><span className="text-[rgba(212,175,55,0.6)]">Size:</span> {req.size}</div>}
                    {req.color && <div><span className="text-[rgba(212,175,55,0.6)]">Color:</span> {req.color}</div>}
                  </div>
                  {req.quotedPrice && <div className="mt-3 pt-3 border-t border-[rgba(212,175,55,0.08)] text-[13px]"><span className="text-[rgba(255,255,255,0.5)]">Quoted Price: </span><span className="font-cinzel text-[#D4AF37] font-bold">₹{req.quotedPrice.toLocaleString()}</span></div>}
                  {req.quotationNote && <div className="text-[12px] text-[rgba(255,255,255,0.5)] mt-2">{req.quotationNote}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
