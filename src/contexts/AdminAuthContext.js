import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { logger } from '../utils/logger';

const AdminAuthContext = createContext(null);

const API_BASE_URL = 'http://localhost:4000';

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if admin is logged in on mount
  useEffect(() => {
    checkAdminAuth();
  }, []);

  async function checkAdminAuth({ skipLoadingToggle = false } = {}) {
    if (!skipLoadingToggle) {
      setLoading(true);
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true, // Send HTTP-only cookie
      });

      if (response.status === 200 && response.data?.success) {
        const user = response.data.user;
        // Only set admin if role is 'admin'
        if (user?.user_role === 'admin') {
          setAdmin(user);
          logger.log('Admin authenticated:', user);
          return user;
        }

        setAdmin(null);
        logger.log('User is not an admin:', user);
        return null;
      }

      setAdmin(null);
      return null;
    } catch (error) {
      logger.error('Auth check failed:', error.response?.data || error.message);
      setAdmin(null);
      return null;
    } finally {
      if (!skipLoadingToggle) {
        setLoading(false);
      }
    }
  }

  async function login(email, password) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/login`,
        {
          user_email: email,
          user_password: password,
        },
        {
          withCredentials: true, // Enable HTTP-only cookie
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Fetch admin profile after successful login
        const authenticatedAdmin = await checkAdminAuth({ skipLoadingToggle: true });

        if (!authenticatedAdmin) {
          throw new Error('Access denied: Admin rights required');
        }

        logger.log('Login successful');
        return { success: true, message: response.data?.message || 'Login successful' };
      }

      throw new Error('Login failed. Please try again.');
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      const errorMessage = backendMessage || error.message || 'Login failed. Please try again.';
      logger.error('Login failed:', errorMessage);

      const enrichedError = new Error(errorMessage);
      enrichedError.status = error.response?.status;
      throw enrichedError;
    }
  }

  async function logout() {
    try {
      await axios.post(
        `${API_BASE_URL}/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setAdmin(null);
      logger.log('Logout successful');
    } catch (error) {
      logger.error('Logout error:', error);
      // Clear admin state even if request fails
      setAdmin(null);
    }
  }

  const value = {
    admin,
    loading,
    login,
    logout,
    isAdmin: !!admin,
    checkAdminAuth, // Expose for manual refresh if needed
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
} 
