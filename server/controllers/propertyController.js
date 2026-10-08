const Property = require('../models/Property');
const Favorite = require('../models/Favorite');

// @desc    Get all properties (with filters)
// @route   GET /api/properties
const getProperties = async (req, res) => {
  try {
    const {
      page = 1, limit = 12, category, type, city, minPrice, maxPrice,
      bedrooms, bathrooms, furnishing, search, status = 'approved', featured
    } = req.query;

    const query = { status };

    if (category) query.category = category;
    if (type) query.type = type;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    if (furnishing) query.furnishing = furnishing;
    if (featured === 'true') query.isFeatured = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('ownerId', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      properties,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('ownerId', 'name email phone avatar createdAt');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Increment views
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create property
// @route   POST /api/properties
const createProperty = async (req, res) => {
  try {
    const propertyData = { ...req.body, ownerId: req.user._id };
    
    // Parse location if it's a string
    if (typeof propertyData.location === 'string') {
      propertyData.location = JSON.parse(propertyData.location);
    }
    if (typeof propertyData.amenities === 'string') {
      propertyData.amenities = JSON.parse(propertyData.amenities);
    }

    // Handle status based on role
    if (req.user.role === 'admin') {
      propertyData.status = propertyData.status || 'approved';
    } else {
      propertyData.status = 'pending';
    }

    const property = await Property.create(propertyData);
    res.status(201).json({ success: true, property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check ownership
    if (property.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    const updateData = { ...req.body };
    if (typeof updateData.location === 'string') updateData.location = JSON.parse(updateData.location);
    if (typeof updateData.amenities === 'string') updateData.amenities = JSON.parse(updateData.amenities);

    // Non-admins can't change status
    if (req.user.role !== 'admin') delete updateData.status;

    property = await Property.findByIdAndUpdate(req.params.id, updateData, {
      new: true, runValidators: true
    }).populate('ownerId', 'name email phone');

    res.json({ success: true, property });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await property.deleteOne();
    await Favorite.deleteMany({ propertyId: req.params.id });

    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get owner's properties
// @route   GET /api/properties/my-listings
const getMyListings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await Property.countDocuments({ ownerId: req.user._id });
    const properties = await Property.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, properties, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProperties, getProperty, createProperty, updateProperty, deleteProperty, getMyListings };
