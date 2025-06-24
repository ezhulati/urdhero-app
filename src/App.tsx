import React, { createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useLanguage, Language } from './hooks/useTranslation';
import { getTranslation } from './translations';

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

// Error Pages
import { RestaurantClosedPage } from './pages/error/RestaurantClosedPage';
import { NetworkErrorPage } from './pages/error/NetworkErrorPage';

// Error Boundary
import { ErrorBoundary } from './components/ErrorBoundary';

// Developer Tools
import { DeveloperBar } from './components/developer/DeveloperBar';

// Translation Context
interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage } = useLanguage();
  
  const t = (key: string, params?: Record<string, any>) => {
    return getTranslation(language, key, params);
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

function App() {
  return (
    <TranslationProvider>
      <ErrorBoundary>
        <Router>
          <div className="App">
            {/* Developer Navigation Bar */}
            <DeveloperBar />
            
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
              
              {/* Error Pages */}
              <Route path="/restaurant-closed" element={<RestaurantClosedPage />} />
              <Route path="/network-error" element={<NetworkErrorPage />} />
              
              {/* Catch-all route */}
              <Route path="*" element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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