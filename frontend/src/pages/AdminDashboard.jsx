import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import {
  ShieldAlert,
  Users,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  BarChart3,
  Search,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [dashRes, reqsRes, usersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/requests'),
        api.get('/admin/users'),
      ]);
      setStats(dashRes.data);
      setAllRequests(reqsRes.data);
      setUsersList(usersRes.data);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading || !stats) {
    return (
      <Sidebar>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-purple-900">Loading College Governance Telemetry...</p>
          </div>
        </div>
      </Sidebar>
    );
  }

  const { summary, departmentStats } = stats;

  const filteredRequests = allRequests.filter(
    (r) =>
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.studentId && u.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Sidebar>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Admin Header Banner */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex justify-between items-center flex-wrap gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-purple-400/10 text-purple-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-3 border border-purple-400/20 shadow-xs">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              Central Campus Digital Governance
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Institutional Governance Telemetry
            </h1>
            <p className="text-xs text-lavender-200 mt-1">
              Real-time monitoring of campus clearance requests, department throughput, and user access roles.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Refresh Telemetry
          </button>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-lavender-200/80 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Students
            </div>
            <div className="text-2xl font-extrabold text-purple-950 flex items-center justify-between">
              <span>{summary.totalStudents}</span>
              <Users className="w-6 h-6 text-purple-700" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Registered accounts</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-lavender-200/80 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Requests
            </div>
            <div className="text-2xl font-extrabold text-blue-600 flex items-center justify-between">
              <span>{summary.totalRequests}</span>
              <FileCheck className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-[11px] text-blue-700 mt-1 font-medium">Clearance applications</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-lavender-200/80 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Pending Queue
            </div>
            <div className="text-2xl font-extrabold text-amber-600 flex items-center justify-between">
              <span>{summary.pendingRequests}</span>
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <p className="text-[11px] text-amber-700 mt-1 font-medium">In department queues</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-lavender-200/80 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Completed Cleared
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 flex items-center justify-between">
              <span>{summary.completedRequests}</span>
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">Certificates issued</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-lavender-200/80 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Rejected Requests
            </div>
            <div className="text-2xl font-extrabold text-rose-600 flex items-center justify-between">
              <span>{summary.rejectedRequests}</span>
              <XCircle className="w-6 h-6 text-rose-500" />
            </div>
            <p className="text-[11px] text-rose-700 mt-1 font-medium">Clearance holds</p>
          </div>
        </div>

        {/* Department Rate Analytics Grid */}
        <div className="bg-white p-6 rounded-3xl border border-lavender-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-700" />
            Department Clearance Throughput Rates
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(departmentStats).map(([dept, data]) => (
              <div key={dept} className="bg-lavender-50/50 p-4 rounded-2xl border border-lavender-200/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sm text-slate-900">{dept}</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {data.percentage}% cleared
                  </span>
                </div>

                <div className="w-full bg-lavender-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Approved: <strong className="text-emerald-700">{data.approved}</strong></span>
                  <span>Processed: <strong>{data.totalProcessed}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Switcher & Table */}
        <div className="bg-white rounded-3xl border border-lavender-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-lavender-100 flex justify-between items-center flex-wrap gap-4 bg-lavender-50/40">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'requests'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-lavender-100 text-purple-950 hover:bg-lavender-200'
                }`}
              >
                All Clearance Requests ({allRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'users'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-lavender-100 text-purple-950 hover:bg-lavender-200'
                }`}
              >
                System Users & Officers ({usersList.length})
              </button>
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-lavender-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder={activeTab === 'requests' ? 'Search requests...' : 'Search users...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 text-xs border border-lavender-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none bg-white"
              />
            </div>
          </div>

          {activeTab === 'requests' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-lavender-50/70 uppercase text-[11px] font-bold text-slate-600 tracking-wider border-b border-lavender-200/60">
                  <tr>
                    <th className="py-3.5 px-6">Request ID</th>
                    <th className="py-3.5 px-6">Student</th>
                    <th className="py-3.5 px-6">Course</th>
                    <th className="py-3.5 px-6">Overall Status</th>
                    <th className="py-3.5 px-6">Dept Progress</th>
                    <th className="py-3.5 px-6">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredRequests.map((req) => {
                    const approvedDeptCount = req.departments
                      ? req.departments.filter((d) => d.status === 'Approved').length
                      : 0;

                    return (
                      <tr key={req._id} className="hover:bg-lavender-50/50 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-purple-900">
                          {req.requestId}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{req.studentName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{req.studentId}</div>
                        </td>
                        <td className="py-4 px-6 text-slate-600">{req.course}</td>
                        <td className="py-4 px-6">
                          <StatusBadge status={req.overallStatus} />
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-800">
                            {approvedDeptCount} / 4 Approved
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-500">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-lavender-50/70 uppercase text-[11px] font-bold text-slate-600 tracking-wider border-b border-lavender-200/60">
                  <tr>
                    <th className="py-3.5 px-6">Name</th>
                    <th className="py-3.5 px-6">Email</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6">Department / Emp ID</th>
                    <th className="py-3.5 px-6">Student ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-lavender-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{u.name}</td>
                      <td className="py-4 px-6 text-slate-600">{u.email}</td>
                      <td className="py-4 px-6 capitalize">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-950'
                              : u.role === 'department'
                              ? 'bg-emerald-100 text-emerald-950'
                              : 'bg-lavender-200 text-purple-950'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-700">
                        {u.department ? `${u.department} (${u.employeeId || 'Staff'})` : '-'}
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-purple-900">
                        {u.studentId || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default AdminDashboard;
