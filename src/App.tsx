import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TranslationProvider } from './contexts/TranslationContext';

// Components
import { InstallPrompt } from './components/ui/InstallPrompt';

// Customer Pages
import { UserSelectionPage } from './pages/UserSelectionPage';
import { HomePage } from './pages/customer/HomePage';
import { QRLandingPage } from './pages/customer/QRLandingPage';
import { MenuPage } from './pages/customer/MenuPage';
import { CartPage } from './pages/customer/CartPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';

// Restaurant Pages
import { RestaurantLoginPage } from './pages/restaurant/LoginPage';
import { RestaurantDashboardPage } from './pages/restaurant/DashboardPage';
import { KitchenDisplayPage } from './pages/restaurant/KitchenDisplayPage';
import { QRManagementPage } from './pages/restaurant/QRManagementPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { VenueRegistration } from './components/venue/VenueRegistration';

// Error Pages
import { RestaurantClosedPage } from './pages/error/RestaurantClosedPage';
import { NetworkErrorPage } from './pages/error/NetworkErrorPage';

// Error Boundary
import { ErrorBoundary } from './components/ErrorBoundary';

// Developer Tools
import { DeveloperBar } from './components/developer/DeveloperBar';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <TranslationProvider>
      <ErrorBoundary>
        <Router>
          <div className="App">
            {/* Developer Navigation Bar */}
            <DeveloperBar />
            
            {/* Offline Warning */}
            {!isOnline && (
              <div className="bg-yellow-500 text-white text-center py-2 px-4 fixed top-0 left-0 right-0 z-50">
                You are currently offline. Some features may not be available.
              </div>
            )}
            
            <Routes>
              {/* Main Entry Point */}
              <Route path="/" element={<UserSelectionPage />} />
              
              {/* Customer Routes */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/qr-landing" element={<QRLandingPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order/:orderNumber" element={<OrderTrackingPage />} />
              
              {/* Restaurant Routes */}
              <Route path="/restaurant/login" element={<RestaurantLoginPage />} />
              <Route path="/restaurant/dashboard" element={<RestaurantDashboardPage />} />
              <Route path="/restaurant/kitchen" element={<KitchenDisplayPage />} />
              <Route path="/restaurant/qr-management" element={<QRManagementPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              {/* Venue Registration */}
              <Route path="/venue/register" element={<VenueRegistration />} />
              
              {/* Error Pages */}
              <Route path="/restaurant-closed" element={<RestaurantClosedPage />} />
              <Route path="/network-error" element={<NetworkErrorPage />} />
              
              {/* Catch-all route */}
              <Route path="*" element={
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">🔍</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">404 - Page not found</h1>
                    <p className="text-gray-600 mb-6">The page you are looking for doesn't exist or has been moved.</p>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Return to home
                    </button>
                  </div>
                </div>
              } />
            </Routes>
            
            {/* PWA Install Prompt */}
            <InstallPrompt />
            
            {/* Toast Notifications */}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '16px',
                },
              }}
            />
          </div>
        </Router>
      </ErrorBoundary>
    </TranslationProvider>
  );
}

export default App;