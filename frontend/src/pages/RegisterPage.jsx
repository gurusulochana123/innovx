import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, UserPlus, User, Mail, Lock, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [academicYear, setAcademicYear] = useState('2026');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !studentId) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await register({
        name,
        studentId,
        email,
        password,
        course,
        academicYear,
      });

      // Navigate to login screen requiring explicit sign-in as per user directive
      navigate('/login', {
        state: {
          registered: true,
          email: email,
          message: 'Account registered successfully! Please sign in with your email and password.',
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-grid-lavender">
      <div className="max-w-md w-full bg-white rounded-3xl border border-lavender-200/80 shadow-2xl p-8 relative overflow-hidden">
        {/* Soft Lavender Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-lavender-100/60 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-lavender-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-slate-900">ClearCampus</span>
            <span className="block text-[10px] font-bold text-lavender-600 uppercase tracking-wider -mt-1">
              Student Registration
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Create Student Profile</h2>
        <p className="text-xs text-slate-500 mb-6">
          Register your student ID & institutional email. After registration, you will sign in to initiate digital clearance.
        </p>

        {error && (
          <div className="mb-5 text-xs bg-rose-50 text-rose-700 p-3.5 rounded-2xl border border-rose-200 font-medium shadow-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Student Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-lavender-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Guru Sulochana"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-lavender-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all bg-lavender-50/30"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Student ID *</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="23CSE001"
                className="w-full px-3.5 py-2.5 text-xs border border-lavender-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none uppercase font-mono font-semibold transition-all bg-lavender-50/30"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Academic Year</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2026"
                className="w-full px-3.5 py-2.5 text-xs border border-lavender-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all bg-lavender-50/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Course / Degree</label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-lavender-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="B.Tech Computer Science"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-lavender-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all bg-lavender-50/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Institutional Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-lavender-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@demo.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-lavender-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all bg-lavender-50/30"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Account Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-lavender-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-lavender-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none transition-all bg-lavender-50/30"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-lavender-600 hover:from-purple-800 hover:to-lavender-700 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-purple-600/25"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating Account...' : 'Complete Registration & Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 border-t border-lavender-100 pt-4">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-purple-700 hover:underline">
            Sign In to Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
