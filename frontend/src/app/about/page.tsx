import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us – ENGRAVIA LABS',
  description: 'Learn the story of Engravia Labs — India\'s premier luxury stone engraving studio crafting heritage in Rajasthan since 2018.',
};

const stats = [{ n:'12,000+', l:'Happy Customers' },{ n:'98%', l:'Satisfaction Rate' },{ n:'7+', l:'Years of Excellence' },{ n:'4.9★', l:'Average Rating' }];
const team = [
  { name:'Aashish Kumar', role:'Founder & Master Artisan', initials:'AK', bio:'25+ years of stone craftsmanship. Trained under India\'s legendary marble sculptors.' },
  { name:'Nishu Kaushal', role:'Design Director', initials:'NK', bio:'IIT-D alumna. Bridges traditional engraving techniques with modern luxury aesthetics.' },
  { name:'Rohit Kumar', role:'Head of Production', initials:'RK', bio:'Oversees our 15-artisan workshop with precision and passion.' },
];

const showcaseImages = [
  { title: 'Our Workshop', subtitle: 'State-of-the-Art Studio', src: '/images/about/workshop.jpg' },
  { title: 'Raw Materials', subtitle: 'Granite, Marble, Metal & Wood', src: '/images/about/materials.jpg' },
  { title: 'Engraving Process', subtitle: 'Laser & Diamond Etching', src: '/images/about/process.jpg' },
  { title: 'Finished Products', subtitle: 'High-Relief 3D Sculptures', src: '/images/about/finished.jpg' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#0D0D0D]">
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:'repeating-linear-gradient(45deg,#D4AF37 0,#D4AF37 1px,transparent 1px,transparent 60px)'}} />
          <div className="relative max-w-3xl mx-auto">
            <div className="text-[11px] text-[#D4AF37] tracking-[5px] uppercase mb-4 flex items-center justify-center gap-4"><span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" />Our Story<span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" /></div>
            <h1 className="font-cinzel text-4xl lg:text-5xl font-bold text-white mb-6">Crafting Emotions<br /><span className="text-[#D4AF37]">In Stone & Metal</span></h1>
            <p className="text-[15px] text-[rgba(255,255,255,0.6)] leading-relaxed">Founded in 2018 in the heartland of stone heritage, Engravia Labs was born from a singular belief: that the most precious moments deserve to be etched in the most enduring materials on earth.</p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#D4AF37] py-12 px-6 shadow-lg">
          <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-0">
            {stats.map((s,i) => (
              <div key={s.l} className={`text-center py-4 ${i<3?'border-r border-[rgba(13,13,13,0.15)]':''}`}>
                <div className="font-cinzel text-3xl font-bold text-[#0D0D0D]">{s.n}</div>
                <div className="text-[11px] text-[rgba(13,13,13,0.65)] tracking-widest uppercase mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Studio Gallery */}
        <section className="py-20 px-6">
          <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[11px] text-[#D4AF37] tracking-[5px] uppercase mb-4 flex items-center gap-3"><span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" />Why Choose Us</div>
              <h2 className="font-cinzel text-3xl font-bold text-white mb-6">Where Luxury<br />Meets Legacy</h2>
              <div className="space-y-5">
                {[['Grade-A Materials','We source only the finest black marble, granite, brass, and hardwood from India\'s top quarries.'],['Master Artisans','Our team brings 200+ collective years of stone and laser engraving expertise.'],['Precision Technology','Laser & CNC diamond-tip engraving combined with traditional hand-finishing for unmatched depth.'],['Lifetime Guarantee','Every piece carries our promise — weather-resistant, UV-sealed, built for generations.']].map(([t,d]) => (
                  <div key={t} className="flex gap-4">
                    <span className="text-[#D4AF37] text-xs mt-1 flex-shrink-0">✦</span>
                    <div><div className="font-cinzel text-[14px] font-semibold text-white mb-1">{t}</div><div className="text-[13px] text-[rgba(255,255,255,0.55)] leading-relaxed">{d}</div></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Gallery Grid */}
            <div className="grid grid-cols-2 gap-4">
              {showcaseImages.map((item) => (
                <div key={item.title} className="group relative aspect-square rounded-xl overflow-hidden border border-[rgba(212,175,55,0.25)] shadow-lg hover:border-[#D4AF37] transition-all duration-300">
                  <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <div className="font-cinzel text-[13px] font-bold text-[#D4AF37]">{item.title}</div>
                    <div className="text-[10px] text-[rgba(255,255,255,0.6)] font-medium leading-tight">{item.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-6 bg-[#111]">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-14">
              <div className="text-[11px] text-[#D4AF37] tracking-[5px] uppercase mb-4 flex items-center justify-center gap-4"><span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" />The Craftspeople<span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" /></div>
              <h2 className="font-cinzel text-3xl font-bold text-white">Meet Our Team</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {team.map(m => (
                <div key={m.name} className="bg-[#1A1A1A] rounded-xl border border-[rgba(212,175,55,0.15)] p-7 text-center hover:border-[rgba(212,175,55,0.4)] transition-colors shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B7320] flex items-center justify-center font-cinzel text-xl font-bold text-[#0D0D0D] mx-auto mb-4 shadow-md">{m.initials}</div>
                  <div className="font-cinzel text-[15px] font-semibold text-white mb-1">{m.name}</div>
                  <div className="text-[11px] text-[#D4AF37] tracking-widest uppercase mb-3">{m.role}</div>
                  <div className="text-[12px] text-[rgba(255,255,255,0.55)] leading-relaxed">{m.bio}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
