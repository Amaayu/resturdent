import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../api/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import SearchBar from '../components/SearchBar';
import { useAuthStore } from '../store/authStore';
import { mockRestaurants } from '../mocks/restaurantData';

export default function Home() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});

  // Redirect restaurant owners and admins to their dashboards
  useEffect(() => {
    if (user?.role === 'restaurant') {
      navigate('/restaurant');
    } else if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  // For development: Toggle between mock and real data
  const [useMockData, setUseMockData] = useState(false);
  
  const { data: apiRestaurants = [], isLoading } = useQuery({
    queryKey: ['restaurants', search, filters],
    queryFn: () => restaurantAPI.getAll({ search, ...filters }).then(res => res.data),
    enabled: !useMockData,
    onError: (error) => {
      console.error('Error fetching restaurants, falling back to mock data:', error);
      setUseMockData(true);
    }
  });

  // Use mock data if enabled or if there was an error
  const restaurants = useMockData ? 
    (Array.isArray(mockRestaurants) ? mockRestaurants.filter(r => 
      r && 
      r.name && 
      r.cuisineType &&
      (r.name.toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(r.cuisineType) && r.cuisineType.some(cuisine => 
        cuisine && cuisine.toLowerCase().includes(search.toLowerCase())
      )))
    ) : []) : 
    (Array.isArray(apiRestaurants) ? apiRestaurants : []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Favorite Food</h1>
          <p className="text-xl mb-4">Discover restaurants and order delicious meals</p>
          {useMockData && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4 rounded">
              <p className="font-semibold">Development Mode: Using Mock Data</p>
              <p className="text-sm">Mock data is being used. To switch to real data, 
                <button 
                  onClick={() => setUseMockData(false)} 
                  className="ml-1 text-blue-600 hover:underline"
                >
                  click here
                </button>.
              </p>
            </div>
          )}
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 rounded-full bg-white shadow hover:shadow-md transition"
          >
            All
          </button>
          {['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese'].map(cuisine => (
            <button
              key={cuisine}
              onClick={() => setFilters({ cuisine })}
              className="px-4 py-2 rounded-full bg-white shadow hover:shadow-md transition whitespace-nowrap"
            >
              {cuisine}
            </button>
          ))}
        </div>

        {/* Restaurant Grid */}
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : !Array.isArray(restaurants) || restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No restaurants found.</p>
            {!useMockData && (
              <button 
                onClick={() => setUseMockData(true)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Use Sample Restaurants
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(restaurant => (
              restaurant && restaurant._id && (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
