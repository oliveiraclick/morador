

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, LayoutGrid, Zap } from 'lucide-react';
import { UserRole } from '../types';

import { useAuth } from '../context/AuthContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Rotas de gestão do prestador (onde a nav DEVE aparecer)
  const isProviderManagementRoute = [
    '/provider/store',
    '/provider/schedule',
    '/provider/orders',
    '/dashboard'
  ].some(path => location.pathname === path || location.pathname.startsWith(path + '/'));

  // Verifica se é a rota de perfil público (/provider/:id)
  // Se começa com /provider/ mas NÃO é uma rota de gestão, é um perfil público.
  const isPublicProviderProfile = location.pathname.startsWith('/provider/') && !isProviderManagementRoute;

  // Hide nav on these paths
  const shouldHide = location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname.startsWith('/register') ||
    location.pathname.startsWith('/booking') ||
    isPublicProviderProfile ||
    location.pathname === '/saas-admin'; // Oculta no admin e perfil publico

  if (shouldHide) return null;

  const state = location.state as { role?: UserRole } | null;
  // Determine if showing Provider or Resident nav based on URL or State
  const isProvider = location.pathname.includes('provider') && !location.pathname.includes('/provider/') ? true : (state?.role === 'provider');

  const navItemClass = (isActive: boolean) => `
    flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 relative
    ${isActive ? 'text-violet-600 -translate-y-2' : 'text-slate-400 hover:text-slate-600'}
  `;

  const activeDotClass = "absolute -bottom-2 w-1.5 h-1.5 bg-violet-600 rounded-full";

  return (
    <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-white/85 backdrop-blur-xl border-t border-white/50 shadow-[0_-5px_30px_rgba(0,0,0,0.05)] flex items-center justify-around px-2 z-50 rounded-t-[30px]">
      {isProvider ? (
        <>
          <button onClick={() => navigate('/dashboard', { state: { role: 'provider' } })} className={navItemClass(location.pathname === '/dashboard')}>
            <LayoutGrid size={26} strokeWidth={2.5} />
            {location.pathname === '/dashboard' && <div className={activeDotClass} />}
          </button>

          <button onClick={() => navigate('/provider/orders', { state: { role: 'provider' } })} className={navItemClass(location.pathname === '/provider/orders')}>
            <ShoppingBag size={26} strokeWidth={2.5} />
            {location.pathname === '/provider/orders' && <div className={activeDotClass} />}
          </button>

          {/* Floating Action Button (Provider - Actions) */}
          <button
            onClick={() => navigate('/provider/orders', { state: { role: 'provider' } })}
            className="w-16 h-16 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-full shadow-glow flex items-center justify-center text-white -mt-12 border-[6px] border-[#f8fafc] active:scale-95 transition-transform"
          >
            <Zap size={28} fill="white" />
          </button>

          <button onClick={() => navigate('/provider/schedule', { state: { role: 'provider' } })} className={navItemClass(location.pathname === '/provider/schedule')}>
            <span className="text-xl">📅</span>
            {location.pathname === '/provider/schedule' && <div className={activeDotClass} />}
          </button>

          <button onClick={() => navigate(profile?.id ? `/provider/${profile.id}` : '/profile', { state: { role: 'provider' } })} className={navItemClass(location.pathname === (profile?.id ? `/provider/${profile.id}` : '/profile'))}>
            <User size={26} strokeWidth={2.5} />
            {location.pathname === (profile?.id ? `/provider/${profile.id}` : '/profile') && <div className={activeDotClass} />}
          </button>
        </>
      ) : (
        <>
          <button onClick={() => navigate('/dashboard', { state: { role: 'resident' } })} className={navItemClass(location.pathname === '/dashboard')}>
            <Home size={26} strokeWidth={2.5} />
            {location.pathname === '/dashboard' && <div className={activeDotClass} />}
          </button>

          <button onClick={() => navigate('/search', { state: { role: 'resident' } })} className={navItemClass(location.pathname === '/search')}>
            <Search size={26} strokeWidth={2.5} />
            {location.pathname === '/search' && <div className={activeDotClass} />}
          </button>

          {/* Floating Action Button (Resident - Shop) */}
          <button
            onClick={() => navigate('/marketplace', { state: { role: 'resident' } })}
            className="w-16 h-16 bg-slate-900 rounded-full shadow-lg shadow-slate-900/30 flex items-center justify-center text-white -mt-12 border-[6px] border-[#f8fafc] active:scale-95 transition-transform"
          >
            <ShoppingBag size={24} />
          </button>

          <button onClick={() => navigate('/orders', { state: { role: 'resident' } })} className={navItemClass(location.pathname === '/orders')}>
            <span className="text-xl">📦</span>
            {location.pathname === '/orders' && <div className={activeDotClass} />}
          </button>

          <button onClick={() => navigate('/profile', { state: { role: 'resident' } })} className={navItemClass(location.pathname === '/profile')}>
            <User size={26} strokeWidth={2.5} />
            {location.pathname === '/profile' && <div className={activeDotClass} />}
          </button>
        </>
      )}
    </div>
  );
};