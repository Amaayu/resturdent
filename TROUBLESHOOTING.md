# Troubleshooting 401 Unauthorized Errors

## Problem
Getting 401 (Unauthorized) errors when trying to access restaurant owner dashboard or create restaurants.

## Root Cause
The authentication token is not being sent with requests, or the user is not properly logged in.

## Solutions

### Solution 1: Clear Browser Data and Re-login

1. **Open Browser DevTools** (F12 or Right-click → Inspect)
2. **Go to Application tab** (Chrome) or Storage tab (Firefox)
3. **Clear all data:**
   - Cookies: Delete all cookies for localhost
   - Local Storage: Clear all localStorage items
   - Session Storage: Clear all sessionStorage items
4. **Refresh the page** (Ctrl+R or Cmd+R)
5. **Register again** as Restaurant Owner or Login

### Solution 2: Check if You're Logged In

1. Open Browser DevTools Console
2. Type: `localStorage.getItem('auth-storage')`
3. You should see something like:
   ```json
   {"state":{"user":{"_id":"...","name":"...","email":"...","role":"restaurant"},"isAuthenticated":true},"version":0}
   ```
4. If you see `null` or `isAuthenticated: false`, you need to log in again

### Solution 3: Verify Server is Running on Correct Port

From the logs, your server is running on **port 5001**, not 5000.

1. Check `client/.env` file contains:
   ```
   VITE_API_URL=http://localhost:5001/api
   ```
2. If it says port 5000, change it to 5001
3. **Restart the development server** (stop with Ctrl+C and run `npm run dev` again)

### Solution 4: Test Authentication Manually

1. **Register as Restaurant Owner:**
   - Go to http://localhost:5173/register
   - Fill in details
   - Select "Restaurant Owner" from dropdown
   - Click Register
   - You should be redirected to `/restaurant` dashboard

2. **Check Network Tab:**
   - Open DevTools → Network tab
   - Try to create a restaurant
   - Look at the POST request to `/api/restaurants`
   - Check the **Cookies** section - you should see a `token` cookie
   - If no token cookie, authentication failed

### Solution 5: Check Cookie Settings

The authentication uses httpOnly cookies. Make sure:

1. **Client and Server are on same domain** (both localhost)
2. **withCredentials is set to true** in axios config (already done)
3. **CORS is properly configured** on server

### Solution 6: Re-register with Restaurant Role

The issue might be that you registered before the role selection was added.

1. **Logout** (click Logout button)
2. **Register a NEW account:**
   - Use a different email (e.g., `owner2@test.com`)
   - **Important:** Select "Restaurant Owner" from the dropdown
   - Complete registration
3. You should be automatically redirected to `/restaurant` dashboard

### Solution 7: Check Server Logs

Look at your server terminal output:
- If you see `401` errors, authentication is failing
- If you see `403` errors, you're authenticated but don't have permission (wrong role)
- If you see `200` or `201`, requests are successful

### Solution 8: Verify User Role in Database

If you have access to MongoDB:

```javascript
// Connect to MongoDB and check user role
db.users.find({ email: "your-email@test.com" })

// Should show: role: "restaurant"
// If it shows role: "customer", update it:
db.users.updateOne(
  { email: "your-email@test.com" },
  { $set: { role: "restaurant" } }
)
```

## Step-by-Step: Fresh Start

1. **Stop the server** (Ctrl+C in terminal)

2. **Clear browser data:**
   - Open DevTools
   - Application → Clear storage → Clear site data

3. **Restart server:**
   ```bash
   npm run dev
   ```

4. **Wait for both servers to start:**
   - Server should show: "Server running on port 5001"
   - Client should show: "Local: http://localhost:5173/"

5. **Go to registration page:**
   ```
   http://localhost:5173/register
   ```

6. **Register as Restaurant Owner:**
   - Name: Test Owner
   - Email: testowner@example.com
   - Password: password123
   - **Role: Restaurant Owner** ← IMPORTANT!
   - Click Register

7. **You should be redirected to:** `/restaurant`

8. **Try creating a restaurant**

## Still Having Issues?

### Check These:

1. **Is the user object in localStorage?**
   ```javascript
   // In browser console:
   JSON.parse(localStorage.getItem('auth-storage'))
   ```

2. **Is the token cookie present?**
   - DevTools → Application → Cookies → http://localhost:5173
   - Look for `token` cookie

3. **Check axios is sending credentials:**
   - Network tab → Select a failed request
   - Headers tab → Request Headers
   - Should see: `Cookie: token=...`

4. **Verify the API URL:**
   ```javascript
   // In browser console:
   import.meta.env.VITE_API_URL
   // Should show: http://localhost:5001/api
   ```

## Common Mistakes

❌ **Registering as Customer instead of Restaurant Owner**
- Solution: Register again with correct role

❌ **Server running on different port than configured**
- Solution: Update `.env` file to match server port

❌ **Not logged in**
- Solution: Login or register

❌ **Old cached data**
- Solution: Clear browser data and refresh

❌ **Token expired**
- Solution: Logout and login again

## Success Indicators

✅ After registration, you're redirected to `/restaurant` dashboard
✅ You see "Welcome back, [Your Name]!" at the top
✅ No 401 errors in console
✅ You can see "My Restaurants" and "Orders" tabs
✅ "Add Restaurant" button is visible

If you see all of these, authentication is working correctly!
