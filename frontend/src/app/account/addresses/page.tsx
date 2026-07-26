'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updateUser } from '../../../store/slices/authSlice';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import toast from 'react-hot-toast';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];
const empty = { label:'Home', fullName:'', phone:'', line1:'', line2:'', city:'', state:'Rajasthan', pincode:'', country:'India', isDefault:false };

export default function AddressesPage() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) return null;

  const inp = 'w-full bg-[#111] border border-[rgba(212,175,55,0.2)] text-white px-4 py-3 text-[13px] outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[rgba(255,255,255,0.25)]';
  const lbl = 'block text-[10px] text-[rgba(255,255,255,0.4)] tracking-widest uppercase mb-1.5';

  const openAdd = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (addr: any) => {
    setEditing(addr);
    setForm({ label: addr.label, fullName: addr.fullName, phone: addr.phone, line1: addr.line1, line2: addr.line2 || '', city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country, isDefault: addr.isDefault });
    setShowForm(true);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      let res;
      if (editing) res = await api.put(`/auth/addresses/${editing._id}`, form);
      else res = await api.post('/auth/addresses', form);
      dispatch(updateUser({ addresses: res.data.addresses }));
      toast.success(editing ? 'Address updated' : 'Address added');
      setShowForm(false);
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Remove this address?')) return;
    const res = await api.delete(`/auth/addresses/${id}`);
    dispatch(updateUser({ addresses: res.data.addresses }));
    toast.success('Address removed');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-cinzel text-2xl font-bold text-white">My <span className="text-[#D4AF37]">Addresses</span></h1>
            {!showForm && <button onClick={openAdd} className="btn-luxury text-[11px] py-2.5 px-5">+ Add Address</button>}
          </div>

          {showForm && (
            <div className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.15)] p-7 mb-6">
              <div className="font-cinzel text-[15px] font-semibold text-white mb-5">{editing ? 'Edit Address' : 'New Address'}</div>
              <form onSubmit={onSave} className="grid md:grid-cols-2 gap-4">
                <div><label className={lbl}>Label</label>
                  <select value={form.label} onChange={e => setForm((f:any) => ({...f, label:e.target.value}))} className={inp}>
                    {['Home','Office','Other'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div><label className={lbl}>Full Name *</label><input value={form.fullName} onChange={e => setForm((f:any) => ({...f, fullName:e.target.value}))} className={inp} required /></div>
                <div><label className={lbl}>Phone *</label><input value={form.phone} onChange={e => setForm((f:any) => ({...f, phone:e.target.value}))} className={inp} required /></div>
                <div><label className={lbl}>Pincode *</label><input value={form.pincode} onChange={e => setForm((f:any) => ({...f, pincode:e.target.value}))} className={inp} required /></div>
                <div className="md:col-span-2"><label className={lbl}>Address Line 1 *</label><input value={form.line1} onChange={e => setForm((f:any) => ({...f, line1:e.target.value}))} className={inp} required placeholder="House / Building / Street" /></div>
                <div className="md:col-span-2"><label className={lbl}>Address Line 2</label><input value={form.line2} onChange={e => setForm((f:any) => ({...f, line2:e.target.value}))} className={inp} placeholder="Area / Locality (optional)" /></div>
                <div><label className={lbl}>City *</label><input value={form.city} onChange={e => setForm((f:any) => ({...f, city:e.target.value}))} className={inp} required /></div>
                <div><label className={lbl}>State *</label>
                  <select value={form.state} onChange={e => setForm((f:any) => ({...f, state:e.target.value}))} className={inp}>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.7)] cursor-pointer">
                    <input type="checkbox" checked={form.isDefault} onChange={e => setForm((f:any) => ({...f, isDefault:e.target.checked}))} className="accent-[#D4AF37]" />
                    Set as default address
                  </label>
                </div>
                <div className="md:col-span-2 flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-luxury disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update Address' : 'Save Address'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline-luxury">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {user.addresses?.length === 0 && !showForm ? (
            <div className="text-center py-20 bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)]">
              <div className="text-4xl mb-4">📍</div>
              <div className="font-cinzel text-xl text-white mb-2">No saved addresses</div>
              <p className="text-[rgba(255,255,255,0.4)] text-sm mb-6">Add an address for faster checkout</p>
              <button onClick={openAdd} className="btn-luxury">Add Address</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {user.addresses?.map((addr: any) => (
                <div key={addr._id} className={`bg-[#1A1A1A] border p-5 ${addr.isDefault ? 'border-[rgba(212,175,55,0.4)]' : 'border-[rgba(212,175,55,0.1)]'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-[#D4AF37] border border-[rgba(212,175,55,0.3)] px-2 py-0.5">{addr.label}</span>
                    {addr.isDefault && <span className="text-[10px] font-bold text-green-400 border border-green-400/30 px-2 py-0.5">Default</span>}
                  </div>
                  <div className="text-[13px] text-[rgba(255,255,255,0.8)] leading-relaxed">
                    <div className="font-semibold text-white">{addr.fullName}</div>
                    <div>{addr.phone}</div>
                    <div>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</div>
                    <div>{addr.city}, {addr.state} – {addr.pincode}</div>
                  </div>
                  <div className="flex gap-4 mt-4 pt-3 border-t border-[rgba(212,175,55,0.08)]">
                    <button onClick={() => openEdit(addr)} className="text-[11px] text-[#D4AF37] hover:text-[#F5E6A3]">Edit</button>
                    <button onClick={() => onDelete(addr._id)} className="text-[11px] text-red-400/70 hover:text-red-400">Remove</button>
                  </div>
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
