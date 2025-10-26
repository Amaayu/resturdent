const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User model inline
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['customer', 'restaurant', 'admin'],
    default: 'customer'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  phone: String
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Database connection
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

// Auth middleware
const protect = async (req, res) => {
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
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Auth handlers
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return { status: 400, json: { message: 'User already exists' } };
    }

    const userRole = (role === 'restaurant') ? 'restaurant' : 'customer';

    const user = await User.create({ name, email, password, role: userRole });

    const token = generateToken(user._id);

    return {
      status: 201,
      json: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    };
  } catch (error) {
    return { status: 500, json: { message: error.message } };
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return { status: 401, json: { message: 'Invalid email or password' } };
    }

    const token = generateToken(user._id);

    return {
      json: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    };
  } catch (error) {
    return { status: 500, json: { message: error.message } };
  }
};

const logout = async (req, res) => {
  return { json: { message: 'Logged out successfully' } };
};

const getMe = async (req, res) => {
  const authResult = await protect(req, res);
  if (authResult.error) {
    return { status: authResult.status, json: authResult.error };
  }

  return { json: authResult.user };
};

// Main handler
exports.handler = async (event, context) => {
  // Set headers for CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    await connectDB();

    const path = event.path.replace('/.netlify/functions/auth', '');
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    let req = {
      body,
      headers: event.headers,
      cookies: event.headers.cookie ? require('cookie').parse(event.headers.cookie) : {}
    };

    let result;

    if (method === 'POST' && path === '/register') {
      result = await register(req);
    } else if (method === 'POST' && path === '/login') {
      result = await login(req);
    } else if (method === 'POST' && path === '/logout') {
      result = await logout(req);
    } else if (method === 'GET' && path === '/me') {
      result = await getMe(req);
    } else {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Route not found' })
      };
    }

    return {
      statusCode: result.status || 200,
      headers,
      body: JSON.stringify(result.json)
    };

  } catch (error) {
    console.error('Auth function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};
