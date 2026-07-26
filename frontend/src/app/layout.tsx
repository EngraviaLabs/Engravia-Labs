import type { Metadata } from 'next';
import { Cinzel, Poppins } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400','600','700','900'], variable: '--font-cinzel', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-poppins', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://engravialabs.com'),
  title: { default: 'ENGRAVIA LABS – Luxury Black Marble Engravings', template: '%s | ENGRAVIA LABS' },
  description: 'India\'s premier luxury stone engraving studio. Bespoke black marble name plates, memorial stones, corporate signages, and custom engravings handcrafted in Rajasthan.',
  keywords: ['black marble name plate', 'stone engraving', 'custom name plate', 'luxury engraving', 'memorial stone', 'house number plate India'],
  authors: [{ name: 'Engravia Labs' }],
  creator: 'Engravia Labs',
  openGraph: {
    type: 'website', locale: 'en_IN',
    url: 'https://engravialabs.com',
    siteName: 'ENGRAVIA LABS',
    title: 'ENGRAVIA LABS – Luxury Black Marble Engravings',
    description: 'Bespoke stone engravings handcrafted in Rajasthan. Black marble name plates, memorial stones, corporate signages.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ENGRAVIA LABS – Luxury Stone Engraving' }],
  },
  twitter: { card: 'summary_large_image', title: 'ENGRAVIA LABS', description: 'Luxury stone engraving studio', images: ['/og-image.jpg'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  verification: { google: 'your-google-verification-code' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0D0D0D" />
      </head>
      <body className="bg-black text-white font-poppins antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
