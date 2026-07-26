'use client';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import SectionHeader from '../ui/SectionHeader';

const fallback = [
  { name:'Rahul Mehra', location:'Mumbai', initials:'RM', rating:5, text:'The craftsmanship exceeded every expectation. Our family name plate has become the centrepiece of our entrance — guests always stop to admire it.' },
  { name:'Priya Kapoor', location:'Delhi', initials:'PK', rating:5, text:'I ordered a corporate signage for our office lobby. The quality is extraordinary — the gold engraving on black marble commands instant attention.' },
  { name:'Anand Sharma', location:'Bengaluru', initials:'AS', rating:5, text:'The memorial stone we received was crafted with such care and precision. It brought tears to our eyes. Truly a piece made with heart.' },
  { name:'Deepika Nair', location:'Kochi', initials:'DN', rating:5, text:'Quick turnaround, impeccable packaging, and the stone itself looks like it belongs in a palace. Absolutely stunning work.' },
];

export default function Testimonials() {
  const { data: testimonials=[] } = useQuery({ queryKey:['testimonials'], queryFn: async()=>{ try { const {data}=await api.get('/testimonials'); return data.testimonials; } catch { return []; } } });
  const items = testimonials.length ? testimonials : fallback;

  return (
    <section className="bg-[#0D0D0D] py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeader eyebrow="What Our Clients Say" title="Voices of Satisfaction" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((t: any,i: number)=>(
            <div key={i} className="bg-[#1A1A1A] rounded-xl border border-[rgba(212,175,55,0.12)] p-7 hover:border-[rgba(212,175,55,0.4)] transition-all duration-300 shadow-lg">
              <div className="font-cinzel text-4xl text-[rgba(212,175,55,0.25)] leading-none mb-4">"</div>
              <p className="text-[13px] text-[rgba(255,255,255,0.65)] leading-relaxed italic mb-6">{t.text}</p>
              <div className="flex items-center gap-3 pt-5 border-t border-[rgba(212,175,55,0.1)]">
                {t.avatar?.url ? (
                  <img src={t.avatar.url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B7320] flex items-center justify-center font-cinzel text-sm font-bold text-[#0D0D0D] flex-shrink-0">{(t.initials||t.name?.split(' ').map((n:string)=>n[0]).join('')).slice(0,2)}</div>
                )}
                <div className="flex-1">
                  <div className="font-cinzel text-[13px] font-semibold text-white">{t.name}</div>
                  <div className="text-[10px] text-[rgba(212,175,55,0.6)] tracking-widest uppercase">{t.location}</div>
                </div>
                <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><span key={s} className="text-[#D4AF37] text-[10px]">★</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
