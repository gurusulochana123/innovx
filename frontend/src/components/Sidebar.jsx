import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  LogOut,
  GraduationCap,
  Building2,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  User,
  BookOpen,
  Home,
  Trophy,
  DollarSign,
  ArrowLeftRight,
} from 'lucide-react';

const Sidebar = ({ children }) => {
  const { user, logout, loginAsDemoRole } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const [collapsed, setCollapsed] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'student') return '/student';
    if (user.role === 'department') return '/department';
    if (user.role === 'admin') return '/admin';
    return '/login';
  };

  const getRoleLabel = () => {
    if (!user) return '';
    if (user.role === 'student') return 'Student Portal';
    if (user.role === 'admin') return 'Admin Governance';
    if (user.role === 'department') return `${user.department} Officer`;
    return '';
  };

  const getRoleIcon = () => {
    if (!user) return <User className="w-4 h-4" />;
    if (user.role === 'student') return <GraduationCap className="w-4 h-4 text-purple-300" />;
    if (user.role === 'admin') return <ShieldAlert className="w-4 h-4 text-purple-300" />;
    if (user.role === 'department') return <Building2 className="w-4 h-4 text-purple-300" />;
    return <User className="w-4 h-4" />;
  };

  const getCurrentActiveKey = () => {
    if (!user) return '';
    if (user.role === 'student') return 'student';
    if (user.role === 'admin') return 'admin';
    if (user.role === 'department') return user.department;
    return '';
  };

  const activeKey = getCurrentActiveKey();

  const portalRoles = [
    { key: 'student',  label: 'Student Portal',    icon: GraduationCap, color: 'bg-purple-600',  desc: 'Clearance tracker' },
    { key: 'Library',  label: 'Library',            icon: BookOpen,      color: 'bg-emerald-600', desc: 'Staff dashboard' },
    { key: 'Hostels',  label: 'Hostel',             icon: Home,          color: 'bg-amber-600',   desc: 'Warden dashboard' },
    { key: 'Sports',   label: 'Sports',             icon: Trophy,        color: 'bg-indigo-600',  desc: 'Coach dashboard' },
    { key: 'Accounts', label: 'Accounts',           icon: DollarSign,    color: 'bg-teal-600',    desc: 'Officer dashboard' },
    { key: 'admin',    label: 'Admin',              icon: ShieldAlert,   color: 'bg-slate-700',   desc: 'Governance panel' },
  ];

  return (
    <div className="min-h-screen flex bg-lavender-50">
      {/* Left Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-purple-950 via-lavender-950 to-slate-950 text-white z-40 transition-all duration-300 flex flex-col justify-between border-r border-lavender-900/40 shadow-2xl ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="overflow-y-auto flex-1">
          {/* Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 sticky top-0 bg-purple-950 z-10">
            {!collapsed ? (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-lavender-600 to-purple-500 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-600/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-tight flex items-center text-white">
                    Clear<span className="text-lavender-300">Campus</span>
                  </span>
                  <span className="block text-[9px] font-bold text-lavender-200 uppercase tracking-widest -mt-1">
                    Digital Governance
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-lavender-600 to-purple-500 text-white flex items-center justify-center font-bold shadow-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-lavender-200 hover:text-white transition-colors"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Role Badge — no name shown */}
          {user && (
            <div className="p-4 border-b border-white/10 bg-white/5">
              {!collapsed ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lavender-500 to-purple-700 text-white flex items-center justify-center font-extrabold text-sm shadow-md border border-white/20">
                    {getRoleIcon()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-[11px] font-bold text-lavender-200 uppercase tracking-widest">
                      {getRoleLabel()}
                    </div>
                    <div className="text-[10px] text-white/50 mt-0.5 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-lavender-500 to-purple-700 text-white flex items-center justify-center shadow-md border border-white/20">
                  {getRoleIcon()}
                </div>
              )}
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <NavLink
              to={getDashboardPath()}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-lavender-600 to-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-lavender-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            {user?.role === 'student' && (
              <NavLink
                to="/student/clearance"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-lavender-600 to-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-lavender-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>My Clearance</span>}
                {!collapsed && unreadCount > 0 && (
                  <span className="ml-auto bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            )}

            {user?.role === 'department' && (
              <NavLink
                to="/department"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-lavender-600 to-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-lavender-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Officer Queue</span>}
              </NavLink>
            )}

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-lavender-600 to-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-lavender-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>Campus Telemetry</span>}
              </NavLink>
            )}
          </nav>

          {/* ─── Portal Switcher ─── */}
          <div className="p-3 border-t border-white/10 mt-2">
            {!collapsed ? (
              <div>
                <button
                  onClick={() => setSwitcherOpen(!switcherOpen)}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-lavender-200 hover:text-white text-xs font-bold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-300" />
                    Switch Portal
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${switcherOpen ? 'rotate-90' : ''}`}
                  />
                </button>

                {switcherOpen && (
                  <div className="mt-2 space-y-1">
                    {portalRoles.map((role) => {
                      const Icon = role.icon;
                      const isActive = activeKey === role.key;
                      return (
                        <button
                          key={role.key}
                          onClick={() => { loginAsDemoRole(role.key); setSwitcherOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                            isActive
                              ? `${role.color} text-white shadow-sm ring-1 ring-white/30`
                              : 'bg-white/5 text-lavender-200 hover:bg-white/15 hover:text-white'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <div className="text-left">
                            <div className="font-bold leading-tight">{role.label}</div>
                            <div className="text-[10px] opacity-70">{role.desc}</div>
                          </div>
                          {isActive && (
                            <span className="ml-auto text-[9px] bg-white/20 px-1.5 py-0.5 rounded uppercase font-bold">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Collapsed: icon-only portal switcher */
              <div className="flex flex-col gap-1.5 items-center">
                {portalRoles.map((role) => {
                  const Icon = role.icon;
                  const isActive = activeKey === role.key;
                  return (
                    <button
                      key={role.key}
                      onClick={() => loginAsDemoRole(role.key)}
                      title={`Switch to ${role.label}`}
                      className={`p-2 rounded-lg transition-all ${
                        isActive
                          ? `${role.color} text-white ring-1 ring-white/30`
                          : 'bg-white/5 text-lavender-200 hover:bg-white/15 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Sign Out */}
        <div className="p-3 border-t border-white/10 bg-black/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs text-rose-300 hover:bg-rose-500/20 hover:text-rose-100 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
