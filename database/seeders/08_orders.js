/**
 * SEEDER 08 — Orders
 * Creates 20 sample orders across different statuses
 */
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail: String, guestName: String,
  items: Array,
  shippingAddress: Object,
  billingAddress: Object,
  sameAsBilling: { type: Boolean, default: true },
  subtotal: Number, discountAmount: { type: Number, default: 0 },
  couponCode: String, shippingCharge: Number,
  taxAmount: Number, taxRate: Number, total: Number,
  paymentMethod: String, paymentStatus: { type: String, default: 'pending' },
  paymentDetails: Object,
  orderStatus: { type: String, default: 'placed' },
  statusHistory: Array,
  trackingNumber: String, courierName: String, trackingUrl: String,
  estimatedDelivery: Date, deliveredAt: Date,
  notes: String, adminNotes: String, invoiceUrl: String,
  refundAmount: Number, refundReason: String, refundedAt: Date,
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

const makeOrder = (num, userId, items, address, payMethod, status, payStatus, daysAgo, tracking = null) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmount = 0;
  const shippingCharge = subtotal > 999 ? 0 : 99;
  const taxRate = 0.18;
  const taxAmount = Math.round((subtotal + shippingCharge) * taxRate);
  const total = subtotal + shippingCharge + taxAmount;
  const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

  const statusHistory = [{ status: 'placed', timestamp: new Date(createdAt.getTime()), note: 'Order placed successfully' }];
  if (['confirmed','processing','shipped','delivered'].includes(status)) statusHistory.push({ status: 'confirmed', timestamp: new Date(createdAt.getTime() + 2 * 60 * 60 * 1000), note: 'Payment confirmed' });
  if (['processing','shipped','delivered'].includes(status)) statusHistory.push({ status: 'processing', timestamp: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000), note: 'Crafting in progress' });
  if (['shipped','delivered'].includes(status)) statusHistory.push({ status: 'shipped', timestamp: new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000), note: tracking ? `Shipped via ${tracking.courier}` : 'Dispatched' });
  if (status === 'delivered') statusHistory.push({ status: 'delivered', timestamp: new Date(createdAt.getTime() + 6 * 24 * 60 * 60 * 1000), note: 'Delivered successfully' });

  return {
    orderNumber: `EL-${String(num).padStart(6, '0')}`,
    user: userId,
    items,
    shippingAddress: address,
    sameAsBilling: true,
    subtotal, discountAmount, shippingCharge, taxAmount, taxRate, total,
    paymentMethod: payMethod,
    paymentStatus: payStatus,
    paymentDetails: {
      razorpayOrderId: payMethod === 'razorpay' ? `order_${Math.random().toString(36).substr(2, 14)}` : undefined,
      razorpayPaymentId: payStatus === 'paid' && payMethod === 'razorpay' ? `pay_${Math.random().toString(36).substr(2, 14)}` : undefined,
      stripePaymentIntentId: payMethod === 'stripe' ? `pi_${Math.random().toString(36).substr(2, 24)}` : undefined,
      paidAt: payStatus === 'paid' ? new Date(createdAt.getTime() + 5 * 60 * 1000) : undefined,
    },
    orderStatus: status,
    statusHistory,
    trackingNumber: tracking?.number,
    courierName: tracking?.courier,
    trackingUrl: tracking?.url,
    estimatedDelivery: new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
    deliveredAt: status === 'delivered' ? new Date(createdAt.getTime() + 6 * 24 * 60 * 60 * 1000) : undefined,
    createdAt,
    updatedAt: new Date(createdAt.getTime() + (status === 'delivered' ? 6 : 1) * 24 * 60 * 60 * 1000),
  };
};

const seedOrders = async (users, products) => {
  await Order.deleteMany({});

  const [admin, rahul, priya, anand, deepika, vikram] = users;

  const productMap = {};
  products.forEach(p => { productMap[p.slug] = p; });

  const rahulAddr  = { fullName: 'Rahul Mehra', phone: '+91 98111 22333', line1: '45 Shivaji Nagar', line2: 'Near Central Mall', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', country: 'India' };
  const priyaAddr  = { fullName: 'Priya Kapoor', phone: '+91 87654 32100', line1: '12-B Vasant Vihar', city: 'New Delhi', state: 'Delhi', pincode: '110057', country: 'India' };
  const anandAddr  = { fullName: 'Anand Sharma', phone: '+91 76543 21098', line1: '78 Indiranagar, 100 Feet Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560038', country: 'India' };
  const deepikaAddr= { fullName: 'Deepika Nair', phone: '+91 65432 10987', line1: '23 Marine Drive', city: 'Kochi', state: 'Kerala', pincode: '682001', country: 'India' };
  const vikramAddr = { fullName: 'Vikram Singh', phone: '+91 54321 09876', line1: 'B-47 Sector 18', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301', country: 'India' };

  const p1 = productMap['premium-black-marble-family-name-plate'];
  const p2 = productMap['obsidian-house-number-plate'];
  const p3 = productMap['corporate-black-granite-lobby-signage'];
  const p4 = productMap['memorial-stone-scripture'];
  const p5 = productMap['anniversary-couple-name-stone'];
  const p6 = productMap['ganesha-shloka-black-marble-plaque'];
  const p7 = productMap['corporate-achievement-award-plaque'];
  const p8 = productMap['motivational-quote-wall-plaque'];

  const makeItem = (product, qty, customization = {}) => ({
    product: product._id,
    name: product.name,
    image: product.images?.[0]?.url || '',
    sku: product.sku,
    price: product.salePrice || product.price,
    quantity: qty,
    customization,
    subtotal: (product.salePrice || product.price) * qty,
  });

  const ordersData = [
    makeOrder(1001, rahul._id,  [makeItem(p1, 1, { text_engraving: 'THE MEHRA FAMILY', font_style: 'Classic Serif', size: '18" × 8"', engraving_color: 'Gold' })], rahulAddr,  'razorpay', 'delivered', 'paid', 45, { number: 'BD1234567890IN', courier: 'BlueDart', url: 'https://bluedart.com/tracking' }),
    makeOrder(1002, priya._id,  [makeItem(p3, 1, { text_engraving: 'KAPOOR ASSOCIATES LLP', font_style: 'Roman', size: '36" × 20"', engraving_color: 'Gold' })], priyaAddr,  'razorpay', 'delivered', 'paid', 38, { number: 'FE9876543210IN', courier: 'FedEx', url: 'https://fedex.com/tracking' }),
    makeOrder(1003, anand._id,  [makeItem(p4, 1, { text_engraving: 'RAMESH SHARMA | 1945–2023', font_style: 'Classic Serif', size: '18" × 12"', engraving_color: 'Silver' })], anandAddr,  'stripe',   'delivered', 'paid', 30, { number: 'DT5647382910IN', courier: 'DTDC', url: 'https://dtdc.com/tracking' }),
    makeOrder(1004, deepika._id,[makeItem(p2, 1, { text_engraving: '42', font_style: 'Bold Block', size: '10" × 8"', engraving_color: 'Gold' })], deepikaAddr,'razorpay', 'delivered', 'paid', 25, { number: 'EK1928374650IN', courier: 'Ecom Express', url: 'https://ecomexpress.in/tracking' }),
    makeOrder(1005, vikram._id, [makeItem(p7, 5, { text_engraving: 'NEXUS TECHNOLOGIES | EMPLOYEE OF THE YEAR', font_style: 'Classic Serif', size: '10" × 8"', engraving_color: 'Gold' })], vikramAddr, 'razorpay', 'delivered', 'paid', 20, { number: 'BD2039485761IN', courier: 'BlueDart', url: 'https://bluedart.com/tracking' }),
    makeOrder(1006, rahul._id,  [makeItem(p5, 1, { text_engraving: 'RAHUL & SUNITA | 14 FEB 2015', font_style: 'Calligraphy', size: '8" × 5"', engraving_color: 'Gold' }), makeItem(p6, 1, { scripture_choice: 'Ganesha Vandana (default)', size: '12" × 8"', engraving_color: 'Gold' })], rahulAddr,  'razorpay', 'delivered', 'paid', 15, { number: 'BD3948576102IN', courier: 'BlueDart', url: 'https://bluedart.com/tracking' }),
    makeOrder(1007, anand._id,  [makeItem(p8, 1, { quote_choice: 'Custom Quote (enter below)', custom_quote: 'Be the change you wish to see in the world', attribution: '— Mahatma Gandhi', size: '16" × 10"', engraving_color: 'Gold' })], anandAddr,  'cod',      'shipped',   'pending', 8, { number: 'DT6758493021IN', courier: 'DTDC', url: 'https://dtdc.com/tracking' }),
    makeOrder(1008, priya._id,  [makeItem(p1, 1, { text_engraving: 'THE KAPOOR RESIDENCE', font_style: 'Classic Serif', size: '24" × 10"', engraving_color: 'Silver' })], priyaAddr,  'stripe',   'processing','paid', 3),
    makeOrder(1009, vikram._id, [makeItem(p3, 1, { text_engraving: 'SINGH & ASSOCIATES', font_style: 'Roman', size: '30" × 16"', engraving_color: 'Gold' })], vikramAddr, 'razorpay', 'confirmed', 'paid', 1),
    makeOrder(1010, deepika._id,[makeItem(p5, 1, { text_engraving: 'RAVI & DEEPIKA | 22 NOV 2018', font_style: 'Calligraphy', size: '10" × 6"', engraving_color: 'Gold' })], deepikaAddr,'razorpay', 'placed',    'paid', 0),
    makeOrder(1011, rahul._id,  [makeItem(p2, 2, { text_engraving: '15', font_style: 'Bold Block', size: '8" × 6"', engraving_color: 'Gold' })], rahulAddr, 'cod', 'processing', 'pending', 5),
    makeOrder(1012, anand._id,  [makeItem(p6, 2, { scripture_choice: 'Gayatri Mantra', size: '16" × 12"', engraving_color: 'Gold' })], anandAddr, 'razorpay', 'shipped', 'paid', 10, { number: 'EK2847593610IN', courier: 'Ecom Express', url: 'https://ecomexpress.in/tracking' }),
    makeOrder(1013, vikram._id, [makeItem(p7, 10, { text_engraving: 'ANNUAL EXCELLENCE AWARD 2024', size: '10" × 8"', engraving_color: 'Gold' })], vikramAddr, 'stripe', 'delivered', 'paid', 60, { number: 'FE1029384756IN', courier: 'FedEx', url: 'https://fedex.com/tracking' }),
    makeOrder(1014, priya._id,  [makeItem(p8, 1, { quote_choice: '"Success is not final, failure is not fatal" — Churchill', size: '20" × 12"', engraving_color: 'Silver' })], priyaAddr, 'razorpay', 'placed', 'pending', 0),
    makeOrder(1015, deepika._id,[makeItem(p1, 1, { text_engraving: 'NAIR FAMILY', font_style: 'Calligraphy', size: '18" × 8"', engraving_color: 'Gold' }), makeItem(p2, 1, { text_engraving: '23', size: '10" × 8"', engraving_color: 'Gold' })], deepikaAddr, 'razorpay', 'delivered', 'paid', 55, { number: 'BD4857693021IN', courier: 'BlueDart', url: 'https://bluedart.com/tracking' }),
    makeOrder(1016, rahul._id,  [makeItem(p3, 1, { text_engraving: 'MEHRA ENTERPRISES | EST. 2008', size: '36" × 20"', engraving_color: 'Gold' })], rahulAddr, 'razorpay', 'processing', 'paid', 2),
    makeOrder(1017, anand._id,  [makeItem(p4, 1, { text_engraving: 'SAVITA SHARMA | 1960–2024', size: '18" × 12"', engraving_color: 'Silver' })], anandAddr, 'cod', 'confirmed', 'pending', 1),
    makeOrder(1018, vikram._id, [makeItem(p5, 1, { text_engraving: 'VIKRAM & ANJALI | 5 JAN 2016', size: '8" × 5"', engraving_color: 'Gold' })], vikramAddr, 'razorpay', 'cancelled', 'refunded', 40),
    makeOrder(1019, priya._id,  [makeItem(p6, 1, { scripture_choice: 'Durga Chalisa Opening', size: '20" × 14"', engraving_color: 'Gold' })], priyaAddr, 'stripe', 'delivered', 'paid', 70, { number: 'DT7869504132IN', courier: 'DTDC', url: 'https://dtdc.com/tracking' }),
    makeOrder(1020, deepika._id,[makeItem(p8, 1, { quote_choice: '"In the middle of difficulty lies opportunity" — Einstein', size: '16" × 10"', engraving_color: 'White' })], deepikaAddr, 'razorpay', 'shipped', 'paid', 6, { number: 'EK3958674021IN', courier: 'Ecom Express', url: 'https://ecomexpress.in/tracking' }),
  ];

  const orders = await Order.insertMany(ordersData);
  return orders;
};

module.exports = seedOrders;
