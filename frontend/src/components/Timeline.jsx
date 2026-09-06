import React from 'react';
import { CheckCircle2, Clock, XCircle, ShieldCheck, FileCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';

const Timeline = ({ request }) => {
  if (!request) return null;

  const departments = request.departments || [];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
      <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
        <FileCheck className="w-5 h-5 text-brand-700" />
        Department Clearance Timeline & Verification Logs
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {/* Step 0: Request Submitted */}
        <div className="relative group">
          <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-brand-800 text-white flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="font-bold text-sm text-slate-900">
                Clearance Request Submitted
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {new Date(request.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Request ID: <span className="font-mono text-brand-700 font-semibold">{request.requestId}</span> created by {request.studentName} ({request.studentId}).
            </p>
          </div>
        </div>

        {/* Steps 1 to 4: Department Steps */}
        {departments.map((dept, index) => {
          const isApproved = dept.status === 'Approved';
          const isRejected = dept.status === 'Rejected';

          return (
            <div key={dept.departmentName} className="relative">
              <div
                className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow-xs text-white ${
                  isApproved
                    ? 'bg-emerald-600'
                    : isRejected
                    ? 'bg-rose-600'
                    : 'bg-slate-300 text-slate-600'
                }`}
              >
                {isApproved ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isRejected ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
              </div>

              <div
                className={`p-4 rounded-xl border transition-all ${
                  isApproved
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : isRejected
                    ? 'bg-rose-50/40 border-rose-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center flex-wrap gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {dept.departmentName} Clearance
                    </span>
                    <StatusBadge status={dept.status} />
                  </div>

                  {dept.processedAt && (
                    <span className="text-xs text-slate-500 font-medium">
                      {new Date(dept.processedAt).toLocaleString()}
                    </span>
                  )}
                </div>

                {isApproved && (
                  <div className="mt-2 space-y-1 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Digitally Verified by {dept.processedBy} ({dept.employeeId || 'Officer'})</span>
                    </div>
                    <div className="font-mono text-slate-600">
                      Verification ID: <span className="font-bold text-brand-800">{dept.verificationId}</span>
                    </div>
                  </div>
                )}

                {isRejected && (
                  <div className="mt-2 text-xs bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-rose-800">
                    <span className="font-bold">Rejection Reason:</span> "{dept.rejectionReason}"
                    <div className="text-[11px] text-rose-600 mt-0.5">
                      Action Officer: {dept.processedBy} ({dept.employeeId})
                    </div>
                  </div>
                )}

                {!isApproved && !isRejected && (
                  <p className="text-xs text-slate-500 mt-1 italic">
                    Awaiting digital sign-off from {dept.departmentName} officer queue.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
