const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  priceType: {
    type: String,
    enum: ['total', 'per_month'],
    default: 'total'
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, default: 'India' },
    zipCode: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'studio', 'commercial', 'plot', 'penthouse'],
    required: true
  },
  category: {
    type: String,
    enum: ['rent', 'sale'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'sold', 'rented'],
    default: 'pending'
  },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  area: { type: Number },
  areaUnit: { type: String, default: 'sq ft' },
  floor: { type: Number },
  totalFloors: { type: Number },
  yearBuilt: { type: Number },
  furnishing: {
    type: String,
    enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
    default: 'unfurnished'
  },
  amenities: [{ type: String }],
  images: [{ type: String }],
  virtualTour: { type: String },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

// Index for search
propertySchema.index({ 'location.city': 1, type: 1, category: 1, price: 1 });
propertySchema.index({ title: 'text', description: 'text', 'location.address': 'text' });

module.exports = mongoose.model('Property', propertySchema);
