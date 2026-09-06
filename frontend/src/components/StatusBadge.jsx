import React from 'react';
import { Clock, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

const StatusBadge = ({ status, size = 'normal' }) => {
  const normalized = (status || '').toUpperCase();

  const sizeClasses = size === 'large' 
    ? 'px-3.5 py-1.5 text-sm font-semibold' 
    : 'px-2.5 py-1 text-xs font-semibold';

  if (normalized === 'APPROVED' || normalized === 'CLEARED') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs ${sizeClasses}`}>
        <CheckCircle2 className={size === 'large' ? 'w-4 h-4 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />
        {normalized === 'CLEARED' ? 'CLEARED ✓' : 'Approved'}
      </span>
    );
  }

  if (normalized === 'REJECTED') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200/80 shadow-xs ${sizeClasses}`}>
        <XCircle className={size === 'large' ? 'w-4 h-4 text-rose-600' : 'w-3.5 h-3.5 text-rose-600'} />
        Rejected
      </span>
    );
  }

  if (normalized === 'PARTIALLY_APPROVED') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-lavender-100 text-purple-900 border border-lavender-300 shadow-xs ${sizeClasses}`}>
        <ShieldCheck className={size === 'large' ? 'w-4 h-4 text-purple-700' : 'w-3.5 h-3.5 text-purple-700'} />
        In Progress
      </span>
    );
  }

  // Pending default
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs ${sizeClasses}`}>
      <Clock className={size === 'large' ? 'w-4 h-4 text-amber-600 animate-spin' : 'w-3.5 h-3.5 text-amber-600'} style={{ animationDuration: '6s' }} />
      Pending
    </span>
  );
};

export default StatusBadge;
