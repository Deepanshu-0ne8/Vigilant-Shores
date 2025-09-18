// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import your auth hook

const ProtectedRoute = () => {
  const { user, loading } = useAuth(); // Get user and loading state from context

  // 1. While the context is checking for an existing session, show a loading message.
  if (loading) {
    return <div>Loading session...</div>;
  }

  // 2. If loading is finished and there is a user, render the child route.
  // The <Outlet> component is a placeholder for the actual page (e.g., Dashboard).
  if (user) {
    return <Outlet />;
  }

  // 3. If loading is finished and there's no user, redirect to the login page.
  return <Navigate to="/login" />;
};

export default ProtectedRoute;