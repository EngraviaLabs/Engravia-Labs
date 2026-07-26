import { Metadata } from 'next';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Blog – ENGRAVIA LABS',
  description: 'Stories, craftsmanship insights, and design inspiration from the Engravia Labs studio in Rajasthan.',
  alternates: { canonical: 'https://engravialabs.com/blog' },
};

async function getBlogs(searchParams: { [key: string]: string | undefined }) {
  try {
    const params = new URLSearchParams();
    if (searchParams.page) params.set('page', searchParams.page);
    if (searchParams.search) params.set('search', searchParams.search);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs?${params}`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return { blogs: [], pagination: null };
  }
}

const fallbackPosts = [
  { _id: '1', slug: 'art-of-marble-engraving', title: 'The Timeless Art of Marble Engraving', excerpt: 'Discover the centuries-old techniques that go into every Engravia Labs creation, from quarry to finished masterpiece.', publishedAt: new Date().toISOString(), author: { name: 'Rajesh Sharma' } },
  { _id: '2', slug: 'choosing-the-right-name-plate', title: 'How to Choose the Right Name Plate for Your Home', excerpt: 'A guide to selecting materials, fonts, and finishes that reflect your home\'s character and your personal style.', publishedAt: new Date().toISOString(), author: { name: 'Priya Agarwal' } },
  { _id: '3', slug: 'caring-for-stone-engravings', title: 'Caring for Your Stone Engravings: A Complete Guide', excerpt: 'Simple maintenance tips to keep your marble and granite pieces looking pristine for generations.', publishedAt: new Date().toISOString(), author: { name: 'Amit Verma' } },
];

export default async function BlogPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const { blogs } = await getBlogs(searchParams);
  const posts = blogs?.length ? blogs : fallbackPosts;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <div className="text-[11px] text-[#D4AF37] tracking-[5px] uppercase mb-4 flex items-center justify-center gap-4">
              <span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" />
              Stories & Craft
              <span className="block w-10 h-px bg-[rgba(212,175,55,0.4)]" />
            </div>
            <h1 className="font-cinzel text-4xl font-bold text-white">The Engravia Journal</h1>
            <p className="text-[rgba(255,255,255,0.55)] max-w-lg mx-auto mt-4 text-[14px] leading-relaxed">
              Craftsmanship insights, design inspiration, and stories from our studio in Rajasthan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <Link key={post._id} href={`/blog/${post.slug}`} className="group bg-[#1A1A1A] border border-[rgba(212,175,55,0.1)] hover:border-[rgba(212,175,55,0.4)] transition-all overflow-hidden block">
                <div className="aspect-[16/10] bg-[#111] relative overflow-hidden">
                  {post.featuredImage?.url ? (
                    <Image src={post.featuredImage.url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="border border-[rgba(212,175,55,0.2)] w-16 h-16 flex items-center justify-center text-[#D4AF37] text-xl">✦</div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-[10px] text-[rgba(212,175,55,0.6)] tracking-widest uppercase mb-2">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                  <h2 className="font-cinzel text-[16px] font-semibold text-white mb-3 leading-snug group-hover:text-[#D4AF37] transition-colors">{post.title}</h2>
                  <p className="text-[13px] text-[rgba(255,255,255,0.5)] leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="text-[11px] text-[rgba(255,255,255,0.4)]">By {post.author?.name || 'Engravia Team'}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
