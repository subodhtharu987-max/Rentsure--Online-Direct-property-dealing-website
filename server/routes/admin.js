const express = require('express');
const router = express.Router();
const {
  getStats, getUsers, updateUser, deleteUser,
  getAdminProperties, updatePropertyStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/properties', getAdminProperties);
router.put('/properties/:id/status', updatePropertyStatus);

module.exports = router;
