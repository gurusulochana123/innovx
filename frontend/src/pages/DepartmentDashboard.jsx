import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import ApprovalModal from '../components/ApprovalModal';
import RejectionModal from '../components/RejectionModal';
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  Search,
  Eye,
  ShieldCheck,
  AlertCircle,
  Filter,
} from 'lucide-react';

const DepartmentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const [selectedStudentRequest, setSelectedStudentRequest] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [viewDetailRequest, setViewDetailRequest] = useState(null);

  const officerDept = user ? user.department : 'Library';

  const fetchDepartmentQueue = async () => {
    try {
      setLoading(true);
      const res = await api.get('/department/requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching department requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentQueue();
  }, [user]);

  const handleApproveConfirm = async () => {
    if (!selectedStudentRequest) return;
    try {
      await api.put(`/department/${selectedStudentRequest.requestId}/approve`);
      fetchDepartmentQueue();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve request.');
    }
  };

  const handleRejectConfirm = async (reason) => {
    if (!selectedStudentRequest) return;
    try {
      await api.put(`/department/${selectedStudentRequest.requestId}/reject`, {
        rejectionReason: reason,
      });
      fetchDepartmentQueue();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject request.');
    }
  };

  const pendingRequests = requests.filter((r) => r.deptStatus === 'Pending');
  const approvedRequests = requests.filter((r) => r.deptStatus === 'Approved');
  const rejectedRequests = requests.filter((r) => r.deptStatus === 'Rejected');
  const totalProcessed = approvedRequests.length + rejectedRequests.length;

  const displayedRequests = (
    activeTab === 'pending' ? pendingRequests : requests.filter((r) => r.deptStatus !== 'Pending')
  ).filter(
    (r) =>
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.requestId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Sidebar>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-purple-900">Loading {officerDept} officer queue...</p>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Officer Welcome Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex justify-between items-center flex-wrap gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-emerald-400/10 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-3 border border-emerald-400/20 shadow-xs">
              <Building2 className="w-4 h-4 text-emerald-400" />
              {officerDept} Department Verification Desk
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {officerDept} Officer Dashboard
            </h1>
            <p className="text-xs text-lavender-200 mt-1">
              Approving Officer: <strong className="text-white">{user.name}</strong> • Employee ID: <strong className="text-white font-mono">{user.employeeId || 'OFF-2026'}</strong>
            </p>
          </div>

          <button
            onClick={fetchDepartmentQueue}
            className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Refresh Queue
          </button>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-lavender-200/80 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Pending Queue
            </div>
            <div className="text-2xl font-extrabold text-amber-600 flex items-center justify-between">
              <span>{pendingRequests.length}</span>
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Awaiting officer review
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-lavender-200/80 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Approved Dues
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 flex items-center justify-between">
              <span>{approvedRequests.length}</span>
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">
              Digitally verified clearance IDs
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-lavender-200/80 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Rejected Dues
            </div>
            <div className="text-2xl font-extrabold text-rose-600 flex items-center justify-between">
              <span>{rejectedRequests.length}</span>
              <XCircle className="w-6 h-6 text-rose-500" />
            </div>
            <p className="text-[11px] text-rose-700 mt-1 font-medium">
              Pending dues / holds
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-lavender-200/80 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Processed
            </div>
            <div className="text-2xl font-extrabold text-purple-950 flex items-center justify-between">
              <span>{totalProcessed}</span>
              <FileCheck className="w-6 h-6 text-purple-700" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Completed verifications
            </p>
          </div>
        </div>

        {/* Requests Table Container */}
        <div className="bg-white rounded-3xl border border-lavender-200/80 shadow-xs overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-6 border-b border-lavender-100 flex justify-between items-center flex-wrap gap-4 bg-lavender-50/40">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'pending'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-lavender-100 text-purple-950 hover:bg-lavender-200'
                }`}
              >
                Pending Requests ({pendingRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('processed')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  activeTab === 'processed'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-lavender-100 text-purple-950 hover:bg-lavender-200'
                }`}
              >
                Processed History ({totalProcessed})
              </button>
            </div>

            {/* Search */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-lavender-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Search Student ID, Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 text-xs border border-lavender-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none bg-white"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-lavender-50/70 uppercase text-[11px] font-bold text-slate-600 tracking-wider border-b border-lavender-200/60">
                <tr>
                  <th className="py-3.5 px-6">Student ID</th>
                  <th className="py-3.5 px-6">Student Name</th>
                  <th className="py-3.5 px-6">Course / Branch</th>
                  <th className="py-3.5 px-6">Request Date</th>
                  <th className="py-3.5 px-6">Dept Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {displayedRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400">
                      No clearance requests matching your filter.
                    </td>
                  </tr>
                ) : (
                  displayedRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-lavender-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-purple-900">
                        {req.studentId}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {req.studentName}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {req.course}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={req.deptStatus} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewDetailRequest(req)}
                            className="px-2.5 py-1.5 rounded-lg bg-lavender-100 hover:bg-lavender-200 text-purple-950 font-semibold flex items-center gap-1 transition-colors"
                            title="View Full Clearance Matrix"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Matrix
                          </button>

                          {req.deptStatus === 'Pending' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedStudentRequest(req);
                                  setShowApprovalModal(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 transition-colors shadow-xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedStudentRequest(req);
                                  setShowRejectionModal(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1 transition-colors shadow-xs"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Modal */}
        <ApprovalModal
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedStudentRequest(null);
          }}
          onConfirm={handleApproveConfirm}
          student={selectedStudentRequest}
          department={officerDept}
          officer={user}
        />

        {/* Rejection Modal */}
        <RejectionModal
          isOpen={showRejectionModal}
          onClose={() => {
            setShowRejectionModal(false);
            setSelectedStudentRequest(null);
          }}
          onConfirm={handleRejectConfirm}
          student={selectedStudentRequest}
          department={officerDept}
        />

        {/* View Details Modal */}
        {viewDetailRequest && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-lavender-200 relative">
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                Multi-Department Clearance Matrix
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Student: <strong className="text-slate-800">{viewDetailRequest.studentName}</strong> ({viewDetailRequest.studentId})
              </p>

              <div className="space-y-3 mb-6">
                {viewDetailRequest.allDepartments.map((dept) => (
                  <div
                    key={dept.departmentName}
                    className="p-3.5 rounded-xl border border-lavender-200 flex justify-between items-center bg-lavender-50/40"
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900">{dept.departmentName}</span>
                      {dept.processedBy && (
                        <div className="text-[10px] text-slate-500">
                          Officer: {dept.processedBy} ({dept.employeeId})
                        </div>
                      )}
                      {dept.verificationId && (
                        <div className="text-[10px] font-mono text-purple-800 font-bold">
                          ID: {dept.verificationId}
                        </div>
                      )}
                      {dept.rejectionReason && (
                        <div className="text-[10px] text-rose-700 font-semibold">
                          Reason: {dept.rejectionReason}
                        </div>
                      )}
                    </div>
                    <StatusBadge status={dept.status} />
                  </div>
                ))}
              </div>

              <button
                onClick={() => setViewDetailRequest(null)}
                className="w-full py-2.5 bg-purple-800 hover:bg-purple-900 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close Matrix Window
              </button>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default DepartmentDashboard;
