import { Link } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurant/${restaurant._id}`} className="block">
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
        <img
          src={restaurant.image || 'https://via.placeholder.com/400x200?text=Restaurant'}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{restaurant.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-yellow-500">★ {restaurant.rating.toFixed(1)}</span>
            <span className="text-gray-500">{restaurant.deliveryTime || '30-40 min'}</span>
          </div>
          {restaurant.cuisineType?.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {restaurant.cuisineType.slice(0, 3).map(cuisine => (
                <span key={cuisine} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {cuisine}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
