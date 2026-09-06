const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    requestId: {
      type: String,
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
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    verificationUrl: {
      type: String,
    },
    departmentApprovals: [
      {
        departmentName: String,
        processedBy: String,
        employeeId: String,
        verificationId: String,
        processedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
