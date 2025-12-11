

import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { RegistrationProvider } from './context/RegistrationContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { supabase } from './supabaseClient';
import { BottomNav } from './components/BottomNav';
// Removed unused imports for Button, LayoutGrid, ShoppingBag, Zap, User, ShieldCheck as LandingPage is removed

// Pages
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';
import { RegisterType } from './pages/RegisterType';
import { RegisterBasic } from './pages/RegisterBasic';
import { RegisterProviderComplete } from './pages/RegisterProviderComplete';
import { Dashboard } from './pages/Dashboard';
import { ProviderProfile } from './pages/ProviderProfile';
import { ProviderOfferForm } from './pages/ProviderOfferForm';
import { ProviderSchedule } from './pages/ProviderSchedule';
import { ProviderOrders } from './pages/ProviderOrders';
import { ProviderStore } from './pages/ProviderStore';
import { BookingPage } from './pages/BookingPage';
import { DesapegoFeed } from './pages/DesapegoFeed';
import { DesapegoForm } from './pages/DesapegoForm';
import { CategoryFeed } from './pages/CategoryFeed';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ResidentProfile } from './pages/ResidentProfile';
import TestConnection from './pages/TestConnection';

// SaaS Views - NEWLY IMPORTED (kept as they are new features)
import { SaaS_LP, Marketplace, SaaSAdmin } from './components/SaaSViews';

// Component to handle forced redirect logic
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // FORCE REDIRECT TO SPLASH ON LOAD/RELOAD
    if (location.pathname !== '/' && location.pathname !== '/test-connection' && location.pathname !== '/saas-admin' && !sessionStorage.getItem('app_loaded')) {
      sessionStorage.setItem('app_loaded', 'true');
      navigate('/');
    }

    // Dynamic PWA Icon / Favicon
    const updateFavicon = async () => {
      try {
        const { data } = await supabase.from('app_settings').select('pwa_icon_url').eq('id', 1).single();
        if (data?.pwa_icon_url) {
          // Update generic icon
          const links = document.querySelectorAll("link[rel*='icon']");
          links.forEach((link: any) => {
            link.href = data.pwa_icon_url;
          });

          // If no icon link exists, create one
          if (links.length === 0) {
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = data.pwa_icon_url;
            document.head.appendChild(link);
          }

          // Update Apple Touch Icon
          const appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
          if (appleLink) {
            appleLink.href = data.pwa_icon_url;
          }

          // Dynamic Manifest for PWA
          // We override the default manifest behavior to inject the dynamic icon
          const manifestInput = document.querySelector("link[rel='manifest']") as HTMLLinkElement;
          if (manifestInput) {
            const dynamicManifest = {
              name: "MORADOR",
              short_name: "Morador",
              start_url: "/",
              display: "standalone",
              background_color: "#7c3aed",
              theme_color: "#7c3aed",
              icons: [
                {
                  src: data.pwa_icon_url,
                  sizes: "192x192",
                  type: "image/png"
                },
                {
                  src: data.pwa_icon_url,
                  sizes: "512x512",
                  type: "image/png"
                }
              ]
            };
            const stringManifest = JSON.stringify(dynamicManifest);
            const blob = new Blob([stringManifest], { type: 'application/json' });
            const manifestURL = URL.createObjectURL(blob);
            manifestInput.href = manifestURL;
          }
        }
      } catch (error) {
        console.error("Failed to update favicon/manifest:", error);
      }
    };
    void updateFavicon();
  }, []);

  return (
    <>
      {/* pb-[100px] ensures content isn't hidden behind the floating nav */}
      <div className="font-sans antialiased text-slate-800 min-h-screen bg-[#f8fafc] pb-[100px] relative viewport-fit-cover">
        <Routes>
          <Route path="/" element={<Splash />} />
          {/* Removed: <Route path="/landing" element={<LandingPage />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/test-connection" element={<TestConnection />} />

          {/* Dashboard handles both Resident and Provider logic */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />

          {/* Resident Flow - Booking */}
          <Route path="/booking/:providerId/:serviceId" element={<BookingPage />} />

          {/* Provider Specific Routes */}
          <Route path="/provider/store" element={<ProviderStore />} />
          <Route path="/provider/offer/new" element={<ProviderOfferForm />} />
          <Route path="/provider/offer/edit/:id" element={<ProviderOfferForm />} />
          <Route path="/provider/schedule" element={<ProviderSchedule />} />
          <Route path="/provider/orders" element={<ProviderOrders />} />

          {/* Category Feeds */}
          <Route path="/category/:type" element={<CategoryFeed />} />

          {/* Desapego Routes */}
          <Route path="/desapego" element={<DesapegoFeed />} />
          <Route path="/desapego/new" element={<DesapegoForm />} />
          <Route path="/desapego/edit/:id" element={<DesapegoForm />} />

          {/* Registration Flow */}
          <Route path="/register/type" element={<RegisterType />} />
          <Route path="/register/basic" element={<RegisterBasic />} />
          <Route path="/register/provider-complete" element={<RegisterProviderComplete />} />

          {/* Profiles and Misc */}
          <Route path="/profile" element={<ResidentProfile />} />

          {/* Placeholder Routes for BottomNav */}
          <Route path="/search" element={<PlaceholderPage title="Busca" icon="🔍" />} />
          <Route path="/orders" element={<PlaceholderPage title="Meus Pedidos" icon="📦" />} />

          {/* SaaS Views - NEW ROUTES (kept as features) */}
          <Route path="/saas-lp" element={<SaaS_LP />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/saas-admin" element={<SaaSAdmin />} />

          {/* Fallback route - redirect to Login page directly */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        <BottomNav />
      </div>
    </>
  );
};

const App: React.FC = () => {
  // Clear session storage on hard refresh to allow splash redirect again
  window.onbeforeunload = () => {
    sessionStorage.removeItem('app_loaded');
  };

  return (
    <HashRouter>
      <AuthProvider>
        <RegistrationProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </RegistrationProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;