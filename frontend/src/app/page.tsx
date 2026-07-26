import { Metadata } from 'next';
import HeroSection from '../components/home/HeroSection';
import FeaturesBar from '../components/home/FeaturesBar';
import CollectionsGrid from '../components/home/CollectionsGrid';
import ProductsSection from '../components/home/ProductsSection';
import LuxurySection from '../components/home/LuxurySection';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/ui/CartDrawer';

export const metadata: Metadata = {
  title: 'ENGRAVIA LABS – Luxury Black Marble Engravings | India',
  description: "India's premier luxury stone engraving studio. Bespoke black marble name plates, memorial stones, corporate signages, and custom engravings handcrafted in Rajasthan.",
  alternates: { canonical: 'https://engravialabs.com' },
};

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Engravia Labs',
  description: 'Luxury stone engraving studio in Rajasthan, India.',
  url: 'https://engravialabs.com',
  logo: 'https://engravialabs.com/logo.png',
  image: 'https://engravialabs.com/og-image.jpg',
  telephone: '+91-98765-43210',
  email: 'hello@engravialabs.com',
  address: { '@type': 'PostalAddress', addressRegion: 'Rajasthan', addressCountry: 'IN' },
  openingHours: 'Mo-Sa 09:00-18:00',
  priceRange: '₹₹₹',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '2400' },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesBar />
        <CollectionsGrid />
        <ProductsSection />
        <LuxurySection />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
