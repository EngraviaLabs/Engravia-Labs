/**
 * SEEDER 01 — Users
 * Creates 1 super admin + 5 sample customers
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: { type: String, select: false },
  role: { type: String, default: 'customer' },
  isVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  avatar: String,
  addresses: Array,
  wishlist: Array,
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastLogin: Date,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const seedUsers = async () => {
  // Remove existing users
  await User.deleteMany({});

  const hashedAdmin    = await bcrypt.hash('Admin@12345', 12);
  const hashedCustomer = await bcrypt.hash('Customer@123', 12);

  const users = await User.insertMany([
    {
      name: 'Engravia Admin',
      email: 'admin@engravialabs.com',
      phone: '+91 98765 43210',
      password: hashedAdmin,
      role: 'super_admin',
      isVerified: true,
      isActive: true,
      totalOrders: 0,
      totalSpent: 0,
      lastLogin: new Date(),
      addresses: [
        {
          label: 'Office',
          fullName: 'Engravia Labs',
          phone: '+91 98765 43210',
          line1: 'Makrana Road, Kishangarh',
          city: 'Kishangarh',
          state: 'Rajasthan',
          pincode: '305801',
          country: 'India',
          isDefault: true,
        },
      ],
    },
    {
      name: 'Rahul Mehra',
      email: 'rahul.mehra@example.com',
      phone: '+91 98111 22333',
      password: hashedCustomer,
      role: 'customer',
      isVerified: true,
      isActive: true,
      totalOrders: 4,
      totalSpent: 18200,
      lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      addresses: [
        {
          label: 'Home',
          fullName: 'Rahul Mehra',
          phone: '+91 98111 22333',
          line1: '45 Shivaji Nagar',
          line2: 'Near Central Mall',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
          isDefault: true,
        },
      ],
    },
    {
      name: 'Priya Kapoor',
      email: 'priya.kapoor@example.com',
      phone: '+91 87654 32100',
      password: hashedCustomer,
      role: 'customer',
      isVerified: true,
      isActive: true,
      totalOrders: 2,
      totalSpent: 9499,
      lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      addresses: [
        {
          label: 'Home',
          fullName: 'Priya Kapoor',
          phone: '+91 87654 32100',
          line1: '12-B Vasant Vihar',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110057',
          country: 'India',
          isDefault: true,
        },
      ],
    },
    {
      name: 'Anand Sharma',
      email: 'anand.sharma@example.com',
      phone: '+91 76543 21098',
      password: hashedCustomer,
      role: 'customer',
      isVerified: true,
      isActive: true,
      totalOrders: 3,
      totalSpent: 14700,
      lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      addresses: [
        {
          label: 'Home',
          fullName: 'Anand Sharma',
          phone: '+91 76543 21098',
          line1: '78 Indiranagar',
          line2: '100 Feet Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          country: 'India',
          isDefault: true,
        },
      ],
    },
    {
      name: 'Deepika Nair',
      email: 'deepika.nair@example.com',
      phone: '+91 65432 10987',
      password: hashedCustomer,
      role: 'customer',
      isVerified: true,
      isActive: true,
      totalOrders: 1,
      totalSpent: 2199,
      lastLogin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      addresses: [
        {
          label: 'Home',
          fullName: 'Deepika Nair',
          phone: '+91 65432 10987',
          line1: '23 Marine Drive',
          city: 'Kochi',
          state: 'Kerala',
          pincode: '682001',
          country: 'India',
          isDefault: true,
        },
      ],
    },
    {
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      phone: '+91 54321 09876',
      password: hashedCustomer,
      role: 'customer',
      isVerified: true,
      isActive: true,
      totalOrders: 2,
      totalSpent: 11500,
      lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      addresses: [
        {
          label: 'Office',
          fullName: 'Vikram Singh',
          phone: '+91 54321 09876',
          line1: 'B-47 Sector 18',
          city: 'Noida',
          state: 'Uttar Pradesh',
          pincode: '201301',
          country: 'India',
          isDefault: true,
        },
      ],
    },
  ]);

  return users;
};

module.exports = seedUsers;
