import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { authAPI } from './api/auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDetail from './pages/RestaurantDetail';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Disclaimer from './pages/Disclaimer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const user = useAuthStore(state => state.user);
  return user?.role === 'admin' ? children : <Navigate to="/" />;
}

function RestaurantRoute({ children }) {
  const user = useAuthStore(state => state.user);
  return user?.role === 'restaurant' ? children : <Navigate to="/" />;
}

function AppContent() {
  const setUser = useAuthStore(state => state.setUser);
  const logout = useAuthStore(state => state.logout);

  // Verify authentication on app load
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await authAPI.getMe();
        setUser(response.data);
      } catch {
        // If verification fails, clear the stored user
        logout();
      }
    };

    // Only verify if we have a user in storage
    const storedAuth = localStorage.getItem('auth-storage');
    if (storedAuth) {
      const { state } = JSON.parse(storedAuth);
      if (state?.user) {
        verifyAuth();
      }
    }
  }, [setUser, logout]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/restaurant" element={<RestaurantRoute><RestaurantDashboard /></RestaurantRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AppContent />
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
