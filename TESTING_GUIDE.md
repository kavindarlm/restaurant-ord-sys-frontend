# Quick Start Guide - Testing Authentication

## 🚀 Getting Started

Follow these steps to test your new authentication system:

---

## 1️⃣ Start the Application

### Terminal 1 - Backend (if not already running):
```bash
cd backend-folder
npm start
# Should run on http://localhost:4000
```

### Terminal 2 - Frontend:
```bash
cd e:\restaurant-ordering-sys\restaurant-ord-sys-frontend
npm start
# Should run on http://localhost:3000
```

---

## 2️⃣ Test Public Features (No Login Required)

### Customer can browse menu:
1. Navigate to: `http://localhost:3000/hotelMenuCustomerPage`
2. ✅ Should load without login
3. ✅ Should display menu items

### Customer can view item details:
1. Navigate to: `http://localhost:3000/itemMenuPageCustomer`
2. Click on any item
3. ✅ Should show item details without authentication

### Customer can add to cart and checkout:
1. Add items to cart
2. Go to: `http://localhost:3000/shopping`
3. ✅ Should work without login (guest checkout)

---

## 3️⃣ Test Admin Authentication

### Try to access admin pages without login:
1. Navigate to: `http://localhost:3000/dashboard`
2. ✅ Should redirect to `/login`

### Admin Login:
1. Go to: `http://localhost:3000/login`
2. Enter admin credentials:
   - Email: (your admin email)
   - Password: (your admin password)
3. Click "Login"
4. ✅ Should show success message
5. ✅ Should redirect to `/dashboard`

### Verify Protected Routes:
After logging in, test these admin routes:
- ✅ `/dashboard` - Admin dashboard
- ✅ `/add-new-item` - Create new dish
- ✅ `/itemMenuPage` - Manage items
- ✅ `/hotelMenuPage` - Manage menus
- ✅ `/pendingOrderPage` - View orders
- ✅ `/add-new-menu` - Create menu
- ✅ `/generate-qr` - Generate QR codes

All should load without redirecting to login.

---

## 4️⃣ Test Admin Features

### Create a New Dish:
1. Go to: `http://localhost:3000/add-new-item`
2. Fill in dish details
3. Submit form
4. ✅ Should create dish successfully
5. ✅ Should NOT redirect to login (means auth is working!)

### View All Orders:
1. Go to: `http://localhost:3000/pendingOrderPage`
2. ✅ Should load all orders
3. ✅ Should show admin-only data

### Update Order Status:
1. On pending orders page
2. Try updating an order status
3. ✅ Should update successfully

---

## 5️⃣ Test Admin Logout

### Logout:
1. Click the "Logout" button in navbar
2. ✅ Should show logout success message
3. ✅ Should redirect to `/login`

### Try accessing admin pages after logout:
1. Navigate to: `http://localhost:3000/dashboard`
2. ✅ Should redirect to `/login` (session cleared)

---

## 6️⃣ Test Session Persistence

### Refresh Page While Logged In:
1. Login as admin
2. Go to dashboard
3. Refresh the page (F5 or Ctrl+R)
4. ✅ Should stay logged in
5. ✅ Should NOT redirect to login

### Close and Reopen Browser:
1. Login as admin
2. Close browser completely
3. Reopen and go to: `http://localhost:3000/dashboard`
4. ✅ Should still be logged in (cookie persists)

---

## 7️⃣ Test Error Handling

### Wrong Credentials:
1. Go to login page
2. Enter wrong email/password
3. ✅ Should show error message
4. ✅ Should NOT redirect anywhere

### Account Lockout (3 failed attempts):
1. Enter wrong password 3 times
2. ✅ Should show lockout message
3. Wait or check backend to unlock

### 401 Error (Token Expired):
If your token expires while logged in:
1. Make an API call (e.g., create dish)
2. ✅ Should automatically redirect to login
3. ✅ Should show error message

---

## 8️⃣ Browser Developer Tools Check

### Check Cookies:
1. Open DevTools (F12)
2. Go to: Application → Cookies → `http://localhost:3000`
3. Look for cookie named: `access_token`
4. ✅ Should see HttpOnly flag checked
5. ✅ Value should be encrypted (JWT token)

### Check Network Requests:
1. Open DevTools → Network tab
2. Login as admin
3. Look at `/user/login` request
4. ✅ Response should be 200 OK
5. ✅ Set-Cookie header should be present

### Check Auth Headers:
1. Stay in Network tab
2. Make an admin API call (e.g., create dish)
3. Look at request headers
4. ✅ Cookie should be automatically sent
5. ✅ Should NOT see Authorization header (cookie handles it)

---

## 9️⃣ Test Role-Based Access

### Try logging in as non-admin user:
If you have a regular user account (not admin):
1. Login with regular user credentials
2. Try to access: `http://localhost:3000/dashboard`
3. ✅ Should redirect to login or show access denied
4. ✅ Admin features should NOT be accessible

---

## 🔟 Test API Service Layer

### Public API Test (in browser console):
```javascript
// Open DevTools → Console
import { publicAPI } from './services/api';

// Should work without login
const dishes = await publicAPI.getDishes();
console.log(dishes);
```

### Admin API Test (when logged in):
```javascript
// Open DevTools → Console
import { adminAPI } from './services/api';

// Should work only when logged in as admin
const orders = await adminAPI.getAllOrders();
console.log(orders);
```

---

## ✅ Full Test Checklist

### Public Features (No Auth):
- [ ] Can browse customer menu pages
- [ ] Can view item details
- [ ] Can add items to cart
- [ ] Can complete checkout
- [ ] No login required for any customer action

### Admin Authentication:
- [ ] Cannot access admin pages without login
- [ ] Redirected to login when accessing protected routes
- [ ] Can login with valid admin credentials
- [ ] Invalid credentials show error
- [ ] Account locks after 3 failed attempts

### Admin Features:
- [ ] Can access dashboard after login
- [ ] Can create new dishes
- [ ] Can update existing items
- [ ] Can delete items
- [ ] Can view all orders
- [ ] Can update order status
- [ ] Can generate QR codes

### Session Management:
- [ ] Session persists on page refresh
- [ ] Session persists when closing/reopening browser
- [ ] Logout clears session properly
- [ ] Cannot access admin pages after logout

### Security:
- [ ] HTTP-only cookie is set on login
- [ ] Cookie is automatically sent with requests
- [ ] Token not accessible via JavaScript
- [ ] 401 errors redirect to login
- [ ] 403 errors show access denied

---

## 🐛 Troubleshooting

### Login not working?
- Check backend is running on port 4000
- Check CORS is enabled with credentials
- Check backend login endpoint returns 200
- Look for errors in browser console

### Redirecting to login constantly?
- Check `/auth/me` endpoint works
- Verify cookie is being set (check DevTools)
- Check `user_role` is exactly `'admin'`
- Verify CORS allows credentials

### Public pages requiring login?
- Make sure routes are NOT wrapped in `<ProtectedRoute>`
- Check you're using `publicAPI` methods
- Verify routes are outside AdminAuthProvider (they're not)

### Admin pages not protected?
- Verify routes are wrapped in `<ProtectedRoute>` in App.js
- Check `ProtectedRoute` is using `useAdminAuth`
- Test by logging out and trying to access

---

## 📊 Expected Results Summary

| Feature | Expected Behavior |
|---------|------------------|
| Browse Menu | ✅ Works without login |
| Place Order | ✅ Works without login |
| Access /dashboard without login | ❌ Redirects to /login |
| Login with valid admin | ✅ Success, redirects to dashboard |
| Login with invalid credentials | ❌ Shows error, stays on login |
| Refresh page while logged in | ✅ Stays logged in |
| Logout | ✅ Clears session, redirects to login |
| Create dish without login | ❌ Redirects to /login |
| Create dish while logged in | ✅ Creates successfully |
| Token expires | ❌ Auto-redirect to /login |

---

## 🎯 What to Look For

### Good Signs (Working Correctly):
✅ Customer pages load without login  
✅ Admin pages redirect to login  
✅ Login sets cookie (check DevTools)  
✅ After login, can access all admin features  
✅ Logout clears everything  
✅ Session persists on refresh  

### Bad Signs (Needs Fixing):
❌ Public pages require login  
❌ Admin pages accessible without login  
❌ Login successful but no redirect  
❌ Logout doesn't clear session  
❌ 401 errors but no redirect  
❌ CORS errors in console  

---

## 🚀 Ready to Go!

Your authentication system is fully implemented. Run through this testing guide to verify everything works correctly.

**Happy Testing!** 🎉

---

## 📞 Need Support?

If something doesn't work as expected:
1. Check the error message in browser console
2. Check Network tab for failed requests
3. Verify backend is running and responding
4. Check CORS configuration in backend
5. Review the main AUTHENTICATION_GUIDE.md
6. Check MIGRATION_GUIDE.md for component updates

Most issues are related to:
- Backend not running
- CORS not configured for credentials
- Cookie not being set by backend
- Wrong API URL (should be http://localhost:4000)
