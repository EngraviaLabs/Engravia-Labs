import type { Metadata } from 'next';
import { Cinzel, Poppins } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400','600','700','900'], variable: '--font-cinzel', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-poppins', display: 'swap' });

export const metadata: Metadata = {
  title: 'Admin Console – ENGRAVIA LABS',
  description: 'Engravia Labs admin dashboard',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${poppins.variable}`}>
      <body className="bg-[#0D0D0D] text-white font-poppins antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
