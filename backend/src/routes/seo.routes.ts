import { Router, Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import Blog from '../models/Blog';

const router = Router();

router.get('/sitemap.xml', async (_req: Request, res: Response) => {
  try {
    const base = process.env.FRONTEND_URL || 'https://engravialabs.com';
    const [products, categories, blogs] = await Promise.all([
      Product.find({ isActive: true }).select('slug updatedAt'),
      Category.find({ isVisible: true }).select('slug updatedAt'),
      Blog.find({ status: 'published' }).select('slug updatedAt'),
    ]);
    const staticPages = ['', '/about', '/contact', '/custom-order', '/blog', '/collection'];
    const urls: { loc: string; priority: string; changefreq: string; lastmod?: string }[] = [
      ...staticPages.map(p => ({ loc: `${base}${p}`, priority: p === '' ? '1.0' : '0.8', changefreq: 'weekly' })),
      ...categories.map(c => ({ loc: `${base}/collection/${c.slug}`, priority: '0.8', changefreq: 'weekly', lastmod: c.updatedAt.toISOString() })),
      ...products.map(p => ({ loc: `${base}/product/${p.slug}`, priority: '0.9', changefreq: 'weekly', lastmod: p.updatedAt.toISOString() })),
      ...blogs.map(b => ({ loc: `${base}/blog/${b.slug}`, priority: '0.7', changefreq: 'monthly', lastmod: b.updatedAt.toISOString() })),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n    <changefreq>${u.changefreq}</changefreq>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}\n  </url>`).join('\n')}\n</urlset>`;
    res.header('Content-Type', 'application/xml').send(xml);
  } catch (e) { res.status(500).send('Sitemap generation failed'); }
});

export default router;
