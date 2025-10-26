import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderAPI } from '../api/orders';
import { restaurantAPI } from '../api/restaurants';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const queryClient = useQueryClient();

  const { data: orders } = useQuery({
    queryKey: ['allOrders'],
    queryFn: () => orderAPI.getAll().then(res => res.data)
  });

  const { data: restaurants } = useQuery({
    queryKey: ['adminRestaurants'],
    queryFn: () => restaurantAPI.getAllAdmin().then(res => res.data)
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => orderAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['allOrders']);
      toast.success('Order status updated!');
    }
  });

  const deleteRestaurantMutation = useMutation({
    mutationFn: (id) => restaurantAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminRestaurants']);
      toast.success('Restaurant deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete restaurant');
    }
  });

  const handleDeleteRestaurant = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This will also delete all associated menu items.`)) {
      deleteRestaurantMutation.mutate(id);
    }
  };

  const todayOrders = orders?.filter(o => 
    new Date(o.createdAt).toDateString() === new Date().toDateString()
  );
  const todaySales = todayOrders?.reduce((sum, o) => sum + o.total, 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === 'PENDING').length || 0;

  const statusOptions = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Today's Sales</h3>
            <p className="text-3xl font-bold">${todaySales.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold">{orders?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 mb-2">Pending Orders</h3>
            <p className="text-3xl font-bold">{pendingOrders}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 font-semibold ${activeTab === 'orders' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('restaurants')}
                className={`px-6 py-3 font-semibold ${activeTab === 'restaurants' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}
              >
                Restaurants
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders?.map(order => (
                  <div key={order._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{order.restaurant?.name}</h3>
                        <p className="text-sm text-gray-600">
                          Customer: {order.user?.name} ({order.user?.email})
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{order.paymentMethod.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-semibold mb-1">Items:</p>
                      <p className="text-sm text-gray-600">
                        {order.items.map((item, idx) => (
                          <span key={idx}>
                            {item.quantity}x {item.name}
                            {idx < order.items.length - 1 && ', '}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm font-semibold mb-1">Delivery Address:</p>
                      <p className="text-sm text-gray-600">
                        {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-semibold">Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatusMutation.mutate({ id: order._id, status: e.target.value })}
                        className="px-3 py-1 border rounded"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'restaurants' && (
              <div className="space-y-4">
                {restaurants?.map(restaurant => (
                  <div key={restaurant._id} className="border rounded-lg p-4">
                    <div className="flex gap-4">
                      <img
                        src={restaurant.image || 'https://via.placeholder.com/100'}
                        alt={restaurant.name}
                        className="w-24 h-24 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
                            <div className="flex gap-4 text-sm">
                              <span>★ {restaurant.rating.toFixed(1)}</span>
                              <span>{restaurant.priceRange}</span>
                              <span className={restaurant.isActive ? 'text-green-600' : 'text-red-600'}>
                                {restaurant.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            {restaurant.owner && (
                              <p className="text-xs text-gray-500 mt-1">
                                Owner: {restaurant.owner.name} ({restaurant.owner.email})
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteRestaurant(restaurant._id, restaurant.name)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                          >
                            Delete Restaurant
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
