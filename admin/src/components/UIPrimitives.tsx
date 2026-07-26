interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  change?: string;
  changeDir?: 'up' | 'down';
}

export function StatCard({ label, value, icon, change, changeDir }: StatCardProps) {
  return (
    <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)] p-5 hover:border-[rgba(212,175,55,0.25)] transition-colors">
      <div className="flex items-center gap-2 text-[11px] text-[rgba(255,255,255,0.4)] uppercase tracking-wide mb-2">
        <span>{icon}</span>{label}
      </div>
      <div className="font-cinzel text-2xl font-bold text-white">{value}</div>
      {change && (
        <div className={`text-[11px] mt-1.5 ${changeDir === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {changeDir === 'up' ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  );
}

interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pages, onChange }: PaginationProps) {
  if (pages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className="w-9 h-9 text-[12px] border border-[rgba(212,175,55,0.2)] text-[rgba(255,255,255,0.5)] hover:border-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed">‹</button>
      {Array.from({ length: pages }).map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)} className={`w-9 h-9 text-[12px] font-semibold border transition-all ${page === i + 1 ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37]' : 'border-[rgba(212,175,55,0.2)] text-[rgba(255,255,255,0.5)] hover:border-[#D4AF37]'}`}>{i + 1}</button>
      ))}
      <button onClick={() => onChange(Math.min(pages, page + 1))} disabled={page === pages} className="w-9 h-9 text-[12px] border border-[rgba(212,175,55,0.2)] text-[rgba(255,255,255,0.5)] hover:border-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed">›</button>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    placed: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    confirmed: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    processing: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    shipped: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
    delivered: 'text-green-400 border-green-400/30 bg-green-400/10',
    cancelled: 'text-red-400 border-red-400/30 bg-red-400/10',
    pending: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    paid: 'text-green-400 border-green-400/30 bg-green-400/10',
    failed: 'text-red-400 border-red-400/30 bg-red-400/10',
    published: 'text-green-400 border-green-400/30 bg-green-400/10',
    draft: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
    reviewing: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    quoted: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    approved: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
    in_production: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    completed: 'text-green-400 border-green-400/30 bg-green-400/10',
    rejected: 'text-red-400 border-red-400/30 bg-red-400/10',
  };
  return <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 border ${colors[status] || 'text-white border-white/20'}`}>{status?.replace('_', ' ')}</span>;
}
