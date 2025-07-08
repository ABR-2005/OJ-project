import React from 'react';
import { Navigate } from 'react-router-dom'; // Import Navigate
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// import AuthForm from './AuthForm'; // AuthForm should be rendered by your Login page, not here

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-300">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // 🔥 CRITICAL FIX: Redirect to the /login route (the UI path)
    // This will change the URL in the browser to /login,
    // which AppContent will then detect to hide the Navbar.
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center bg-gray-800 p-8 rounded-lg shadow-xl border border-red-700">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-extrabold text-red-400 mb-4 tracking-wide">Access Denied</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            You don't have the necessary permissions to access this feature. <br/>
            Please contact an administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;