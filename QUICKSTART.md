# Quick Start Guide

## Prerequisites
- Node.js (v18+)
- MongoDB (running locally or use MongoDB Atlas)
- npm

## Installation Steps

### 1. Install Dependencies

Root dependencies:
```bash
npm install
```

Server dependencies:
```bash
cd server
npm install
```

Client dependencies:
```bash
cd client
npm install
```

Or install all at once:
```bash
npm run install:all
```

### 2. Setup Environment Variables

The `.env` files are already created in both `server/` and `client/` directories.

**Important:** Make sure MongoDB is running on your system!

For macOS with Homebrew:
```bash
brew services start mongodb-community
```

For manual start:
```bash
mongod
```

### 3. Seed the Database

Populate the database with sample restaurants, menu items, and users:

```bash
cd server
npm run seed
```

This will create:
- **Admin account:** admin@example.com / admin123
- **Customer account:** john@example.com / password123
- 4 sample restaurants with menu items

### 4. Start the Application

**Option A: Run both servers concurrently (recommended)**
```bash
npm run dev
```

**Option B: Run servers separately**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

### 5. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## Test Accounts

### Admin Account
- Email: admin@example.com
- Password: admin123
- Access: Admin dashboard, order management, restaurant management

### Customer Account
- Email: john@example.com
- Password: password123
- Access: Browse restaurants, place orders, view order history

## Features to Test

### As a Customer:
1. ✅ Register a new account or login
2. ✅ Browse restaurants on the home page
3. ✅ Filter by cuisine type
4. ✅ Search for restaurants
5. ✅ Click on a restaurant to view menu
6. ✅ Add items to cart
7. ✅ Proceed to checkout
8. ✅ Fill delivery information
9. ✅ Select payment method (COD or None)
10. ✅ Place order
11. ✅ View order history in profile
12. ✅ Update profile information

### As an Admin:
1. ✅ Login with admin account
2. ✅ Access admin dashboard
3. ✅ View sales statistics
4. ✅ Manage orders (update status)
5. ✅ View all restaurants
6. ✅ Real-time order notifications

### Static Pages:
- ✅ About Us
- ✅ Contact
- ✅ Disclaimer

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service
```bash
brew services start mongodb-community
# or
mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process using the port
```bash
lsof -ti:5000 | xargs kill -9
```

### CORS Error
**Solution:** Ensure CLIENT_URL in server/.env matches your frontend URL

### Cart Not Persisting
**Solution:** Check browser localStorage is enabled

### Dependencies Not Installing
**Solution:** Clear npm cache and reinstall
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
restaurant-app/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── api/           # API service functions
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   ├── App.jsx        # Main app with routing
│   │   └── main.jsx       # Entry point
│   ├── .env               # Frontend environment variables
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Auth & error handling
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Helper functions & seed data
│   │   └── server.js      # Express app entry point
│   ├── .env               # Backend environment variables
│   └── package.json
│
├── package.json           # Root package with scripts
├── README.md              # Full documentation
└── QUICKSTART.md          # This file
```

## API Testing

You can test the API using curl or Postman:

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get Restaurants
```bash
curl http://localhost:5000/api/restaurants
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## Next Steps

1. Customize restaurant data in `server/src/utils/seedData.js`
2. Add your own restaurant images
3. Configure MongoDB Atlas for production
4. Deploy to your preferred hosting platform
5. Add more features as needed

## Support

For issues or questions:
- Check the main README.md for detailed documentation
- Review the API endpoints section
- Check browser console for frontend errors
- Check server terminal for backend errors

Happy coding! 🚀
