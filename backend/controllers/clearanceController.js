const mongoose = require('mongoose');
const ClearanceRequest = require('../models/ClearanceRequest');
const Notification = require('../models/Notification');
const memoryStore = require('../utils/memoryStore');

// @desc Create new clearance request for logged in student
// @route POST /api/clearance/create
const createClearanceRequest = async (req, res) => {
  try {
    const student = req.user;

    if (!student || student.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit clearance requests.' });
    }

    const uniqueNum = Math.floor(100000 + Math.random() * 900000);
    const requestId = `REQ-2026-${uniqueNum}`;

    const defaultDepartments = [
      { departmentName: 'Library', status: 'Pending' },
      { departmentName: 'Hostels', status: 'Pending' },
      { departmentName: 'Sports', status: 'Pending' },
      { departmentName: 'Accounts', status: 'Pending' },
    ];

    if (mongoose.connection.readyState === 1) {
      // Find if student already has an active request
      const existingRequest = await ClearanceRequest.findOne({
        $or: [{ student: student._id }, { studentId: student.studentId }],
        overallStatus: { $in: ['PENDING', 'PARTIALLY_APPROVED'] },
      });

      if (existingRequest) {
        return res.status(400).json({
          message: 'You already have an active clearance request in progress.',
          request: existingRequest,
        });
      }

      const clearanceRequest = await ClearanceRequest.create({
        requestId,
        student: student._id,
        studentId: student.studentId || `STD-${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: student.name,
        course: student.course || 'B.Tech Computer Science',
        academicYear: student.academicYear || '2026',
        overallStatus: 'PENDING',
        departments: defaultDepartments,
      });

      await Notification.create({
        userId: student._id,
        message: `Clearance Request ${requestId} submitted successfully. Pending approvals from Library, Hostels, Sports, and Accounts.`,
        type: 'info',
        relatedRequestId: requestId,
      });

      return res.status(201).json(clearanceRequest);
    } else {
      await memoryStore.seed();

      // Check in memory store for student's specific request
      const existingRequest = memoryStore.requests.find(
        (r) =>
          (r.studentId === student.studentId || r.student.toString() === student._id.toString()) &&
          ['PENDING', 'PARTIALLY_APPROVED'].includes(r.overallStatus)
      );

      if (existingRequest) {
        return res.status(400).json({
          message: 'You already have an active clearance request in progress.',
          request: existingRequest,
        });
      }

      const clearanceRequest = {
        _id: 'req_' + Date.now(),
        requestId,
        student: student._id,
        studentId: student.studentId || `STD-${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: student.name,
        course: student.course || 'B.Tech Computer Science',
        academicYear: student.academicYear || '2026',
        overallStatus: 'PENDING',
        departments: defaultDepartments,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memoryStore.requests.push(clearanceRequest);

      memoryStore.notifications.push({
        _id: 'notif_' + Date.now(),
        userId: student._id,
        message: `Clearance Request ${requestId} submitted. Pending approvals from Library, Hostels, Sports, and Accounts.`,
        type: 'info',
        read: false,
        relatedRequestId: requestId,
        createdAt: new Date(),
      });

      return res.status(201).json(clearanceRequest);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get active clearance request for logged in student
// @route GET /api/clearance/student/:studentId
const getStudentClearanceRequest = async (req, res) => {
  try {
    const studentId = req.params.studentId || (req.user && req.user.studentId);
    const userId = req.user ? req.user._id : null;

    if (mongoose.connection.readyState === 1) {
      const request = await ClearanceRequest.findOne({
        $or: [{ studentId: studentId }, { student: userId }],
      })
        .sort({ createdAt: -1 })
        .populate('student', 'name email studentId course academicYear');

      if (!request) {
        return res.status(404).json({ message: 'No clearance request found for this student.' });
      }

      return res.json(request);
    } else {
      await memoryStore.seed();
      const request = memoryStore.requests
        .filter((r) => r.studentId === studentId || (userId && r.student && r.student.toString() === userId.toString()))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      if (!request) {
        return res.status(404).json({ message: 'No clearance request found for this student.' });
      }

      return res.json(request);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get clearance request by requestId
// @route GET /api/clearance/:requestId
const getClearanceRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const request = await ClearanceRequest.findOne({ requestId }).populate(
        'student',
        'name email studentId course academicYear'
      );

      if (!request) {
        return res.status(404).json({ message: 'Clearance request not found.' });
      }

      return res.json(request);
    } else {
      await memoryStore.seed();
      const request = memoryStore.requests.find((r) => r.requestId === requestId);

      if (!request) {
        return res.status(404).json({ message: 'Clearance request not found.' });
      }

      return res.json(request);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClearanceRequest,
  getStudentClearanceRequest,
  getClearanceRequestById,
};
