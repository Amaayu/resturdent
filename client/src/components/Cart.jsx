import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const navigate = useNavigate();

  const subtotal = getTotal();
  const tax = subtotal * 0.08;
  const deliveryFee = 40; // ₹40 delivery fee
  const total = subtotal + tax + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        <p className="text-gray-500">Cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      
      <div className="space-y-4 mb-4">
        {items.map(item => (
          <div key={item._id} className="flex gap-3">
            <img
              src={item.image || 'https://via.placeholder.com/60'}
              alt={item.name}
              className="w-16 h-16 rounded object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{item.name}</h3>
              <p className="text-gray-600 text-sm">{formatPrice(item.price)}</p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item._id)}
                  className="ml-auto text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>{formatPrice(deliveryFee)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="w-full bg-orange-500 text-white py-3 rounded-lg mt-4 hover:bg-orange-600 font-semibold"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
