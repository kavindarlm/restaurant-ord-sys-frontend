# Migration Guide: Updating Components to New Auth System

## 🔄 Quick Reference - Before & After

### Before (Old Way - Direct axios calls):
```javascript
import axios from 'axios';

// Making API calls directly
const response = await axios.get('http://localhost:4000/dish');
const dishes = response.data;

// Creating a dish (admin)
await axios.post('http://localhost:4000/dish', dishData, {
  withCredentials: true
});
```

### After (New Way - Using API service):
```javascript
import { publicAPI, adminAPI } from '../services/api';

// Public API calls (no auth)
const dishes = await publicAPI.getDishes();

// Admin API calls (with auth)
await adminAPI.createDish(dishData);
```

---

## 📋 Step-by-Step Migration for Components

### 1. Update Imports

**Before:**
```javascript
import axios from 'axios';
```

**After:**
```javascript
import { publicAPI, adminAPI } from '../services/api';
// Or if you need auth context:
import { useAdminAuth } from '../contexts/AdminAuthContext';
```

---

### 2. Replace API Calls

#### Customer Components (Public Access):

**Before:**
```javascript
async function loadDishes() {
  const response = await axios.get('http://localhost:4000/dish');
  setDishes(response.data);
}
```

**After:**
```javascript
async function loadDishes() {
  const dishes = await publicAPI.getDishes();
  setDishes(dishes);
}
```

#### Admin Components (Protected Access):

**Before:**
```javascript
async function createDish(dishData) {
  const response = await axios.post(
    'http://localhost:4000/dish',
    dishData,
    { withCredentials: true }
  );
  return response.data;
}
```

**After:**
```javascript
async function createDish(dishData) {
  return await adminAPI.createDish(dishData);
  // Error handling (401, 403) is automatic!
}
```

---

### 3. Update Authentication Checks

**Before:**
```javascript
import { checkAuth } from '../utils/authUtils';

useEffect(() => {
  const verifyAuth = async () => {
    const isAuth = await checkAuth();
    if (!isAuth) {
      navigate('/login');
    }
  };
  verifyAuth();
}, []);
```

**After:**
```javascript
import { useAdminAuth } from '../contexts/AdminAuthContext';

const { admin, loading } = useAdminAuth();

if (loading) return <LoadingSpinner />;
if (!admin) return <Navigate to="/login" />;
// Or just wrap route with <ProtectedRoute> in App.js
```

---

## 🔧 Common Component Patterns

### Pattern 1: Customer Menu Page (Public)

```javascript
import React, { useState, useEffect } from 'react';
import { publicAPI } from '../services/api';

function CustomerMenu() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    try {
      setLoading(true);
      const data = await publicAPI.getDishes();
      setDishes(data);
    } catch (error) {
      console.error('Error loading menu:', error);
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {dishes.map(dish => (
        <DishCard key={dish.dish_id} dish={dish} />
      ))}
    </div>
  );
}
```

### Pattern 2: Admin Dashboard with Auth

```javascript
import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { adminAPI } from '../services/api';

function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await adminAPI.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      // 401 errors automatically redirect to login
    }
  }

  return (
    <div>
      <header>
        <h1>Welcome, {admin.user_name}!</h1>
        <button onClick={logout}>Logout</button>
      </header>
      <OrdersList orders={orders} />
    </div>
  );
}
```

### Pattern 3: Form with Admin API

```javascript
import React, { useState } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function CreateDishForm() {
  const [formData, setFormData] = useState({
    dish_name: '',
    dish_price: '',
    dish_description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await adminAPI.createDish(formData);
      toast.success('Dish created successfully!');
      navigate('/itemMenuPage');
    } catch (error) {
      toast.error('Failed to create dish');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.dish_name}
        onChange={(e) => setFormData({...formData, dish_name: e.target.value})}
        required
      />
      {/* More fields */}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Dish'}
      </button>
    </form>
  );
}
```

---

## 📝 Checklist for Each Component

When updating a component, check:

- [ ] Replace direct axios calls with `publicAPI` or `adminAPI`
- [ ] Remove manual `withCredentials: true` (handled automatically)
- [ ] Remove manual auth checks (use `useAdminAuth` or `ProtectedRoute`)
- [ ] Remove hardcoded API URLs (now in service layer)
- [ ] Add proper error handling with try/catch
- [ ] Add loading states for better UX
- [ ] Use toast notifications for user feedback

---

## 🎯 API Method Reference

### Public API Methods (No Auth):

```javascript
publicAPI.getDishes()                  // Get all dishes
publicAPI.getDish(id)                  // Get single dish
publicAPI.getCategories()              // Get all categories
publicAPI.placeOrder(orderData)        // Place order
publicAPI.trackOrder(orderId)          // Track order
publicAPI.getTables()                  // Get tables
```

### Admin API Methods (Auth Required):

```javascript
// Dishes
adminAPI.createDish(dishData)
adminAPI.updateDish(id, dishData)
adminAPI.deleteDish(id)

// Orders
adminAPI.getAllOrders()
adminAPI.updateOrderStatus(orderId, updates)

// Users
adminAPI.getAllUsers()
adminAPI.deleteUser(userId)

// Categories
adminAPI.createCategory(categoryData)
adminAPI.updateCategory(id, categoryData)
adminAPI.deleteCategory(id)

// Tables
adminAPI.createTable(tableData)
adminAPI.updateTable(id, tableData)
adminAPI.deleteTable(id)
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't mix old and new patterns:
```javascript
// BAD - mixing axios with new API service
import axios from 'axios';
import { adminAPI } from '../services/api';

const dishes = await axios.get('http://localhost:4000/dish');
await adminAPI.createDish(dishData);
```

### ✅ Use consistently:
```javascript
// GOOD - use API service throughout
import { publicAPI, adminAPI } from '../services/api';

const dishes = await publicAPI.getDishes();
await adminAPI.createDish(dishData);
```

### ❌ Don't add withCredentials manually:
```javascript
// BAD - withCredentials already handled
await adminAPI.createDish(dishData, { withCredentials: true });
```

### ✅ Let the service handle it:
```javascript
// GOOD - credentials handled automatically
await adminAPI.createDish(dishData);
```

---

## 🔍 Finding Components to Update

Use these commands to find components that might need updating:

### Find axios usage:
```bash
# In VS Code, search for:
import axios
axios.get
axios.post
axios.patch
axios.delete
```

### Find direct API URLs:
```bash
# Search for:
http://localhost:4000
```

### Find old auth checks:
```bash
# Search for:
checkAuth
withCredentials
```

---

## 📦 Components Already Updated

✅ `Login.jsx` - Uses AdminAuthContext  
✅ `ProtectedRoute.jsx` - Uses AdminAuthContext  
✅ `navbar.jsx` - Uses AdminAuthContext for logout  
✅ `App.js` - Wrapped with AdminAuthProvider  

---

## 🎉 Benefits of New System

1. **Cleaner Code**: No repeated axios configuration
2. **Centralized Error Handling**: 401/403 handled in one place
3. **Type Safety**: Clear method signatures
4. **Easier Testing**: Mock API service instead of axios
5. **Better Security**: Consistent credential handling
6. **Less Boilerplate**: No need to repeat `withCredentials: true`

---

## 💡 Tips

1. **Start with one component** - Don't try to update everything at once
2. **Test each component** - Verify functionality after migration
3. **Use the same error handling pattern** - Keep UX consistent
4. **Add loading states** - Improve user experience
5. **Remove console.logs** - Clean up after testing

---

## 🆘 Need Help?

If you're unsure how to migrate a specific component:
1. Copy the component code
2. Identify the API calls being made
3. Check the API method reference above
4. Replace with appropriate `publicAPI` or `adminAPI` method
5. Test the component

Example:
```
Old: axios.get('http://localhost:4000/dish/5')
New: publicAPI.getDish(5)

Old: axios.post('http://localhost:4000/order', orderData)
New: publicAPI.placeOrder(orderData)

Old: axios.patch('http://localhost:4000/order/5', updates, {withCredentials: true})
New: adminAPI.updateOrderStatus(5, updates)
```
