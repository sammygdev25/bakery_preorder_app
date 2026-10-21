import './App.css';
import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { Footer } from './components/ui';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GoogleAuthDonePage from './pages/GoogleAuthDonePage';
import OrderPayPage from './pages/OrderPayPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ProfilePage from './pages/ProfilePage';

interface RequireAuthProps { children: ReactNode }

function RequireAuth({ children }: RequireAuthProps) {
  const auth = useAuth() as { isAuthenticated?: boolean; loading?: boolean };
  if (auth && auth.loading) {
    return null;
  }
  const authed = auth && typeof auth.isAuthenticated === 'boolean' ? auth.isAuthenticated : Boolean(localStorage.getItem('token'));
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ErrorBoundary>
          <div className="ds-page">
            <Navbar />
            <main className="ds-page-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
                <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
                <Route path="/orders" element={<RequireAuth><OrderHistoryPage /></RequireAuth>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/google/done" element={<GoogleAuthDonePage />} />
                <Route path="/order-pay" element={<RequireAuth><OrderPayPage /></RequireAuth>} />
                <Route path="/payment-cancel" element={<PaymentCancelPage />} />
                <Route path="/payment-success" element={<RequireAuth><PaymentSuccessPage /></RequireAuth>} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/dashboard" element={<HomePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer brand="Bakery Preorder App" columns={[{ title: 'Explore', links: [{ label: 'Home', to: '/' }, { label: 'Menu', to: '/menu' }, { label: 'Profile', to: '/profile' }] }]} />
          </div>
        </ErrorBoundary>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
