const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User model
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role: { type: String, enum: ['customer', 'restaurant', 'admin'], default: 'customer' },
  address: { street: String, city: String, state: String, zipCode: String },
  phone: String
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Restaurant model
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  phone: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  cuisine: [{ type: String }],
  priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'] },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  isOpen: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: String,
  menu: [{
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    image: String,
    isAvailable: { type: Boolean, default: true }
  }]
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// Order model
const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'], default: 'pending' },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
  specialInstructions: String
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// Database connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    throw error;
  }
};

// Auth middleware
const protect = async (req) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') ||
                  req.cookies?.token;

    if (!token) {
      return { error: { message: 'Not authorized, no token', code: 'NO_TOKEN' }, status: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return { error: { message: 'User not found', code: 'USER_NOT_FOUND' }, status: 401 };
    }

    return { user };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { error: { message: 'Session expired, please log in again', code: 'TOKEN_EXPIRED' }, status: 401 };
    }
    return { error: { message: 'Not authorized, token failed', code: 'TOKEN_INVALID' }, status: 401 };
  }
};

// Generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// API Handlers
const authRoutes = {
  register: async (body) => {
    const { name, email, password, role } = body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return { status: 400, json: { message: 'User already exists' } };
    }
    const userRole = (role === 'restaurant') ? 'restaurant' : 'customer';
    const user = await User.create({ name, email, password, role: userRole });
    const token = generateToken(user._id);
    return { status: 201, json: { _id: user._id, name: user.name, email: user.email, role: user.role, token } };
  },

  login: async (body) => {
    const { email, password } = body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return { status: 401, json: { message: 'Invalid email or password' } };
    }
    const token = generateToken(user._id);
    return { json: { _id: user._id, name: user.name, email: user.email, role: user.role, token } };
  },

  logout: async () => {
    return { json: { message: 'Logged out successfully' } };
  },

  getMe: async (req) => {
    const authResult = await protect(req);
    if (authResult.error) return authResult;
    return { json: authResult.user };
  }
};

const restaurantRoutes = {
  getRestaurants: async () => {
    const restaurants = await Restaurant.find({ isOpen: true })
      .populate('owner', 'name')
      .select('-menu');
    return { json: restaurants };
  },

  getRestaurantById: async (id) => {
    const restaurant = await Restaurant.findById(id).populate('owner', 'name');
    if (!restaurant) {
      return { status: 404, json: { message: 'Restaurant not found' } };
    }
    return { json: restaurant };
  },

  createRestaurant: async (body, user) => {
    const restaurant = await Restaurant.create({ ...body, owner: user._id });
    return { status: 201, json: restaurant };
  },

  updateRestaurant: async (id, body, user) => {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return { status: 404, json: { message: 'Restaurant not found' } };
    }
    if (restaurant.owner.toString() !== user._id.toString() && user.role !== 'admin') {
      return { status: 403, json: { message: 'Not authorized' } };
    }
    const updated = await Restaurant.findByIdAndUpdate(id, body, { new: true });
    return { json: updated };
  },

  addMenuItem: async (restaurantId, body, user) => {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return { status: 404, json: { message: 'Restaurant not found' } };
    }
    if (restaurant.owner.toString() !== user._id.toString() && user.role !== 'admin') {
      return { status: 403, json: { message: 'Not authorized' } };
    }
    restaurant.menu.push(body);
    await restaurant.save();
    return { json: restaurant.menu[restaurant.menu.length - 1] };
  },

  updateMenuItem: async (menuItemId, body, user) => {
    const restaurant = await Restaurant.findOne({ 'menu._id': menuItemId });
    if (!restaurant) {
      return { status: 404, json: { message: 'Menu item not found' } };
    }
    if (restaurant.owner.toString() !== user._id.toString() && user.role !== 'admin') {
      return { status: 403, json: { message: 'Not authorized' } };
    }
    const menuItem = restaurant.menu.id(menuItemId);
    Object.assign(menuItem, body);
    await restaurant.save();
    return { json: menuItem };
  },

  deleteMenuItem: async (menuItemId, user) => {
    const restaurant = await Restaurant.findOne({ 'menu._id': menuItemId });
    if (!restaurant) {
      return { status: 404, json: { message: 'Menu item not found' } };
    }
    if (restaurant.owner.toString() !== user._id.toString() && user.role !== 'admin') {
      return { status: 403, json: { message: 'Not authorized' } };
    }
    restaurant.menu.pull(menuItemId);
    await restaurant.save();
    return { json: { message: 'Menu item removed' } };
  },

  getRestaurantsByOwner: async (user) => {
    const restaurants = await Restaurant.find({ owner: user._id });
    return { json: restaurants };
  }
};

const orderRoutes = {
  getOrders: async (user) => {
    let orders;
    if (user.role === 'customer') {
      orders = await Order.find({ customer: user._id })
        .populate('restaurant', 'name')
        .populate('customer', 'name');
    } else if (user.role === 'restaurant') {
      orders = await Order.find({ restaurant: { $in: await Restaurant.find({ owner: user._id }).distinct('_id') } })
        .populate('restaurant', 'name')
        .populate('customer', 'name');
    } else {
      orders = await Order.find({})
        .populate('restaurant', 'name')
        .populate('customer', 'name');
    }
    return { json: orders };
  },

  createOrder: async (body, user) => {
    const order = await Order.create({ ...body, customer: user._id });
    return { status: 201, json: order };
  },

  updateOrderStatus: async (id, body, user) => {
    const order = await Order.findById(id).populate('restaurant');
    if (!order) {
      return { status: 404, json: { message: 'Order not found' } };
    }
    if (order.restaurant.owner.toString() !== user._id.toString() && user.role !== 'admin') {
      return { status: 403, json: { message: 'Not authorized' } };
    }
    const updated = await Order.findByIdAndUpdate(id, body, { new: true });
    return { json: updated };
  }
};

// Main handler
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    await connectDB();

    const path = event.path.replace('/.netlify/functions/api', '');
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};
    const queryParams = event.queryStringParameters || {};

    const req = {
      body,
      headers: event.headers,
      cookies: event.headers.cookie ? require('cookie').parse(event.headers.cookie) : {},
      query: queryParams,
      params: {}
    };

    // Parse path parameters
    const pathParts = path.split('/').filter(p => p);
    if (pathParts.length > 0) {
      if (pathParts[0] === 'auth') {
        // Auth routes
        const authMethod = pathParts[1];
        if (method === 'POST' && authMethod === 'register') return await handleResponse(authRoutes.register(body));
        if (method === 'POST' && authMethod === 'login') return await handleResponse(authRoutes.login(body));
        if (method === 'POST' && authMethod === 'logout') return await handleResponse(authRoutes.logout());
        if (method === 'GET' && authMethod === 'me') return await handleResponse(authRoutes.getMe(req));
      } else if (pathParts[0] === 'restaurants') {
        // Restaurant routes
        const authResult = await protect(req);
        if (authResult.error) return await handleResponse(authResult);

        if (method === 'GET' && pathParts.length === 1) return await handleResponse(restaurantRoutes.getRestaurants());
        if (method === 'GET' && pathParts[1] === 'owner' && pathParts[2] === 'my-restaurants') {
          return await handleResponse(restaurantRoutes.getRestaurantsByOwner(authResult.user));
        }
        if (method === 'POST' && pathParts.length === 1) return await handleResponse(restaurantRoutes.createRestaurant(body, authResult.user));
        if (method === 'GET' && pathParts.length === 2) return await handleResponse(restaurantRoutes.getRestaurantById(pathParts[1]));
        if (method === 'PUT' && pathParts.length === 2) return await handleResponse(restaurantRoutes.updateRestaurant(pathParts[1], body, authResult.user));
        if (method === 'POST' && pathParts.length === 3 && pathParts[2] === 'menu') {
          return await handleResponse(restaurantRoutes.addMenuItem(pathParts[1], body, authResult.user));
        }
        if (method === 'PUT' && pathParts[1] === 'menu') {
          return await handleResponse(restaurantRoutes.updateMenuItem(pathParts[2], body, authResult.user));
        }
        if (method === 'DELETE' && pathParts[1] === 'menu') {
          return await handleResponse(restaurantRoutes.deleteMenuItem(pathParts[2], authResult.user));
        }
      } else if (pathParts[0] === 'orders') {
        // Order routes
        const authResult = await protect(req);
        if (authResult.error) return await handleResponse(authResult);

        if (method === 'GET' && pathParts.length === 1) return await handleResponse(orderRoutes.getOrders(authResult.user));
        if (method === 'POST' && pathParts.length === 1) return await handleResponse(orderRoutes.createOrder(body, authResult.user));
        if (method === 'PUT' && pathParts.length === 2) return await handleResponse(orderRoutes.updateOrderStatus(pathParts[1], body, authResult.user));
      } else if (pathParts[0] === 'users') {
        // User routes - simplified
        const authResult = await protect(req);
        if (authResult.error) return await handleResponse(authResult);
        if (method === 'GET' && pathParts.length === 1) {
          const users = await User.find({}).select('-password');
          return await handleResponse({ json: users });
        }
      } else if (path === '/health') {
        return await handleResponse({ json: { status: 'ok', message: 'Server is running' } });
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Route not found' })
    };

  } catch (error) {
    console.error('API function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};

async function handleResponse(result) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

  return {
    statusCode: result.status || 200,
    headers,
    body: JSON.stringify(result.json)
  };
}
