import axios from 'axios';
import { logger } from './logger';

const API_BASE_URL = 'http://localhost:4000';

// Configure axios to include credentials (cookies) with every request
axios.defaults.withCredentials = true;

/**
 * Check if the user's token is valid by calling the backend
 * The httpOnly cookie is automatically sent with the request
 * @returns {Promise<boolean>} - Returns true if authenticated, false otherwise
 */
export const checkAuth = async () => {
  try {
    // The cookie is automatically sent due to withCredentials: true
    // Calls your existing /auth/me endpoint with JwtAuthGuard
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      withCredentials: true
    });
    
    if (response.status === 200 && response.data?.success) {
      logger.log('User authenticated:', response.data.user);
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error('Authentication check failed:', error.response?.data || error.message);
    return false;
  }
};

/**
 * Check if the current user is an admin
 * @returns {Promise<boolean>} - Returns true if user is admin, false otherwise
 */
export const checkAdminAuth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      withCredentials: true
    });
    
    if (response.status === 200 && response.data?.success) {
      const user = response.data.user;
      const isAdmin = user.user_role === 'admin';
      logger.log('Admin check:', { user: user.user_email, isAdmin });
      return isAdmin;
    }
    
    return false;
  } catch (error) {
    logger.error('Admin authentication check failed:', error.response?.data || error.message);
    return false;
  }
};

/**
 * Get current user information
 * @returns {Promise<object|null>} - User data or null if not authenticated
 */
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      withCredentials: true
    });
    
    if (response.status === 200 && response.data?.success) {
      return response.data.user;
    }
    
    return null;
  } catch (error) {
    logger.error('Failed to get current user:', error);
    return null;
  }
};
