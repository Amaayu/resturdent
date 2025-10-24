import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/currency';

export default function RestaurantDashboard() {
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('restaurants');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);

  // Fetch restaurant owner's restaurants
  const { data: restaurants = [], isLoading: loadingRestaurants, error: restaurantsError } = useQuery({
    queryKey: ['myRestaurants'],
    queryFn: async () => {
      const { data } = await axios.get('/restaurants/owner/my-restaurants');
      return data;
    },
    enabled: isAuthenticated && user?.role === 'restaurant',
    retry: 1
  });

  // Fetch orders for restaurant owner
  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ['restaurantOrders'],
    queryFn: async () => {
      const { data } = await axios.get('/orders/restaurant/my-orders');
      return data;
    },
    enabled: isAuthenticated && user?.role === 'restaurant',
    retry: 1
  });


  // Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const { data } = await axios.put(`/orders/${orderId}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['restaurantOrders']);
      toast.success('Order status updated');
    },
    onError: () => {
      toast.error('Failed to update order status');
    }
  });

  // Create restaurant mutation
  const createRestaurantMutation = useMutation({
    mutationFn: async (restaurantData) => {
      const { data } = await axios.post('/restaurants', restaurantData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myRestaurants']);
      toast.success('Restaurant created successfully');
      setShowRestaurantForm(false);
    },
    onError: () => {
      toast.error('Failed to create restaurant');
    }
  });

  // Add menu item mutation
  const addMenuItemMutation = useMutation({
    mutationFn: async ({ restaurantId, menuItem }) => {
      const { data } = await axios.post(`/restaurants/${restaurantId}/menu`, menuItem);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myRestaurants']);
      toast.success('Menu item added successfully');
      setShowMenuForm(false);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to add menu item';
      toast.error(errorMessage);
      console.error('Menu item error:', error.response?.data);
    }
  });

  // Delete menu item mutation
  const _deleteMenuItemMutation = useMutation({
    mutationFn: async (menuItemId) => {
      await axios.delete(`/restaurants/menu/${menuItemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myRestaurants']);
      toast.success('Menu item deleted');
    },
    onError: () => {
      toast.error('Failed to delete menu item');
    }
  });

  const handleRestaurantSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const restaurantData = {
      name: formData.get('name'),
      description: formData.get('description'),
      cuisineType: formData.get('cuisineType').split(',').map(c => c.trim()),
      priceRange: formData.get('priceRange'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: {
        street: formData.get('street'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode')
      },
      deliveryTime: formData.get('deliveryTime'),
      image: formData.get('image')
    };
    createRestaurantMutation.mutate(restaurantData);
  };

  const handleMenuItemSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const spiceLevel = formData.get('spiceLevel');
    
    const menuItem = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      category: formData.get('category'),
      image: formData.get('image'),
      isVegetarian: formData.get('isVegetarian') === 'on',
      isVegan: formData.get('isVegan') === 'on'
    };
    
    // Only include spiceLevel if a valid value is selected
    if (spiceLevel && spiceLevel !== '') {
      menuItem.spiceLevel = spiceLevel;
    }
    
    addMenuItemMutation.mutate({ restaurantId: selectedRestaurant, menuItem });
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Show error if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Authentication Required</p>
          <p>Please log in to access the restaurant dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Restaurant Owner Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
      </div>

      {/* Error Messages */}
      {restaurantsError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">⚠️ Authentication Error</p>
          <p className="mb-3">{restaurantsError.response?.data?.message || 'Not authorized - no token found.'}</p>
          <p className="text-sm mb-3">This usually means you need to log in again. The authentication cookie may not be set properly.</p>
          <div className="flex gap-3">
            <a href="/login" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Go to Login
            </a>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'restaurants'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Restaurants
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Orders
          </button>
        </nav>
      </div>

      {/* Restaurants Tab */}
      {activeTab === 'restaurants' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Restaurants</h2>
            <button
              onClick={() => setShowRestaurantForm(!showRestaurantForm)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              {showRestaurantForm ? 'Cancel' : 'Add Restaurant'}
            </button>
          </div>

          {showRestaurantForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4">Create New Restaurant</h3>
              <form onSubmit={handleRestaurantSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input name="name" placeholder="Restaurant Name" required className="border p-2 rounded" />
                  <input name="phone" placeholder="Phone" required className="border p-2 rounded" />
                  <input name="email" type="email" placeholder="Email" required className="border p-2 rounded" />
                  <input name="cuisineType" placeholder="Cuisine Types (comma separated)" required className="border p-2 rounded" />
                  <select name="priceRange" required className="border p-2 rounded">
                    <option value="">Select Price Range</option>
                    <option value="Budget">priceRange: Budget</option>
                    <option value="Moderate">priceRange: Moderate</option>
                    <option value="Expensive">priceRange: Expensive</option>
                    <option value="Fine Dining">priceRange: Fine Dining</option>
                  </select>
                  <input name="deliveryTime" placeholder="Delivery Time (e.g., 30-45 min)" required className="border p-2 rounded" />
                </div>
                <textarea name="description" placeholder="Description" required className="border p-2 rounded w-full" rows="3"></textarea>
                <div className="grid grid-cols-2 gap-4">
                  <input name="street" placeholder="Street Address" required className="border p-2 rounded" />
                  <input name="city" placeholder="City" required className="border p-2 rounded" />
                  <input name="state" placeholder="State" required className="border p-2 rounded" />
                  <input name="zipCode" placeholder="Zip Code" required className="border p-2 rounded" />
                </div>
                <input name="image" placeholder="Image URL" className="border p-2 rounded w-full" />
                <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
                  Create Restaurant
                </button>
              </form>
            </div>
          )}

          {loadingRestaurants ? (
            <p>Loading restaurants...</p>
          ) : (
            <div className="grid gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{restaurant.name}</h3>
                      <p className="text-gray-600">{restaurant.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {restaurant.cuisineType?.join(', ')} • {restaurant.priceRange}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRestaurant(restaurant._id);
                        setShowMenuForm(!showMenuForm);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Add Menu Item
                    </button>
                  </div>

                  {showMenuForm && selectedRestaurant === restaurant._id && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-bold mb-3">Add Menu Item</h4>
                      <form onSubmit={handleMenuItemSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input name="name" placeholder="Item Name" required className="border p-2 rounded" />
                          <input name="price" type="number" step="0.01" placeholder="Price" required className="border p-2 rounded" />
                          <input name="category" placeholder="Category" required className="border p-2 rounded" />
                          <select name="spiceLevel" className="border p-2 rounded">
                            <option value="">Spice Level (optional)</option>
                            <option value="mild">Mild</option>
                            <option value="medium">Medium</option>
                            <option value="hot">Hot</option>
                            <option value="extra-hot">Extra Hot</option>
                          </select>
                        </div>
                        <textarea name="description" placeholder="Description" required className="border p-2 rounded w-full" rows="2"></textarea>
                        <input name="image" placeholder="Image URL" className="border p-2 rounded w-full" />
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input type="checkbox" name="isVegetarian" className="mr-2" />
                            Vegetarian
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" name="isVegan" className="mr-2" />
                            Vegan
                          </label>
                        </div>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                          Add Item
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Menu Items */}
                  <div className="mt-4">
                    <h4 className="font-bold mb-2">Menu Items:</h4>
                    {/* Note: You'll need to fetch menu items separately or include them in the restaurant query */}
                    <p className="text-sm text-gray-500">Menu items will be displayed here</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Restaurant Orders</h2>
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Order #{order._id.slice(-6)}</h3>
                      <p className="text-gray-600">Restaurant: {order.restaurant?.name}</p>
                      <p className="text-gray-600">Customer: {order.user?.name}</p>
                      <p className="text-gray-600">Phone: {order.user?.phone || order.deliveryAddress?.phone}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Items:</h4>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="border-t mt-2 pt-2 font-bold flex justify-between">
                      <span>Total:</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-1">Delivery Address:</h4>
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Update Status:</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderMutation.mutate({ orderId: order._id, status: e.target.value })}
                      className="border rounded px-3 py-2"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
