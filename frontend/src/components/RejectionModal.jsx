import React, { useState } from 'react';
import { AlertOctagon, XCircle, X } from 'lucide-react';

const RejectionModal = ({ isOpen, onClose, onConfirm, student, department }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !student) return null;

  const presets = [
    'Library book not returned',
    'Hostel room dues pending',
    'Sports equipment missing/damaged',
    'Tuition fee payment pending',
  ];

  const handleReject = async () => {
    if (!reason.trim()) {
      setError('Please provide a specific reason for rejection.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    await onConfirm(reason.trim());
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

        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
          <AlertOctagon className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Reject Clearance Request
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Please specify the outstanding dues or unreturned assets for {student.studentName} ({student.studentId}).
        </p>

        {error && (
          <div className="mb-3 text-xs bg-rose-50 text-rose-700 p-2.5 rounded-lg border border-rose-200 font-medium">
            {error}
          </div>
        )}

        {/* Presets */}
        <div className="mb-3">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Quick Reason Presets:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setReason(preset);
                  setError('');
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Detailed Reason for Rejection:
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. 2 books overdue from Central Library; Fine amount ₹450 pending."
            className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal;
