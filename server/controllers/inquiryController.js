const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Send inquiry
// @route   POST /api/inquiries
const createInquiry = async (req, res) => {
  try {
    const { propertyId, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot send inquiry to your own property' });
    }

    const inquiry = await Inquiry.create({
      userId: req.user._id,
      propertyId,
      ownerId: property.ownerId,
      message
    });

    await inquiry.populate([
      { path: 'userId', select: 'name email phone' },
      { path: 'propertyId', select: 'title location images' },
      { path: 'ownerId', select: 'name email' }
    ]);

    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get inquiries
// @route   GET /api/inquiries
const getInquiries = async (req, res) => {
  try {
    const { role } = req.user;
    const { page = 1, limit = 10 } = req.query;

    let query = {};
    if (role === 'buyer') query.userId = req.user._id;
    else if (role === 'owner') query.ownerId = req.user._id;
    // admin sees all

    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .populate('userId', 'name email phone avatar')
      .populate('propertyId', 'title location images price category type')
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, inquiries, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reply to inquiry
// @route   PUT /api/inquiries/:id/reply
const replyInquiry = async (req, res) => {
  try {
    const { reply } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    if (inquiry.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    inquiry.reply = reply;
    inquiry.status = 'replied';
    inquiry.repliedAt = new Date();
    await inquiry.save();

    res.json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });

    if (inquiry.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await inquiry.deleteOne();
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createInquiry, getInquiries, replyInquiry, deleteInquiry };
