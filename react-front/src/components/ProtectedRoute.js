// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    // No user logged in
    return <Navigate to="/signin" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // User does not have the required role
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
