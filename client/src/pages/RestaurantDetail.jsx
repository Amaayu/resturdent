import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantAPI } from '../api/restaurants';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import Cart from '../components/Cart';
import { formatPrice } from '../utils/currency';

export default function RestaurantDetail() {
  const { id } = useParams();
  const addItem = useCartStore(state => state.addItem);

  const { data, isLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantAPI.getById(id).then(res => res.data)
  });

  const handleAddToCart = (item) => {
    addItem(item, { _id: data._id, name: data.name });
    toast.success('Added to cart!');
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  const groupedMenu = data.menuItems?.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-6">
            <img
              src={data.image || 'https://via.placeholder.com/200'}
              alt={data.name}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
              <p className="text-gray-600 mb-2">{data.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-yellow-500">★ {data.rating.toFixed(1)}</span>
                <span>{data.priceRange}</span>
                <span>{data.deliveryTime || '30-40 min'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-4 py-8 flex gap-8">
        <div className="flex-1">
          {Object.entries(groupedMenu || {}).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item._id} className="bg-white p-4 rounded-lg shadow flex gap-4">
                    <img
                      src={item.image || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="w-24 h-24 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">{formatPrice(item.price)}</span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cart Sidebar */}
        <div className="w-80 sticky top-4 h-fit">
          <Cart />
        </div>
      </div>
    </div>
  );
}
