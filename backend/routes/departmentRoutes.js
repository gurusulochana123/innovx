const express = require('express');
const router = express.Router();
const {
  getDepartmentRequests,
  approveDepartmentRequest,
  rejectDepartmentRequest,
} = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('department', 'admin'));

router.get('/requests', getDepartmentRequests);
router.put('/:requestId/approve', approveDepartmentRequest);
router.put('/:requestId/reject', rejectDepartmentRequest);

module.exports = router;
