/**
 * SEEDER 09 — Reviews
 */
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: Number, title: String, body: String,
  images: Array,
  isVerifiedPurchase: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  helpfulVotes: Array,
  adminReply: Object,
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

const seedReviews = async (users, products, orders) => {
  await Review.deleteMany({});

  const [, rahul, priya, anand, deepika, vikram] = users;

  const p1 = products.find(p => p.slug === 'premium-black-marble-family-name-plate');
  const p2 = products.find(p => p.slug === 'obsidian-house-number-plate');
  const p3 = products.find(p => p.slug === 'corporate-black-granite-lobby-signage');
  const p4 = products.find(p => p.slug === 'memorial-stone-scripture');
  const p5 = products.find(p => p.slug === 'anniversary-couple-name-stone');
  const p6 = products.find(p => p.slug === 'ganesha-shloka-black-marble-plaque');
  const p7 = products.find(p => p.slug === 'corporate-achievement-award-plaque');
  const p8 = products.find(p => p.slug === 'motivational-quote-wall-plaque');

  const o1 = orders[0]; const o2 = orders[1]; const o3 = orders[2];
  const o4 = orders[3]; const o5 = orders[4]; const o6 = orders[5];

  const reviews = await Review.insertMany([
    {
      product: p1._id, user: rahul._id, order: o1._id,
      rating: 5, title: 'Absolutely stunning — worth every rupee',
      body: 'The craftsmanship exceeded every expectation. Our family name plate is the centrepiece of our entrance — every guest stops to admire it. The gold engraving on jet-black marble is breathtaking. Delivered on time, packaging impeccable. Will order again without hesitation.',
      isVerifiedPurchase: true, isApproved: true, isPublished: true,
      helpfulVotes: [priya._id, anand._id, deepika._id],
      adminReply: { text: 'Thank you so much, Rahul! We are thrilled that the name plate has become such a talking point at your home. Looking forward to crafting more pieces for you!', repliedAt: new Date(Date.now() - 40 * 86400000) },
      createdAt: new Date(Date.now() - 44 * 86400000),
    },
    {
      product: p3._id, user: priya._id, order: o2._id,
      rating: 5, title: 'Our office lobby has never looked more prestigious',
      body: 'Ordered corporate signage for our new office lobby. The quality is unlike anything I have seen — the gold engraving on black marble commands instant attention. Clients are always impressed the moment they walk in. The piece communicates prestige perfectly.',
      isVerifiedPurchase: true, isApproved: true, isPublished: true,
      helpfulVotes: [rahul._id, vikram._id],
      createdAt: new Date(Date.now() - 37 * 86400000),
    },
    {
      product: p4._id, user: anand._id, order: o3._id,
      rating: 5, title: 'A tribute made with heart and soul',
      body: 'The memorial stone for my father was crafted with extraordinary care and sensitivity. The engraving was flawless, the stone was beautiful, and the packaging was protective and respectful. It brought tears to our eyes. Truly a piece made with heart. Thank you Engravia Labs.',
      isVerifiedPurchase: true, isApproved: true, isPublished: true,
      helpfulVotes: [rahul._id, priya._id, deepika._id, vikram._id],
      adminReply: { text: 'Dear Anand, we are deeply honoured that you trusted us with such a meaningful piece. Your father\'s memorial will stand as a testament to his memory. Our heartfelt condolences to you and your family.', repliedAt: new Date(Date.now() - 28 * 86400000) },
      createdAt: new Date(Date.now() - 29 * 86400000),
    },
    {
      product: p2._id, user: deepika._id, order: o4._id,
      rating: 5, title: 'Palace-worthy quality, delivered on time',
      body: 'Ordered a house number plate for our new villa. Just 4 days from order to delivery — faster than expected. The packaging was impeccable with protective foam, and the stone looks like it belongs in a palace. The gold numbers gleam beautifully in sunlight. Highly recommend!',
      isVerifiedPurchase: true, isApproved: true, isPublished: true,
      helpfulVotes: [rahul._id, anand._id],
      createdAt: new Date(Date.now() - 24 * 86400000),
    },
    {
      product: p7._id, user: vikram._id, order: o5._id,
      rating: 5, title: 'Best corporate gifts we have ever given',
      body: 'We ordered 5 award plaques for our annual recognition ceremony. Every piece was identical in quality, beautifully engraved, and delivered on time. Our employees were genuinely thrilled — many said it was the best award they had ever received. Engravia Labs is our permanent go-to for corporate gifting.',
      isVerifiedPurchase: true, isApproved: true, isPublished: true,
      helpfulVotes: [priya._id, anand._id],
      createdAt: new Date(Date.now() - 19 * 86400000),
    },
    {
      product: p5._id, user: rahul._id, order: o6._id,
      rating: 5, title: 'Anniversary gift that made her cry happy tears',
      body: 'Gifted this to my wife on our 10th anniversary. The moment she opened the box she had tears in her eyes. The names and date are engraved so elegantly. It is now proudly displayed in our living room. The gift packaging itself was luxurious. Worth every paisa.',
      isVerifiedPurchase: true, isApproved: true, isPublished: true,
      helpfulVotes: [deepika._id, anand._id, priya._id],
      createdAt: new Date(Date.now() - 14 * 86400000),
    },
    {
      product: p6._id, user: anand._id, order: o6._id,
      rating: 5, title: 'The Ganesha shloka plaque is divine',
      body: 'Placed this at our home entrance. The Devanagari engraving is so precise and beautiful — every character is perfect. The gold fill glows warmly. Every visitor asks where we got it. It has become the most talked-about piece in our home.',
      isVerifiedPurchase: true, isApproved: true, isPublished: true,
      helpfulVotes: [rahul._id, vikram._id],
      createdAt: new Date(Date.now() - 13 * 86400000),
    },
    {
      product: p8._id, user: priya._id, order: o2._id,
      rating: 4, title: 'Beautiful quality, slightly delayed',
      body: 'The wall plaque quality is superb — the marble is genuinely premium and the engraving is sharp. Only giving 4 stars because delivery took 2 extra days. But the product itself is absolutely 5-star. Would order again.',
      isVerifiedPurchase: true, isApproved: true, isPublished: true,
      helpfulVotes: [],
      adminReply: { text: 'Hi Priya, thank you for your honest feedback! We sincerely apologise for the delay — we had an unexpectedly high volume of orders that week. We\'re working to improve our delivery timelines. Hope you love the plaque!', repliedAt: new Date(Date.now() - 9 * 86400000) },
      createdAt: new Date(Date.now() - 10 * 86400000),
    },
    {
      product: p1._id, user: vikram._id, order: o5._id,
      rating: 5, title: 'Engravia Labs is in a class of its own',
      body: 'I have ordered from 3 different stone engraving companies and Engravia Labs is simply in a different league. The stone quality, depth of engraving, finish, packaging, communication — everything is premium. This is the only place I will order from now on.',
      isVerifiedPurchase: true, isApproved: true, isPublished: true,
      helpfulVotes: [rahul._id, priya._id, anand._id, deepika._id],
      createdAt: new Date(Date.now() - 18 * 86400000),
    },
    {
      product: p2._id, user: anand._id, order: o3._id,
      rating: 5, title: 'Perfect for our apartment complex',
      body: 'Ordered 2 house number plates for our duplex. Both came out perfectly identical — same engraving depth, same colour, same finish. The granite is heavy and feels genuinely premium. Love the quality.',
      isVerifiedPurchase: true, isApproved: true, isPublished: true,
      helpfulVotes: [deepika._id],
      createdAt: new Date(Date.now() - 7 * 86400000),
    },
    {
      product: p3._id, user: vikram._id, order: o5._id,
      rating: 5, title: 'Made our new office look like a Fortune 500 company',
      body: 'The corporate signage transformed our office reception completely. Before it looked like any regular office. Now clients walk in and are genuinely impressed before they even meet us. The investment was absolutely worth it.',
      isVerifiedPurchase: true, isApproved: true, isPublished: true,
      helpfulVotes: [priya._id],
      createdAt: new Date(Date.now() - 5 * 86400000),
    },
    {
      product: p5._id, user: deepika._id, order: o4._id,
      rating: 5, title: 'Housewarming gift that stole the show',
      body: 'Bought this as a housewarming gift. She was completely blown away. The marble is heavy and premium, the gold engraving glows beautifully, and the gift box was so elegant. Everyone at the housewarming wanted to know where it came from. 10 out of 10.',
      isVerifiedPurchase: true, isApproved: true, isPublished: true,
      helpfulVotes: [rahul._id, anand._id],
      createdAt: new Date(Date.now() - 3 * 86400000),
    },
    {
      product: p1._id, user: priya._id, order: o2._id,
      rating: 5, title: 'Second order — even better than the first',
      body: 'This is my second name plate from Engravia Labs. They keep getting better. The consistency of quality across orders is what impresses me most. A truly reliable luxury brand.',
      isVerifiedPurchase: true, isApproved: false, isPublished: false,
      helpfulVotes: [],
      createdAt: new Date(Date.now() - 1 * 86400000),
    },
  ]);

  // Update product ratings
  const ratingMap = {};
  reviews.filter(r => r.isApproved).forEach(r => {
    const id = r.product.toString();
    if (!ratingMap[id]) ratingMap[id] = { total: 0, count: 0 };
    ratingMap[id].total += r.rating;
    ratingMap[id].count += 1;
  });

  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ rating: Number, numReviews: Number }));
  for (const [id, data] of Object.entries(ratingMap)) {
    await Product.findByIdAndUpdate(id, {
      rating: Math.round((data.total / data.count) * 10) / 10,
      numReviews: data.count,
    });
  }

  return reviews;
};

module.exports = seedReviews;
