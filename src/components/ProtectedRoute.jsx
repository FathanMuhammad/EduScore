import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner fullPage />;
  }

  if (!currentUser) {
    // Redirect to login but store current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // User role is not allowed, redirect to respective dashboard
    console.warn(`Role ${userRole} is not allowed to access ${location.pathname}. Redirecting...`);
    
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === 'guru') {
      return <Navigate to="/guru/dashboard" replace />;
    } else if (userRole === 'siswa') {
      return <Navigate to="/siswa/dashboard" replace />;
    }
    
    return <Navigate to="/login" replace />;
  }

  return children;
}
