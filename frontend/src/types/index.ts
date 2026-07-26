export interface Product {
  _id: string; name: string; slug: string; sku: string;
  description: string; shortDescription?: string;
  category: { _id: string; name: string; slug: string };
  images: { url: string; publicId: string; alt?: string; isPrimary: boolean }[];
  price: number; salePrice?: number;
  stock: number; rating: number; numReviews: number;
  isFeatured: boolean; isBestSeller: boolean;
  material: string[]; colors: string[]; sizes: string[];
  customizationFields: CustomizationField[];
  features: string[]; specifications: { key: string; value: string }[];
  tags: string[]; isCustomizable: boolean;
  shippingInfo: { freeShipping: boolean; processingDays: number };
  createdAt: string; updatedAt: string;
}

export interface CustomizationField {
  name: string; type: 'text'|'select'|'upload'|'textarea'|'color'|'number';
  label: string; placeholder?: string; options?: string[];
  required: boolean; maxLength?: number; priceModifier?: number;
}

export interface Category {
  _id: string; name: string; slug: string; description?: string;
  image?: { url: string }; parent?: Category;
  productCount: number; isVisible: boolean; displayOrder: number;
}

export interface Order {
  _id: string; orderNumber: string;
  items: OrderItem[]; total: number; subtotal: number;
  discountAmount: number; shippingCharge: number; taxAmount: number;
  orderStatus: string; paymentStatus: string; paymentMethod: string;
  shippingAddress: Address; createdAt: string;
  trackingNumber?: string; courierName?: string;
  estimatedDelivery?: string; deliveredAt?: string;
  statusHistory: { status: string; timestamp: string; note?: string }[];
}

export interface OrderItem {
  product: Product | string; name: string; image: string;
  sku: string; price: number; quantity: number;
  customization?: Record<string, string>; subtotal: number;
}

export interface Address {
  _id?: string; label: string; fullName: string; phone: string;
  line1: string; line2?: string; city: string; state: string;
  pincode: string; country: string; isDefault: boolean;
}

export interface User {
  _id: string; name: string; email: string; phone?: string;
  role: string; isVerified: boolean; avatar?: string;
  addresses: Address[]; wishlist: string[];
  totalOrders: number; totalSpent: number;
}

export interface Review {
  _id: string; rating: number; title: string; body: string;
  user: { _id: string; name: string; avatar?: string };
  isVerifiedPurchase: boolean; helpfulVotes: string[];
  adminReply?: { text: string; repliedAt: string };
  images?: { url: string }[]; createdAt: string;
}

export interface CartItem {
  product: Product; quantity: number;
  customization?: Record<string, string>; price: number;
}

export interface PaginationData {
  page: number; limit: number; total: number;
  pages: number; hasNextPage: boolean; hasPrevPage: boolean;
}
