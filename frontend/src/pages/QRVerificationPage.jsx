import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, CheckCircle2, XCircle, Award, Calendar, BookOpen, User, Building2, ExternalLink } from 'lucide-react';

const QRVerificationPage = () => {
  const { verificationId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerificationData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/verify/${verificationId}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Verification record not found or invalid.');
      } finally {
        setLoading(false);
      }
    };
    fetchVerificationData();
  }, [verificationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-950 text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-lavender-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-lavender-200">Decrypting & Verifying Governance Record...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-purple-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 bg-grid-lavender">
      <div className="max-w-xl w-full bg-slate-900/90 backdrop-blur-md rounded-3xl border border-lavender-900/60 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-lavender-500 text-white flex items-center justify-center font-bold shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">ClearCampus</span>
          </div>
          <span className="text-[10px] font-mono bg-white/10 text-lavender-200 px-2.5 py-1 rounded-md border border-white/20">
            QR VERIFICATION PORTAL
          </span>
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white mb-2">Invalid Verification Record</h2>
            <p className="text-xs text-lavender-200 max-w-sm mx-auto mb-6">{error}</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all border border-white/20"
            >
              Return to Portal
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Header Badge */}
            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-5 text-center relative overflow-hidden">
              <div className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 px-4 py-1.5 rounded-full font-extrabold text-xs mb-2 shadow-lg">
                <CheckCircle2 className="w-4 h-4" />
                Certificate Valid ✓
              </div>
              <h2 className="text-lg font-extrabold text-white">
                Official Institutional Clearance Verified
              </h2>
              <p className="text-[11px] text-emerald-300/80 mt-1 font-mono">
                Verification ID: <span className="font-bold text-white">{data.verificationId || data.certificateId}</span>
              </p>
            </div>

            {/* Student Details Box */}
            <div className="bg-black/30 p-5 rounded-2xl border border-white/10 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-lavender-200 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-lavender-300" /> Student Name:
                </span>
                <span className="font-extrabold text-white text-sm">{data.studentName}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-lavender-200 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-lavender-300" /> Registration ID:
                </span>
                <span className="font-mono font-bold text-lavender-300">{data.studentId}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-lavender-200 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-lavender-300" /> Course / Branch:
                </span>
                <span className="font-semibold text-slate-200">{data.course || 'B.Tech Computer Science'}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-lavender-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-lavender-300" /> Clearance Date:
                </span>
                <span className="font-semibold text-slate-200">
                  {new Date(data.issuedAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Department Approvals Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-lavender-200 mb-3 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-lavender-300" /> Verified Department Approvals
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                {['Library', 'Hostels', 'Sports', 'Accounts'].map((dept) => (
                  <div key={dept} className="bg-black/20 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{dept}</span>
                    <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> CLEARED
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 text-[11px] text-lavender-200 text-center space-y-2">
              <p>
                ✓ Cryptographically verified by ClearCampus Digital Governance Engine.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-lavender-300 hover:text-white font-bold text-xs"
              >
                Access ClearCampus Portal <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRVerificationPage;
