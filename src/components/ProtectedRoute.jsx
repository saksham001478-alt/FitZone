// ProtectedRoute.jsx — Route guard component checking authentication and user role
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guard routes by authentication state and role access
 */
export function ProtectedRoute({ allowedRole, children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/app" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
