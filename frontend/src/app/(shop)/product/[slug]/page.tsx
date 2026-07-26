import { Metadata } from 'next';
import Navbar from '../../../../components/layout/Navbar';
import Footer from '../../../../components/layout/Footer';
import CartDrawer from '../../../../components/ui/CartDrawer';
import ProductPageClient from './ProductPageClient';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const { product } = await res.json();
    return {
      title: product.seo?.metaTitle || `${product.name} – ENGRAVIA LABS`,
      description: product.seo?.metaDescription || product.shortDescription || product.description?.slice(0,160),
      alternates: { canonical: `https://engravialabs.com/product/${params.slug}` },
      openGraph: {
        title: product.name, description: product.shortDescription,
        images: product.images?.[0] ? [{ url: product.images[0].url, alt: product.name }] : [],
      },
    };
  } catch {
    return { title: 'Product – ENGRAVIA LABS' };
  }
}

export default function ProductPage({ params }: Props) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-20">
        <ProductPageClient slug={params.slug} />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
