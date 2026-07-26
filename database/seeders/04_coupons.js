/**
 * SEEDER 04 — Coupons
 * Creates 6 discount coupons
 */
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  description: String,
  type: String,
  value: Number,
  minOrderAmount: Number,
  maxDiscount: Number,
  usageLimit: Number,
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  startsAt: Date,
  expiresAt: Date,
  usedBy: Array,
}, { timestamps: true });

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

const seedCoupons = async () => {
  await Coupon.deleteMany({});

  const now = new Date();
  const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

  const coupons = await Coupon.insertMany([
    {
      code: 'WELCOME20',
      description: 'Welcome discount — 20% off for new customers',
      type: 'percentage',
      value: 20,
      minOrderAmount: 999,
      maxDiscount: 1000,
      usageLimit: 500,
      usedCount: 142,
      perUserLimit: 1,
      isActive: true,
      startsAt: now,
      expiresAt: nextYear,
    },
    {
      code: 'FLAT500',
      description: 'Flat ₹500 off on orders above ₹2999',
      type: 'fixed',
      value: 500,
      minOrderAmount: 2999,
      usageLimit: 200,
      usedCount: 87,
      perUserLimit: 1,
      isActive: true,
      startsAt: now,
      expiresAt: nextYear,
    },
    {
      code: 'MARBLE10',
      description: '10% off on all marble products',
      type: 'percentage',
      value: 10,
      minOrderAmount: 0,
      maxDiscount: 500,
      usageLimit: null,
      usedCount: 234,
      perUserLimit: 2,
      isActive: true,
      startsAt: now,
      expiresAt: nextYear,
    },
    {
      code: 'FREESHIP',
      description: 'Free shipping on any order',
      type: 'free_shipping',
      value: 0,
      minOrderAmount: 0,
      usageLimit: 100,
      usedCount: 45,
      perUserLimit: 1,
      isActive: true,
      startsAt: now,
      expiresAt: nextYear,
    },
    {
      code: 'CORPORATE15',
      description: '15% off on corporate orders above ₹5000',
      type: 'percentage',
      value: 15,
      minOrderAmount: 5000,
      maxDiscount: 2000,
      usageLimit: null,
      usedCount: 56,
      perUserLimit: 5,
      isActive: true,
      startsAt: now,
      expiresAt: nextYear,
    },
    {
      code: 'FESTIVAL25',
      description: '25% off — Festival season special',
      type: 'percentage',
      value: 25,
      minOrderAmount: 1999,
      maxDiscount: 1500,
      usageLimit: 150,
      usedCount: 150,
      perUserLimit: 1,
      isActive: false,
      startsAt: new Date('2024-10-01'),
      expiresAt: new Date('2024-11-15'),
    },
  ]);

  return coupons;
};

module.exports = seedCoupons;
