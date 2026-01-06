import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useGlobal, GlobalProvider } from './context/GlobalContext';
import { UserRole } from './types';

// Pages
import Splash from './pages/Splash';
import RoleSelection from './pages/RoleSelection';
import Login from './pages/Login';
import RegisterResident from './pages/RegisterResident';
import CompleteRegistration from './pages/CompleteRegistration'; // Imported
import RegisterProfessional from './pages/RegisterProfessional';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import MyStore from './pages/MyStore';

// Resident Pages
import ResidentHome from './pages/ResidentHome';
import Marketplace from './pages/Marketplace';
import Booking from './pages/Booking';
import SellItem from './pages/SellItem';
import ProPlan from './pages/ProPlan';
import ResidentProfile from './pages/ResidentProfile';
import Categories from './pages/Categories';
import ProfessionalProfile from './pages/ProfessionalProfile';
import ServiceSearch from './pages/ServiceSearch';
import Orders from './pages/Orders';

// Professional Pages
import ProfDashboard from './pages/ProfDashboard';
import CreateOffer from './pages/CreateOffer';
import Agenda from './pages/Agenda';
import Reviews from './pages/Reviews';

// Admin Pages
import MasterDashboard from './pages/MasterDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCondos from './pages/AdminCondos';
import AdminFinancial from './pages/AdminFinancial';
import AdminPlans from './pages/AdminPlans';
import AdminBroadcast from './pages/AdminBroadcast';
import AdminAds from './pages/AdminAds';

import ProfessionalPaywall from './pages/ProfessionalPaywall';
import AdminBranding from './pages/AdminBranding';

import { supabase } from './lib/supabase';

const AppContent = () => {
  const { profile, loading, refreshProfile } = useGlobal();
  const navigate = useNavigate();

  const userRole = (profile?.role as UserRole) || (localStorage.getItem('user_role') as UserRole) || UserRole.RESIDENT;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Layout role={userRole}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/register/resident" element={<RegisterResident />} />
        <Route path="/register/professional" element={<RegisterProfessional />} />
        <Route path="/login" element={<Login />} />
        <Route path="/complete-registration" element={
          <ProtectedRoute allowedRoles={[UserRole.RESIDENT, UserRole.PROFESSIONAL]}>
            <CompleteRegistration />
          </ProtectedRoute>
        } />

        {/* Resident Routes */}
        <Route path="/home" element={
          <ProtectedRoute allowedRoles={[UserRole.RESIDENT]}>
            <ResidentHome />
          </ProtectedRoute>
        } />
        <Route path="/market" element={
          <ProtectedRoute allowedRoles={[UserRole.RESIDENT]}>
            <Marketplace />
          </ProtectedRoute>
        } />
        <Route path="/booking" element={
          <ProtectedRoute allowedRoles={[UserRole.RESIDENT]}>
            <Booking />
          </ProtectedRoute>
        } />
        <Route path="/sell" element={
          <ProtectedRoute allowedRoles={[UserRole.RESIDENT]}>
            <SellItem />
          </ProtectedRoute>
        } />
        <Route path="/pro" element={
          <ProtectedRoute allowedRoles={[UserRole.RESIDENT]}>
            <ProPlan />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={[UserRole.RESIDENT]}>
            <ResidentProfile />
          </ProtectedRoute>
        } />
        <Route path="/my-store" element={
          <ProtectedRoute allowedRoles={[UserRole.RESIDENT, UserRole.PROFESSIONAL]}>
            <MyStore />
          </ProtectedRoute>
        } />
        <Route path="/professional-profile" element={
          <ProtectedRoute allowedRoles={[UserRole.RESIDENT]}>
            <ProfessionalProfile />
          </ProtectedRoute>
        } />
        <Route path="/service-search" element={
          <ProtectedRoute allowedRoles={[UserRole.RESIDENT]}>
            <ServiceSearch />
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute allowedRoles={[UserRole.RESIDENT]}>
            <Categories />
          </ProtectedRoute>
        } />

        {/* Professional Routes */}
        <Route path="/plan/professional" element={
          <ProtectedRoute allowedRoles={[UserRole.PROFESSIONAL]}>
            <ProfessionalPaywall />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={[UserRole.PROFESSIONAL]}>
            <ProfDashboard />
          </ProtectedRoute>
        } />

        {/* Shared Routes */}
        <Route path="/orders" element={
          <ProtectedRoute allowedRoles={[UserRole.RESIDENT, UserRole.PROFESSIONAL]}>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute allowedRoles={[UserRole.RESIDENT, UserRole.PROFESSIONAL, UserRole.ADMIN]}>
            <Chat />
          </ProtectedRoute>
        } />
        <Route path="/create-offer" element={
          <ProtectedRoute allowedRoles={[UserRole.PROFESSIONAL]}>
            <CreateOffer />
          </ProtectedRoute>
        } />
        <Route path="/store" element={
          <ProtectedRoute allowedRoles={[UserRole.PROFESSIONAL]}>
            <MyStore />
          </ProtectedRoute>
        } />
        <Route path="/agenda" element={
          <ProtectedRoute allowedRoles={[UserRole.PROFESSIONAL]}>
            <Agenda />
          </ProtectedRoute>
        } />
        <Route path="/reviews" element={
          <ProtectedRoute allowedRoles={[UserRole.PROFESSIONAL]}>
            <Reviews />
          </ProtectedRoute>
        } />

        {/* Legacy/Shortcut Routes */}
        <Route path="/beauty" element={<Navigate to="/market" state={{ category: 'Beleza' }} replace />} />
        <Route path="/food" element={<Navigate to="/market" state={{ category: 'Comida' }} replace />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <MasterDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/condos" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminCondos />
          </ProtectedRoute>
        } />
        <Route path="/admin/financial" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminFinancial />
          </ProtectedRoute>
        } />
        <Route path="/admin/plans" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminPlans />
          </ProtectedRoute>
        } />
        <Route path="/admin/broadcast" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminBroadcast />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/admin/branding" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminBranding />
          </ProtectedRoute>
        } />
        <Route path="/admin/ads" element={
          <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminAds />
          </ProtectedRoute>
        } />

        {/* Generic Settings Route (Accessible by Pro via Dashboard link) */}
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={[UserRole.PROFESSIONAL, UserRole.RESIDENT, UserRole.ADMIN]}>
            <Settings />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
};

import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <GlobalProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </GlobalProvider>
    </ErrorBoundary>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);