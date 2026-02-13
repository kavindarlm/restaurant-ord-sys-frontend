import axios from 'axios';
import { logger } from './logger';

const API_BASE_URL = 'http://localhost:4000';

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  logger.log(`Retrieving cookie "${name}":`, document.cookie);
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

/**
 * Check if the user's token is valid
 * @returns {Promise<boolean>} - Returns true if authenticated, false otherwise
 */
export const checkAuth = async () => {
  try {
    // Get token from cookies
    const token = getCookie('access_token');
    logger.log('Checking authentication with token:', token);
    
    if (!token) {
      return false;
    }

    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200 && response.data) {
      // Token is valid, user can proceed
      logger.log('User authenticated:', response.data.user);
      return true;
    }
    
    return false;
  } catch (error) {
    logger.error('Authentication check failed:', error);
    // Token is invalid or request failed
    logout(); // Clear the invalid token
    return false;
  }
};

/**
 * Logout user by clearing token
 */
export const logout = () => {
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
};

/**
 * Get the stored token
 * @returns {string|null} - The token or null if not found
 */
export const getToken = () => {
  return getCookie('access_token');
};
