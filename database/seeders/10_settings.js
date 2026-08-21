/**
 * SEEDER 10 — Site Settings
 */
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: mongoose.Schema.Types.Mixed,
  group: String, label: String, type: String,
}, { timestamps: true });

const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);

const seedSettings = async () => {
  await Setting.deleteMany({});

  await Setting.insertMany([
    { key: 'site_name',            value: 'Engravia Labs',                                                  group: 'general',  label: 'Site Name',                    type: 'string' },
    { key: 'site_tagline',         value: "India's Premier Luxury Stone Engraving Studio",                  group: 'general',  label: 'Site Tagline',                 type: 'string' },
    { key: 'contact_email',        value: 'hello@engravialabs.com',                                         group: 'general',  label: 'Contact Email',                type: 'string' },
    { key: 'contact_phone',        value: '+91 98765 43210',                                                group: 'general',  label: 'Contact Phone',                type: 'string' },
    { key: 'whatsapp_number',      value: '919876543210',                                                   group: 'general',  label: 'WhatsApp Number',              type: 'string' },
    { key: 'address',              value: 'Makrana Road, Kishangarh, Rajasthan 305801, India',              group: 'general',  label: 'Business Address',             type: 'string' },
    { key: 'business_hours',       value: 'Monday – Saturday: 9:00 AM – 6:00 PM IST',                      group: 'general',  label: 'Business Hours',               type: 'string' },
    { key: 'currency',             value: 'INR',                                                            group: 'general',  label: 'Currency',                     type: 'string' },
    { key: 'currency_symbol',      value: '₹',                                                              group: 'general',  label: 'Currency Symbol',              type: 'string' },
    { key: 'free_shipping_threshold', value: 999,                                                           group: 'shipping', label: 'Free Shipping Above (₹)',      type: 'number' },
    { key: 'default_shipping_charge',value: 99,                                                             group: 'shipping', label: 'Default Shipping Charge (₹)', type: 'number' },
    { key: 'cod_charge',           value: 50,                                                               group: 'shipping', label: 'COD Extra Charge (₹)',         type: 'number' },
    { key: 'processing_days',      value: 3,                                                                group: 'shipping', label: 'Default Processing Days',      type: 'number' },
    { key: 'tax_rate',             value: 18,                                                               group: 'shipping', label: 'GST Rate (%)',                 type: 'number' },
    { key: 'seo_title',            value: 'ENGRAVIA LABS – Luxury Black Marble Engravings | India',         group: 'seo',      label: 'Default SEO Title',            type: 'string' },
    { key: 'seo_description',      value: "India's premier luxury stone engraving studio. Bespoke black marble name plates, memorial stones, corporate signages, and custom engravings handcrafted in Rajasthan.", group: 'seo', label: 'Default Meta Description', type: 'string' },
    { key: 'google_analytics_id',  value: 'G-XXXXXXXXXX',                                                  group: 'seo',      label: 'Google Analytics ID',          type: 'string' },
    { key: 'google_verification',  value: '',                                                               group: 'seo',      label: 'Google Search Console Code',   type: 'string' },
    { key: 'instagram_url',        value: 'https://instagram.com/engravialabs',                             group: 'social',   label: 'Instagram URL',                type: 'string' },
    { key: 'facebook_url',         value: 'https://facebook.com/engravialabs',                              group: 'social',   label: 'Facebook URL',                 type: 'string' },
    { key: 'youtube_url',          value: 'https://youtube.com/@engravialabs',                              group: 'social',   label: 'YouTube URL',                  type: 'string' },
    { key: 'homepage_hero_heading',value: 'Craft Your Legacy In Black Marble',                              group: 'homepage', label: 'Hero Heading',                 type: 'string' },
    { key: 'homepage_hero_subtext',value: "Bespoke stone engravings that command respect, define spaces, and endure centuries. Handcrafted in Rajasthan's finest studios.", group: 'homepage', label: 'Hero Subtext', type: 'string' },
    { key: 'homepage_stats',       value: [{ number: '12,000+', label: 'Happy Clients' }, { number: '99.8%', label: 'Satisfaction' }, { number: '48 hrs', label: 'Design Proof' }, { number: 'Lifetime', label: 'Guarantee' }], group: 'homepage', label: 'Hero Stats', type: 'json' },
    { key: 'maintenance_mode',     value: false,                                                            group: 'general',  label: 'Maintenance Mode',             type: 'boolean' },
    { key: 'order_email_notifications', value: true,                                                        group: 'email',    label: 'Send Order Email Notifications', type: 'boolean' },
    { key: 'review_auto_approve',  value: false,                                                            group: 'general',  label: 'Auto-approve Reviews',         type: 'boolean' },
    { key: 'max_images_per_product', value: 10,                                                             group: 'general',  label: 'Max Images Per Product',       type: 'number' },
    { key: 'store_upi_id',         value: 'engravialabs@upi',                                               group: 'payment',  label: 'Store UPI ID / VPA',           type: 'string' },
    { key: 'enable_direct_upi_qr', value: true,                                                             group: 'payment',  label: 'Enable Direct UPI QR & VPA',   type: 'boolean' },
    { key: 'razorpay_key_id',      value: 'rzp_test_T4jYhLKhRcdUW5',                                        group: 'payment',  label: 'Razorpay Key ID',              type: 'string' },
  ]);

  return true;
};

module.exports = seedSettings;
