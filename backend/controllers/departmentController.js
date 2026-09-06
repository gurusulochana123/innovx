const mongoose = require('mongoose');
const ClearanceRequest = require('../models/ClearanceRequest');
const Notification = require('../models/Notification');
const Certificate = require('../models/Certificate');
const memoryStore = require('../utils/memoryStore');

const DEPT_PREFIXES = {
  Library: 'LIB',
  Hostels: 'HST',
  Sports: 'SPT',
  Accounts: 'ACC',
};

// @desc Get pending and processed requests for department officer
// @route GET /api/department/requests
const getDepartmentRequests = async (req, res) => {
  try {
    let officerDept = req.user.department || req.query.department || req.body.departmentName;
    if (!officerDept && req.user.role === 'admin') officerDept = 'Library';

    if (!officerDept) {
      return res.status(400).json({ message: 'User is not assigned to any department.' });
    }

    if (mongoose.connection.readyState === 1) {
      const requests = await ClearanceRequest.find({
        'departments.departmentName': officerDept,
      }).sort({ updatedAt: -1 });

      const formattedRequests = requests.map((reqDoc) => {
        const deptItem = reqDoc.departments.find((d) => d.departmentName === officerDept);
        return {
          _id: reqDoc._id,
          requestId: reqDoc.requestId,
          studentId: reqDoc.studentId,
          studentName: reqDoc.studentName,
          course: reqDoc.course,
          academicYear: reqDoc.academicYear,
          createdAt: reqDoc.createdAt,
          overallStatus: reqDoc.overallStatus,
          deptStatus: deptItem ? deptItem.status : 'Pending',
          verificationId: deptItem ? deptItem.verificationId : null,
          rejectionReason: deptItem ? deptItem.rejectionReason : null,
          processedBy: deptItem ? deptItem.processedBy : null,
          employeeId: deptItem ? deptItem.employeeId : null,
          processedAt: deptItem ? deptItem.processedAt : null,
          allDepartments: reqDoc.departments,
        };
      });

      return res.json(formattedRequests);
    } else {
      await memoryStore.seed();
      const requests = memoryStore.requests.filter((r) =>
        r.departments.some((d) => d.departmentName === officerDept)
      );

      const formattedRequests = requests.map((reqDoc) => {
        const deptItem = reqDoc.departments.find((d) => d.departmentName === officerDept);
        return {
          _id: reqDoc._id,
          requestId: reqDoc.requestId,
          studentId: reqDoc.studentId,
          studentName: reqDoc.studentName,
          course: reqDoc.course,
          academicYear: reqDoc.academicYear,
          createdAt: reqDoc.createdAt,
          overallStatus: reqDoc.overallStatus,
          deptStatus: deptItem ? deptItem.status : 'Pending',
          verificationId: deptItem ? deptItem.verificationId : null,
          rejectionReason: deptItem ? deptItem.rejectionReason : null,
          processedBy: deptItem ? deptItem.processedBy : null,
          employeeId: deptItem ? deptItem.employeeId : null,
          processedAt: deptItem ? deptItem.processedAt : null,
          allDepartments: reqDoc.departments,
        };
      });

      return res.json(formattedRequests);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Digitally approve a clearance request for a department
// @route PUT /api/department/:requestId/approve
const approveDepartmentRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const officer = req.user;
    let officerDept = officer.department || req.body.departmentName;
    if (!officerDept && officer.role === 'admin') officerDept = 'Library';

    if (!officerDept) {
      return res.status(400).json({ message: 'User does not belong to a department.' });
    }

    const prefix = DEPT_PREFIXES[officerDept] || 'CLR';
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const verificationId = `${prefix}-CLR-2026-${randNum}`;

    if (mongoose.connection.readyState === 1) {
      const request = await ClearanceRequest.findOne({ requestId });

      if (!request) {
        return res.status(404).json({ message: 'Clearance request not found.' });
      }

      const deptIndex = request.departments.findIndex((d) => d.departmentName === officerDept);
      if (deptIndex === -1) {
        return res.status(400).json({ message: `Department ${officerDept} not found on this request.` });
      }

      request.departments[deptIndex].status = 'Approved';
      request.departments[deptIndex].processedBy = officer.name;
      request.departments[deptIndex].employeeId = officer.employeeId || `${prefix}-OFFICER`;
      request.departments[deptIndex].verificationId = verificationId;
      request.departments[deptIndex].processedAt = new Date();
      request.departments[deptIndex].rejectionReason = null;

      const allApproved = request.departments.every((d) => d.status === 'Approved');
      const anyRejected = request.departments.some((d) => d.status === 'Rejected');

      if (allApproved) {
        request.overallStatus = 'CLEARED';
      } else if (anyRejected) {
        request.overallStatus = 'REJECTED';
      } else {
        request.overallStatus = 'PARTIALLY_APPROVED';
      }

      await request.save();

      if (allApproved) {
        const certRand = Math.floor(100000 + Math.random() * 900000);
        const certificateId = `NDC-2026-${certRand}`;

        const certApprovals = request.departments.map((d) => ({
          departmentName: d.departmentName,
          processedBy: d.processedBy,
          employeeId: d.employeeId,
          verificationId: d.verificationId,
          processedAt: d.processedAt,
        }));

        await Certificate.create({
          certificateId,
          requestId: request.requestId,
          studentId: request.studentId,
          studentName: request.studentName,
          course: request.course,
          academicYear: request.academicYear,
          verificationId: certificateId,
          issuedAt: new Date(),
          departmentApprovals: certApprovals,
        });

        await Notification.create({
          userId: request.student,
          message: '🎉 Congratulations! Your No-Dues Certificate has been automatically generated and is ready for download.',
          type: 'success',
          relatedRequestId: request.requestId,
        });
      } else {
        await Notification.create({
          userId: request.student,
          message: `✓ ${officerDept} department has approved your No-Dues request. (Verification ID: ${verificationId})`,
          type: 'info',
          relatedRequestId: request.requestId,
        });
      }

      return res.json({
        message: `${officerDept} clearance digitally approved successfully.`,
        verificationId,
        request,
      });
    } else {
      await memoryStore.seed();
      const request = memoryStore.requests.find((r) => r.requestId === requestId);

      if (!request) {
        return res.status(404).json({ message: 'Clearance request not found.' });
      }

      const deptIndex = request.departments.findIndex((d) => d.departmentName === officerDept);
      if (deptIndex === -1) {
        return res.status(400).json({ message: `Department ${officerDept} not found on this request.` });
      }

      request.departments[deptIndex].status = 'Approved';
      request.departments[deptIndex].processedBy = officer.name;
      request.departments[deptIndex].employeeId = officer.employeeId || `${prefix}-OFFICER`;
      request.departments[deptIndex].verificationId = verificationId;
      request.departments[deptIndex].processedAt = new Date();
      request.departments[deptIndex].rejectionReason = null;

      const allApproved = request.departments.every((d) => d.status === 'Approved');
      const anyRejected = request.departments.some((d) => d.status === 'Rejected');

      if (allApproved) {
        request.overallStatus = 'CLEARED';
      } else if (anyRejected) {
        request.overallStatus = 'REJECTED';
      } else {
        request.overallStatus = 'PARTIALLY_APPROVED';
      }

      if (allApproved) {
        const certRand = Math.floor(100000 + Math.random() * 900000);
        const certificateId = `NDC-2026-${certRand}`;

        const certApprovals = request.departments.map((d) => ({
          departmentName: d.departmentName,
          processedBy: d.processedBy,
          employeeId: d.employeeId,
          verificationId: d.verificationId,
          processedAt: d.processedAt,
        }));

        memoryStore.certificates.push({
          _id: 'cert_' + Date.now(),
          certificateId,
          requestId: request.requestId,
          studentId: request.studentId,
          studentName: request.studentName,
          course: request.course,
          academicYear: request.academicYear,
          verificationId: certificateId,
          issuedAt: new Date(),
          departmentApprovals: certApprovals,
        });

        memoryStore.notifications.push({
          _id: 'notif_' + Date.now(),
          userId: request.student,
          message: '🎉 Congratulations! Your No-Dues Certificate has been automatically generated and is ready for download.',
          type: 'success',
          read: false,
          relatedRequestId: request.requestId,
          createdAt: new Date(),
        });
      } else {
        memoryStore.notifications.push({
          _id: 'notif_' + Date.now(),
          userId: request.student,
          message: `✓ ${officerDept} department has approved your No-Dues request. (Verification ID: ${verificationId})`,
          type: 'info',
          read: false,
          relatedRequestId: request.requestId,
          createdAt: new Date(),
        });
      }

      return res.json({
        message: `${officerDept} clearance digitally approved successfully.`,
        verificationId,
        request,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reject clearance request with reason
// @route PUT /api/department/:requestId/reject
const rejectDepartmentRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { rejectionReason } = req.body;
    const officer = req.user;
    let officerDept = officer.department || req.body.departmentName;
    if (!officerDept && officer.role === 'admin') officerDept = 'Library';

    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({ message: 'Rejection reason is required.' });
    }

    if (!officerDept) {
      return res.status(400).json({ message: 'User does not belong to a department.' });
    }

    if (mongoose.connection.readyState === 1) {
      const request = await ClearanceRequest.findOne({ requestId });
      if (!request) return res.status(404).json({ message: 'Clearance request not found.' });

      const deptIndex = request.departments.findIndex((d) => d.departmentName === officerDept);
      if (deptIndex === -1) return res.status(400).json({ message: `Department ${officerDept} not found.` });

      request.departments[deptIndex].status = 'Rejected';
      request.departments[deptIndex].processedBy = officer.name;
      request.departments[deptIndex].employeeId = officer.employeeId || `${officerDept.substring(0, 3).toUpperCase()}-OFFICER`;
      request.departments[deptIndex].rejectionReason = rejectionReason.trim();
      request.departments[deptIndex].processedAt = new Date();

      request.overallStatus = 'REJECTED';
      await request.save();

      await Notification.create({
        userId: request.student,
        message: `❌ Your clearance request was rejected by ${officerDept}. Reason: "${rejectionReason.trim()}"`,
        type: 'danger',
        relatedRequestId: request.requestId,
      });

      return res.json({ message: `${officerDept} clearance rejected.`, request });
    } else {
      await memoryStore.seed();
      const request = memoryStore.requests.find((r) => r.requestId === requestId);
      if (!request) return res.status(404).json({ message: 'Clearance request not found.' });

      const deptIndex = request.departments.findIndex((d) => d.departmentName === officerDept);
      if (deptIndex === -1) return res.status(400).json({ message: `Department ${officerDept} not found.` });

      request.departments[deptIndex].status = 'Rejected';
      request.departments[deptIndex].processedBy = officer.name;
      request.departments[deptIndex].employeeId = officer.employeeId || `${officerDept.substring(0, 3).toUpperCase()}-OFFICER`;
      request.departments[deptIndex].rejectionReason = rejectionReason.trim();
      request.departments[deptIndex].processedAt = new Date();

      request.overallStatus = 'REJECTED';

      memoryStore.notifications.push({
        _id: 'notif_' + Date.now(),
        userId: request.student,
        message: `❌ Your clearance request was rejected by ${officerDept}. Reason: "${rejectionReason.trim()}"`,
        type: 'danger',
        read: false,
        relatedRequestId: request.requestId,
        createdAt: new Date(),
      });

      return res.json({ message: `${officerDept} clearance rejected.`, request });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDepartmentRequests,
  approveDepartmentRequest,
  rejectDepartmentRequest,
};
