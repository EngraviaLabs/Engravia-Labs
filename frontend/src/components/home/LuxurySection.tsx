export default function LuxurySection() {
  const pillars = [
    { icon:'🔨', title:'Handcrafted', desc:'Each piece individually carved by master artisans with 15+ years of expertise.' },
    { icon:'💎', title:'Premium Materials', desc:'Sourced only from Rajasthan\'s finest quarries — Grade-A black marble.' },
    { icon:'🎨', title:'Custom Designed', desc:'Your vision, our craft. Every order is unique, bespoke, and yours alone.' },
    { icon:'∞', title:'Built To Last', desc:'Weather-sealed, UV-resistant finish. Designed to endure for generations.' },
  ];
  const steps = [
    { title:'Design Consultation', desc:'Share your vision — our design team crafts a digital proof within 24 hours.' },
    { title:'Stone Selection', desc:'We source the finest slab matched to your specifications and aesthetic.' },
    { title:'Expert Engraving', desc:'CNC-guided diamond-tip engraving, finished by hand for depth and texture.' },
    { title:'Delivery & Install', desc:'Premium packaging, insured shipping, and optional installation service.' },
  ];
  return (
    <section className="bg-[#111] border-y border-[rgba(212,175,55,0.08)] py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-20 items-start">
        {/* Pillars */}
        <div>
          <div className="text-[10px] sm:text-[11px] font-semibold tracking-[2px] sm:tracking-[5px] uppercase text-[#D4AF37] mb-4 flex items-center gap-2 sm:gap-3"><span className="block w-6 sm:w-10 h-px bg-[rgba(212,175,55,0.4)] shrink-0" />Our Promise</div>
          <h2 className="font-cinzel text-2xl xs:text-3xl lg:text-4xl font-bold text-white mb-8">The Engravia <span className="text-[#D4AF37]">Difference</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map(p=>(
              <div key={p.title} className="p-5 sm:p-6 border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.02)] hover:border-[rgba(212,175,55,0.35)] transition-colors">
                <div className="text-2xl mb-3">{p.icon}</div>
                <div className="font-cinzel text-[15px] font-semibold text-white mb-2">{p.title}</div>
                <div className="text-[12px] text-[rgba(255,255,255,0.5)] leading-relaxed">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Process */}
        <div>
          <div className="text-[10px] sm:text-[11px] font-semibold tracking-[2px] sm:tracking-[5px] uppercase text-[#D4AF37] mb-8 flex items-center gap-2 sm:gap-3"><span className="block w-6 sm:w-10 h-px bg-[rgba(212,175,55,0.4)] shrink-0" />Our Process</div>
          <div className="space-y-0">
            {steps.map((s,i)=>(
              <div key={s.title} className={`flex gap-5 py-6 ${i<steps.length-1?'border-b border-[rgba(212,175,55,0.08)]':''}`}>
                <div className="font-cinzel text-4xl font-black text-[rgba(212,175,55,0.12)] leading-none min-w-[52px]">0{i+1}</div>
                <div>
                  <div className="font-cinzel text-[15px] font-semibold text-[#D4AF37] mb-2">{s.title}</div>
                  <div className="text-[13px] text-[rgba(255,255,255,0.5)] leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
