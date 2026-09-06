const mongoose = require('mongoose');

const departmentStatusSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    enum: ['Library', 'Hostels', 'Sports', 'Accounts'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  processedBy: {
    type: String,
    default: null,
  },
  employeeId: {
    type: String,
    default: null,
  },
  verificationId: {
    type: String,
    default: null,
  },
  rejectionReason: {
    type: String,
    default: null,
  },
  processedAt: {
    type: Date,
    default: null,
  },
});

const clearanceRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      default: 'B.Tech Computer Science',
    },
    academicYear: {
      type: String,
      default: '2026',
    },
    overallStatus: {
      type: String,
      enum: ['PENDING', 'PARTIALLY_APPROVED', 'CLEARED', 'REJECTED'],
      default: 'PENDING',
    },
    departments: [departmentStatusSchema],
  },
  {
    timestamps: true,
  }
);

const ClearanceRequest = mongoose.model('ClearanceRequest', clearanceRequestSchema);
module.exports = ClearanceRequest;
