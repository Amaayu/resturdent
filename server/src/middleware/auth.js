import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    // Only check for token in cookies (httpOnly)
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ 
        message: 'Not authorized, no token',
        code: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Session expired, please log in again',
        code: 'TOKEN_EXPIRED'
      });
    }
    res.status(401).json({ 
      message: 'Not authorized, token failed',
      code: 'TOKEN_INVALID'
    });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

export const restaurant = (req, res, next) => {
  if (req.user && req.user.role === 'restaurant') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as restaurant owner' });
  }
};

export const restaurantOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'restaurant' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as restaurant owner or admin' });
  }
};
