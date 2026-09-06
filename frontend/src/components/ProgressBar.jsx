import React from 'react';

const ProgressBar = ({ approvedCount = 0, totalCount = 4 }) => {
  const percentage = Math.round((approvedCount / totalCount) * 100);

  const getGradient = () => {
    if (percentage === 100) return 'from-emerald-500 to-teal-500';
    if (percentage > 0) return 'from-blue-600 to-indigo-600';
    return 'from-amber-500 to-orange-500';
  };

  return (
    <div className="w-full bg-slate-100 p-4 rounded-xl border border-slate-200/80 shadow-xs">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Clearance Approval Progress
        </span>
        <span className="text-sm font-extrabold text-slate-800">
          {approvedCount} of {totalCount} Departments Approved ({percentage}%)
        </span>
      </div>

      <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${getGradient()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
