/**
 * SEEDER 07 — Blog Posts
 * Creates 10 published blog posts about stone engraving
 */
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  excerpt: String,
  content: String,
  featuredImage: Object,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  categories: [String],
  tags: [String],
  status: { type: String, default: 'draft' },
  publishedAt: Date,
  viewCount: { type: Number, default: 0 },
  seo: Object,
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

const seedBlogs = async (users) => {
  await Blog.deleteMany({});

  const adminUser = users.find(u => u.role === 'super_admin');

  const blogs = await Blog.insertMany([
    {
      title: 'The Timeless Art of Marble Engraving — From Ancient India to Modern Luxury',
      slug: 'timeless-art-of-marble-engraving-ancient-india-modern-luxury',
      excerpt: 'Discover the centuries-old techniques behind every Engravia Labs creation, from the ancient marble traditions of Rajasthan to the precision craftsmanship we practice today.',
      content: `Marble engraving is one of humanity's oldest and most enduring art forms. From the intricately carved temples of Rajasthan to the grand palaces of Mughal India, stone has always been the medium of choice for expressing permanence, beauty, and status.

At Engravia Labs, we are the custodians of this extraordinary tradition — combining centuries of artisanal knowledge with modern precision technology to create pieces that are truly worthy of the legacy they represent.

The Story of Rajasthan Marble

Rajasthan is the heartland of India's marble heritage. The region around Makrana — just 60 kilometres from our workshop — has produced marble of unparalleled quality for over 2,000 years. It is the same marble used to build the Taj Mahal, one of the world's most beautiful structures.

Makrana marble is unique in its crystalline structure and its ability to hold engraving with exceptional clarity. The deep black varieties, formed from high-carbon metamorphic rock, provide the perfect canvas for gold and silver inlay — creating a contrast that has captivated eyes for centuries.

The Modern Engraving Process

Today, our master artisans combine traditional hand skills with modern CNC technology:

1. Stone Selection — We personally inspect and select each slab from the quarry, choosing only the finest pieces with uniform colour, density, and crystalline structure.

2. Digital Design — Our design team creates a precise digital layout of your text, ensuring perfect spacing, proportions, and font clarity.

3. CNC Engraving — A diamond-tip CNC machine carves the design with micron-level precision, creating a clean, consistent groove.

4. Hand Finishing — Our master artisans then hand-work each groove, deepening and refining the engraving to add the dimensional quality that machines alone cannot achieve.

5. Gold or Silver Fill — The engraved grooves are filled with premium gold or silver paint, pressed in and sealed with a clear resin to prevent fading.

6. Surface Sealing — The entire piece is coated with a UV-resistant sealant that protects against weathering, moisture, and fading for decades.

The result is a piece that looks as magnificent in 50 years as it does on the day it is made.`,
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
        publicId: 'engravia-labs/blog/art-of-marble-engraving',
        alt: 'Master artisan engraving marble at Engravia Labs workshop',
      },
      author: adminUser._id,
      categories: ['Craftsmanship', 'Heritage'],
      tags: ['marble engraving', 'Rajasthan marble', 'stone art', 'craftsmanship', 'luxury', 'artisan'],
      status: 'published',
      publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      viewCount: 1240,
      seo: {
        metaTitle: 'The Art of Marble Engraving — Ancient India to Modern Luxury | ENGRAVIA LABS',
        metaDescription: 'Discover the centuries-old techniques of marble engraving from Rajasthan. How Engravia Labs combines ancient artisanal tradition with modern precision.',
        keywords: ['marble engraving India', 'Rajasthan marble art', 'stone engraving history', 'luxury stone craft'],
        canonicalUrl: 'https://engravialabs.com/blog/timeless-art-of-marble-engraving-ancient-india-modern-luxury',
      },
    },
    {
      title: 'How to Choose the Perfect Name Plate for Your Home',
      slug: 'how-to-choose-perfect-name-plate-home',
      excerpt: 'A complete guide to selecting the right size, material, font, and finish for your home name plate — so it complements your architecture and reflects your personal style.',
      content: `Your home's name plate is the first thing visitors see. It sets the tone, communicates your style, and makes a lasting first impression. Choosing the right one is more nuanced than it might seem.

This guide will walk you through every decision you need to make to get the perfect name plate for your home.

Step 1 — Choose the Right Size

The size of your name plate should be proportional to your wall and entrance.

For apartments and flats: A standard 12" × 6" plate is ideal. It is visible without being overwhelming.

For independent houses: An 18" × 8" or 24" × 10" plate works beautifully. The larger size commands attention without looking out of place.

For villas and bungalows: Consider our 30" × 12" or custom sizes. A grand entrance deserves a grand name plate.

Step 2 — Pick Your Material

Black Marble vs Black Granite:

Black marble is slightly softer, which allows for finer engraving detail. It has a warmer, more elegant appearance and is best for names, scripts, and detailed text.

Black granite is denser and more weather-resistant. It is the better choice for house number plates and anything that will be fully exposed to rain and sun.

Step 3 — Select Your Font

The font carries as much personality as the words themselves.

Classic Serif: Timeless, traditional, works with any home style. Our most popular choice.

Calligraphy: Elegant and ornate, perfect for family names. Adds a luxurious feel.

Modern Sans: Clean, contemporary, ideal for minimalist modern homes.

Roman: Grand and authoritative. Perfect for large villas and institutional buildings.

Step 4 — Choose Your Engraving Fill Colour

Gold: Warm, luxurious, the most popular choice. Works beautifully on black marble.

Silver: Cool, contemporary, and modern. Increasingly popular for minimalist homes.

White: Subtle and elegant. Creates a softer, more restrained look.

Step 5 — Plan Your Content

For a home name plate, consider including:
- Family surname (e.g. THE SHARMA FAMILY)
- Individual names (e.g. RAJESH & SUNITA)
- House name (e.g. SUNCREST)
- Established year (e.g. EST. 2019)

Keep it clean. Less is usually more. Two lines of text generally look better than three or four.

Still unsure? Contact our design team — we offer free consultation and will help you create the perfect piece for your home.`,
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
        publicId: 'engravia-labs/blog/choose-name-plate',
        alt: 'Different sizes and styles of marble name plates',
      },
      author: adminUser._id,
      categories: ['Buying Guide', 'Tips'],
      tags: ['name plate guide', 'choose name plate', 'home decor', 'marble name plate', 'size guide'],
      status: 'published',
      publishedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      viewCount: 2340,
      seo: {
        metaTitle: 'How to Choose the Perfect Name Plate for Your Home | ENGRAVIA LABS',
        metaDescription: 'Complete guide to choosing the right size, material, font, and finish for your home name plate.',
        keywords: ['choose name plate', 'name plate guide India', 'marble name plate size', 'home name plate tips'],
      },
    },
    {
      title: '10 Unique Stone Gift Ideas for Weddings, Anniversaries, and Housewarmings',
      slug: '10-unique-stone-gift-ideas-weddings-anniversaries-housewarmings',
      excerpt: 'Looking for a truly memorable gift? These 10 personalised stone gift ideas from Engravia Labs are guaranteed to leave a lasting impression on your loved ones.',
      content: `When you want to give a gift that will truly last — one that will be displayed, admired, and treasured for decades — nothing compares to a personalised stone engraving.

Here are 10 unique ideas for every occasion:

1. Couple Name Stone for Weddings
A black marble stone engraved with the couple's names and wedding date. Place it at the entrance of their new home or on the mantelpiece. It becomes an instant heirloom.

2. Anniversary Date Plaque
Celebrate a milestone anniversary with a marble plaque engraved with the wedding date, the number of years, and a short message. A deeply personal gift that grows more meaningful with time.

3. Newborn Birth Stone
Engrave the baby's name, date of birth, time, weight, and a short blessing on premium black marble. A keepsake the parents will treasure forever and the child will cherish as they grow up.

4. Housewarming Name Plate
The perfect practical-yet-luxurious housewarming gift. A personalised family name plate that they will display at their entrance for years to come.

5. Memorial Stone for Condolence
When words are not enough, a dignified memorial stone with the name of the departed and a meaningful quote offers a lasting tribute that the family will deeply appreciate.

6. Corporate Milestone Plaque
For a colleague's promotion, retirement, or work anniversary — a marble plaque engraved with their name, years of service, and the company logo is a prestigious and memorable gift.

7. Religious Scripture Stone
A sacred shloka, verse, or prayer engraved on black marble — perfect for Griha Pravesh ceremonies, temple inaugurations, or as a gift for devout family members.

8. Family Tree Wall Piece
A large marble plaque engraved with the family tree across two or three generations. An extraordinary gift for grandparents or parents on special occasions.

9. Motivational Quote for the Home Office
Engrave a favourite quote that inspires and motivates — perfect for an entrepreneur, leader, or ambitious friend. A daily reminder of what they stand for.

10. Business Launch Gift
When a friend or colleague launches a new business, a marble plaque with their company name and founding date is a powerful symbol of the new beginning — and a lasting reminder of your support.

All of these pieces can be customised, sized, and personalised through our website or via WhatsApp. Every piece is delivered in premium packaging, ready for gifting.`,
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
        publicId: 'engravia-labs/blog/gift-ideas-stone',
        alt: 'Collection of personalised stone gift ideas from Engravia Labs',
      },
      author: adminUser._id,
      categories: ['Gift Ideas', 'Inspiration'],
      tags: ['stone gift', 'marble gift', 'wedding gift', 'anniversary gift', 'personalised gift', 'unique gift India'],
      status: 'published',
      publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      viewCount: 3120,
      seo: {
        metaTitle: '10 Unique Stone Gift Ideas for Every Occasion | ENGRAVIA LABS',
        metaDescription: '10 personalised stone gift ideas for weddings, anniversaries, housewarmings, and more. Unique marble gifts that last a lifetime.',
        keywords: ['stone gift ideas', 'marble gift India', 'unique personalised gifts', 'wedding gift marble'],
      },
    },
    {
      title: 'How to Care for Your Marble Name Plate — A Complete Maintenance Guide',
      slug: 'how-to-care-marble-name-plate-maintenance-guide',
      excerpt: 'With simple care, your Engravia Labs marble piece will look as beautiful in 50 years as it does today. Here is everything you need to know about maintaining your stone engraving.',
      content: `Your marble name plate is built to last decades — but with a little simple care, it will remain as brilliant as the day it was installed.

Daily and Weekly Care

The good news: marble name plates require very little maintenance. Here is a simple routine:

Weekly: Wipe with a soft, dry cloth to remove dust. Do not use abrasive cloths or rough sponges.

Monthly: If needed, wipe with a barely damp cloth. Dry immediately with a soft cloth.

Never use: Acidic cleaners, bleach, vinegar, lemon juice, or any harsh chemical. These can damage the stone surface and etch the engraving.

Cleaning Products to Use

Safe options:
- Dry microfibre cloth (best for regular cleaning)
- Slightly damp soft cloth with plain water
- Mild pH-neutral stone cleaner (available at hardware stores)

Products to avoid:
- Bleach
- Acidic cleaners (anything with citrus or vinegar)
- Abrasive powders or pads
- Glass cleaners (they often contain ammonia)

Protecting the Engraving

All our pieces are factory-sealed with a UV-resistant clear coat. However, for outdoor installations:

Every 2 years: Apply a thin coat of marble sealer (available at hardware stores). This keeps the surface protected against moisture and UV rays.

If the gold fill looks dull: This is rare with our premium fill, but if it happens, a thin coat of clear nail varnish can restore the shine temporarily. Contact us for professional re-fill options.

Outdoor Installation Tips

If your name plate is outdoors:
- Mount it under a slight overhang if possible to reduce direct rain exposure
- Ensure the mounting screws are stainless steel (we include these)
- Check mounting screws annually and tighten if necessary
- Avoid mounting near metal surfaces that might rust and stain the stone

When to Contact Us

Contact our support team if:
- You notice the gold fill peeling or fading (rare — covered under warranty)
- You see cracks in the stone (shipping damage — contact us immediately)
- You want a professional re-polish service

Our lifetime craftsmanship guarantee covers manufacturing defects. For normal wear and care questions, our WhatsApp team is available 6 days a week.`,
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
        publicId: 'engravia-labs/blog/marble-care-guide',
        alt: 'Cleaning and maintaining a marble name plate',
      },
      author: adminUser._id,
      categories: ['Care & Maintenance', 'Tips'],
      tags: ['marble care', 'name plate maintenance', 'stone cleaning', 'marble maintenance guide'],
      status: 'published',
      publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      viewCount: 890,
      seo: {
        metaTitle: 'How to Care for Your Marble Name Plate | ENGRAVIA LABS',
        metaDescription: 'Complete care guide for marble and stone engravings. Keep your piece looking beautiful for decades.',
        keywords: ['marble name plate care', 'stone engraving maintenance', 'marble cleaning guide India'],
      },
    },
    {
      title: 'Black Marble vs Black Granite — Which Should You Choose?',
      slug: 'black-marble-vs-black-granite-which-to-choose',
      excerpt: 'Both black marble and black granite look stunning for name plates and signage — but they have important differences. Here is how to choose the right material for your specific needs.',
      content: `One of the most common questions we receive is: "Should I choose black marble or black granite for my name plate?"

Both are premium, beautiful materials — but they have meaningful differences that affect which is right for your specific application.

The Short Answer:
- Choose marble for: Family name plates, indoor displays, detailed text, luxury aesthetic
- Choose granite for: House number plates, outdoor signage, durability priority, number-heavy designs

Now the detailed explanation:

Black Marble — Characteristics

Formation: Marble is a metamorphic rock formed from limestone under heat and pressure. The distinctive veining is created by mineral impurities during formation.

Appearance: Black marble has a warmer, softer look. The surface has natural movement and character. Under polish, it achieves a deep, mirror-like shine.

Hardness: Marble is rated 3–4 on the Mohs hardness scale. It is softer than granite, which means it accepts finer, more detailed engraving.

Best for: Family names, scripts, Devanagari text, quotes, and designs with fine details. The softer surface allows our artisans to achieve extraordinary detail.

Maintenance: Marble is slightly more porous than granite. Outdoors, it benefits from an annual sealant coat. Indoors, it requires minimal care.

Black Granite — Characteristics

Formation: Granite is an igneous rock formed from cooled magma. It is denser and harder than marble.

Appearance: Black granite typically has a more uniform, slightly cooler-toned black. The surface is extremely dense and polishes to a very high sheen.

Hardness: Granite is rated 6–7 on the Mohs scale. It is significantly harder and more resistant to scratching, weathering, and moisture.

Best for: House number plates, outdoor business signs, anything exposed to direct weather. The superior durability makes it the practical choice for exposed outdoor applications.

Maintenance: Granite requires almost no maintenance. It can handle direct rain, temperature extremes, and general outdoor exposure without special treatment.

Our Recommendation

For your home entrance name plate (partially sheltered): Black marble is our recommendation. The aesthetics are warmer and more luxurious, and the fine engraving capability is superior.

For your house number plate (fully outdoors): Black granite is the better choice. The superior weather resistance ensures the numbers remain sharp and visible for decades.

For corporate lobbies: Either works beautifully — choose marble for a warmer feel, granite for a more contemporary, imposing look.

Still not sure? Share your project details via WhatsApp or our contact form and our design team will guide you to the perfect choice.`,
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
        publicId: 'engravia-labs/blog/marble-vs-granite',
        alt: 'Comparison of black marble and black granite name plates',
      },
      author: adminUser._id,
      categories: ['Buying Guide', 'Materials'],
      tags: ['marble vs granite', 'black marble', 'black granite', 'name plate material', 'stone comparison'],
      status: 'published',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      viewCount: 1560,
      seo: {
        metaTitle: 'Black Marble vs Black Granite — Which to Choose | ENGRAVIA LABS',
        metaDescription: 'Detailed comparison of black marble and black granite for name plates and signage. Which material is right for you?',
        keywords: ['marble vs granite name plate', 'black marble or granite', 'stone material comparison India'],
      },
    },
    {
      title: 'Behind the Scenes — A Day at the Engravia Labs Workshop',
      slug: 'behind-the-scenes-day-at-engravia-labs-workshop',
      excerpt: 'Step inside our Kishangarh workshop and follow a premium marble name plate from raw stone to finished masterpiece — a journey that takes 3 to 5 days and involves 15 skilled artisans.',
      content: `Few people get to see what happens between placing an order and receiving the finished piece at their door. Today, we are taking you inside the Engravia Labs workshop in Kishangarh, Rajasthan.

6:00 AM — The Workshop Opens

The stone yard is already busy at 6 AM. Our stone selection team is inspecting freshly arrived slabs from the Makrana quarry 60 kilometres away. Not every slab makes the cut — we reject approximately 30% of all incoming stone for variations in colour, density, or surface integrity.

7:00 AM — Order Preparation

Our production team reviews the day's orders. Each order file contains the client's text, chosen font, dimensions, and a digital design proof that has already been approved by the client. A production sheet is attached to each slab selected for the day's work.

8:00 AM — Stone Cutting

The selected slab enters our precision cutting room where it is cut to the exact ordered dimensions using a diamond-blade wet saw. Water is used continuously to keep the blade cool and prevent dust. The cut pieces are inspected for edge quality before moving to the next stage.

9:30 AM — Surface Preparation

Each cut piece is ground progressively through 5 grades of abrasive wheel — from rough to ultra-fine — until the surface achieves a perfect mirror polish. This process takes 45–60 minutes per piece and is done entirely by hand.

11:00 AM — CNC Engraving

The polished piece moves to our CNC engraving room. The digital design file is loaded, the stone is secured, and the diamond-tip engraving head begins its precise, controlled work. The machine cuts at a controlled depth of 3–5mm. The entire process takes 20–45 minutes depending on the complexity of the design.

12:30 PM — Hand Artisan Work

This is where human skill transforms a machine-engraved piece into art. Our senior artisans spend an additional 30–60 minutes on each piece — deepening corners, refining curves, and ensuring every character has the dimensional quality that machines cannot achieve alone.

2:00 PM — Gold or Silver Fill

The engraved grooves are carefully filled with premium gold or silver paint using fine brushes. The fill is pressed into the groove to eliminate air pockets, then allowed to cure. After curing, excess fill is carefully scraped from the surface, leaving only the filled engravings. This process requires exceptional precision and a steady hand.

3:30 PM — Final Surface Polish

The filled piece is given a final polish to restore the mirror surface that may have been disturbed during the fill process. The gold-filled engravings now gleam brilliantly against the polished black surface.

4:00 PM — Quality Inspection

Every piece goes through a rigorous 12-point quality check: text accuracy, engraving depth, fill consistency, surface polish quality, edge finish, and overall proportions. Pieces that do not pass are sent back for rework. Our rejection rate at this stage is approximately 8%.

4:30 PM — UV Sealing

Approved pieces receive a coat of our premium UV-resistant clear sealant, which is cured under UV light for 15 minutes. This sealant protects the stone and the fill against weathering for decades.

5:00 PM — Packaging

The finished piece is wrapped in soft tissue paper, then in a custom foam cut to shape, and placed in our branded outer box. Each box is labelled with the customer's order number and delivery address. Mounting hardware — stainless steel screws and anchors — are included in every package.

5:30 PM — Dispatch

Completed orders are handed to our courier partners for dispatch. Most orders placed before 2 PM are dispatched the same evening.

From raw stone to your door — every piece is a labour of love. That is the Engravia Labs promise.`,
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
        publicId: 'engravia-labs/blog/workshop-behind-scenes',
        alt: 'Engravia Labs workshop in Kishangarh, Rajasthan',
      },
      author: adminUser._id,
      categories: ['Behind the Scenes', 'Craftsmanship'],
      tags: ['workshop', 'how it is made', 'marble crafting', 'stone engraving process', 'Rajasthan artisan'],
      status: 'published',
      publishedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      viewCount: 2780,
      seo: {
        metaTitle: 'Inside the Engravia Labs Workshop | ENGRAVIA LABS',
        metaDescription: 'Follow a marble name plate from raw stone to finished masterpiece inside the Engravia Labs workshop in Rajasthan.',
        keywords: ['marble engraving workshop India', 'how marble name plate is made', 'stone engraving process'],
      },
    },
  ]);

  return blogs;
};

module.exports = seedBlogs;
