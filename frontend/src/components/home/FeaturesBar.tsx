export default function FeaturesBar() {
  const features = [
    { icon:'🏆', title:'Premium Quality', sub:'Grade-A marble & granite' },
    { icon:'✏️', title:'Personalized Design', sub:'Every piece is unique' },
    { icon:'🔒', title:'Secure Payments', sub:'Razorpay & Stripe' },
    { icon:'🌍', title:'Worldwide Shipping', sub:'Insured delivery' },
  ];
  return (
    <div className="bg-[#D4AF37] py-6 px-6 shadow-md">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f,i) => (
          <div key={f.title} className={`flex items-center gap-4 py-2 px-4 ${i<features.length-1?'lg:border-r border-[rgba(13,13,13,0.2)]':''}`}>
            <span className="text-3xl filter drop-shadow">{f.icon}</span>
            <div>
              <div className="font-poppins text-[15px] font-extrabold text-[#0D0D0D] tracking-wider uppercase leading-snug">{f.title}</div>
              <div className="text-[13px] font-medium text-[rgba(13,13,13,0.8)] mt-0.5">{f.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
