import express from 'express';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  deleteRestaurant,
  getRestaurantsByOwner,
  getRestaurantWithMenu,
  getAllRestaurantsAdmin
} from '../controllers/restaurantController.js';
import { protect, admin, restaurant, restaurantOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Specific routes MUST come before parameterized routes
// Admin routes
router.get('/admin/all', protect, admin, getAllRestaurantsAdmin);

// Restaurant owner routes
router.get('/owner/my-restaurants', protect, restaurant, getRestaurantsByOwner);
router.get('/owner/:id', protect, restaurant, getRestaurantWithMenu);

// Menu routes (specific paths before :id)
router.post('/:id/menu', protect, restaurantOrAdmin, addMenuItem);
router.put('/menu/:menuItemId', protect, restaurantOrAdmin, updateMenuItem);
router.delete('/menu/:menuItemId', protect, restaurantOrAdmin, deleteMenuItem);

// Public routes
router.get('/', getRestaurants);

// Create/Update/Delete restaurant routes
router.post('/', protect, restaurantOrAdmin, createRestaurant);
router.put('/:id', protect, restaurantOrAdmin, updateRestaurant);
router.delete('/:id', protect, admin, deleteRestaurant);

// Public route - MUST be last as it catches all /:id patterns
router.get('/:id', getRestaurantById);

export default router;
