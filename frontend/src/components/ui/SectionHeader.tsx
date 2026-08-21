interface Props { eyebrow: string; title: string; subtitle?: string; light?: boolean; align?: 'center'|'left'; }
export default function SectionHeader({ eyebrow, title, subtitle, light, align='center' }: Props) {
  return (
    <div className={`mb-10 sm:mb-14 ${align==='center'?'text-center':''}`}>
      <div className={`text-[10px] sm:text-[11px] font-semibold tracking-[2px] sm:tracking-[5px] uppercase text-[#D4AF37] mb-3 sm:mb-4 flex items-center gap-2 sm:gap-4 ${align==='center'?'justify-center':''}`}>
        <span className="block w-6 sm:w-10 h-px bg-[rgba(212,175,55,0.4)] shrink-0" />
        <span className="text-center">{eyebrow}</span>
        {align==='center' && <span className="block w-6 sm:w-10 h-px bg-[rgba(212,175,55,0.4)] shrink-0" />}
      </div>
      <h2 className={`font-cinzel text-2xl xs:text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight tracking-wide ${light?'text-[#0D0D0D]':'text-white'}`}>{title}</h2>
      {subtitle && <p className={`mt-3 sm:mt-4 text-xs sm:text-[15px] leading-relaxed max-w-xl ${align==='center'?'mx-auto':''} ${light?'text-[rgba(0,0,0,0.55)]':'text-[rgba(255,255,255,0.5)]'}`}>{subtitle}</p>}
    </div>
  );
}
