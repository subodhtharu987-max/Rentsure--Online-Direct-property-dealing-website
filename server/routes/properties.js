const express = require('express');
const router = express.Router();
const {
  getProperties, getProperty, createProperty,
  updateProperty, deleteProperty, getMyListings
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProperties);
router.get('/my-listings', protect, authorize('owner', 'admin'), getMyListings);
router.get('/:id', getProperty);
router.post('/', protect, authorize('owner', 'admin'), createProperty);
router.put('/:id', protect, authorize('owner', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

module.exports = router;
