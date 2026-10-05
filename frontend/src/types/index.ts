export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
  addresses?: Address[];
  token?: string;
}

export interface Specification {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  discount: number;
  finalPrice: number;
  images: string[];
  stock: number;
  sizes?: string[];
  colors?: string[];
  specifications?: Specification[];
  rating: number;
  numReviews: number;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  flashDealExpiry?: string;
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName?: string;
}

export interface CartItem {
  _id?: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
}

export interface OrderItem {
  _id?: string;
  product: string | Product;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface TrackingStep {
  status: 'Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  timestamp: string;
  note?: string;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: Address;
  deliveryMethod: string;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  orderStatus: 'Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  subtotal: number;
  shippingPrice: number;
  taxPrice: number;
  discountAmount?: number;
  totalAmount: number;
  trackingHistory: TrackingStep[];
  createdAt: string;
}

export interface Review {
  _id: string;
  user: string;
  userName: string;
  userAvatar?: string;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FilterState {
  search: string;
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  discount: number;
  sort: string;
  page: number;
}

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  salesAnalytics: {
    month: string;
    revenue: number;
    orders: number;
  }[];
  recentOrders: Order[];
  categoryStats: {
    _id: string;
    count: number;
  }[];
}
