import express from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  getAllOrders,
  getRestaurantOrders
} from '../controllers/orderController.js';
import { protect, admin, restaurant, restaurantOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Specific routes MUST come before parameterized routes
router.get('/restaurant/my-orders', protect, restaurant, getRestaurantOrders);
router.get('/user/:userId', protect, getUserOrders);

// General routes
router.post('/', protect, createOrder);
router.get('/', protect, admin, getAllOrders);

// Parameterized routes - must be last
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, restaurantOrAdmin, updateOrderStatus);

export default router;
