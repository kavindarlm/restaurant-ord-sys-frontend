import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

/**
 * Check if the user's token is valid
 * @returns {Promise<boolean>} - Returns true if authenticated, false otherwise
 */
export const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    
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
      console.log('User authenticated:', response.data.user);
      return true;
    }
    
    return false;
  } catch (error) {
    // Token is expired or invalid
    console.error('Authentication check failed:', error);
    localStorage.removeItem('token'); // Clear invalid token
    return false;
  }
};

/**
 * Logout user by clearing token
 */
export const logout = () => {
  localStorage.removeItem('token');
};

/**
 * Get the stored token
 * @returns {string|null} - The token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem('token');
};
