import { Metadata } from 'next';
import Navbar from '../../../../components/layout/Navbar';
import Footer from '../../../../components/layout/Footer';
import CartDrawer from '../../../../components/ui/CartDrawer';
import CollectionPageClient from './CollectionPageClient';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const name = params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${name} – ENGRAVIA LABS`,
    description: `Shop our premium ${name} collection. Handcrafted luxury stone engravings from Rajasthan.`,
    alternates: { canonical: `https://engravialabs.com/collection/${params.slug}` },
  };
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-20">
        <CollectionPageClient slug={params.slug} />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
