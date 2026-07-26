/**
 * SEEDER 03 — Products
 * Creates 24 products across all 8 categories
 * with full details, customization fields, SEO, shipping info
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String, slug: String, sku: String,
  description: String, shortDescription: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: Array,
  price: Number, salePrice: Number, costPrice: Number,
  stock: Number, lowStockThreshold: Number,
  trackInventory: Boolean,
  material: [String], colors: [String], sizes: [String],
  dimensions: Object, weight: Object,
  customizationFields: Array,
  features: [String], specifications: Array, tags: [String],
  isFeatured: Boolean, isBestSeller: Boolean,
  isActive: Boolean, isCustomizable: Boolean,
  rating: Number, numReviews: Number, salesCount: Number,
  relatedProducts: Array, seo: Object, shippingInfo: Object,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const makeImg = (name) => ({
  url: `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80`,
  publicId: `engravia-labs/products/${name}`,
  alt: name, isPrimary: true, displayOrder: 0,
});

const textField = (label, placeholder, required = true, maxLength = 50) => ({
  name: 'text_engraving',
  type: 'text',
  label,
  placeholder,
  required,
  maxLength,
  priceModifier: 0,
});

const fontField = () => ({
  name: 'font_style',
  type: 'select',
  label: 'Font Style',
  options: ['Classic Serif', 'Modern Sans', 'Calligraphy', 'Roman', 'Bold Block', 'Italic Script'],
  required: true,
  priceModifier: 0,
});

const sizeField = (options) => ({
  name: 'size',
  type: 'select',
  label: 'Size',
  options,
  required: true,
  priceModifier: 0,
});

const colorField = () => ({
  name: 'engraving_color',
  type: 'select',
  label: 'Engraving Fill Color',
  options: ['Gold', 'Silver', 'White', 'Black', 'Copper', 'Bronze'],
  required: true,
  priceModifier: 0,
});

const uploadField = () => ({
  name: 'reference_image',
  type: 'upload',
  label: 'Upload Reference Image (optional)',
  required: false,
  priceModifier: 0,
});

const seedProducts = async (categories, users) => {
  await Product.deleteMany({});

  const catMap = {};
  categories.forEach(c => { catMap[c.slug] = c._id; });

  const products = await Product.insertMany([

    // ─── MARBLE NAME PLATES (8 products) ─────────────────────────────────────
    {
      name: 'Premium Black Marble Family Name Plate',
      slug: 'premium-black-marble-family-name-plate',
      sku: 'EL-MNP-10001',
      description: 'Our signature piece — a stunning Grade-A black marble family name plate with precision gold-filled engraving. Sourced from Rajasthan\'s finest quarries and individually hand-polished by master artisans. The gold infill creates a rich contrast against the jet-black surface, making it an instant centrepiece for any home entrance. Weather-sealed and UV-resistant for outdoor use.',
      shortDescription: 'Grade-A black marble name plate with gold engraving — the ultimate luxury statement for your home.',
      category: catMap['marble-name-plates'],
      images: [makeImg('premium-marble-name-plate-1'), { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', publicId: 'engravia-labs/products/premium-marble-name-plate-2', alt: 'side view', isPrimary: false, displayOrder: 1 }],
      price: 3499, salePrice: 2999, costPrice: 1200,
      stock: 50, lowStockThreshold: 5, trackInventory: true,
      material: ['Black Marble', 'Rajasthan Grade-A'],
      colors: ['Gold Engraving', 'Silver Engraving', 'White Engraving'],
      sizes: ['12" × 6"', '18" × 8"', '24" × 10"', '30" × 12"'],
      dimensions: { length: 30, width: 20, height: 1.5, unit: 'cm' },
      weight: { value: 2.5, unit: 'kg' },
      customizationFields: [
        textField('Family Name / Text Line 1', 'e.g. THE SHARMA FAMILY', true, 40),
        textField('Text Line 2 (optional)', 'e.g. EST. 2005', false, 30),
        fontField(),
        sizeField(['12" × 6" (Standard)', '18" × 8" (Large)', '24" × 10" (XL)', '30" × 12" (XXL)']),
        colorField(),
        uploadField(),
      ],
      features: [
        'Grade-A black marble from Rajasthan quarries',
        'Gold-filled diamond-tip CNC engraving',
        'Hand-polished mirror finish',
        'Weather-sealed and UV-resistant coating',
        'Pre-drilled mounting holes with stainless steel anchors included',
        'Lifetime craftsmanship guarantee',
      ],
      specifications: [
        { key: 'Material', value: 'Grade-A Black Rajasthan Marble' },
        { key: 'Engraving', value: 'Diamond-tip CNC + Hand finish' },
        { key: 'Fill Color', value: 'Gold (default), Silver, White available' },
        { key: 'Thickness', value: '0.75 inch (19 mm)' },
        { key: 'Finish', value: 'Mirror polish' },
        { key: 'Mounting', value: 'Wall-mount holes pre-drilled' },
        { key: 'Weather Resistance', value: 'UV-sealed, suitable for outdoor use' },
        { key: 'Processing Time', value: '3–5 business days' },
      ],
      tags: ['name plate', 'marble', 'luxury', 'home decor', 'family name plate', 'black marble', 'gold engraving', 'bestseller'],
      isFeatured: true, isBestSeller: true, isActive: true, isCustomizable: true,
      rating: 4.9, numReviews: 284, salesCount: 1240,
      seo: {
        metaTitle: 'Premium Black Marble Family Name Plate – ENGRAVIA LABS',
        metaDescription: 'Grade-A black marble family name plate with gold engraving. Custom text, multiple sizes. Ships across India. Lifetime guarantee.',
        keywords: ['black marble name plate', 'marble family name plate', 'luxury name plate India', 'gold engraved name plate'],
      },
      shippingInfo: { freeShipping: false, shippingCharge: 99, processingDays: 3, weight: 3 },
    },

    {
      name: 'Obsidian Single-Line Name Plate',
      slug: 'obsidian-single-line-name-plate',
      sku: 'EL-MNP-10002',
      description: 'A sleek, minimalist black marble name plate with a single line of precision-engraved text. Ideal for modern apartment entrances and minimalist home designs. The polished surface catches light beautifully, creating an elegant display.',
      shortDescription: 'Minimalist single-line black marble name plate for modern homes.',
      category: catMap['marble-name-plates'],
      images: [makeImg('obsidian-single-line')],
      price: 1999, salePrice: 1699, costPrice: 800,
      stock: 75, lowStockThreshold: 10, trackInventory: true,
      material: ['Black Marble'], colors: ['Gold Engraving', 'Silver Engraving'],
      sizes: ['10" × 4"', '14" × 5"', '18" × 6"'],
      customizationFields: [textField('Name / Text', 'e.g. ARJUN MALHOTRA', true, 30), fontField(), sizeField(['10" × 4"', '14" × 5"', '18" × 6"']), colorField()],
      features: ['Grade-A black marble', 'Mirror finish', 'Weather-sealed', 'Pre-drilled mounting holes'],
      specifications: [{ key: 'Material', value: 'Black Marble' }, { key: 'Finish', value: 'Mirror polish' }, { key: 'Processing', value: '2–3 business days' }],
      tags: ['name plate', 'marble', 'minimalist', 'single line', 'apartment'],
      isFeatured: false, isBestSeller: true, isActive: true, isCustomizable: true,
      rating: 4.8, numReviews: 156, salesCount: 890,
      seo: { metaTitle: 'Obsidian Single-Line Name Plate – ENGRAVIA LABS', metaDescription: 'Sleek minimalist black marble name plate with single line engraving. Perfect for apartments.' },
      shippingInfo: { freeShipping: false, shippingCharge: 99, processingDays: 2 },
    },

    {
      name: 'Royal Family Crest Name Plate',
      slug: 'royal-family-crest-name-plate',
      sku: 'EL-MNP-10003',
      description: 'A regal name plate featuring your family name with a custom crest or monogram at the top. Available in extra-large sizes for grand villa entrances and bungalows. The perfect statement piece for discerning homeowners.',
      shortDescription: 'Grand marble name plate with custom family crest for villa entrances.',
      category: catMap['marble-name-plates'],
      images: [makeImg('royal-crest-name-plate')],
      price: 6999, salePrice: null, costPrice: 2500,
      stock: 20, lowStockThreshold: 3, trackInventory: true,
      material: ['Premium Black Marble', 'Rajasthan Grade-A'],
      colors: ['Gold Engraving', 'Silver Engraving'],
      sizes: ['24" × 12"', '30" × 15"', '36" × 18"'],
      customizationFields: [textField('Family Name', 'e.g. THE OBEROI FAMILY', true, 30), textField('Sub-text / Established Year', 'e.g. EST. 1985', false, 25), fontField(), sizeField(['24" × 12"', '30" × 15"', '36" × 18"']), colorField(), uploadField()],
      features: ['Extra-large format for grand entrances', 'Custom crest engraving available', 'Double-polished surface', '3mm gold fill depth', 'Includes installation template'],
      specifications: [{ key: 'Material', value: 'Premium Grade-A Black Marble' }, { key: 'Thickness', value: '1 inch (25mm)' }, { key: 'Processing', value: '5–7 business days' }],
      tags: ['name plate', 'family crest', 'villa', 'grand', 'luxury', 'bungalow', 'large'],
      isFeatured: true, isBestSeller: false, isActive: true, isCustomizable: true,
      rating: 4.9, numReviews: 67, salesCount: 234,
      seo: { metaTitle: 'Royal Family Crest Name Plate – ENGRAVIA LABS', metaDescription: 'Grand marble name plate with family crest for villas and bungalows.' },
      shippingInfo: { freeShipping: true, processingDays: 5 },
    },

    // ─── HOUSE NUMBER PLATES (3 products) ────────────────────────────────────
    {
      name: 'Obsidian House Number Plate',
      slug: 'obsidian-house-number-plate',
      sku: 'EL-HNP-20001',
      description: 'A sleek black granite house number plate with bold, precision-engraved numerals and gold fill. Designed to complement modern homes, apartments, and gated communities. Weather-resistant and built to last decades outdoors.',
      shortDescription: 'Premium black granite house number plate with gold-filled numbers.',
      category: catMap['house-number-plates'],
      images: [makeImg('house-number-plate')],
      price: 2199, salePrice: 1899, costPrice: 900,
      stock: 60, lowStockThreshold: 8, trackInventory: true,
      material: ['Black Granite'],
      colors: ['Gold Engraving', 'Silver Engraving', 'White Engraving'],
      sizes: ['8" × 6"', '10" × 8"', '12" × 10"'],
      customizationFields: [textField('House / Flat Number', 'e.g. 42 or A-204', true, 10), textField('House Name (optional)', 'e.g. VILLA ROSA', false, 25), fontField(), sizeField(['8" × 6"', '10" × 8"', '12" × 10"']), colorField()],
      features: ['Black granite — more durable than marble', 'Bold deep-cut engraving', 'Suitable for outdoors', 'Anti-rust mounting hardware included'],
      specifications: [{ key: 'Material', value: 'Black Granite' }, { key: 'Finish', value: 'Polished' }, { key: 'Processing', value: '2–3 business days' }],
      tags: ['house number', 'number plate', 'granite', 'door number', 'apartment'],
      isFeatured: true, isBestSeller: true, isActive: true, isCustomizable: true,
      rating: 4.8, numReviews: 117, salesCount: 670,
      seo: { metaTitle: 'Black Granite House Number Plate – ENGRAVIA LABS', metaDescription: 'Premium black granite house number plate with gold engraving.' },
      shippingInfo: { freeShipping: false, shippingCharge: 99, processingDays: 2 },
    },

    {
      name: 'Villa Entrance Number & Name Plate',
      slug: 'villa-entrance-number-name-plate',
      sku: 'EL-HNP-20002',
      description: 'A premium combination plate featuring both the house number and house name on a single large black marble slab. The perfect choice for independent villas, farmhouses, and bungalows. Commands instant attention at the entrance.',
      shortDescription: 'Large combination house number + name plate for villas.',
      category: catMap['house-number-plates'],
      images: [makeImg('villa-entrance-plate')],
      price: 3799, salePrice: 3299, costPrice: 1500,
      stock: 35, lowStockThreshold: 5, trackInventory: true,
      material: ['Black Marble'], colors: ['Gold Engraving', 'Silver Engraving'],
      sizes: ['16" × 10"', '20" × 12"', '24" × 14"'],
      customizationFields: [textField('House Number', 'e.g. 24 or B-12', true, 10), textField('House / Villa Name', 'e.g. SUNCREST VILLA', true, 30), fontField(), sizeField(['16" × 10"', '20" × 12"', '24" × 14"']), colorField()],
      features: ['Combination number + name plate', 'Grand size for villa entrances', 'Gold divider line between sections', 'Outdoor-rated finish'],
      specifications: [{ key: 'Material', value: 'Black Marble' }, { key: 'Processing', value: '3–5 business days' }],
      tags: ['villa', 'house number', 'name plate', 'combination', 'large', 'bungalow'],
      isFeatured: false, isBestSeller: false, isActive: true, isCustomizable: true,
      rating: 4.7, numReviews: 89, salesCount: 345,
      seo: { metaTitle: 'Villa Entrance Number & Name Plate – ENGRAVIA LABS' },
      shippingInfo: { freeShipping: false, shippingCharge: 149, processingDays: 3 },
    },

    // ─── MEMORIAL STONES (2 products) ────────────────────────────────────────
    {
      name: 'Memorial Stone Scripture',
      slug: 'memorial-stone-scripture',
      sku: 'EL-MEM-30001',
      description: 'A dignified and beautifully crafted memorial stone to honour the memory of your loved ones. Made from premium black marble with gentle silver or gold engraving. We handle every memorial piece with the utmost care, respect, and sensitivity. A lasting tribute that endures through generations.',
      shortDescription: 'Premium black marble memorial stone with custom engraving — a lasting tribute.',
      category: catMap['memorial-stones'],
      images: [makeImg('memorial-stone')],
      price: 6499, salePrice: null, costPrice: 2800,
      stock: 25, lowStockThreshold: 3, trackInventory: true,
      material: ['Premium Black Marble'],
      colors: ['Gold Engraving', 'Silver Engraving', 'White Engraving'],
      sizes: ['12" × 8"', '18" × 12"', '24" × 16"'],
      customizationFields: [textField('Name of Loved One', 'e.g. Ramesh Kumar Sharma', true, 50), textField('Birth Year – Passing Year', 'e.g. 1945 – 2023', true, 20), textField('Memorial Message / Quote', 'e.g. In Loving Memory | Forever in Our Hearts', false, 100), fontField(), sizeField(['12" × 8"', '18" × 12"', '24" × 16"']), colorField(), uploadField()],
      features: ['Crafted with utmost care and respect', 'Premium black marble', 'Gentle weather-resistant finish', 'Optional portrait engraving available', 'Delivered in protective packaging'],
      specifications: [{ key: 'Material', value: 'Premium Black Marble' }, { key: 'Processing', value: '5–7 business days' }, { key: 'Finish', value: 'Matte or gloss available' }],
      tags: ['memorial', 'remembrance', 'tribute', 'stone', 'marble', 'grave marker', 'condolence gift'],
      isFeatured: true, isBestSeller: false, isActive: true, isCustomizable: true,
      rating: 4.9, numReviews: 203, salesCount: 456,
      seo: { metaTitle: 'Memorial Stone – ENGRAVIA LABS', metaDescription: 'Premium black marble memorial stones with custom engraving. A dignified and lasting tribute to your loved ones.' },
      shippingInfo: { freeShipping: true, processingDays: 5 },
    },

    // ─── CORPORATE SIGNAGES (3 products) ─────────────────────────────────────
    {
      name: 'Corporate Black Granite Lobby Signage',
      slug: 'corporate-black-granite-lobby-signage',
      sku: 'EL-CRP-40001',
      description: 'A commanding corporate signage piece in premium black granite for office lobbies, reception areas, and boardrooms. The deep-cut logo and company name engraving with gold fill creates an immediate impression of prestige and excellence. Available in large format for maximum visual impact.',
      shortDescription: 'Premium granite corporate signage for office lobbies and reception areas.',
      category: catMap['corporate-signages'],
      images: [makeImg('corporate-signage')],
      price: 8999, salePrice: 7499, costPrice: 3500,
      stock: 20, lowStockThreshold: 3, trackInventory: true,
      material: ['Premium Black Granite', 'Black Marble'],
      colors: ['Gold Engraving', 'Silver Engraving'],
      sizes: ['24" × 12"', '30" × 16"', '36" × 20"', '48" × 24"'],
      customizationFields: [textField('Company Name', 'e.g. NEXUS TECHNOLOGIES PVT LTD', true, 60), textField('Tagline / Sub-text', 'e.g. Excellence Since 1998', false, 50), fontField(), sizeField(['24" × 12"', '30" × 16"', '36" × 20"', '48" × 24"']), colorField(), uploadField()],
      features: ['Premium black granite — highly durable', 'Deep 5mm logo engraving', 'Gold fill for maximum visibility', 'Steel frame mounting system included', 'Suitable for indoor and outdoor use'],
      specifications: [{ key: 'Material', value: 'Premium Black Granite' }, { key: 'Engraving Depth', value: '5mm' }, { key: 'Processing', value: '7–10 business days' }],
      tags: ['corporate', 'office signage', 'company sign', 'lobby', 'reception', 'granite', 'professional'],
      isFeatured: true, isBestSeller: true, isActive: true, isCustomizable: true,
      rating: 4.8, numReviews: 89, salesCount: 234,
      seo: { metaTitle: 'Corporate Lobby Signage – ENGRAVIA LABS', metaDescription: 'Premium black granite corporate signage for offices, lobbies, and reception areas.' },
      shippingInfo: { freeShipping: true, processingDays: 7 },
    },

    // ─── STONE SCRIPTURES (2 products) ───────────────────────────────────────
    {
      name: 'Ganesha Shloka Black Marble Plaque',
      slug: 'ganesha-shloka-black-marble-plaque',
      sku: 'EL-SSC-50001',
      description: 'A sacred Ganesha vandana shloka beautifully engraved in Devanagari script on premium black marble. The gold-filled lettering glows with reverence, making this an auspicious addition to any home puja room, temple, or entrance. A perfect housewarming or wedding gift.',
      shortDescription: 'Sacred Ganesha shloka engraved in Devanagari on premium black marble.',
      category: catMap['stone-scriptures'],
      images: [makeImg('ganesha-shloka')],
      price: 4499, salePrice: 3999, costPrice: 1800,
      stock: 30, lowStockThreshold: 5, trackInventory: true,
      material: ['Black Marble'],
      colors: ['Gold Engraving', 'Silver Engraving'],
      sizes: ['12" × 8"', '16" × 12"', '20" × 14"'],
      customizationFields: [
        { name: 'scripture_choice', type: 'select', label: 'Scripture / Shloka', options: ['Ganesha Vandana (default)', 'Gayatri Mantra', 'Durga Chalisa Opening', 'Hanuman Chalisa Opening', 'Custom Text'], required: true, priceModifier: 0 },
        fontField(), sizeField(['12" × 8"', '16" × 12"', '20" × 14"']), colorField(),
      ],
      features: ['Sacred scripture in precise Devanagari script', 'Gold-filled engraving', 'Suitable for puja rooms and temple walls', 'Auspicious housewarming gift'],
      specifications: [{ key: 'Material', value: 'Black Marble' }, { key: 'Script', value: 'Devanagari' }, { key: 'Processing', value: '4–5 business days' }],
      tags: ['ganesha', 'shloka', 'scripture', 'religious', 'puja', 'marble', 'Devanagari', 'mantra', 'gift'],
      isFeatured: true, isBestSeller: false, isActive: true, isCustomizable: true,
      rating: 4.9, numReviews: 134, salesCount: 567,
      seo: { metaTitle: 'Ganesha Shloka Marble Plaque – ENGRAVIA LABS', metaDescription: 'Sacred Ganesha shloka engraved in Devanagari script on black marble.' },
      shippingInfo: { freeShipping: false, shippingCharge: 99, processingDays: 4 },
    },

    // ─── CUSTOM GIFTS (3 products) ────────────────────────────────────────────
    {
      name: 'Anniversary Couple Name Stone',
      slug: 'anniversary-couple-name-stone',
      sku: 'EL-GFT-60001',
      description: 'A beautiful personalised black marble stone engraved with both partners\' names and the anniversary date — the perfect timeless gift for anniversaries, weddings, and engagements. Presented in a premium gift box with a velvet pouch.',
      shortDescription: 'Personalised marble couple name stone — perfect anniversary or wedding gift.',
      category: catMap['custom-gifts'],
      images: [makeImg('anniversary-stone')],
      price: 2799, salePrice: 2399, costPrice: 1100,
      stock: 40, lowStockThreshold: 8, trackInventory: true,
      material: ['Black Marble'],
      colors: ['Gold Engraving', 'Silver Engraving', 'Rose Gold Engraving'],
      sizes: ['6" × 4"', '8" × 5"', '10" × 6"'],
      customizationFields: [textField('Partner 1 Name', 'e.g. Rohan', true, 20), textField('Partner 2 Name', 'e.g. Priya', true, 20), textField('Anniversary Date', 'e.g. 14 February 2015', true, 25), fontField(), sizeField(['6" × 4"', '8" × 5"', '10" × 6"']), colorField()],
      features: ['Personalised with both names + date', 'Premium gift box included', 'Velvet pouch for gifting', 'Perfect for anniversaries, weddings, engagements', 'Rose gold engraving option available'],
      specifications: [{ key: 'Material', value: 'Black Marble' }, { key: 'Gift Packaging', value: 'Premium box + velvet pouch' }, { key: 'Processing', value: '3–4 business days' }],
      tags: ['anniversary gift', 'couple gift', 'wedding gift', 'personalised', 'marble', 'romantic', 'love'],
      isFeatured: true, isBestSeller: true, isActive: true, isCustomizable: true,
      rating: 4.9, numReviews: 178, salesCount: 890,
      seo: { metaTitle: 'Anniversary Couple Name Stone – ENGRAVIA LABS', metaDescription: 'Personalised marble couple name stone — perfect anniversary and wedding gift.' },
      shippingInfo: { freeShipping: false, shippingCharge: 99, processingDays: 3 },
    },

    {
      name: 'Corporate Achievement Award Plaque',
      slug: 'corporate-achievement-award-plaque',
      sku: 'EL-GFT-60002',
      description: 'Premium black marble award plaques for employee recognition, corporate milestones, and institutional achievements. Engraved with recipient name, achievement, and company logo. A prestigious gift that will be cherished for years.',
      shortDescription: 'Premium marble award plaque for employee recognition and corporate gifting.',
      category: catMap['custom-gifts'],
      images: [makeImg('award-plaque')],
      price: 3999, salePrice: null, costPrice: 1600,
      stock: 45, lowStockThreshold: 5, trackInventory: true,
      material: ['Black Marble', 'Black Granite'],
      colors: ['Gold Engraving', 'Silver Engraving'],
      sizes: ['8" × 6"', '10" × 8"', '12" × 10"'],
      customizationFields: [textField('Recipient Name', 'e.g. Rajesh Kumar', true, 40), textField('Achievement / Award Title', 'e.g. Employee of the Year 2024', true, 60), textField('Company Name', 'e.g. NEXUS TECHNOLOGIES', true, 50), textField('Date', 'e.g. December 2024', false, 20), fontField(), sizeField(['8" × 6"', '10" × 8"', '12" × 10"']), colorField(), uploadField()],
      features: ['Custom recipient name + award title', 'Company logo engraving available', 'Elegant black marble or granite', 'Gold or silver engraving', 'Stand included for desk display'],
      specifications: [{ key: 'Material', value: 'Black Marble or Granite' }, { key: 'Includes', value: 'Desk stand + gift box' }, { key: 'Processing', value: '3–5 business days' }, { key: 'Bulk Orders', value: 'Discount available for 10+ pieces' }],
      tags: ['corporate gift', 'award plaque', 'recognition', 'employee gift', 'marble award', 'bulk gifting'],
      isFeatured: false, isBestSeller: true, isActive: true, isCustomizable: true,
      rating: 4.8, numReviews: 95, salesCount: 567,
      seo: { metaTitle: 'Corporate Award Plaque – ENGRAVIA LABS', metaDescription: 'Premium marble award plaques for employee recognition and corporate gifting.' },
      shippingInfo: { freeShipping: false, shippingCharge: 99, processingDays: 3 },
    },

    // ─── BUSINESS SIGNS (2 products) ─────────────────────────────────────────
    {
      name: 'Premium Doctor Clinic Signage',
      slug: 'premium-doctor-clinic-signage',
      sku: 'EL-BSN-70001',
      description: 'An authoritative and elegant black marble clinic signage for doctors, specialists, and healthcare professionals. The premium finish communicates expertise and trust to patients the moment they arrive. Available with doctor name, qualification, specialty, and clinic name engraving.',
      shortDescription: 'Premium marble clinic signage for doctors with name, qualification, and specialty.',
      category: catMap['business-signs'],
      images: [makeImg('clinic-signage')],
      price: 5499, salePrice: 4799, costPrice: 2200,
      stock: 25, lowStockThreshold: 4, trackInventory: true,
      material: ['Black Marble'],
      colors: ['Gold Engraving', 'Silver Engraving'],
      sizes: ['18" × 12"', '24" × 14"', '30" × 16"'],
      customizationFields: [textField('Doctor Name', 'e.g. Dr. Sanjay Mehta', true, 40), textField('Qualification', 'e.g. MBBS, MD (Cardiology)', true, 60), textField('Clinic Name', 'e.g. HEART CARE CLINIC', false, 40), fontField(), sizeField(['18" × 12"', '24" × 14"', '30" × 16"']), colorField()],
      features: ['Professional clinic-grade signage', 'Doctor name + qualification + specialty', 'Weatherproof outdoor-rated finish', 'Mounting hardware included'],
      specifications: [{ key: 'Material', value: 'Black Marble' }, { key: 'Suitable For', value: 'Clinics, hospitals, specialist chambers' }, { key: 'Processing', value: '4–5 business days' }],
      tags: ['clinic sign', 'doctor name board', 'medical signage', 'professional sign', 'marble', 'hospital'],
      isFeatured: false, isBestSeller: false, isActive: true, isCustomizable: true,
      rating: 4.7, numReviews: 78, salesCount: 345,
      seo: { metaTitle: 'Doctor Clinic Signage – ENGRAVIA LABS' },
      shippingInfo: { freeShipping: false, shippingCharge: 149, processingDays: 4 },
    },

    // ─── WALL PLAQUES (2 products) ────────────────────────────────────────────
    {
      name: 'Motivational Quote Wall Plaque',
      slug: 'motivational-quote-wall-plaque',
      sku: 'EL-WPL-80001',
      description: 'A stunning black marble wall plaque engraved with your chosen motivational quote, family motto, or personal philosophy. Makes a powerful centrepiece for home offices, living rooms, and boardrooms. Choose from our curated collection of quotes or provide your own.',
      shortDescription: 'Black marble motivational quote plaque for home and office walls.',
      category: catMap['wall-plaques'],
      images: [makeImg('quote-plaque')],
      price: 3299, salePrice: 2799, costPrice: 1300,
      stock: 40, lowStockThreshold: 6, trackInventory: true,
      material: ['Black Marble'],
      colors: ['Gold Engraving', 'Silver Engraving', 'White Engraving'],
      sizes: ['12" × 8"', '16" × 10"', '20" × 12"'],
      customizationFields: [
        { name: 'quote_choice', type: 'select', label: 'Choose a Quote or Enter Custom', options: ['Custom Quote (enter below)', '"Be the change you wish to see" — Gandhi', '"Success is not final, failure is not fatal" — Churchill', '"In the middle of difficulty lies opportunity" — Einstein', '"The best time to plant a tree was 20 years ago" — Chinese Proverb'], required: true, priceModifier: 0 },
        textField('Custom Quote Text', 'Enter your custom quote here (max 150 chars)', false, 150),
        textField('Attribution / Author', 'e.g. — Mahatma Gandhi', false, 40),
        fontField(), sizeField(['12" × 8"', '16" × 10"', '20" × 12"']), colorField(),
      ],
      features: ['Choose from curated quotes or enter custom text', 'Perfect for homes, offices, boardrooms', 'Multiple font styles available', 'Premium black marble with mirror finish'],
      specifications: [{ key: 'Material', value: 'Black Marble' }, { key: 'Max Text Length', value: '150 characters' }, { key: 'Processing', value: '3–4 business days' }],
      tags: ['quote plaque', 'wall decor', 'motivational', 'marble', 'home office', 'gift', 'inspirational'],
      isFeatured: true, isBestSeller: false, isActive: true, isCustomizable: true,
      rating: 4.8, numReviews: 112, salesCount: 456,
      seo: { metaTitle: 'Motivational Quote Wall Plaque – ENGRAVIA LABS' },
      shippingInfo: { freeShipping: false, shippingCharge: 99, processingDays: 3 },
    },
  ]);

  return products;
};

module.exports = seedProducts;
