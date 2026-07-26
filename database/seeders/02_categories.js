/**
 * SEEDER 02 — Categories
 * Creates all 8 product categories for the store
 */

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  description: String,
  image: { url: String, publicId: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  displayOrder: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
  productCount: { type: Number, default: 0 },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String,
  },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

const seedCategories = async () => {
  await Category.deleteMany({});

  const categories = await Category.insertMany([
    {
      name: 'Marble Name Plates',
      slug: 'marble-name-plates',
      description: 'Premium black marble name plates handcrafted for homes, villas, and residences. Each piece is individually carved with gold-filled engraving for a timeless luxury look.',
      image: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        publicId: 'engravia-labs/categories/marble-name-plates',
      },
      displayOrder: 1,
      isVisible: true,
      productCount: 8,
      seo: {
        metaTitle: 'Black Marble Name Plates – ENGRAVIA LABS',
        metaDescription: 'Premium handcrafted black marble name plates with gold engraving. Custom designs for homes, villas, and residences. Ships across India.',
        keywords: ['black marble name plate', 'marble name plate India', 'luxury name plate', 'gold engraved name plate'],
      },
    },
    {
      name: 'House Number Plates',
      slug: 'house-number-plates',
      description: 'Elegant black granite house number plates with precision-engraved numbers and gold infill. Perfect for modern homes and gated communities.',
      image: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        publicId: 'engravia-labs/categories/house-number-plates',
      },
      displayOrder: 2,
      isVisible: true,
      productCount: 6,
      seo: {
        metaTitle: 'House Number Plates – ENGRAVIA LABS',
        metaDescription: 'Premium black granite house number plates with gold engraving. Custom number plates for homes and apartments.',
        keywords: ['house number plate', 'door number plate', 'marble number plate', 'home number plate India'],
      },
    },
    {
      name: 'Memorial Stones',
      slug: 'memorial-stones',
      description: 'Dignified and beautifully crafted memorial stones to honour the memory of your loved ones. Each piece is made with the utmost care and respect.',
      image: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        publicId: 'engravia-labs/categories/memorial-stones',
      },
      displayOrder: 3,
      isVisible: true,
      productCount: 4,
      seo: {
        metaTitle: 'Memorial Stones – ENGRAVIA LABS',
        metaDescription: 'Dignified black marble memorial stones with custom engraving. Honour your loved ones with a lasting tribute.',
        keywords: ['memorial stone', 'grave stone India', 'memorial plaque', 'remembrance stone'],
      },
    },
    {
      name: 'Corporate Signages',
      slug: 'corporate-signages',
      description: 'Commanding corporate signage in premium black marble and granite. Make a powerful first impression in your office lobby, reception, and boardroom.',
      image: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        publicId: 'engravia-labs/categories/corporate-signages',
      },
      displayOrder: 4,
      isVisible: true,
      productCount: 5,
      seo: {
        metaTitle: 'Corporate Signages – ENGRAVIA LABS',
        metaDescription: 'Premium marble and granite corporate signage for offices, lobbies, and boardrooms. Custom company logos and text engraving.',
        keywords: ['corporate signage India', 'office name board', 'marble company sign', 'reception signage'],
      },
    },
    {
      name: 'Stone Scriptures',
      slug: 'stone-scriptures',
      description: 'Sacred quotes, shlokas, prayers, and motivational verses beautifully engraved on premium black marble. Perfect for homes, temples, and meditation rooms.',
      image: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        publicId: 'engravia-labs/categories/stone-scriptures',
      },
      displayOrder: 5,
      isVisible: true,
      productCount: 4,
      seo: {
        metaTitle: 'Stone Scriptures & Quotes – ENGRAVIA LABS',
        metaDescription: 'Sacred scriptures, shlokas, and motivational quotes engraved on premium black marble. Custom religious and inspirational stone engravings.',
        keywords: ['stone scripture', 'marble shloka', 'engraved quotes stone', 'religious stone plaque India'],
      },
    },
    {
      name: 'Custom Gifts',
      slug: 'custom-gifts',
      description: 'Unique personalised stone gifts for weddings, anniversaries, housewarming, corporate gifting, and special occasions. Each gift is one of a kind.',
      image: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        publicId: 'engravia-labs/categories/custom-gifts',
      },
      displayOrder: 6,
      isVisible: true,
      productCount: 6,
      seo: {
        metaTitle: 'Custom Stone Gifts – ENGRAVIA LABS',
        metaDescription: 'Unique personalised marble and stone gifts for weddings, anniversaries, and corporate gifting. Premium custom gifts that last a lifetime.',
        keywords: ['custom stone gift India', 'marble gift', 'personalised stone gift', 'corporate gift stone'],
      },
    },
    {
      name: 'Business Signs',
      slug: 'business-signs',
      description: 'Premium stone business signs for shops, restaurants, clinics, and retail establishments. Durable, weather-resistant, and strikingly beautiful.',
      image: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        publicId: 'engravia-labs/categories/business-signs',
      },
      displayOrder: 7,
      isVisible: true,
      productCount: 5,
      seo: {
        metaTitle: 'Business Signs – ENGRAVIA LABS',
        metaDescription: 'Premium marble and granite business signs for shops, clinics, restaurants, and retail stores. Custom outdoor and indoor signage.',
        keywords: ['business sign India', 'shop name board stone', 'marble business sign', 'outdoor stone sign'],
      },
    },
    {
      name: 'Wall Plaques',
      slug: 'wall-plaques',
      description: 'Decorative and commemorative wall plaques in premium stone for homes, institutions, and public spaces. Custom sizes and designs available.',
      image: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        publicId: 'engravia-labs/categories/wall-plaques',
      },
      displayOrder: 8,
      isVisible: true,
      productCount: 4,
      seo: {
        metaTitle: 'Stone Wall Plaques – ENGRAVIA LABS',
        metaDescription: 'Decorative and commemorative stone wall plaques for homes, offices, and institutions. Custom designs and sizes.',
        keywords: ['stone wall plaque India', 'marble wall plaque', 'commemorative plaque stone', 'decorative stone plaque'],
      },
    },
  ]);

  return categories;
};

module.exports = seedCategories;
