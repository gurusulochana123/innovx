import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import ProgressBar from '../components/ProgressBar';
import confetti from 'canvas-confetti';
import {
  FileText,
  Send,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  BookOpen,
  Home,
  Trophy,
  DollarSign,
  ShieldCheck,
  Award,
  ArrowRight,
  Bell,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState('');

  const fetchStudentRequest = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/clearance/my-request');
      setRequest(res.data);
      if (res.data && res.data.overallStatus === 'CLEARED') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setRequest(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchStudentRequest();
    else { setRequest(null); setLoading(false); }
  }, [user?._id, user?.studentId, user?.email]);

  const handleCreateRequest = async () => {
    try {
      setSubmitting(true);
      setError('');
      const res = await api.post('/clearance/create');
      setRequest(res.data);
      setShowConfirmModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create clearance request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!request) return;
    try {
      const response = await api.get(`/certificate/${request.requestId}?download=true`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `No_Dues_Certificate_${user.studentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Unable to generate PDF. Please try again.');
    }
  };

  const departments = request ? request.departments : [];
  const approvedCount = departments.filter((d) => d.status === 'Approved').length;
  const pendingCount  = departments.filter((d) => d.status === 'Pending').length;
  const rejectedCount = departments.filter((d) => d.status === 'Rejected').length;
  const progress      = request ? Math.round((approvedCount / 4) * 100) : 0;

  const deptIcons = { Library: BookOpen, Hostels: Home, Sports: Trophy, Accounts: DollarSign };

  if (loading) {
    return (
      <Sidebar>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-purple-900">Loading your dashboard…</p>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Welcome Hero ── */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-lavender-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white/10 text-lavender-200 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-3 border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Student Governance Desk
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, {user?.name} 👋
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-lavender-200">
                <span>ID: <strong className="text-white font-mono">{user?.studentId}</strong></span>
                <span>·</span>
                <span>{user?.course || 'B.Tech'}</span>
                <span>·</span>
                <span>Year {user?.academicYear || '2026'}</span>
              </div>
            </div>

            {/* Action */}
            {!request ? (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-white font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 hover:scale-105"
              >
                <Send className="w-4 h-4" />
                Apply for No-Dues
              </button>
            ) : request.overallStatus === 'CLEARED' ? (
              <button
                onClick={handleDownloadPDF}
                className="py-3 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Certificate
              </button>
            ) : (
              <Link
                to="/student/clearance"
                className="py-3 px-5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-2xl border border-white/20 flex items-center gap-2 transition-all"
              >
                <Clock className="w-4 h-4 animate-pulse" />
                View Clearance Status
              </Link>
            )}
          </div>
        </div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Progress',  value: `${progress}%`,  icon: Award,        color: 'text-purple-700',  bg: 'bg-purple-50',  border: 'border-purple-200' },
            { label: 'Approved',  value: approvedCount,   icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { label: 'Pending',   value: pendingCount,    icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200' },
            { label: 'Rejected',  value: rejectedCount,   icon: XCircle,      color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-200' },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 border ${border} flex items-center justify-between`}>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                <div className={`text-2xl font-extrabold ${color} mt-0.5`}>{value}</div>
              </div>
              <Icon className={`w-6 h-6 ${color} opacity-50`} />
            </div>
          ))}
        </div>

        {/* ── My Clearance CTA card or Progress ── */}
        {!request ? (
          /* No request yet */
          <div className="bg-white rounded-2xl border border-lavender-200 p-8 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-lavender-100 text-purple-700 flex items-center justify-center mx-auto mb-4 border border-lavender-200">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">No Application Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
              Start your digital clearance process. Your request will be routed automatically to all 4 departments.
            </p>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="py-3 px-8 bg-gradient-to-r from-purple-700 to-lavender-600 hover:from-purple-800 text-white font-bold text-xs rounded-2xl shadow-lg inline-flex items-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              Apply for No-Dues Clearance
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Progress bar */}
            <ProgressBar approvedCount={approvedCount} totalCount={4} />

            {/* Department mini-cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {departments.map((dept) => {
                const Icon = deptIcons[dept.departmentName] || ShieldCheck;
                const isApproved = dept.status === 'Approved';
                const isRejected = dept.status === 'Rejected';
                return (
                  <div
                    key={dept.departmentName}
                    className={`rounded-2xl border p-4 flex flex-col items-center text-center gap-2 transition-all ${
                      isApproved ? 'bg-emerald-50 border-emerald-200'
                      : isRejected ? 'bg-rose-50 border-rose-200'
                      : 'bg-white border-lavender-200'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isApproved ? 'text-emerald-600' : isRejected ? 'text-rose-600' : 'text-amber-500'}`} />
                    <div className="text-xs font-extrabold text-slate-800">{dept.departmentName}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isApproved ? 'bg-emerald-100 text-emerald-700'
                      : isRejected ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                    }`}>
                      {dept.status}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Go to full clearance page */}
            <Link
              to="/student/clearance"
              className="flex items-center justify-between bg-white border border-lavender-200 rounded-2xl px-5 py-4 hover:border-purple-400 hover:bg-lavender-50 transition-all group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-lavender-100 text-purple-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900">My Clearance Portal</div>
                  <div className="text-[11px] text-slate-500">View full details, timeline & download certificate</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-lavender-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Cleared success bar */}
            {request.overallStatus === 'CLEARED' && (
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8" />
                  <div>
                    <div className="font-extrabold text-sm">🎉 All Departments Cleared!</div>
                    <div className="text-xs text-emerald-100 mt-0.5">Your No-Dues Certificate is ready.</div>
                  </div>
                </div>
                <button
                  onClick={handleDownloadPDF}
                  className="py-2 px-5 bg-white text-emerald-900 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 hover:bg-emerald-50 transition-all"
                >
                  <Download className="w-4 h-4 text-emerald-700" />
                  Download PDF
                </button>
              </div>
            )}

            {/* Rejection notice */}
            {rejectedCount > 0 && (
              <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-sm text-rose-900">Action Required</div>
                  <div className="text-xs text-rose-700 mt-1">
                    {rejectedCount} department(s) rejected your request. Visit{' '}
                    <Link to="/student/clearance" className="underline font-bold">My Clearance</Link>{' '}
                    to see reasons and resolve dues.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notifications tip */}
        <div className="bg-lavender-50 border border-lavender-200 rounded-2xl px-5 py-4 flex items-center gap-3 text-xs text-slate-600">
          <Bell className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <span>You'll receive in-app notifications whenever a department approves or rejects your clearance request.</span>
        </div>
      </div>

      {/* ── Confirm Modal ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-lavender-200">
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">Confirm Clearance Request</h3>
            <p className="text-xs text-slate-500 mb-5">
              This will route your file to all 4 departments simultaneously.
            </p>

            {error && (
              <div className="mb-4 text-xs bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-200 font-medium">{error}</div>
            )}

            <div className="bg-lavender-50 p-4 rounded-2xl border border-lavender-200 space-y-2 mb-5 text-xs">
              {[
                ['Student Name',    user?.name],
                ['Registration ID', user?.studentId],
                ['Course',          user?.course || 'B.Tech'],
                ['Academic Year',   user?.academicYear || '2026'],
                ['Departments',     'Library · Hostels · Sports · Accounts'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-slate-500">{label}:</span>
                  <span className="font-bold text-slate-900 text-right">{val}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                disabled={submitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
};

export default StudentDashboard;
