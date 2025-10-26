import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { authAPI } from '../api/auth';
import toast from 'react-hot-toast';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout: logoutStore } = useAuthStore();
  const items = useCartStore(state => state.items);

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      logoutStore();
      toast.success('Logged out successfully');
      navigate('/');
    }
  });

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.svg" 
              alt="FoodHub Logo" 
              className="h-10 w-10"
            />
            <span className="text-2xl font-bold text-orange-500">
              FoodHub
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-orange-500">Home</Link>
            <Link to="/about" className="hover:text-orange-500">About</Link>
            <Link to="/contact" className="hover:text-orange-500">Contact</Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'customer' && (
                  <>
                    <Link to="/profile" className="hover:text-orange-500">Profile</Link>
                    <Link to="/checkout" className="relative hover:text-orange-500">
                      Cart
                      {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {items.length}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                {user?.role === 'restaurant' && (
                  <Link to="/restaurant" className="hover:text-orange-500">Dashboard</Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-orange-500">Admin Dashboard</Link>
                )}
                <button
                  onClick={() => logoutMutation.mutate()}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-orange-500">Login</Link>
                <Link to="/register" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
