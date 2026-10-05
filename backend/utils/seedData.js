const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

const seedCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets, laptops, smartphones, and audio gear.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    iconName: 'Smartphone'
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trending apparel, luxury wear, jackets, and streetwear.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=600',
    iconName: 'Shirt'
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    description: 'Premium sneakers, formal shoes, boots, and athletic footwear.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    iconName: 'Footprints'
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    description: 'Skincare, fragrances, makeup, and personal care products.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    iconName: 'Sparkles'
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Modern furniture, cookware, espresso machines, and decor.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600',
    iconName: 'Home'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Designer watches, sunglasses, leather bags, and jewelry.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    iconName: 'Watch'
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Fitness equipment, yoga mats, dumbbells, and outdoor gear.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
    iconName: 'Dumbbell'
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Best-selling novels, tech guides, biographies, and hardcovers.',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    iconName: 'BookOpen'
  }
];

const seedProducts = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling with two processors and eight microphones for unprecedented sound quality.',
    category: 'Electronics',
    brand: 'Sony',
    price: 399,
    discount: 15,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 25,
    colors: ['Midnight Black', 'Silver', 'Navy'],
    specifications: [
      { key: 'Battery Life', value: '30 Hours' },
      { key: 'Connectivity', value: 'Bluetooth 5.2' },
      { key: 'Weight', value: '250g' }
    ],
    rating: 4.9,
    numReviews: 128,
    isFeatured: true,
    isFlashDeal: true,
    flashDealExpiry: new Date(Date.now() + 86400000 * 3)
  },
  {
    name: 'Apple MacBook Pro 16" M3 Max',
    description: 'Mind-blowing performance with the M3 Max chip, Liquid Retina XDR display, up to 22 hours of battery life, and sleek space black finish.',
    category: 'Electronics',
    brand: 'Apple',
    price: 2499,
    discount: 10,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 15,
    colors: ['Space Black', 'Silver'],
    specifications: [
      { key: 'Processor', value: 'Apple M3 Max 16-Core' },
      { key: 'RAM', value: '36GB Unified Memory' },
      { key: 'Storage', value: '1TB SSD' }
    ],
    rating: 5.0,
    numReviews: 210,
    isFeatured: true
  },
  {
    name: 'Nike Air Max Pulse Sneakers',
    description: 'Combines street style with futuristic comfort. Textile upper with synthetic leather accents and responsive Air cushioning.',
    category: 'Shoes',
    brand: 'Nike',
    price: 160,
    discount: 20,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 40,
    sizes: ['US 8', 'US 9', 'US 10', 'US 11'],
    colors: ['Fire Red/Black', 'Pure White', 'Wolf Grey'],
    specifications: [
      { key: 'Material', value: 'Breathable Mesh & Leather' },
      { key: 'Sole', value: 'Rubber Air Max Cushion' }
    ],
    rating: 4.7,
    numReviews: 89,
    isFeatured: true,
    isFlashDeal: true,
    flashDealExpiry: new Date(Date.now() + 86400000 * 2)
  },
  {
    name: 'Minimalist Minimal Chronograph Watch',
    description: 'Stainless steel timepiece with sapphire crystal glass, Japanese quartz movement, and genuine Italian leather strap.',
    category: 'Accessories',
    brand: 'Fossil',
    price: 185,
    discount: 25,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 18,
    colors: ['Rose Gold', 'Matte Black', 'Silver'],
    specifications: [
      { key: 'Water Resistance', value: '50m (5 ATM)' },
      { key: 'Case Size', value: '42mm' }
    ],
    rating: 4.6,
    numReviews: 64,
    isFeatured: true
  },
  {
    name: 'Premium Leather Biker Jacket',
    description: '100% lambskin genuine leather with silver hardware finish, asymmetrical zip closure, and satin inner lining.',
    category: 'Fashion',
    brand: 'AllSaints',
    price: 450,
    discount: 30,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 12,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Onyx Black', 'Dark Brown'],
    specifications: [
      { key: 'Material', value: '100% Genuine Lambskin' },
      { key: 'Fit', value: 'Slim Fit' }
    ],
    rating: 4.8,
    numReviews: 43,
    isFeatured: true
  },
  {
    name: 'DeLonghi Barista Espresso Machine',
    description: '15-bar pump espresso maker with integrated milk frother, precision temperature control, and dual filter holder.',
    category: 'Home & Kitchen',
    brand: 'DeLonghi',
    price: 299,
    discount: 18,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 20,
    colors: ['Stainless Steel', 'Matte Black'],
    specifications: [
      { key: 'Pressure', value: '15 Bar' },
      { key: 'Water Tank', value: '1.1 Liters' }
    ],
    rating: 4.7,
    numReviews: 92,
    isFeatured: false,
    isFlashDeal: true,
    flashDealExpiry: new Date(Date.now() + 86400000 * 4)
  },
  {
    name: 'Hydra-Gel Radiant Skin Serum',
    description: 'Intense hyaluronic acid facial serum designed to deeply hydrate, plump, and smooth skin texture.',
    category: 'Beauty',
    brand: 'Glossier',
    price: 48,
    discount: 10,
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 50,
    specifications: [
      { key: 'Volume', value: '50ml / 1.7 fl oz' },
      { key: 'Skin Type', value: 'All Skin Types' }
    ],
    rating: 4.9,
    numReviews: 156,
    isFeatured: false
  },
  {
    name: 'Pro-Grip Non-Slip Yoga Mat & Strap',
    description: 'Eco-friendly TPE foam yoga mat with alignment guidelines, 6mm cushioning, and anti-tear mesh technology.',
    category: 'Sports',
    brand: 'Lululemon',
    price: 78,
    discount: 15,
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 35,
    colors: ['Sage Green', 'Plum Violet', 'Ocean Blue'],
    specifications: [
      { key: 'Thickness', value: '6mm' },
      { key: 'Dimensions', value: '72" x 24"' }
    ],
    rating: 4.8,
    numReviews: 76,
    isFeatured: false
  },
  {
    name: 'Atomic Habits Hardcover Book',
    description: 'An easy and proven way to build good habits and break bad ones by James Clear. Global bestseller.',
    category: 'Books',
    brand: 'Penguin Press',
    price: 27,
    discount: 25,
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 60,
    specifications: [
      { key: 'Format', value: 'Hardcover' },
      { key: 'Pages', value: '320' }
    ],
    rating: 4.95,
    numReviews: 340,
    isFeatured: true
  },
  {
    name: 'Ray-Ban Wayfarer Classic Sunglasses',
    description: 'Iconic crystal green G-15 UV protection lenses paired with durable black acetate frame.',
    category: 'Accessories',
    brand: 'Ray-Ban',
    price: 163,
    discount: 12,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 22,
    colors: ['Black / Green Lens', 'Tortoise / Brown Lens'],
    specifications: [
      { key: 'UV Protection', value: '100% UV400' },
      { key: 'Frame Material', value: 'Acetate' }
    ],
    rating: 4.7,
    numReviews: 112,
    isFeatured: true
  }
];

const seedDatabase = async () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    console.log('Seeding ShopSphere Database...');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    // Seed Categories
    const categories = await Category.insertMany(seedCategories);
    console.log(`Seeded ${categories.length} categories`);

    // Seed Admin & Test User
    const adminUser = await User.create({
      name: 'ShopSphere Admin',
      email: 'admin@shopsphere.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 019-2831',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      addresses: [
        {
          fullName: 'ShopSphere Admin HQ',
          phone: '+1 (555) 019-2831',
          street: '100 Innovation Way, Tech Park',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          zipCode: '94105',
          isDefault: true
        }
      ]
    });

    const standardUser = await User.create({
      name: 'Alex Johnson',
      email: 'user@shopsphere.com',
      password: 'user123',
      role: 'user',
      phone: '+1 (555) 349-9921',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      addresses: [
        {
          fullName: 'Alex Johnson',
          phone: '+1 (555) 349-9921',
          street: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'IL',
          country: 'USA',
          zipCode: '62704',
          isDefault: true
        }
      ]
    });

    console.log(`Seeded Admin (${adminUser.email}) and Standard User (${standardUser.email})`);

    // Seed Products
    const products = await Product.insertMany(seedProducts);
    console.log(`Seeded ${products.length} products`);

    // Seed initial Order for Dashboard Analytics demonstration
    await Order.create({
      user: standardUser._id,
      orderItems: [
        {
          product: products[0]._id,
          name: products[0].name,
          image: products[0].images[0],
          price: products[0].finalPrice,
          quantity: 1,
          selectedColor: 'Midnight Black'
        },
        {
          product: products[2]._id,
          name: products[2].name,
          image: products[2].images[0],
          price: products[2].finalPrice,
          quantity: 1,
          selectedSize: 'US 10'
        }
      ],
      shippingAddress: standardUser.addresses[0],
      deliveryMethod: 'Express Delivery',
      paymentMethod: 'Credit/Debit Card',
      paymentStatus: 'Completed',
      orderStatus: 'Shipped',
      subtotal: products[0].finalPrice + products[2].finalPrice,
      shippingPrice: 15,
      taxPrice: Math.round((products[0].finalPrice + products[2].finalPrice) * 0.18),
      discountAmount: 0,
      totalAmount: Math.round((products[0].finalPrice + products[2].finalPrice) * 1.18 + 15),
      trackingHistory: [
        { status: 'Placed', timestamp: new Date(Date.now() - 86400000 * 2), note: 'Order placed' },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 86400000 * 1.8), note: 'Order confirmed' },
        { status: 'Packed', timestamp: new Date(Date.now() - 86400000 * 1.2), note: 'Item packaged' },
        { status: 'Shipped', timestamp: new Date(Date.now() - 86400000 * 0.5), note: 'In transit with FedEx' }
      ]
    });

    console.log('Database Seeding Complete!');
  } catch (error) {
    console.error(`Database Seeding Error: ${error.message}`);
  }
};

module.exports = { seedDatabase };
