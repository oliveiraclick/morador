import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import ResidentHome from './pages/ResidentHome';
import Marketplace from './pages/Marketplace';
import Booking from './pages/Booking';
import ProfDashboard from './pages/ProfDashboard';
import SellItem from './pages/SellItem';
import MasterDashboard from './pages/MasterDashboard';
import ProPlan from './pages/ProPlan';
import Splash from './pages/Splash';
import { UserRole } from './types';

import RoleSelection from './pages/RoleSelection';
import Login from './pages/Login';
import RegisterResident from './pages/RegisterResident';
import RegisterProfessional from './pages/RegisterProfessional';

const App = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.RESIDENT);

  // Sync Role on load
  useEffect(() => {
    const stored = localStorage.getItem('user_role') as UserRole;
    if (stored) setUserRole(stored);
  }, []);

  return (
    <BrowserRouter>
      <Layout role={userRole}>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/register/resident" element={<RegisterResident />} />
          <Route path="/register/professional" element={<RegisterProfessional />} />
          <Route path="/login" element={<Login setRole={setUserRole} />} />

          {/* Resident Routes */}
          <Route path="/home" element={<ResidentHome />} />
          <Route path="/market" element={<Marketplace />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/sell" element={<SellItem />} />
          <Route path="/pro" element={<ProPlan />} />
          <Route path="/services" element={<div className="p-8 text-center text-gray-500">Tela de Pedidos (Em breve)</div>} />
          <Route path="/profile" element={<div className="p-8 text-center text-gray-500">Perfil do Usuário (Em breve)</div>} />

          {/* Professional Routes */}
          <Route path="/dashboard" element={<ProfDashboard />} />
          <Route path="/orders" element={<div className="p-8 text-center text-gray-500">Gerenciar Pedidos (Em breve)</div>} />
          <Route path="/create-offer" element={<div className="p-8 text-center text-gray-500">Criar Oferta (Em breve)</div>} />
          <Route path="/store" element={<div className="p-8 text-center text-gray-500">Minha Loja (Em breve)</div>} />
          <Route path="/agenda" element={<div className="p-8 text-center text-gray-500">Minha Agenda (Em breve)</div>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<MasterDashboard />} />

          {/* New Placeholders for Navigation */}
          <Route path="/slips" element={<div className="p-8 text-center text-gray-500">Boletos (Em breve)</div>} />
          <Route path="/concierge" element={<div className="p-8 text-center text-gray-500">Portaria (Em breve)</div>} />
          <Route path="/notices" element={<div className="p-8 text-center text-gray-500">Avisos (Em breve)</div>} />
          <Route path="/beauty" element={<div className="p-8 text-center text-gray-500">Serviços de Beleza (Em breve)</div>} />
          <Route path="/food" element={<div className="p-8 text-center text-gray-500">Comida e Bebida (Em breve)</div>} />
          <Route path="/reviews" element={<div className="p-8 text-center text-gray-500">Minhas Avaliações (Em breve)</div>} />
          <Route path="/performance" element={<div className="p-8 text-center text-gray-500">Desempenho Profissional (Em breve)</div>} />
          <Route path="/settings" element={<div className="p-8 text-center text-gray-500">Configurações (Em breve)</div>} />

          <Route path="/admin/condos" element={<div className="p-8 text-center text-gray-500">Gerenciar Condomínios (Em breve)</div>} />
          <Route path="/admin/users" element={<div className="p-8 text-center text-gray-500">Gerenciar Usuários (Em breve)</div>} />
          <Route path="/admin/financial" element={<div className="p-8 text-center text-gray-500">Financeiro Master (Em breve)</div>} />
          <Route path="/admin/settings" element={<div className="p-8 text-center text-gray-500">Ajustes Master (Em breve)</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);