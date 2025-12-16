import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, PlusCircle, Calendar, User, ShoppingBag, LayoutDashboard, ClipboardList, Store, Building, DollarSign, Settings, Users, Bell, LogOut } from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

import DebugOverlay from './DebugOverlay';

const Layout: React.FC<LayoutProps> = ({ children, role }) => {
  // ... existing hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Normalize role to avoid case sensitivity issues (e.g. 'resident' vs 'RESIDENT')
  const normalizedRole = role ? role.toUpperCase() : '';


  // Hide nav check...
  if (
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/role-selection' ||
    location.pathname.startsWith('/register/') ||
    location.pathname === '/pro'
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        {children}
        {/* <DebugOverlay roleFromState={role} /> */}
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_registered');
    window.location.href = '/login';
  };

  const navItemClass = (path: string) =>
    `flex-1 flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === path ? 'text-[#7c3aed]' : 'text-gray-400 hover:text-gray-600'
    } `;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* <DebugOverlay roleFromState={role} /> */}
      {/* Mobile container simulation */}
      <div className="w-full max-w-[480px] bg-gray-50 min-h-screen relative shadow-2xl flex flex-col">
        {/* ... */}


        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
          {children}
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-20 px-4 pb-4 rounded-t-2xl z-50">
          <div className="flex items-center justify-between h-full">

            {normalizedRole === UserRole.RESIDENT ? (
              <>
                <button onClick={() => navigate('/home')} className={navItemClass('/home')}>
                  <Home size={24} strokeWidth={location.pathname === '/home' ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">Início</span>
                </button>
                <button onClick={() => navigate('/market')} className={navItemClass('/market')}>
                  <Search size={24} strokeWidth={location.pathname === '/market' ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">Explorar</span>
                </button>
                <button onClick={() => navigate('/sell')} className="flex flex-col items-center justify-center -mt-8">
                  <div className="bg-[#7c3aed] text-white p-4 rounded-full shadow-lg shadow-purple-300 transform transition active:scale-95">
                    <PlusCircle size={28} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 mt-1">Add desapego</span>
                </button>
                <button onClick={() => navigate('/orders')} className={navItemClass('/orders')}>
                  <ShoppingBag size={24} strokeWidth={location.pathname === '/orders' ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">Sacolinha</span>
                </button>
                <button onClick={() => navigate('/profile')} className={navItemClass('/profile')}>
                  <User size={24} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">Perfil</span>
                </button>
              </>
            ) : normalizedRole === UserRole.ADMIN ? (
              /* Admin Nav */
              <>
                <button onClick={() => navigate('/admin')} className={navItemClass('/admin')}>
                  <Store size={24} strokeWidth={location.pathname === '/admin' ? 2.5 : 2} />
                </button>
                <button onClick={() => navigate('/admin/condos')} className={navItemClass('/admin/condos')}>
                  <Building size={24} strokeWidth={location.pathname === '/admin/condos' ? 2.5 : 2} />
                </button>
                <button onClick={() => navigate('/admin/users')} className={navItemClass('/admin/users')}>
                  <Users size={24} strokeWidth={location.pathname === '/admin/users' ? 2.5 : 2} />
                </button>
                <button onClick={() => navigate('/admin/financial')} className={navItemClass('/admin/financial')}>
                  <DollarSign size={24} strokeWidth={location.pathname === '/admin/financial' ? 2.5 : 2} />
                </button>
                <button onClick={() => navigate('/admin/broadcast')} className={navItemClass('/admin/broadcast')}>
                  <Bell size={24} strokeWidth={location.pathname === '/admin/broadcast' ? 2.5 : 2} />
                </button>
                <button onClick={() => navigate('/admin/settings')} className={navItemClass('/admin/settings')}>
                  <Settings size={24} strokeWidth={location.pathname === '/admin/settings' ? 2.5 : 2} />
                </button>
                <button onClick={handleLogout} className="flex-1 flex flex-col items-center justify-center w-full h-full space-y-1 text-red-400 hover:text-red-600">
                  <LogOut size={24} strokeWidth={2} />
                </button>
              </>
            ) : (
              /* Professional Nav */
              <>
                <button onClick={() => navigate('/dashboard')} className={navItemClass('/dashboard')}>
                  <Home size={24} strokeWidth={location.pathname === '/dashboard' ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">Painel</span>
                </button>
                <button onClick={() => navigate('/orders')} className={navItemClass('/orders')}>
                  <ClipboardList size={24} strokeWidth={location.pathname === '/orders' ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">Pedidos</span>
                </button>
                <button onClick={() => navigate('/create-offer')} className="flex flex-col items-center justify-center -mt-8">
                  <div className="bg-[#7c3aed] text-white p-4 rounded-full shadow-lg shadow-purple-300 transform transition active:scale-95">
                    <PlusCircle size={28} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 mt-1">Ofertar</span>
                </button>
                <button onClick={() => navigate('/store')} className={navItemClass('/store')}>
                  <LayoutDashboard size={24} strokeWidth={location.pathname === '/store' ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">Minha Loja</span>
                </button>
                <button onClick={() => navigate('/agenda')} className={navItemClass('/agenda')}>
                  <Calendar size={24} strokeWidth={location.pathname === '/agenda' ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">Agenda</span>
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;