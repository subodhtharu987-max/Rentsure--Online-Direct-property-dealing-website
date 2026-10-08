const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'replied', 'closed'],
    default: 'pending'
  },
  reply: {
    type: String,
    maxlength: [2000, 'Reply cannot exceed 2000 characters']
  },
  repliedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
