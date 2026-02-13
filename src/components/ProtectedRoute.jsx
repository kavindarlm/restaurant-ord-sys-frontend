import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

/**
 * AdminRoute component that protects admin-only routes
 * Redirects to login if user is not authenticated as admin
 * Uses AdminAuthContext to check authentication state
 */
const AdminRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated as admin
  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated as admin
  return children;
};

// Keep the old name as export for backward compatibility
export default AdminRoute;

// Also export with new name
export { AdminRoute };
