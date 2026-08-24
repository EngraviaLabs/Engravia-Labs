/**
 * SEEDER 06 — Banners
 * Creates hero banners and announcement strip banners
 */
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  image: { url: String, publicId: String, alt: String },
  mobileImage: { url: String, publicId: String },
  ctaText: String,
  ctaLink: String,
  ctaSecondaryText: String,
  ctaSecondaryLink: String,
  placement: String,
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  startsAt: Date,
  endsAt: Date,
}, { timestamps: true });

const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

const seedBanners = async () => {
  await Banner.deleteMany({});

  const banners = await Banner.insertMany([
    {
      title: 'Craft your legacy in\nStone, Metal & Wood',
      subtitle: "India's Premier Stone Engraving Studio",
      description: 'Crafted in Stone & Metal. Designed to Endure.\nBespoke engravings created with precision, craftsmanship, and an uncompromising eye for detail.',
      image: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
        publicId: 'engravia-labs/banners/hero-main',
        alt: 'ENGRAVIA LABS — Black Marble Engravings',
      },
      ctaText: 'Shop Collection',
      ctaLink: '/collection',
      ctaSecondaryText: 'Custom Order',
      ctaSecondaryLink: '/custom-order',
      placement: 'hero',
      isActive: true,
      displayOrder: 1,
    },
    {
      title: 'Festive Season Special — 20% Off',
      subtitle: 'Use code WELCOME20 at checkout',
      description: 'Limited time offer on all marble name plates and house number plates.',
      image: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
        publicId: 'engravia-labs/banners/hero-festive',
        alt: 'Festive Season Sale — ENGRAVIA LABS',
      },
      ctaText: 'Shop Now',
      ctaLink: '/collection/marble-name-plates',
      ctaSecondaryText: 'View All Offers',
      ctaSecondaryLink: '/collection',
      placement: 'hero',
      isActive: false,
      displayOrder: 2,
    },
    {
      title: '🎁 Free Shipping on Orders Above ₹999 | Use Code: FREESHIP for Free Shipping on Any Order',
      subtitle: '',
      description: '',
      image: {
        url: '',
        publicId: 'engravia-labs/banners/strip-shipping',
      },
      ctaText: 'Shop Now',
      ctaLink: '/collection',
      placement: 'banner_strip',
      isActive: true,
      displayOrder: 1,
    },
    {
      title: '✦ Premium Quality ✦ Handcrafted in Rajasthan ✦ Ships Across India ✦ Lifetime Guarantee ✦',
      subtitle: '',
      description: '',
      image: {
        url: '',
        publicId: 'engravia-labs/banners/strip-features',
      },
      ctaText: '',
      ctaLink: '/about',
      placement: 'banner_strip',
      isActive: false,
      displayOrder: 2,
    },
  ]);

  return banners;
};

module.exports = seedBanners;
