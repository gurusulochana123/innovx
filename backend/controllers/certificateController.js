const mongoose = require('mongoose');
const Certificate = require('../models/Certificate');
const ClearanceRequest = require('../models/ClearanceRequest');
const memoryStore = require('../utils/memoryStore');
const { generateCertificatePDF } = require('../utils/pdfGenerator');

// @desc Get certificate metadata or download PDF
// @route GET /api/certificate/:requestId
const getCertificateByRequestId = async (req, res) => {
  try {
    const { requestId } = req.params;
    const download = req.query.download === 'true';

    let certificate;

    if (mongoose.connection.readyState === 1) {
      certificate = await Certificate.findOne({ requestId });

      if (!certificate) {
        const request = await ClearanceRequest.findOne({ requestId, overallStatus: 'CLEARED' });
        if (!request) {
          return res.status(400).json({
            message: 'Certificate not available yet. All 4 departments must approve first.',
          });
        }

        const certRand = Math.floor(100000 + Math.random() * 900000);
        const certificateId = `NDC-2026-${certRand}`;

        const deptApprovals = request.departments.map((d) => ({
          departmentName: d.departmentName,
          processedBy: d.processedBy,
          employeeId: d.employeeId,
          verificationId: d.verificationId,
          processedAt: d.processedAt,
        }));

        certificate = await Certificate.create({
          certificateId,
          requestId: request.requestId,
          studentId: request.studentId,
          studentName: request.studentName,
          course: request.course,
          academicYear: request.academicYear,
          verificationId: certificateId,
          issuedAt: new Date(),
          departmentApprovals: deptApprovals,
        });
      }
    } else {
      await memoryStore.seed();
      certificate = memoryStore.certificates.find((c) => c.requestId === requestId);

      if (!certificate) {
        const request = memoryStore.requests.find((r) => r.requestId === requestId && r.overallStatus === 'CLEARED');
        if (!request) {
          return res.status(400).json({
            message: 'Certificate not available yet. All 4 departments must approve first.',
          });
        }

        const certRand = Math.floor(100000 + Math.random() * 900000);
        const certificateId = `NDC-2026-${certRand}`;

        const deptApprovals = request.departments.map((d) => ({
          departmentName: d.departmentName,
          processedBy: d.processedBy,
          employeeId: d.employeeId,
          verificationId: d.verificationId,
          processedAt: d.processedAt,
        }));

        certificate = {
          _id: 'cert_' + Date.now(),
          certificateId,
          requestId: request.requestId,
          studentId: request.studentId,
          studentName: request.studentName,
          course: request.course,
          academicYear: request.academicYear,
          verificationId: certificateId,
          issuedAt: new Date(),
          departmentApprovals: deptApprovals,
        };

        memoryStore.certificates.push(certificate);
      }
    }

    if (download) {
      return await generateCertificatePDF(certificate, res);
    }

    return res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Verify certificate authenticity by verificationId or certificateId (Public route)
// @route GET /api/verify/:verificationId
const verifyCertificate = async (req, res) => {
  try {
    const { verificationId } = req.params;

    if (mongoose.connection.readyState === 1) {
      let certificate = await Certificate.findOne({
        $or: [{ certificateId: verificationId }, { verificationId: verificationId }],
      });

      if (!certificate) {
        const request = await ClearanceRequest.findOne({
          'departments.verificationId': verificationId,
        });

        if (request) {
          const dept = request.departments.find((d) => d.verificationId === verificationId);
          return res.json({
            valid: true,
            type: 'DEPARTMENT_VERIFICATION',
            verificationId,
            departmentName: dept.departmentName,
            processedBy: dept.processedBy,
            employeeId: dept.employeeId,
            processedAt: dept.processedAt,
            studentName: request.studentName,
            studentId: request.studentId,
            course: request.course,
          });
        }

        return res.status(404).json({
          valid: false,
          message: 'No valid certificate or department verification record found for this ID.',
          verificationId,
        });
      }

      return res.json({
        valid: true,
        type: 'FULL_NO_DUES_CERTIFICATE',
        certificateId: certificate.certificateId,
        verificationId: certificate.verificationId,
        studentName: certificate.studentName,
        studentId: certificate.studentId,
        course: certificate.course,
        academicYear: certificate.academicYear,
        issuedAt: certificate.issuedAt,
        departmentApprovals: certificate.departmentApprovals,
      });
    } else {
      await memoryStore.seed();
      let certificate = memoryStore.certificates.find(
        (c) => c.certificateId === verificationId || c.verificationId === verificationId
      );

      if (!certificate) {
        const request = memoryStore.requests.find((r) =>
          r.departments.some((d) => d.verificationId === verificationId)
        );

        if (request) {
          const dept = request.departments.find((d) => d.verificationId === verificationId);
          return res.json({
            valid: true,
            type: 'DEPARTMENT_VERIFICATION',
            verificationId,
            departmentName: dept.departmentName,
            processedBy: dept.processedBy,
            employeeId: dept.employeeId,
            processedAt: dept.processedAt,
            studentName: request.studentName,
            studentId: request.studentId,
            course: request.course,
          });
        }

        return res.status(404).json({
          valid: false,
          message: 'No valid certificate or department verification record found for this ID.',
          verificationId,
        });
      }

      return res.json({
        valid: true,
        type: 'FULL_NO_DUES_CERTIFICATE',
        certificateId: certificate.certificateId,
        verificationId: certificate.verificationId,
        studentName: certificate.studentName,
        studentId: certificate.studentId,
        course: certificate.course,
        academicYear: certificate.academicYear,
        issuedAt: certificate.issuedAt,
        departmentApprovals: certificate.departmentApprovals,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCertificateByRequestId,
  verifyCertificate,
};
