/**
 * Seed script — creates demo users and sample properties
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/realestate';

const USERS = [
  { name: 'Admin User', email: 'admin@demo.com', password: 'password123', role: 'admin', phone: '+91 98765 00001' },
  { name: 'Priya Sharma', email: 'owner@demo.com', password: 'password123', role: 'owner', phone: '+91 98765 00002' },
  { name: 'Rahul Verma', email: 'buyer@demo.com', password: 'password123', role: 'buyer', phone: '+91 98765 00003' },
];

const PROPERTIES = (ownerId) => [
  {
    title: 'Luxurious 3BHK Sea-View Apartment in Bandra West',
    description: 'Stunning fully-furnished apartment with panoramic sea views. Features include modular kitchen, premium fixtures, and 24/7 security. Walking distance to Bandra-Worli Sea Link.',
    price: 75000, priceType: 'per_month', category: 'rent', type: 'apartment', status: 'approved',
    bedrooms: 3, bathrooms: 2, area: 1800, areaUnit: 'sq ft', floor: 12, totalFloors: 20,
    furnishing: 'fully-furnished', yearBuilt: 2019,
    location: { address: 'Turner Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', country: 'India', zipCode: '400050', coordinates: { lat: 19.0596, lng: 72.8295 } },
    amenities: ['parking', 'gym', 'swimming pool', 'security', 'power backup', 'lift', 'balcony'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    ],
    isFeatured: true, ownerId,
  },
  {
    title: 'Independent 4BHK Villa with Private Pool in Lonavala',
    description: 'Exclusive hilltop villa surrounded by nature. Perfect for weekend getaways or permanent residence. Includes private pool, landscaped garden, and stunning valley views.',
    price: 18500000, priceType: 'total', category: 'sale', type: 'villa', status: 'approved',
    bedrooms: 4, bathrooms: 4, area: 4200, areaUnit: 'sq ft', floor: 1, totalFloors: 2,
    furnishing: 'semi-furnished', yearBuilt: 2021,
    location: { address: 'Khopoli Road, Amby Valley', city: 'Lonavala', state: 'Maharashtra', country: 'India', zipCode: '410401', coordinates: { lat: 18.7546, lng: 73.4062 } },
    amenities: ['parking', 'swimming pool', 'garden', 'security', 'power backup', 'balcony', 'pet friendly', 'club house'],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    ],
    isFeatured: true, ownerId,
  },
  {
    title: 'Modern 2BHK Studio in Koramangala, Bangalore',
    description: 'Contemporary studio apartment ideal for young professionals. Located in the heart of Koramangala with easy access to tech parks, cafes, and entertainment.',
    price: 28000, priceType: 'per_month', category: 'rent', type: 'studio', status: 'approved',
    bedrooms: 2, bathrooms: 1, area: 950, areaUnit: 'sq ft', floor: 5, totalFloors: 8,
    furnishing: 'fully-furnished',
    location: { address: '5th Block, Koramangala', city: 'Bangalore', state: 'Karnataka', country: 'India', zipCode: '560034', coordinates: { lat: 12.9352, lng: 77.6245 } },
    amenities: ['wifi', 'ac', 'parking', 'lift', 'security', 'power backup'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
    ownerId,
  },
  {
    title: 'Spacious Commercial Office Space in Cyber City, Gurgaon',
    description: 'Premium Grade A office space in the heart of Cyber City. Modern infrastructure, high-speed internet, and excellent connectivity via Delhi Metro.',
    price: 12000000, priceType: 'total', category: 'sale', type: 'commercial', status: 'approved',
    area: 3500, areaUnit: 'sq ft', floor: 15, totalFloors: 30,
    location: { address: 'DLF Cyber City, Phase 2', city: 'Gurgaon', state: 'Haryana', country: 'India', zipCode: '122002', coordinates: { lat: 28.4947, lng: 77.0894 } },
    amenities: ['parking', 'lift', 'power backup', 'security', 'wifi', 'ac'],
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
    ownerId,
  },
  {
    title: 'Elegant 3BHK Penthouse in Jubilee Hills, Hyderabad',
    description: 'Exclusive penthouse on the 30th floor offering 360-degree views of the city. Premium finishes, private terrace, and concierge services.',
    price: 95000, priceType: 'per_month', category: 'rent', type: 'penthouse', status: 'approved',
    bedrooms: 3, bathrooms: 3, area: 2800, areaUnit: 'sq ft', floor: 30, totalFloors: 30,
    furnishing: 'fully-furnished', yearBuilt: 2022,
    location: { address: 'Road No. 36, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', country: 'India', zipCode: '500033', coordinates: { lat: 17.4239, lng: 78.4073 } },
    amenities: ['parking', 'gym', 'swimming pool', 'security', 'power backup', 'lift', 'club house', 'balcony', 'modular kitchen'],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
    isFeatured: true, ownerId,
  },
  {
    title: '1200 sqyd Residential Plot in Aerocity, Delhi',
    description: 'Prime residential plot near Indira Gandhi International Airport. Excellent investment opportunity in one of Delhi\'s fastest-growing areas.',
    price: 25000000, priceType: 'total', category: 'sale', type: 'plot', status: 'pending',
    area: 1200, areaUnit: 'sq yard',
    location: { address: 'Aerocity, Near IGI Airport', city: 'Delhi', state: 'Delhi', country: 'India', zipCode: '110037', coordinates: { lat: 28.5562, lng: 77.0889 } },
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
    ownerId,
  },
  {
    title: 'Charming 2BHK House in Aundh, Pune',
    description: 'Beautifully maintained independent house in a quiet residential area. Ground floor with private garden, ideal for families. Close to schools and hospitals.',
    price: 9500000, priceType: 'total', category: 'sale', type: 'house', status: 'approved',
    bedrooms: 2, bathrooms: 2, area: 1400, areaUnit: 'sq ft', floor: 1, totalFloors: 1,
    furnishing: 'semi-furnished', yearBuilt: 2015,
    location: { address: 'Aundh Road, Wakad', city: 'Pune', state: 'Maharashtra', country: 'India', zipCode: '411027', coordinates: { lat: 18.5946, lng: 73.7730 } },
    amenities: ['parking', 'garden', 'security', 'pet friendly'],
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'],
    ownerId,
  },
  {
    title: '1BHK Apartment near Marine Drive, Mumbai',
    description: 'Compact and well-ventilated apartment with partial sea view. Perfect for single professionals or couples. Walking distance to Marine Drive promenade.',
    price: 35000, priceType: 'per_month', category: 'rent', type: 'apartment', status: 'approved',
    bedrooms: 1, bathrooms: 1, area: 650, areaUnit: 'sq ft', floor: 6, totalFloors: 12,
    furnishing: 'semi-furnished', yearBuilt: 2010,
    location: { address: 'Nariman Point, Marine Lines', city: 'Mumbai', state: 'Maharashtra', country: 'India', zipCode: '400020', coordinates: { lat: 18.9322, lng: 72.8264 } },
    amenities: ['lift', 'security', 'power backup'],
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
    ownerId,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const created = [];
    for (const u of USERS) {
      const user = await User.create(u);
      created.push(user);
      console.log(`👤 Created user: ${u.email} (${u.role})`);
    }

    const owner = created.find(u => u.role === 'owner');

    // Create properties
    const props = PROPERTIES(owner._id);
    for (const p of props) {
      await Property.create(p);
      console.log(`🏠 Created: ${p.title.slice(0, 40)}...`);
    }

    console.log('\n✅ Seed complete!');
    console.log('\nDemo Login Credentials:');
    console.log('  Admin  → admin@demo.com  / password123');
    console.log('  Owner  → owner@demo.com  / password123');
    console.log('  Buyer  → buyer@demo.com  / password123');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
