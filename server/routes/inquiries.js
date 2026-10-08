const express = require('express');
const router = express.Router();
const { createInquiry, getInquiries, replyInquiry, deleteInquiry } = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createInquiry);
router.get('/', protect, getInquiries);
router.put('/:id/reply', protect, replyInquiry);
router.delete('/:id', protect, deleteInquiry);

module.exports = router;
