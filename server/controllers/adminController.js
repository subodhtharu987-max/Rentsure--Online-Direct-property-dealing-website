const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Favorite = require('../models/Favorite');

// @desc    Get admin stats
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalProperties, totalInquiries, totalFavorites,
      pendingProperties, approvedProperties, rejectedProperties,
      buyerCount, ownerCount, adminCount] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Inquiry.countDocuments(),
      Favorite.countDocuments(),
      Property.countDocuments({ status: 'pending' }),
      Property.countDocuments({ status: 'approved' }),
      Property.countDocuments({ status: 'rejected' }),
      User.countDocuments({ role: 'buyer' }),
      User.countDocuments({ role: 'owner' }),
      User.countDocuments({ role: 'admin' })
    ]);

    // Recent activity
    const recentProperties = await Property.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 }).limit(5);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers, totalProperties, totalInquiries, totalFavorites,
        pendingProperties, approvedProperties, rejectedProperties,
        buyerCount, ownerCount, adminCount
      },
      recentProperties,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { isActive, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive, role },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin' });
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all properties for admin
// @route   GET /api/admin/properties
const getAdminProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { 'location.city': { $regex: search, $options: 'i' } }
    ];

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, properties, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/reject property
// @route   PUT /api/admin/properties/:id/status
const updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('ownerId', 'name email');

    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats, getUsers, updateUser, deleteUser, getAdminProperties, updatePropertyStatus };
