const mongoose = require('mongoose');
const User = require('../models/User');
const ClearanceRequest = require('../models/ClearanceRequest');
const memoryStore = require('../utils/memoryStore');

// @desc Get admin dashboard statistics
// @route GET /api/admin/dashboard
const getAdminDashboard = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalStudents = await User.countDocuments({ role: 'student' });
      const totalRequests = await ClearanceRequest.countDocuments();
      const pendingRequests = await ClearanceRequest.countDocuments({ overallStatus: 'PENDING' });
      const partiallyApprovedRequests = await ClearanceRequest.countDocuments({ overallStatus: 'PARTIALLY_APPROVED' });
      const completedRequests = await ClearanceRequest.countDocuments({ overallStatus: 'CLEARED' });
      const rejectedRequests = await ClearanceRequest.countDocuments({ overallStatus: 'REJECTED' });

      const departments = ['Library', 'Hostels', 'Sports', 'Accounts'];
      const departmentStats = {};

      for (const dept of departments) {
        const totalDeptProcessed = await ClearanceRequest.countDocuments({
          'departments.departmentName': dept,
          'departments.status': { $in: ['Approved', 'Rejected'] },
        });

        const deptApproved = await ClearanceRequest.countDocuments({
          'departments.departmentName': dept,
          'departments.status': 'Approved',
        });

        const percentage = totalDeptProcessed > 0
          ? Math.round((deptApproved / totalDeptProcessed) * 100)
          : 100;

        departmentStats[dept] = {
          approved: deptApproved,
          totalProcessed: totalDeptProcessed,
          percentage,
        };
      }

      const recentRequests = await ClearanceRequest.find()
        .sort({ createdAt: -1 })
        .limit(5);

      return res.json({
        summary: {
          totalStudents,
          totalRequests,
          pendingRequests: pendingRequests + partiallyApprovedRequests,
          completedRequests,
          rejectedRequests,
        },
        departmentStats,
        recentRequests,
      });
    } else {
      await memoryStore.seed();
      const totalStudents = memoryStore.users.filter((u) => u.role === 'student').length;
      const totalRequests = memoryStore.requests.length;
      const pendingRequests = memoryStore.requests.filter((r) => r.overallStatus === 'PENDING').length;
      const partiallyApprovedRequests = memoryStore.requests.filter((r) => r.overallStatus === 'PARTIALLY_APPROVED').length;
      const completedRequests = memoryStore.requests.filter((r) => r.overallStatus === 'CLEARED').length;
      const rejectedRequests = memoryStore.requests.filter((r) => r.overallStatus === 'REJECTED').length;

      const departments = ['Library', 'Hostels', 'Sports', 'Accounts'];
      const departmentStats = {};

      for (const dept of departments) {
        let totalDeptProcessed = 0;
        let deptApproved = 0;

        memoryStore.requests.forEach((r) => {
          const item = r.departments.find((d) => d.departmentName === dept);
          if (item && ['Approved', 'Rejected'].includes(item.status)) totalDeptProcessed++;
          if (item && item.status === 'Approved') deptApproved++;
        });

        const percentage = totalDeptProcessed > 0
          ? Math.round((deptApproved / totalDeptProcessed) * 100)
          : 100;

        departmentStats[dept] = {
          approved: deptApproved,
          totalProcessed: totalDeptProcessed,
          percentage,
        };
      }

      const recentRequests = [...memoryStore.requests]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      return res.json({
        summary: {
          totalStudents,
          totalRequests,
          pendingRequests: pendingRequests + partiallyApprovedRequests,
          completedRequests,
          rejectedRequests,
        },
        departmentStats,
        recentRequests,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all clearance requests
// @route GET /api/admin/requests
const getAllRequests = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const requests = await ClearanceRequest.find().sort({ createdAt: -1 });
      return res.json(requests);
    } else {
      await memoryStore.seed();
      const requests = [...memoryStore.requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(requests);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all system users
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().select('-password').sort({ role: 1, name: 1 });
      return res.json(users);
    } else {
      await memoryStore.seed();
      const users = memoryStore.users.map(({ password, ...u }) => u);
      return res.json(users);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminDashboard,
  getAllRequests,
  getAllUsers,
};
