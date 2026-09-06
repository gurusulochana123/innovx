import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import MyClearancePage from './pages/MyClearancePage';
import DepartmentDashboard from './pages/DepartmentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import QRVerificationPage from './pages/QRVerificationPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Guard Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lavender-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-purple-900">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'student') return <Navigate to="/student" replace />;
    if (user.role === 'department') return <Navigate to="/department" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
  }

  return children;
};

// Root index redirector
const RootRedirector = () => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!token || !user) return <Navigate to="/login" replace />;

  if (user.role === 'student') return <Navigate to="/student" replace />;
  if (user.role === 'department') return <Navigate to="/department" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-lavender-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<RootRedirector />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Public QR Verification Route */}
                <Route path="/verify/:verificationId" element={<QRVerificationPage />} />

                {/* Protected Role-Based Routes */}
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/clearance"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <MyClearancePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/department"
                  element={
                    <ProtectedRoute allowedRoles={['department']}>
                      <DepartmentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
