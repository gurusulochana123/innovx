import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, LogIn, Lock, Mail, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginAsDemoRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.registered) {
      setSuccessMessage(location.state.message || 'Registration successful! Please sign in with your email and password.');
      if (location.state.email) {
        setEmail(location.state.email);
      }
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const user = await login(email, password);
      redirectUser(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (roleKey) => {
    try {
      setError('');
      setLoading(true);
      const user = await loginAsDemoRole(roleKey);
      redirectUser(user);
    } catch (err) {
      setError('Failed to login with demo account.');
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (user) => {
    if (user.role === 'student') navigate('/student');
    else if (user.role === 'department') navigate('/department');
    else if (user.role === 'admin') navigate('/admin');
    else navigate('/');
  };

  const demoAccounts = [
    { roleKey: 'student', title: 'Student Portal', email: 'student@demo.com', color: 'border-purple-200 bg-lavender-50/80 hover:bg-lavender-100/90 text-purple-950' },
    { roleKey: 'Library', title: 'Library Officer', email: 'library@demo.com', color: 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-950' },
    { roleKey: 'Hostels', title: 'Hostel Warden', email: 'hostel@demo.com', color: 'border-amber-200 bg-amber-50/70 hover:bg-amber-100/80 text-amber-950' },
    { roleKey: 'Sports', title: 'Sports Coach', email: 'sports@demo.com', color: 'border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-950' },
    { roleKey: 'Accounts', title: 'Accounts Officer', email: 'accounts@demo.com', color: 'border-teal-200 bg-teal-50/70 hover:bg-teal-100/80 text-teal-950' },
    { roleKey: 'admin', title: 'College Admin', email: 'admin@demo.com', color: 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-grid-lavender">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-3xl border border-lavender-200/80 shadow-2xl overflow-hidden">
        {/* Left Side: Login Form */}
        <div className="p-8 flex flex-col justify-center relative">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-lavender-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900">ClearCampus</span>
              <span className="block text-[10px] font-bold text-purple-600 uppercase tracking-wider -mt-1">
                Digital Governance Portal
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Sign In to Account</h2>
          <p className="text-xs text-slate-500 mb-6">
            Enter your registered email address and password to access your dashboard.
          </p>

          {/* Registration Success Confirmation Alert */}
          {successMessage && (
            <div className="mb-5 text-xs bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl border border-emerald-200 font-semibold flex items-start gap-2.5 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>{successMessage}</div>
            </div>
          )}

          {error && (
            <div className="mb-5 text-xs bg-rose-50 text-rose-700 p-3.5 rounded-2xl border border-rose-200 font-medium shadow-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Institutional Email Address</label>
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
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
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
              className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-lavender-600 hover:from-purple-800 hover:to-lavender-700 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 shadow-purple-600/25"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 border-t border-lavender-100 pt-4">
            Need a student clearance account?{' '}
            <Link to="/register" className="font-bold text-purple-700 hover:underline">
              Register Student Email
            </Link>
          </div>
        </div>

        {/* Right Side: Demo Quick Selector */}
        <div className="bg-gradient-to-br from-purple-950 via-slate-950 to-purple-950 text-white p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-purple-900/40">
          <div className="flex items-center gap-2 text-amber-300 mb-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider">Quick Hackathon Demo Logins</h3>
          </div>
          <p className="text-xs text-lavender-200 mb-6">
            Click any account pill below to test end-to-end multi-department clearance:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.roleKey}
                onClick={() => handleDemoClick(acc.roleKey)}
                disabled={loading}
                className={`p-3 rounded-xl border text-left transition-all group shadow-sm ${acc.color}`}
              >
                <div className="font-bold text-xs flex justify-between items-center">
                  <span>{acc.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-[10px] font-mono opacity-80 mt-0.5">{acc.email}</div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-purple-900/40 text-[11px] text-lavender-200 flex items-center justify-between">
            <span>Demo Password for all:</span>
            <span className="font-mono bg-white/10 text-amber-300 px-2.5 py-0.5 rounded border border-white/20 font-bold">
              password123
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
