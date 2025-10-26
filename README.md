# Restaurant Ordering Platform

A full-stack restaurant discovery and online ordering web application built with React, Express, and MongoDB.

## Features

### Customer Features
- 🔐 User authentication (Register/Login with JWT)
- 🍽️ Browse restaurants with filters (cuisine, price, rating)
- 🔍 Search functionality
- 📋 View restaurant details and menus
- 🛒 Shopping cart with persistence
- 💳 Checkout with Cash on Delivery (COD) option
- 👤 User profile management
- 📦 Order history and tracking
- 📄 Static pages: About Us, Contact, Disclaimer

### Admin Features
- 📊 Dashboard with sales statistics
- 📋 Order management with status updates
- 🏪 Restaurant management (CRUD operations)
- 🍕 Menu item management
- 🔔 Real-time order notifications via Socket.io

## Tech Stack

### Frontend
- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Routing:** React Router v6
- **Notifications:** react-hot-toast
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with httpOnly cookies
- **Security:** helmet, cors, express-rate-limit
- **Real-time:** Socket.io
- **Password Hashing:** bcryptjs

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API service functions
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth & error handling
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Helper functions
│   │   └── server.js      # Entry point
│   └── package.json
│
└── README.md
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd restaurant-app
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant-app
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

6. **Run the application**

Terminal 1 - Start backend:
```bash
cd server
npm run dev
```

Terminal 2 - Start frontend:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Restaurants
- `GET /api/restaurants` - Get all restaurants (with filters)
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (admin only)
- `PUT /api/restaurants/:id` - Update restaurant (admin only)

### Menu Items
- `POST /api/restaurants/:id/menu` - Add menu item (admin only)
- `PUT /api/restaurants/menu/:menuItemId` - Update menu item (admin only)
- `DELETE /api/restaurants/menu/:menuItemId` - Delete menu item (admin only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/user/:userId` - Get user orders
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `GET /api/orders` - Get all orders (admin only)

### Users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

## Default Admin Account

To create an admin account, manually update a user in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Payment Methods

This application supports offline payment methods only:
- **Cash on Delivery (COD)** - Pay when order is delivered
- **None** - Pay at restaurant

Online payment integration is intentionally disabled as per requirements.

## Features in Detail

### Cart Persistence
Cart data is stored in localStorage, so items persist across browser sessions.

### Real-time Updates
Socket.io provides real-time notifications for:
- New orders (admin dashboard)
- Order status changes (customer view)

### Order Status Flow
1. PENDING - Order placed
2. CONFIRMED - Restaurant confirmed
3. IN_PROGRESS - Being prepared
4. OUT_FOR_DELIVERY - On the way
5. DELIVERED - Completed
6. CANCELLED - Cancelled

## Security Features

- JWT tokens stored in httpOnly cookies
- Password hashing with bcryptjs
- CORS protection
- Rate limiting on API endpoints
- Helmet.js for security headers
- Input validation

## Development

### Adding Sample Data

You can add sample restaurants and menu items through the admin dashboard or directly via MongoDB:

```javascript
// Sample restaurant
db.restaurants.insertOne({
  name: "Pizza Palace",
  description: "Best pizza in town",
  cuisineType: ["Italian"],
  priceRange: "$$",
  rating: 4.5,
  isActive: true
})
```

## Production Deployment

1. Set `NODE_ENV=production` in server `.env`
2. Update `CLIENT_URL` to your production frontend URL
3. Use a production MongoDB instance (MongoDB Atlas recommended)
4. Build the frontend: `cd client && npm run build`
5. Serve the built files with a static server or integrate with backend

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file

**CORS Error:**
- Verify CLIENT_URL matches your frontend URL
- Check cors configuration in server.js

**Authentication Issues:**
- Clear browser cookies
- Check JWT_SECRET is set
- Verify token expiration

## License

MIT

## Support

For issues and questions, please use the Contact page in the application or open an issue on GitHub.
