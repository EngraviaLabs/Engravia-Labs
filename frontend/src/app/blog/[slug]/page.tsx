import { Metadata } from 'next';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '../../../lib/utils';
import { notFound } from 'next/navigation';

type Props = { params: { slug: string } };

async function getBlog(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.blog;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlog(params.slug);
  if (!blog) return { title: 'Blog Post – ENGRAVIA LABS' };
  return {
    title: blog.seo?.metaTitle || `${blog.title} – ENGRAVIA LABS`,
    description: blog.seo?.metaDescription || blog.excerpt,
    alternates: { canonical: `https://engravialabs.com/blog/${params.slug}` },
    openGraph: {
      title: blog.title, description: blog.excerpt, type: 'article',
      images: blog.featuredImage?.url ? [{ url: blog.featuredImage.url }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0D0D0D] pt-32 pb-16 text-center">
          <div className="font-cinzel text-2xl text-white mb-4">Post not found</div>
          <Link href="/blog" className="btn-outline-luxury">Back to Journal</Link>
        </main>
        <Footer />
      </>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    image: blog.featuredImage?.url,
    datePublished: blog.publishedAt,
    author: { '@type': 'Person', name: blog.author?.name || 'Engravia Labs' },
    publisher: { '@type': 'Organization', name: 'Engravia Labs' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
        <article className="max-w-[800px] mx-auto px-6">
          <div className="flex items-center gap-2 text-[11px] text-[rgba(255,255,255,0.4)] mb-8 tracking-widest uppercase">
            <Link href="/" className="hover:text-[#D4AF37]">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#D4AF37]">Journal</Link>
          </div>

          <div className="text-[10px] text-[#D4AF37] tracking-widest uppercase mb-4">
            {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            {' · '}{blog.viewCount || 0} views
          </div>

          <h1 className="font-cinzel text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">{blog.title}</h1>

          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[rgba(212,175,55,0.1)]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B7320] flex items-center justify-center font-cinzel text-sm font-bold text-[#0D0D0D]">
              {blog.author?.name?.[0] || 'E'}
            </div>
            <div>
              <div className="text-[13px] font-semibold text-white">{blog.author?.name || 'Engravia Labs'}</div>
              <div className="text-[11px] text-[rgba(255,255,255,0.4)]">Author</div>
            </div>
          </div>

          {blog.featuredImage?.url && (
            <div className="relative aspect-video mb-10 bg-[#111] overflow-hidden">
              <Image src={getImageUrl(blog.featuredImage.url)} alt={blog.title} fill unoptimized className="object-cover" sizes="800px" priority />
            </div>
          )}

          <div className="prose prose-invert max-w-none text-[15px] text-[rgba(255,255,255,0.7)] leading-[1.9] whitespace-pre-line">
            {blog.content}
          </div>

          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-[rgba(212,175,55,0.1)]">
              {blog.tags.map((tag: string) => (
                <span key={tag} className="text-[11px] text-[rgba(212,175,55,0.7)] border border-[rgba(212,175,55,0.25)] px-3 py-1 tracking-wide uppercase">{tag}</span>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/blog" className="btn-outline-luxury">← Back to Journal</Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
