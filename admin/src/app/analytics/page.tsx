'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminShell from '../../components/AdminShell';
import { StatCard } from '../../components/UIPrimitives';
import api from '../../lib/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#D4AF37', '#F5E6A3', '#8B7320', '#5a4a14', '#f0d060'];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('month');

  const { data: overview } = useQuery({ queryKey: ['analytics-overview'], queryFn: async () => (await api.get('/admin/analytics/overview')).data.overview });
  const { data: revenue = [] } = useQuery({ queryKey: ['analytics-revenue', period], queryFn: async () => (await api.get('/admin/analytics/revenue', { params: { period } })).data.data });
  const { data: topProducts = [] } = useQuery({ queryKey: ['analytics-top-products'], queryFn: async () => (await api.get('/admin/analytics/top-products')).data.products });
  const { data: orderStats } = useQuery({ queryKey: ['analytics-order-stats'], queryFn: async () => (await api.get('/admin/analytics/order-stats')).data });

  const revenueChart = revenue.map((d: any) => ({ label: d._id.day ? `${d._id.day}/${d._id.month}` : `${d._id.month}/${d._id.year}`, revenue: d.revenue, orders: d.orders }));
  const orderStatusChart = orderStats?.orderStats?.map((s: any) => ({ name: s._id, value: s.count })) || [];
  const paymentChart = orderStats?.paymentStats?.map((s: any) => ({ name: s._id.toUpperCase(), revenue: s.revenue, count: s.count })) || [];

  const tooltipStyle = { contentStyle: { background: '#0D0D0D', border: '1px solid rgba(212,175,55,0.3)', fontSize: 12 }, labelStyle: { color: '#D4AF37' } };

  return (
    <AdminShell>
      <div className="flex items-center gap-3 mb-6">
        <div className="font-cinzel text-lg font-bold text-white">Analytics</div>
        <div className="ml-auto flex gap-2">
          {['week', 'month', 'year'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`text-[11px] font-bold uppercase tracking-wide px-4 py-2 border transition-all ${period === p ? 'bg-[#D4AF37] text-[#0D0D0D] border-[#D4AF37]' : 'border-[rgba(212,175,55,0.25)] text-[rgba(255,255,255,0.5)] hover:border-[#D4AF37]'}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="💰" label="Total Revenue" value={`₹${(overview?.totalRevenue || 0).toLocaleString()}`} change={`${overview?.revenueGrowth >= 0 ? '+' : ''}${overview?.revenueGrowth || 0}% vs last month`} changeDir={overview?.revenueGrowth >= 0 ? 'up' : 'down'} />
        <StatCard icon="🛒" label="This Month Orders" value={overview?.monthOrders || 0} change={`${overview?.totalOrders || 0} total`} changeDir="up" />
        <StatCard icon="📦" label="Active Products" value={overview?.totalProducts || 0} />
        <StatCard icon="👥" label="Total Customers" value={overview?.totalUsers || 0} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)]">
          <div className="px-5 py-4 border-b border-[rgba(212,175,55,0.08)] font-cinzel text-[13px] font-semibold text-white">Revenue & Orders</div>
          <div className="p-4 h-72">
            {revenueChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.06)" />
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.25)" fontSize={10} />
                  <YAxis yAxisId="left" stroke="rgba(255,255,255,0.25)" fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.25)" fontSize={10} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} dot={false} name="Revenue (₹)" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#F5E6A3" strokeWidth={1.5} dot={false} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-[rgba(255,255,255,0.2)] text-sm">No data for selected period</div>}
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)]">
          <div className="px-5 py-4 border-b border-[rgba(212,175,55,0.08)] font-cinzel text-[13px] font-semibold text-white">Order Status</div>
          <div className="p-4 h-72">
            {orderStatusChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={orderStatusChart} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" nameKey="name">
                    {orderStatusChart.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-[rgba(255,255,255,0.2)] text-sm">No orders yet</div>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)]">
          <div className="px-5 py-4 border-b border-[rgba(212,175,55,0.08)] font-cinzel text-[13px] font-semibold text-white">Revenue by Payment Method</div>
          <div className="p-4 h-56">
            {paymentChart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.06)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.25)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.25)" fontSize={10} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="revenue" fill="#D4AF37" name="Revenue (₹)" radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-[rgba(255,255,255,0.2)] text-sm">No data</div>}
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)]">
          <div className="px-5 py-4 border-b border-[rgba(212,175,55,0.08)] font-cinzel text-[13px] font-semibold text-white">Top 10 Products</div>
          <div className="divide-y divide-[rgba(255,255,255,0.04)] max-h-56 overflow-y-auto">
            {topProducts.slice(0, 10).map((p: any, i: number) => (
              <div key={p._id} className="flex items-center gap-3 px-5 py-2.5">
                <span className="font-cinzel text-[rgba(212,175,55,0.4)] text-sm w-5 flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0"><div className="text-[12px] text-white truncate">{p.name}</div></div>
                <div className="text-right flex-shrink-0"><div className="font-cinzel text-[#D4AF37] text-[12px]">{p.salesCount} sold</div><div className="text-[11px] text-[rgba(255,255,255,0.35)]">₹{(p.salePrice || p.price)?.toLocaleString()}</div></div>
              </div>
            ))}
            {topProducts.length === 0 && <div className="text-center py-8 text-[rgba(255,255,255,0.2)] text-sm">No sales data yet</div>}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
