interface Props { eyebrow: string; title: string; subtitle?: string; light?: boolean; align?: 'center'|'left'; }
export default function SectionHeader({ eyebrow, title, subtitle, light, align='center' }: Props) {
  return (
    <div className={`mb-14 ${align==='center'?'text-center':''}`}>
      <div className={`text-[11px] font-semibold tracking-[5px] uppercase text-[#D4AF37] mb-4 flex items-center gap-4 ${align==='center'?'justify-center':''}`}>
        <span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" />
        {eyebrow}
        {align==='center' && <span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" />}
      </div>
      <h2 className={`font-cinzel text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight tracking-wide ${light?'text-[#0D0D0D]':'text-white'}`}>{title}</h2>
      {subtitle && <p className={`mt-4 text-[15px] leading-relaxed max-w-xl ${align==='center'?'mx-auto':''} ${light?'text-[rgba(0,0,0,0.55)]':'text-[rgba(255,255,255,0.5)]'}`}>{subtitle}</p>}
    </div>
  );
}
