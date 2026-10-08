const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

// @desc    Get user favorites
// @route   GET /api/favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate({
        path: 'propertyId',
        populate: { path: 'ownerId', select: 'name email phone' }
      })
      .sort({ createdAt: -1 });

    const properties = favorites
      .filter(f => f.propertyId)
      .map(f => f.propertyId);

    res.json({ success: true, favorites: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle favorite
// @route   POST /api/favorites
const toggleFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const existing = await Favorite.findOne({ userId: req.user._id, propertyId });

    if (existing) {
      await existing.deleteOne();
      return res.json({ success: true, favorited: false, message: 'Removed from favorites' });
    }

    await Favorite.create({ userId: req.user._id, propertyId });
    res.json({ success: true, favorited: true, message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check if favorited
// @route   GET /api/favorites/check/:propertyId
const checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      userId: req.user._id,
      propertyId: req.params.propertyId
    });
    res.json({ success: true, favorited: !!favorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFavorites, toggleFavorite, checkFavorite };
