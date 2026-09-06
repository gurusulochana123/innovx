import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, X } from 'lucide-react';

const ApprovalModal = ({ isOpen, onClose, onConfirm, student, department, officer }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !student) return null;

  const prefixMap = {
    Library: 'LIB',
    Hostels: 'HST',
    Sports: 'SPT',
    Accounts: 'ACC',
  };

  const sampleId = `${prefixMap[department] || 'CLR'}-CLR-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleApprove = async () => {
    setIsSubmitting(true);
    await onConfirm();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Digital Clearance Verification
        </h3>
        <p className="text-xs text-slate-600 mb-5">
          Are you sure you want to digitally approve this clearance request?
        </p>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 mb-6 text-xs text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Student Name:</span>
            <span className="font-bold text-slate-900">{student.studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Student ID:</span>
            <span className="font-mono font-semibold">{student.studentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Department:</span>
            <span className="font-bold text-emerald-700">{department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Approving Officer:</span>
            <span>{officer?.name} ({officer?.employeeId || 'Staff'})</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
            <span className="text-slate-500">Generated Verification ID:</span>
            <span className="font-mono text-brand-700 font-bold bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
              {sampleId}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSubmitting ? 'Verifying...' : 'Digitally Approve'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
