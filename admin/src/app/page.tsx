'use client';
import { useQuery } from '@tanstack/react-query';
import AdminShell from '../components/AdminShell';
import { StatCard, StatusBadge } from '../components/UIPrimitives';
import api from '../lib/api';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const { data: overview, isLoading: ovLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => (await api.get('/admin/analytics/overview')).data.overview,
  });
  const { data: revenue = [] } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: async () => (await api.get('/admin/analytics/revenue', { params: { period: 'month' } })).data.data,
  });
  const { data: topProducts = [] } = useQuery({
    queryKey: ['admin-top-products'],
    queryFn: async () => (await api.get('/admin/analytics/top-products')).data.products,
  });
  const { data: recentOrders = [] } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => (await api.get('/orders/admin', { params: { limit: 6 } })).data.orders,
  });

  const chartData = revenue.map((d: any) => ({
    label: `${d._id.day || ''}/${d._id.month}`,
    revenue: d.revenue,
  }));

  return (
    <AdminShell>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Revenue" icon="💰" value={ovLoading ? '...' : `₹${(overview?.totalRevenue || 0).toLocaleString()}`} change={ovLoading ? undefined : `${overview?.revenueGrowth >= 0 ? '+' : ''}${overview?.revenueGrowth}% this month`} changeDir={overview?.revenueGrowth >= 0 ? 'up' : 'down'} />
        <StatCard label="Total Orders" icon="🛒" value={ovLoading ? '...' : overview?.totalOrders} change={ovLoading ? undefined : `${overview?.monthOrders} this month`} changeDir="up" />
        <StatCard label="Active Products" icon="📦" value={ovLoading ? '...' : overview?.totalProducts} />
        <StatCard label="Pending Orders" icon="⏳" value={ovLoading ? '...' : overview?.pendingOrders} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)]">
          <div className="px-5 py-4 border-b border-[rgba(212,175,55,0.08)] font-cinzel text-[14px] font-semibold text-white">Revenue Overview</div>
          <div className="p-4 h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.08)" />
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#0D0D0D', border: '1px solid rgba(212,175,55,0.3)', fontSize: 12 }} labelStyle={{ color: '#D4AF37' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[rgba(255,255,255,0.3)] text-sm">No revenue data yet</div>
            )}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)]">
          <div className="px-5 py-4 border-b border-[rgba(212,175,55,0.08)] font-cinzel text-[14px] font-semibold text-white">Top Products</div>
          <div className="p-3 space-y-1 max-h-64 overflow-y-auto">
            {topProducts.slice(0, 6).map((p: any, i: number) => (
              <div key={p._id} className="flex items-center gap-3 px-2 py-2.5 hover:bg-[rgba(212,175,55,0.03)] transition-colors">
                <span className="font-cinzel text-[#D4AF37]/40 text-sm w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-white truncate">{p.name}</div>
                  <div className="text-[10px] text-[rgba(255,255,255,0.4)]">{p.salesCount} sold</div>
                </div>
                <div className="text-[12px] font-cinzel text-[#D4AF37]">₹{(p.salePrice || p.price)?.toLocaleString()}</div>
              </div>
            ))}
            {topProducts.length === 0 && <div className="text-center py-8 text-[rgba(255,255,255,0.3)] text-sm">No sales yet</div>}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)]">
        <div className="px-5 py-4 border-b border-[rgba(212,175,55,0.08)] flex items-center justify-between">
          <div className="font-cinzel text-[14px] font-semibold text-white">Recent Orders</div>
          <Link href="/orders" className="text-[11px] text-[#D4AF37] tracking-wide uppercase hover:text-[#F5E6A3]">View All →</Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(212,175,55,0.06)]">
              {['Order', 'Customer', 'Amount', 'Status', ''].map(h => <th key={h} className="px-5 py-3 text-left text-[10px] font-bold tracking-wide uppercase text-[rgba(255,255,255,0.35)]">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o: any) => (
              <tr key={o._id} className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(212,175,55,0.02)]">
                <td className="px-5 py-3 font-cinzel text-[#D4AF37] text-[12px]">#{o.orderNumber}</td>
                <td className="px-5 py-3 text-[13px] text-white">{o.user?.name || o.guestEmail || 'Guest'}</td>
                <td className="px-5 py-3 font-cinzel text-[13px]">₹{o.total?.toLocaleString()}</td>
                <td className="px-5 py-3"><StatusBadge status={o.orderStatus} /></td>
                <td className="px-5 py-3"><Link href={`/orders/${o._id}`} className="text-[11px] text-[#D4AF37] hover:text-[#F5E6A3]">View ›</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
