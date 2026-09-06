import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { ShieldCheck, GraduationCap, Building2, ShieldAlert } from 'lucide-react';

// Navbar is shown ONLY on public pages (login, register, verify).
// When logged in and inside a dashboard, the Sidebar handles navigation.
const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getRoleBadge = () => {
    if (!user) return null;
    if (user.role === 'student') return (
      <span className="bg-lavender-100 text-purple-900 text-[11px] font-bold px-3 py-1 rounded-full border border-lavender-200 flex items-center gap-1.5 shadow-xs">
        <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
        Student Portal
      </span>
    );
    if (user.role === 'admin') return (
      <span className="bg-purple-100 text-purple-950 text-[11px] font-bold px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1.5 shadow-xs">
        <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
        Admin
      </span>
    );
    if (user.role === 'department') return (
      <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-xs">
        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
        {user.department} Officer
      </span>
    );
    return null;
  };

  // If logged in, the sidebar handles the layout — hide this top navbar
  if (user) return null;

  return (
    <header className="bg-white border-b border-lavender-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-800 via-lavender-700 to-purple-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shadow-purple-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                Clear<span className="text-purple-700">Campus</span>
              </span>
              <span className="block text-[10px] font-bold text-lavender-600 tracking-wider uppercase -mt-1">
                Digital Governance Portal
              </span>
            </div>
          </Link>

          {/* Guest nav */}
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-purple-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-purple-700 to-lavender-600 hover:from-purple-800 text-white rounded-xl shadow-md transition-all shadow-purple-600/20"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
