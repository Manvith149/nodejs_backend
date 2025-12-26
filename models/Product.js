import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['Coconut Shell', 'Powder', 'Wood Charcoal', 'Activated Carbon', 'Steam Coal']
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  minOrderQuantity: {
    type: Number,
    default: 1
  },
  maxOrderQuantity: {
    type: Number,
    default: 10000
  },
  stock: {
    type: Number,
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String
  }],
  specifications: [{
    label: String,
    value: String
  }],
  features: [String],
  applications: [String],
  badge: {
    type: String,
    enum: ['Best Seller', 'Premium', 'Industrial', 'Bulk Order', 'Top Rated', 'New', null]
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;

