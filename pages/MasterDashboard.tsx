import React from 'react';
import { Bell, Settings, TrendingUp, TrendingDown, Users, Building, DollarSign, Store, BarChart3, ShieldCheck, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminStatsCard from '../components/AdminStatsCard';
import AdminSectorChart from '../components/AdminSectorChart';
import RecentActivityList from '../components/RecentActivityList';

const MasterDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 p-0.5">
              <img src="https://picsum.photos/id/64/100/100" className="w-full h-full rounded-full object-cover border-2 border-white" alt="Admin" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Master Admin</p>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Painel Master</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <Bell size={20} className="text-gray-600" />
          </button>
          <button onClick={() => navigate('/admin/settings')} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Bom dia, Admin <span className="text-2xl">👋</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">Visão geral dos seus condomínios hoje.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <AdminStatsCard
            icon={DollarSign}
            iconBgClass="bg-purple-100"
            iconColorClass="text-purple-600"
            percentage="+12%"
            percentageBgClass="bg-green-100"
            percentageColorClass="text-green-700"
            label="MRR Mensal"
            value="R$ 150.2k"
          />

          <AdminStatsCard
            icon={Building}
            iconBgClass="bg-indigo-100"
            iconColorClass="text-indigo-600"
            percentage="+5%"
            percentageBgClass="bg-green-100"
            percentageColorClass="text-green-700"
            label="Condomínios"
            value="124"
          />

          <AdminSectorChart
            data={[
              { name: 'Limpeza', count: 45, color: 'bg-blue-500' },
              { name: 'Manutenção', count: 32, color: 'bg-orange-500' },
              { name: 'Beleza', count: 28, color: 'bg-pink-500' },
              { name: 'Aulas', count: 15, color: 'bg-purple-500' }
            ]}
            total={45} // This should be max or total? The CSS uses count/45 so 45 is denominator. Let's pass 45 as total for now to match UI behavior.
          />

          <AdminStatsCard
            icon={Users}
            iconBgClass="bg-blue-100"
            iconColorClass="text-blue-600"
            percentage="+8%"
            percentageBgClass="bg-green-100"
            percentageColorClass="text-green-700"
            label="Usuários Totais"
            value="45.3k"
          />

          <AdminStatsCard
            icon={TrendingDown}
            iconBgClass="bg-orange-100"
            iconColorClass="text-orange-600"
            percentage="-0.2%"
            percentageBgClass="bg-green-100"
            percentageColorClass="text-green-700"
            label="Churn Rate"
            value="1.2%"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Ações Rápidas</h3>
            <button onClick={() => navigate('/admin/settings')} className="text-purple-600 text-sm font-bold">Ver todas</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate('/admin/users')} className="h-32 rounded-3xl p-4 relative overflow-hidden flex items-end group">
              <div className="absolute inset-0 bg-gray-900"></div>
              <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" alt="Users" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

              <div className="relative z-10 text-left">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                  <Users size={16} className="text-white" />
                </div>
                <span className="text-white font-bold text-sm leading-tight block">Gerenciar Usuários</span>
              </div>
            </button>

            <button onClick={() => navigate('/admin/broadcast')} className="h-32 rounded-3xl p-4 relative overflow-hidden flex items-end group shadow-lg shadow-purple-200">
              <div className="absolute inset-0 bg-[#7c3aed]"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6d28d9] to-[#8b5cf6] opacity-50"></div>
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors"></div>

              <div className="relative z-10 text-left w-full">
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                    <Bell size={16} className="text-white fill-white" />
                  </div>
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Novo</span>
                </div>
                <span className="text-white font-bold text-sm leading-tight block">Enviar Avisos</span>
              </div>
            </button>

            <button onClick={() => navigate('/admin/plans')} className="h-32 rounded-3xl p-4 relative overflow-hidden flex items-end group">
              <div className="absolute inset-0 bg-gray-900"></div>
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" alt="Plans" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

              <div className="relative z-10 text-left">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                  <Ticket size={16} className="text-white" />
                </div>
                <span className="text-white font-bold text-sm leading-tight block">Planos & Cupons</span>
              </div>
            </button>

            <button onClick={() => navigate('/admin/condos')} className="h-32 rounded-3xl p-4 relative overflow-hidden flex items-end group">
              <div className="absolute inset-0 bg-gray-900"></div>
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" alt="Condos" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

              <div className="relative z-10 text-left">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                  <ShieldCheck size={16} className="text-white" />
                </div>
                <span className="text-white font-bold text-sm leading-tight block">Aprovar Fornecedores</span>
              </div>
            </button>

            <button onClick={() => navigate('/admin/financial')} className="h-32 rounded-3xl p-4 relative overflow-hidden flex items-end group col-span-1">
              <div className="absolute inset-0 bg-gray-900"></div>
              <img src="https://images.unsplash.com/photo-1554224155-98406f588c26?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" alt="Finance" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>

              <div className="relative z-10 text-left flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <BarChart3 size={16} className="text-white" />
                </div>
                <div>
                  <span className="text-white font-bold text-sm leading-tight block">Relatórios</span>
                  <p className="text-white/60 text-xs text-nowrap">Financeiro</p>
                </div>
              </div>
            </button>

            <button onClick={() => navigate('/admin/ads')} className="h-32 rounded-3xl p-4 relative overflow-hidden flex items-end group col-span-1 bg-pink-600">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600"></div>
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors"></div>

              <div className="relative z-10 text-left w-full">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                  <Store size={16} className="text-white" />
                </div>
                <span className="text-white font-bold text-sm leading-tight block">Gerenciar Anúncios</span>
              </div>
            </button>
          </div>
        </div>

        {/* Activity Feed (Bottom) */}
        <div>
          <RecentActivityList />
        </div>
      </div>


    </div>
  );
};

export default MasterDashboard;