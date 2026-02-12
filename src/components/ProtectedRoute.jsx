import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuth } from '../utils/authUtils';

/**
 * ProtectedRoute component that checks authentication before rendering children
 * Redirects to login if user is not authenticated
 * Re-checks authentication on every route change
 */
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      const authenticated = await checkAuth();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    verifyAuth();
  }, [location.pathname]); // Re-run auth check whenever the route changes

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;
