import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import Timeline from '../components/Timeline';
import confetti from 'canvas-confetti';
import {
  FileText,
  Send,
  Download,
  QrCode,
  CheckCircle2,
  Clock,
  XCircle,
  BookOpen,
  Home,
  Trophy,
  DollarSign,
  ShieldCheck,
  Award,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyClearancePage = () => {
  const { user } = useContext(AuthContext);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudentRequest = async (isRefresh = false) => {
    if (!user) return;
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError('');
      const res = await api.get('/clearance/my-request');
      setRequest(res.data);
      if (res.data && res.data.overallStatus === 'CLEARED') {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setRequest(null);
      } else {
        setError('Failed to load clearance data. Please refresh.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
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
      const response = await api.get(`/certificate/${request.requestId}?download=true`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `No_Dues_Certificate_${user.studentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert('Unable to generate PDF certificate. Please try again.');
    }
  };

  const departments = request ? request.departments : [];
  const approvedCount = departments.filter((d) => d.status === 'Approved').length;
  const pendingCount  = departments.filter((d) => d.status === 'Pending').length;
  const rejectedCount = departments.filter((d) => d.status === 'Rejected').length;
  const rejectedDepts = departments.filter((d) => d.status === 'Rejected');

  const deptIcons = { Library: BookOpen, Hostels: Home, Sports: Trophy, Accounts: DollarSign };
  const deptColors = {
    Library:  { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' },
    Hostels:  { bg: 'bg-amber-100',   text: 'text-amber-700',   ring: 'ring-amber-200'   },
    Sports:   { bg: 'bg-indigo-100',  text: 'text-indigo-700',  ring: 'ring-indigo-200'  },
    Accounts: { bg: 'bg-teal-100',    text: 'text-teal-700',    ring: 'ring-teal-200'    },
  };

  if (loading) {
    return (
      <Sidebar>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-purple-900">Loading clearance portal…</p>
          </div>
        </div>
      </Sidebar>
    );
  }

  const progress = request ? Math.round((approvedCount / 4) * 100) : 0;

  return (
    <Sidebar>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-700" />
              My Clearance Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track your no-dues clearance status across all departments in real time.
            </p>
          </div>
          {request && (
            <button
              onClick={() => fetchStudentRequest(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-purple-700 bg-white border border-lavender-200 rounded-xl hover:bg-lavender-50 transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>

        {/* ── Student Info Strip ── */}
        <div className="bg-gradient-to-r from-purple-950 to-lavender-900 rounded-2xl px-6 py-4 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-extrabold text-lg border border-white/20">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="font-extrabold text-sm">{user?.name}</div>
              <div className="text-[11px] text-lavender-200 mt-0.5">
                {user?.studentId} &nbsp;·&nbsp; {user?.course || 'B.Tech'} &nbsp;·&nbsp; {user?.academicYear || '2026'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!request ? (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="py-2.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Apply for No-Dues
              </button>
            ) : request.overallStatus === 'CLEARED' ? (
              <>
                <button
                  onClick={handleDownloadPDF}
                  className="py-2.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </button>
                <Link
                  to={`/verify/${request.requestId}`}
                  className="py-2.5 px-4 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <QrCode className="w-4 h-4" />
                  QR Verify
                </Link>
              </>
            ) : (
              <span className="text-[11px] bg-white/10 text-lavender-200 px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                Review in progress
              </span>
            )}
          </div>
        </div>

        {/* ── No Request State ── */}
        {!request ? (
          <div className="bg-white rounded-3xl p-12 border border-lavender-200 shadow-sm text-center">
            <div className="w-16 h-16 rounded-3xl bg-lavender-100 text-purple-700 flex items-center justify-center mx-auto mb-5 border border-lavender-200">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">No Application Submitted Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              Submit your clearance request to route it automatically to Library, Hostels, Sports, and Accounts departments. You'll get real-time updates as each department reviews your file.
            </p>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="py-3 px-8 bg-gradient-to-r from-purple-700 to-lavender-600 hover:from-purple-800 text-white font-bold text-xs rounded-2xl shadow-lg inline-flex items-center gap-2 shadow-purple-600/25 transition-all"
            >
              <Send className="w-4 h-4" />
              Apply for No-Dues Clearance
            </button>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ── Progress Overview ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Progress',  value: `${progress}%`,    icon: Award,        color: 'text-purple-700',  bg: 'bg-purple-50',  border: 'border-purple-200' },
                { label: 'Approved',  value: approvedCount,     icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                { label: 'Pending',   value: pendingCount,      icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200' },
                { label: 'Rejected',  value: rejectedCount,     icon: XCircle,      color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-200' },
              ].map(({ label, value, icon: Icon, color, bg, border }) => (
                <div key={label} className={`${bg} rounded-2xl p-4 border ${border} flex items-center justify-between`}>
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</div>
                    <div className={`text-2xl font-extrabold ${color} mt-0.5`}>{value}</div>
                  </div>
                  <Icon className={`w-6 h-6 ${color} opacity-60`} />
                </div>
              ))}
            </div>

            {/* ── Visual Progress Bar ── */}
            <ProgressBar approvedCount={approvedCount} totalCount={4} />

            {/* ── Cleared Banner ── */}
            {request.overallStatus === 'CLEARED' && (
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm">🎉 All Departments Cleared!</div>
                    <div className="text-xs text-emerald-100 mt-0.5">
                      Your No-Dues Certificate is ready with digital signature &amp; QR code.
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleDownloadPDF}
                  className="py-2.5 px-5 bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-700" />
                  Download Certificate (PDF)
                </button>
              </div>
            )}

            {/* ── Rejection Banner ── */}
            {rejectedDepts.length > 0 && (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-rose-950">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <h4 className="font-extrabold text-sm text-rose-900">Action Required — Clearance Hold</h4>
                    {rejectedDepts.map((d) => (
                      <div key={d.departmentName} className="bg-white p-3 rounded-xl border border-rose-200 text-xs">
                        <span className="font-bold text-rose-800">{d.departmentName}:</span>{' '}
                        <span className="text-slate-700 font-mono">"{d.rejectionReason}"</span>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Officer: {d.processedBy} ({d.employeeId})
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-rose-700">
                      Visit the respective department to resolve dues. The officer will re-approve after resolution.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Department Status Cards ── */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-700" />
                Department-wise Clearance Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {departments.map((dept) => {
                  const Icon = deptIcons[dept.departmentName] || ShieldCheck;
                  const dc = deptColors[dept.departmentName] || { bg: 'bg-slate-100', text: 'text-slate-700', ring: 'ring-slate-200' };
                  const isApproved = dept.status === 'Approved';
                  const isRejected = dept.status === 'Rejected';

                  return (
                    <div
                      key={dept.departmentName}
                      className={`rounded-2xl border p-4 transition-all ${
                        isApproved
                          ? 'bg-emerald-50 border-emerald-200'
                          : isRejected
                          ? 'bg-rose-50 border-rose-200'
                          : 'bg-white border-lavender-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dc.bg} ${dc.text}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <StatusBadge status={dept.status} />
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900">{dept.departmentName}</h4>

                      {isApproved && (
                        <div className="mt-2 text-[10px] text-slate-600 bg-white p-2 rounded-xl border border-emerald-100 space-y-1">
                          <div className="font-bold text-emerald-700">✓ Digitally Verified</div>
                          <div className="font-mono text-purple-800 font-bold truncate">ID: {dept.verificationId}</div>
                          <div className="text-slate-500">By: {dept.processedBy} ({dept.employeeId})</div>
                        </div>
                      )}

                      {isRejected && (
                        <div className="mt-2 text-[10px] bg-rose-50 p-2 rounded-xl border border-rose-200 text-rose-800">
                          <span className="font-bold">Reason:</span> "{dept.rejectionReason}"
                        </div>
                      )}

                      {!isApproved && !isRejected && (
                        <p className="mt-2 text-[10px] text-slate-400 italic">Awaiting {dept.departmentName} review…</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Audit Timeline ── */}
            <Timeline request={request} />
          </div>
        )}

        {/* ── Confirm Submission Modal ── */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-lavender-200">
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Confirm Clearance Request</h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                This will route your file to all 4 departments simultaneously.
              </p>

              {error && (
                <div className="mb-4 text-xs bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-200 font-medium">
                  {error}
                </div>
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
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRequest}
                  disabled={submitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting…' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default MyClearancePage;
