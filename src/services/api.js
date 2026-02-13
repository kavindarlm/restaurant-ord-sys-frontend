import axios from 'axios';

const API_BASE = 'http://localhost:4000';

// =============================================================================
// PUBLIC API - No authentication required (for customers)
// =============================================================================

export const publicAPI = {
  /**
   * Get all dishes (menu items)
   * @returns {Promise} List of all dishes
   */
  async getDishes() {
    const response = await axios.get(`${API_BASE}/dish`);
    return response.data;
  },

  /**
   * Get a specific dish by ID
   * @param {number|string} id - Dish ID
   * @returns {Promise} Dish details
   */
  async getDish(id) {
    const response = await axios.get(`${API_BASE}/dish/${id}`);
    return response.data;
  },

  /**
   * Get all categories
   * @returns {Promise} List of categories
   */
  async getCategories() {
    const response = await axios.get(`${API_BASE}/category`);
    return response.data;
  },

  /**
   * Place an order (guest checkout - no authentication required)
   * @param {object} orderData - Order details
   * @returns {Promise} Created order
   */
  async placeOrder(orderData) {
    const response = await axios.post(`${API_BASE}/order`, orderData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  /**
   * Track a specific order by ID
   * @param {number|string} orderId - Order ID
   * @returns {Promise} Order details
   */
  async trackOrder(orderId) {
    const response = await axios.get(`${API_BASE}/order/${orderId}`);
    return response.data;
  },

  /**
   * Get all tables
   * @returns {Promise} List of tables
   */
  async getTables() {
    const response = await axios.get(`${API_BASE}/table`);
    return response.data;
  },
};

// =============================================================================
// ADMIN API - Authentication required (HTTP-only cookie)
// =============================================================================

export const adminAPI = {
  /**
   * Create a new dish
   * @param {object} dishData - Dish details
   * @returns {Promise} Created dish
   */
  async createDish(dishData) {
    try {
      const response = await axios.post(`${API_BASE}/dish`, dishData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // Send admin JWT cookie
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  },

  /**
   * Update a dish by ID
   * @param {number|string} id - Dish ID
   * @param {object} dishData - Updated dish data
   * @returns {Promise} Updated dish
   */
  async updateDish(id, dishData) {
    try {
      const response = await axios.patch(`${API_BASE}/dish/${id}`, dishData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  },

  /**
   * Delete a dish by ID
   * @param {number|string} id - Dish ID
   * @returns {Promise}
   */
  async deleteDish(id) {
    try {
      const response = await axios.delete(`${API_BASE}/dish/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  },

  /**
   * Get all orders (admin view)
   * @returns {Promise} List of all orders
   */
  async getAllOrders() {
    try {
      const response = await axios.get(`${API_BASE}/order`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  },

  /**
   * Update order status
   * @param {number|string} orderId - Order ID
   * @param {object} updates - Order updates (e.g., { status: 'completed' })
   * @returns {Promise} Updated order
   */
  async updateOrderStatus(orderId, updates) {
    try {
      const response = await axios.patch(`${API_BASE}/order/${orderId}`, updates, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  },

  /**
   * Get all users (admin only)
   * @returns {Promise} List of users
   */
  async getAllUsers() {
    try {
      const response = await axios.get(`${API_BASE}/user`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  },

  /**
   * Delete a user by ID
   * @param {number|string} userId - User ID
   * @returns {Promise}
   */
  async deleteUser(userId) {
    try {
      const response = await axios.delete(`${API_BASE}/user/${userId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  },

  /**
   * Create a new category
   * @param {object} categoryData - Category details
   * @returns {Promise} Created category
   */
  async createCategory(categoryData) {
    try {
      const response = await axios.post(`${API_BASE}/category`, categoryData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  },

  /**
   * Update a category
   * @param {number|string} id - Category ID
   * @param {object} categoryData - Updated category data
   * @returns {Promise} Updated category
   */
  async updateCategory(id, categoryData) {
    try {
      const response = await axios.patch(`${API_BASE}/category/${id}`, categoryData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  },

  /**
   * Delete a category
   * @param {number|string} id - Category ID
   * @returns {Promise}
   */
  async deleteCategory(id) {
    try {
      const response = await axios.delete(`${API_BASE}/category/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  },

  /**
   * Create a new table
   * @param {object} tableData - Table details
   * @returns {Promise} Created table
   */
  async createTable(tableData) {
    try {
      const response = await axios.post(`${API_BASE}/table`, tableData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  },

  /**
   * Update a table
   * @param {number|string} id - Table ID
   * @param {object} tableData - Updated table data
   * @returns {Promise} Updated table
   */
  async updateTable(id, tableData) {
    try {
      const response = await axios.patch(`${API_BASE}/table/${id}`, tableData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  },

  /**
   * Delete a table
   * @param {number|string} id - Table ID
   * @returns {Promise}
   */
  async deleteTable(id) {
    try {
      const response = await axios.delete(`${API_BASE}/table/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  },
};

// =============================================================================
// ERROR HANDLER
// =============================================================================

/**
 * Handle API errors and redirect if unauthorized
 * @param {Error} error - Axios error object
 */
function handleAPIError(error) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // Unauthorized - redirect to admin login
        console.error('Unauthorized: Please login');
        window.location.href = '/login';
        break;

      case 403:
        // Forbidden - user doesn't have required role
        console.error('Access denied: Admin rights required');
        break;

      case 404:
        console.error('Resource not found');
        break;

      case 500:
        console.error('Server error. Please try again later');
        break;

      default:
        console.error('API Error:', error.message);
    }
  } else {
    console.error('Network error. Please check your connection');
  }
}

// Export API_BASE for other components that might need it
export { API_BASE };
