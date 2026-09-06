const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllRequests,
  getAllUsers,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/requests', getAllRequests);
router.get('/users', getAllUsers);

module.exports = router;
