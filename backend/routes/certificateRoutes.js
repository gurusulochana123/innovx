const express = require('express');
const router = express.Router();
const {
  getCertificateByRequestId,
  verifyCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

// Public QR verification endpoint
router.get('/verify/:verificationId', verifyCertificate);
router.get('/v/:verificationId', verifyCertificate);

// Protected certificate endpoint
router.get('/:requestId', (req, res, next) => {
  // If request comes to /api/verify/NDC-... pass to verifyCertificate
  if (req.baseUrl === '/api/verify' || req.params.requestId.startsWith('NDC-') || req.params.requestId.includes('-CLR-')) {
    req.params.verificationId = req.params.requestId;
    return verifyCertificate(req, res);
  }
  protect(req, res, () => getCertificateByRequestId(req, res));
});

module.exports = router;
