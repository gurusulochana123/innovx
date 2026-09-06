import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, User, BookOpen, Home, Trophy, DollarSign, ShieldAlert } from 'lucide-react';

const DemoSwitcher = () => {
  const { user, loginAsDemoRole } = useContext(AuthContext);

  const roles = [
    { key: 'student', label: 'Student', icon: User, color: 'bg-purple-600' },
    { key: 'Library', label: 'Library Staff', icon: BookOpen, color: 'bg-emerald-600' },
    { key: 'Hostels', label: 'Hostel Warden', icon: Home, color: 'bg-amber-600' },
    { key: 'Sports', label: 'Sports Coach', icon: Trophy, color: 'bg-indigo-600' },
    { key: 'Accounts', label: 'Accounts Officer', icon: DollarSign, color: 'bg-teal-600' },
    { key: 'admin', label: 'College Admin', icon: ShieldAlert, color: 'bg-slate-900' },
  ];

  const getCurrentActiveKey = () => {
    if (!user) return '';
    if (user.role === 'student') return 'student';
    if (user.role === 'admin') return 'admin';
    if (user.role === 'department') return user.department;
    return '';
  };

  const activeKey = getCurrentActiveKey();

  return (
    <div className="bg-gradient-to-r from-purple-950 via-slate-950 to-purple-950 text-white text-xs py-2 px-4 shadow-md border-b border-purple-900/40 flex items-center justify-between flex-wrap gap-2 z-50">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 font-bold text-amber-300 uppercase tracking-wider text-[11px] bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          Hackathon Quick Switcher
        </span>
        <span className="hidden md:inline text-lavender-200 text-xs">
          Click any role to test end-to-end workflow instantly:
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = activeKey === role.key;

          return (
            <button
              key={role.key}
              onClick={() => loginAsDemoRole(role.key)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                isActive
                  ? `${role.color} text-white shadow-sm ring-2 ring-white/30 font-bold scale-105`
                  : 'bg-white/10 text-lavender-100 hover:bg-white/20 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{role.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DemoSwitcher;
