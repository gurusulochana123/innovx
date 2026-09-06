const express = require('express');
const router = express.Router();
const {
  createClearanceRequest,
  getStudentClearanceRequest,
  getClearanceRequestById,
} = require('../controllers/clearanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create', protect, authorize('student'), createClearanceRequest);
router.get('/student/:studentId', protect, getStudentClearanceRequest);
router.get('/my-request', protect, authorize('student'), (req, res) => {
  req.params.studentId = req.user.studentId;
  getStudentClearanceRequest(req, res);
});
router.get('/:requestId', protect, getClearanceRequestById);

module.exports = router;
