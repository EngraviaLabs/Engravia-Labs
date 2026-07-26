'use client';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-2xl' }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-[#1A1A1A] flex items-center justify-between px-6 py-4 border-b border-[rgba(212,175,55,0.1)] z-10">
          <div className="font-cinzel text-[16px] font-semibold text-white">{title}</div>
          <button onClick={onClose} className="text-[rgba(255,255,255,0.5)] hover:text-white text-xl transition-colors">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
