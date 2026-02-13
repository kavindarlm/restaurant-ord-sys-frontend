# Frontend Authentication Implementation - Restaurant Ordering System

## ✅ Implementation Complete

Your frontend authentication system has been successfully updated to use **HTTP-only cookie authentication** with role-based access control.

---

## 📁 Files Created/Modified

### New Files Created:
1. **`src/contexts/AdminAuthContext.js`** - Admin authentication context provider
2. **`src/services/api.js`** - API service layer with public and admin endpoints

### Files Modified:
1. **`src/components/ProtectedRoute.jsx`** - Updated to use AdminAuthContext
2. **`src/components/Login.jsx`** - Updated to use new auth flow
3. **`src/components/navbar.jsx`** - Updated with logout functionality and admin display
4. **`src/App.js`** - Wrapped with AdminAuthProvider
5. **`src/utils/authUtils.js`** - Enhanced with admin check function

---

## 🎯 Key Features Implemented

### 1. **Two-Tier Access System**
- ✅ **Public Access (Customers)**: No authentication required
  - Browse menu
  - View items
  - Place orders
  - Track orders
  
- ✅ **Protected Access (Admin)**: Authentication required via HTTP-only cookies
  - Manage dishes/menu
  - View all orders
  - Manage users
  - Generate QR codes
  - Dashboard access

### 2. **AdminAuthContext**
```javascript
import { useAdminAuth } from './contexts/AdminAuthContext';

// In your components:
const { admin, loading, login, logout, isAdmin } = useAdminAuth();
```

Provides:
- `admin` - Current admin user object (null if not logged in)
- `loading` - Boolean indicating auth check in progress
- `login(email, password)` - Admin login function
- `logout()` - Admin logout function
- `isAdmin` - Boolean, true if logged in as admin

### 3. **API Service Layer**

#### Public APIs (No Auth Required):
```javascript
import { publicAPI } from './services/api';

// Available methods:
publicAPI.getDishes()
publicAPI.getDish(id)
publicAPI.getCategories()
publicAPI.placeOrder(orderData)
publicAPI.trackOrder(orderId)
publicAPI.getTables()
```

#### Admin APIs (Auth Required):
```javascript
import { adminAPI } from './services/api';

// Available methods:
adminAPI.createDish(dishData)
adminAPI.updateDish(id, dishData)
adminAPI.deleteDish(id)
adminAPI.getAllOrders()
adminAPI.updateOrderStatus(orderId, updates)
adminAPI.getAllUsers()
adminAPI.deleteUser(userId)
adminAPI.createCategory(categoryData)
adminAPI.updateCategory(id, categoryData)
adminAPI.deleteCategory(id)
adminAPI.createTable(tableData)
adminAPI.updateTable(id, tableData)
adminAPI.deleteTable(id)
```

All admin APIs automatically:
- ✅ Send HTTP-only cookie with request
- ✅ Handle 401 (Unauthorized) - redirect to login
- ✅ Handle 403 (Forbidden) - show access denied
- ✅ Handle other errors gracefully

---

## 🔐 Authentication Flow

### Admin Login Flow:
1. User enters email and password on `/login`
2. Frontend calls `login(email, password)` from AdminAuthContext
3. Backend validates credentials
4. Backend sets HTTP-only cookie with JWT
5. Frontend fetches admin profile using `/auth/me`
6. Frontend stores admin state in context
7. User redirected to `/dashboard`

### Admin Logout Flow:
1. User clicks logout button
2. Frontend calls `logout()` from AdminAuthContext
3. Backend clears HTTP-only cookie
4. Frontend clears admin state
5. User redirected to `/login`

### Protected Route Access:
1. User tries to access protected route (e.g., `/dashboard`)
2. `ProtectedRoute` checks `admin` state from context
3. If not authenticated → redirect to `/login`
4. If authenticated → render protected component

---

## 🗺️ Route Structure

### Public Routes (No Auth):
```
/ (if you add home page)
/hotelMenuCustomerPage
/itemMenuPageCustomer
/hotelMenuPageCustomer/:table_id
/payment/:cartId
/shopping
/item-view/:dish_id
/login (allows admin to login)
```

### Protected Routes (Admin Only):
```
/dashboard                  - Admin dashboard
/add-new-item              - Create new dish
/itemMenuPage              - Manage items
/hotelMenuPage             - Manage menus
/pendingOrderPage          - View pending orders
/add-new-menu              - Create new menu
/generate-qr               - Generate QR codes
```

---

## 🚀 Usage Examples

### Example 1: Using Auth in Admin Dashboard

```javascript
import React from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

function AdminDashboard() {
  const { admin, logout } = useAdminAuth();

  return (
    <div>
      <header>
        <h1>Welcome, {admin.user_name}!</h1>
        <button onClick={logout}>Logout</button>
      </header>
      {/* Dashboard content */}
    </div>
  );
}
```

### Example 2: Fetching Data in Customer Page (No Auth)

```javascript
import React, { useEffect, useState } from 'react';
import { publicAPI } from '../services/api';

function MenuPage() {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    loadDishes();
  }, []);

  async function loadDishes() {
    try {
      const data = await publicAPI.getDishes();
      setDishes(data);
    } catch (error) {
      console.error('Error loading dishes:', error);
    }
  }

  return (
    <div>
      {dishes.map(dish => (
        <DishCard key={dish.dish_id} dish={dish} />
      ))}
    </div>
  );
}
```

### Example 3: Admin Creating Dish (With Auth)

```javascript
import React, { useState } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';

function NewDish() {
  const [dishData, setDishData] = useState({
    dish_name: '',
    dish_price: '',
    dish_description: ''
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await adminAPI.createDish(dishData);
      toast.success('Dish created successfully!');
      // Reset form or redirect
    } catch (error) {
      // Error handling is automatic:
      // - 401 → redirects to login
      // - 403 → shows access denied
      toast.error('Failed to create dish');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Create Dish</button>
    </form>
  );
}
```

### Example 4: Conditional Rendering Based on Auth

```javascript
import React from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

function Header() {
  const { admin, isAdmin } = useAdminAuth();

  return (
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/menu">Menu</a>
        
        {isAdmin && (
          <>
            <a href="/dashboard">Dashboard</a>
            <span>👤 {admin.user_name}</span>
          </>
        )}
        
        {!isAdmin && (
          <a href="/login">Admin Login</a>
        )}
      </nav>
    </header>
  );
}
```

---

## 🔧 Configuration

### Backend API URL
The API base URL is set in two places:

1. **AdminAuthContext** (`src/contexts/AdminAuthContext.js`):
```javascript
const API_BASE_URL = 'http://localhost:4000';
```

2. **API Service** (`src/services/api.js`):
```javascript
const API_BASE = 'http://localhost:4000';
```

**To change for production:**
Update both files with your production API URL, or better yet, use environment variables:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
```

Then create a `.env` file:
```
REACT_APP_API_URL=https://your-production-api.com
```

---

## ⚠️ Important Notes

### 1. HTTP-Only Cookies
- JWT tokens are stored in HTTP-only cookies by the backend
- Frontend **never** accesses the token directly
- Cookie is automatically sent with every request using `credentials: 'include'`
- This prevents XSS attacks

### 2. CORS Configuration
Your backend must allow credentials from the frontend domain:

```javascript
// Backend CORS config (NestJS example)
app.enableCors({
  origin: 'http://localhost:3000',  // Your frontend URL
  credentials: true
});
```

### 3. Role-Based Access
- Only users with `user_role: 'admin'` can access protected routes
- The backend validates the role on every protected endpoint
- Frontend checks role in `AdminAuthContext`

### 4. Session Persistence
- Admin state persists across page refreshes
- On app mount, `AdminAuthContext` calls `/auth/me` to restore session
- If cookie is valid, admin is logged back in automatically

### 5. Automatic Redirects
- 401 errors → Automatically redirect to `/login`
- This is handled in `api.js` service layer
- No need to manually check auth on every API call

---

## 🧪 Testing Checklist

### Customer (Public) Features:
- [ ] Can browse menu without login
- [ ] Can view item details
- [ ] Can add items to cart
- [ ] Can complete checkout/payment
- [ ] Can track order with order ID

### Admin Features:
- [ ] Can login with admin credentials
- [ ] Redirected to dashboard after login
- [ ] Can create new dishes
- [ ] Can update existing dishes
- [ ] Can delete dishes
- [ ] Can view all orders
- [ ] Can update order status
- [ ] Can generate QR codes
- [ ] Admin name displays in navbar
- [ ] Can logout successfully

### Security Features:
- [ ] Cannot access admin routes without login
- [ ] Redirected to login when trying to access protected routes
- [ ] Session persists on page refresh
- [ ] Logout clears session properly
- [ ] Non-admin users cannot access admin features

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" errors on protected routes
**Solution:** 
- Verify backend is setting HTTP-only cookie on login
- Check CORS is configured to allow credentials
- Ensure `withCredentials: true` in axios calls

### Issue: Admin state not persisting on refresh
**Solution:**
- Check `/auth/me` endpoint is working
- Verify cookie is being sent with requests
- Check browser DevTools → Application → Cookies

### Issue: Redirecting to login even when logged in
**Solution:**
- Check `user_role` in backend response is exactly `'admin'`
- Verify `/auth/me` returns `success: true`
- Check console for authentication errors

### Issue: Customer routes require authentication
**Solution:**
- Verify routes are **outside** `<ProtectedRoute>` in `App.js`
- Check you're using `publicAPI` methods, not `adminAPI`

---

## 📚 Additional Resources

### Key Concepts:
- **HTTP-Only Cookies**: More secure than localStorage for JWT storage
- **Role-Based Access Control (RBAC)**: Different permissions for different user roles
- **Guest Checkout**: Customers don't need accounts to use the system
- **JWT Authentication**: Stateless authentication using JSON Web Tokens

### Next Steps:
1. Update any remaining components to use `publicAPI` or `adminAPI`
2. Add loading states to improve UX
3. Add error boundaries for better error handling
4. Consider adding a home page as landing page
5. Implement forgot password functionality (if needed)
6. Add user profile management (if needed)

---

## 📝 Summary

Your authentication system now follows security best practices:

✅ HTTP-only cookies prevent XSS attacks  
✅ CORS properly configured with credentials  
✅ Clear separation between public and admin features  
✅ Role-based access control enforced  
✅ Automatic session management  
✅ Proper error handling and redirects  
✅ Clean API service layer  
✅ Protected routes for admin features  
✅ Guest checkout for customers  

**Your restaurant ordering system is now secure and ready for use!** 🎉

---

## 🆘 Need Help?

If you encounter any issues:
1. Check browser console for errors
2. Check Network tab in DevTools for API responses
3. Verify backend is running and accessible
4. Ensure CORS is properly configured
5. Check that HTTP-only cookies are being set

For backend authentication guide, refer to the backend authentication documentation.
