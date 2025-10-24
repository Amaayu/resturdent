# User Roles and Permissions

This document describes the three-tier user role system implemented in the restaurant ordering platform.

## User Roles

### 1. Customer (Default Role)
**Purpose:** Browse restaurants, order food, and track deliveries.

**Permissions:**
- ✅ Browse all active restaurants
- ✅ View restaurant details and menus
- ✅ Add items to cart
- ✅ Place orders
- ✅ View order history
- ✅ Update profile information
- ❌ Cannot access admin or restaurant dashboards
- ❌ Cannot manage restaurants or menu items

**Registration:** Users register as customers by default or select "Customer" during registration.

**Dashboard Access:** `/profile` - View personal information and order history

---

### 2. Restaurant Owner
**Purpose:** Manage their own restaurants, menu items, and view orders for their restaurants.

**Permissions:**
- ✅ Create new restaurants
- ✅ View and manage their own restaurants
- ✅ Add, update, and delete menu items for their restaurants
- ✅ View all orders for their restaurants
- ✅ Update order status (PENDING → CONFIRMED → IN_PROGRESS → OUT_FOR_DELIVERY → DELIVERED)
- ✅ Cancel orders
- ❌ Cannot view or manage other restaurants
- ❌ Cannot delete restaurants (admin only)
- ❌ Cannot access admin dashboard
- ❌ Cannot view all orders (only their restaurant orders)

**Registration:** Select "Restaurant Owner" during registration.

**Dashboard Access:** `/restaurant` - Restaurant Owner Dashboard

**Key Features:**
- **My Restaurants Tab:** View all owned restaurants, add new restaurants, add menu items
- **Orders Tab:** View and manage orders for all owned restaurants with customer details

---

### 3. Admin (Super User)
**Purpose:** Full control over the entire platform - manage all restaurants, dishes, and orders.

**Permissions:**
- ✅ View all orders from all restaurants
- ✅ Update any order status
- ✅ View all restaurants (including owner information)
- ✅ Create new restaurants
- ✅ Update any restaurant
- ✅ **DELETE any restaurant** (also deletes associated menu items)
- ✅ Add, update, and delete menu items for any restaurant
- ✅ View platform statistics (today's sales, total orders, pending orders)
- ✅ Full access to all platform features

**Registration:** Admin role must be manually set in the database (for security).

**Dashboard Access:** `/admin` - Admin Dashboard

**Key Features:**
- **Orders Tab:** View and manage all orders with customer and restaurant details
- **Restaurants Tab:** View all restaurants with owner info, delete restaurants
- **Statistics:** Real-time dashboard with sales metrics

---

## API Endpoints by Role

### Public Endpoints (No Authentication)
```
GET  /api/restaurants              - Get all active restaurants
GET  /api/restaurants/:id          - Get restaurant details with menu
```

### Customer Endpoints (Protected)
```
POST /api/orders                   - Create order
GET  /api/orders/user/:userId      - Get user's orders
GET  /api/orders/:id               - Get order details
GET  /api/users/:id                - Get user profile
PUT  /api/users/:id                - Update user profile
```

### Restaurant Owner Endpoints (Protected - Restaurant Role)
```
GET  /api/restaurants/owner/my-restaurants     - Get owned restaurants
GET  /api/restaurants/owner/:id                - Get restaurant with menu
POST /api/restaurants                          - Create restaurant
PUT  /api/restaurants/:id                      - Update restaurant
POST /api/restaurants/:id/menu                 - Add menu item
PUT  /api/restaurants/menu/:menuItemId         - Update menu item
DELETE /api/restaurants/menu/:menuItemId       - Delete menu item
GET  /api/orders/restaurant/my-orders          - Get restaurant orders
PUT  /api/orders/:id/status                    - Update order status
```

### Admin Endpoints (Protected - Admin Role)
```
GET  /api/restaurants/admin/all                - Get all restaurants with owners
DELETE /api/restaurants/:id                    - Delete restaurant
POST /api/restaurants                          - Create restaurant
PUT  /api/restaurants/:id                      - Update any restaurant
POST /api/restaurants/:id/menu                 - Add menu item
PUT  /api/restaurants/menu/:menuItemId         - Update menu item
DELETE /api/restaurants/menu/:menuItemId       - Delete menu item
GET  /api/orders                               - Get all orders
PUT  /api/orders/:id/status                    - Update order status
```

---

## Navigation by Role

### Customer Navigation
- Home
- About
- Contact
- Disclaimer
- Profile (order history)
- Cart
- Logout

### Restaurant Owner Navigation
- Home
- About
- Contact
- Disclaimer
- Dashboard (restaurant management)
- Logout

### Admin Navigation
- Home
- About
- Contact
- Disclaimer
- Admin Dashboard (full platform control)
- Logout

---

## How to Create Users

### Customer or Restaurant Owner
1. Go to `/register`
2. Fill in name, email, password
3. Select role: "Customer" or "Restaurant Owner"
4. Click Register

### Admin
Admins must be created manually in the database for security:

```javascript
// Using MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or create a new admin user:
```javascript
// First register as customer, then update role
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$12$hashedPasswordHere", // Use bcrypt to hash
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## Security Features

1. **Role-Based Middleware:**
   - `protect` - Requires authentication
   - `admin` - Requires admin role
   - `restaurant` - Requires restaurant role
   - `restaurantOrAdmin` - Requires restaurant or admin role

2. **Authorization Checks:**
   - Restaurant owners can only access their own restaurants
   - Customers can only view their own orders
   - Admins have unrestricted access

3. **Route Protection:**
   - Frontend routes are protected based on user role
   - Unauthorized access redirects to home page
   - API endpoints validate JWT tokens and user roles

---

## Order Status Flow

All roles can update order status (restaurant owners for their orders, admins for all):

1. **PENDING** - Order placed by customer
2. **CONFIRMED** - Restaurant confirmed the order
3. **IN_PROGRESS** - Food is being prepared
4. **OUT_FOR_DELIVERY** - Order is on the way
5. **DELIVERED** - Order completed
6. **CANCELLED** - Order cancelled

---

## Database Schema Updates

### User Model
```javascript
role: {
  type: String,
  enum: ['customer', 'restaurant', 'admin'],
  default: 'customer'
}
```

### Restaurant Model
```javascript
owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}
```

---

## Testing the System

### Test as Customer
1. Register with role "Customer"
2. Browse restaurants and place orders
3. View order history in profile

### Test as Restaurant Owner
1. Register with role "Restaurant Owner"
2. Access `/restaurant` dashboard
3. Create a restaurant
4. Add menu items
5. View incoming orders
6. Update order status

### Test as Admin
1. Create admin user in database
2. Login with admin credentials
3. Access `/admin` dashboard
4. View all orders and restaurants
5. Delete restaurants
6. Manage all platform data

---

## Summary

This three-tier system provides:
- **Customers** can consume dishes and place orders
- **Restaurant Owners** can list dishes and manage their own restaurants
- **Admins** have full control to view all orders, check all listed restaurants, and delete restaurants/dishes from the platform

All roles have appropriate permissions and cannot access features outside their authorization level.
