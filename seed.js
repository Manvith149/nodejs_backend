import mongoose from 'mongoose';
import config from './config.js';
import Product from './models/Product.js';
import User from './models/User.js';

const products = [
  {
    name: 'Coconut Shell Charcoal Premium',
    slug: 'coconut-shell-charcoal-premium',
    description: 'Premium quality coconut shell charcoal with high fixed carbon content. Ideal for industrial applications, metallurgy, and activated carbon production. Our coconut shell charcoal is sourced from the finest coconut shells and processed using advanced carbonization techniques.',
    shortDescription: 'High-grade coconut shell charcoal with 80-85% fixed carbon',
    category: 'Coconut Shell',
    price: 45,
    unit: 'kg',
    minOrderQuantity: 100,
    stock: 50000,
    inStock: true,
    images: ['/assets/coconut-charcoal.jpg'],
    specifications: [
      { label: 'Fixed Carbon', value: '80-85%' },
      { label: 'Ash Content', value: '< 3%' },
      { label: 'Moisture', value: '< 5%' },
      { label: 'Volatile Matter', value: '10-15%' },
      { label: 'Calorific Value', value: '7000-7500 kcal/kg' }
    ],
    features: [
      'High fixed carbon content',
      'Low ash and moisture',
      'Consistent quality',
      'Eco-friendly production',
      'Bulk packaging available'
    ],
    applications: [
      'Activated carbon production',
      'Metallurgical processes',
      'Water purification',
      'Gold recovery',
      'Industrial heating'
    ],
    badge: 'Best Seller',
    rating: 4.8,
    reviewCount: 124
  },
  {
    name: 'Earthing Charcoal Powder',
    slug: 'earthing-charcoal-powder',
    description: 'Specially processed charcoal powder for earthing and grounding applications. Provides excellent electrical conductivity and corrosion resistance. Meets all Indian electrical standards for earthing compounds.',
    shortDescription: 'Fine charcoal powder for electrical earthing applications',
    category: 'Powder',
    price: 55,
    unit: 'kg',
    minOrderQuantity: 50,
    stock: 30000,
    inStock: true,
    images: ['/assets/charcoal-powder.jpg'],
    specifications: [
      { label: 'Particle Size', value: '< 200 mesh' },
      { label: 'Carbon Content', value: '> 85%' },
      { label: 'Moisture', value: '< 8%' },
      { label: 'Resistivity', value: '< 5 Ohm-cm' }
    ],
    features: [
      'Excellent conductivity',
      'Corrosion resistant',
      'Long lasting',
      'Easy to apply',
      'Meets IS standards'
    ],
    applications: [
      'Electrical earthing',
      'Lightning arresters',
      'Substation grounding',
      'Industrial earthing pits'
    ],
    badge: 'Premium',
    rating: 4.9,
    reviewCount: 89
  },
  {
    name: 'Black Hardwood Charcoal',
    slug: 'black-hardwood-charcoal',
    description: 'Superior quality hardwood charcoal made from selected hardwood species. Perfect for BBQ, restaurants, and industrial fuel applications. Burns longer and produces consistent heat.',
    shortDescription: 'Premium hardwood charcoal for BBQ and industrial use',
    category: 'Wood Charcoal',
    price: 42,
    unit: 'kg',
    minOrderQuantity: 150,
    stock: 40000,
    inStock: true,
    images: ['/assets/wood-charcoal.jpg'],
    specifications: [
      { label: 'Fixed Carbon', value: '75-80%' },
      { label: 'Ash Content', value: '< 5%' },
      { label: 'Moisture', value: '< 6%' },
      { label: 'Burn Time', value: '2-3 hours' },
      { label: 'Calorific Value', value: '6500-7000 kcal/kg' }
    ],
    features: [
      'Long burning time',
      'Low smoke emission',
      'Consistent heat output',
      'Natural wood aroma',
      'Restaurant grade quality'
    ],
    applications: [
      'Restaurant grilling',
      'BBQ and outdoor cooking',
      'Industrial boilers',
      'Tandoor ovens',
      'Charcoal briquette production'
    ],
    badge: 'Premium',
    rating: 4.7,
    reviewCount: 156
  },
  {
    name: 'Granular Activated Carbon',
    slug: 'granular-activated-carbon',
    description: 'High-performance granular activated carbon for water treatment, air purification, and chemical processing. Manufactured from coconut shell charcoal with high surface area and adsorption capacity.',
    shortDescription: 'Industrial grade activated carbon for purification',
    category: 'Activated Carbon',
    price: 120,
    unit: 'kg',
    minOrderQuantity: 25,
    stock: 15000,
    inStock: true,
    images: ['/assets/activated-carbon.jpg'],
    specifications: [
      { label: 'Iodine Number', value: '> 1000 mg/g' },
      { label: 'Surface Area', value: '> 1000 m²/g' },
      { label: 'Mesh Size', value: '8x30' },
      { label: 'Moisture', value: '< 5%' },
      { label: 'Hardness', value: '> 95%' }
    ],
    features: [
      'High adsorption capacity',
      'Excellent hardness',
      'Low dust content',
      'Regenerable',
      'Food grade available'
    ],
    applications: [
      'Water treatment plants',
      'Air purification systems',
      'Gold recovery',
      'Pharmaceutical industry',
      'Food & beverage processing'
    ],
    badge: 'Industrial',
    rating: 4.9,
    reviewCount: 67
  },
  {
    name: 'High Calorific Steam Coal',
    slug: 'high-calorific-steam-coal',
    description: 'Premium quality steam coal with high calorific value for power generation and industrial boilers. Consistent quality with low ash and sulfur content.',
    shortDescription: 'High energy steam coal for industrial applications',
    category: 'Steam Coal',
    price: 8,
    unit: 'kg',
    minOrderQuantity: 1000,
    stock: 500000,
    inStock: true,
    images: ['/assets/steam-coal.jpg'],
    specifications: [
      { label: 'Calorific Value', value: '5500-6000 kcal/kg' },
      { label: 'Ash Content', value: '< 12%' },
      { label: 'Moisture', value: '< 10%' },
      { label: 'Sulfur', value: '< 0.5%' },
      { label: 'Volatile Matter', value: '25-30%' }
    ],
    features: [
      'High energy output',
      'Low sulfur content',
      'Consistent sizing',
      'Reliable supply',
      'Competitive pricing'
    ],
    applications: [
      'Thermal power plants',
      'Industrial boilers',
      'Brick kilns',
      'Cement industry',
      'Steel manufacturing'
    ],
    badge: 'Bulk Order',
    rating: 4.5,
    reviewCount: 45
  },
  {
    name: 'Washed Activated Carbon',
    slug: 'washed-activated-carbon',
    description: 'Acid-washed activated carbon with ultra-high purity for pharmaceutical and food-grade applications. Meets stringent quality standards for sensitive applications.',
    shortDescription: 'Ultra-pure activated carbon for pharmaceutical use',
    category: 'Activated Carbon',
    price: 150,
    unit: 'kg',
    minOrderQuantity: 20,
    stock: 8000,
    inStock: true,
    images: ['/assets/activated-carbon.jpg'],
    specifications: [
      { label: 'Iodine Number', value: '> 1100 mg/g' },
      { label: 'pH', value: '6-8 (Neutral)' },
      { label: 'Ash Content', value: '< 3%' },
      { label: 'Iron Content', value: '< 0.05%' },
      { label: 'Purity', value: '> 99%' }
    ],
    features: [
      'Pharmaceutical grade',
      'Acid washed for purity',
      'Neutral pH',
      'Low metal content',
      'FDA compliant'
    ],
    applications: [
      'Pharmaceutical manufacturing',
      'Food & beverage processing',
      'Medical devices',
      'Laboratory use',
      'Drinking water treatment'
    ],
    badge: 'Top Rated',
    rating: 5.0,
    reviewCount: 34
  },
  {
    name: 'Lump Charcoal',
    slug: 'lump-charcoal',
    description: 'Natural lump charcoal made from selected hardwoods. Irregular shapes and sizes perfect for authentic grilling experiences. Burns hot and clean with minimal ash.',
    shortDescription: 'Natural hardwood lump charcoal for grilling',
    category: 'Wood Charcoal',
    price: 40,
    unit: 'kg',
    minOrderQuantity: 100,
    stock: 25000,
    inStock: true,
    images: ['/assets/lump-charcoal.jpg'],
    specifications: [
      { label: 'Carbon Content', value: '75-80%' },
      { label: 'Ash Content', value: '< 3%' },
      { label: 'Moisture', value: '< 5%' },
      { label: 'Size', value: '20mm - 80mm' }
    ],
    features: [
      '100% Natural',
      'No chemical additives',
      'High heat output',
      'Gives food a smoky flavor',
      'Easy to light'
    ],
    applications: [
      'BBQ grilling',
      'Restaurant cooking',
      'Smokers',
      'Outdoor cooking'
    ],
    badge: 'Premium',
    rating: 4.6,
    reviewCount: 52
  }
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@manvithcharcoal.com',
  password: 'admin123',
  phone: '9876543210',
  company: 'Manvith Charcoal',
  role: 'admin',
  isVerified: true
};

async function seed() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create products
    await Product.insertMany(products);
    console.log(`Created ${products.length} products`);

    // Create admin user
    await User.create(adminUser);
    console.log('Created admin user');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@manvithcharcoal.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();

