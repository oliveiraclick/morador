import React from 'react';
import { Bell, Settings, TrendingUp, TrendingDown, Users, Building, DollarSign, Store, BarChart3, ShieldCheck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                <DollarSign size={20} />
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">+12%</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">MRR Mensal</p>
            <p className="text-xl font-bold text-gray-900">R$ 150.2k</p>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Building size={20} />
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">+5%</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">Condomínios</p>
            <p className="text-xl font-bold text-gray-900">124</p>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Users size={20} />
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">+8%</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">Usuários Totais</p>
            <p className="text-xl font-bold text-gray-900">45.3k</p>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                <TrendingDown size={20} />
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">-0.2%</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">Churn Rate</p>
            <p className="text-xl font-bold text-gray-900">1.2%</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Ações Rápidas</h3>
            <button onClick={() => navigate('/admin/settings')} className="text-purple-600 text-sm font-bold">Ver todas</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => navigate('/admin/users')} className="h-32 rounded-3xl p-4 relative overflow-hidden flex items-end group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6d28d9] to-[#4c1d95]"></div>
              {/* Abstract shape decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>

              <div className="relative z-10 text-left">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                  <Users size={16} className="text-white" />
                </div>
                <span className="text-white font-bold text-sm leading-tight block">Gerenciar Usuários</span>
              </div>
            </button>

            <button onClick={() => navigate('/admin/settings')} className="h-32 rounded-3xl p-4 relative overflow-hidden flex items-end">
              <div className="absolute inset-0 bg-black"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-black to-purple-900/50"></div>
              {/* Lines decoration */}
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ffffff 10px, #ffffff 11px)' }}></div>

              <div className="relative z-10 text-left">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                  <Settings size={16} className="text-white" />
                </div>
                <span className="text-white font-bold text-sm leading-tight block">Config. White Label</span>
              </div>
            </button>

            <button onClick={() => navigate('/admin/condos')} className="h-32 rounded-3xl p-4 relative overflow-hidden flex items-end">
              <div className="absolute inset-0 bg-gray-900"></div>
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" alt="bg" />

              <div className="relative z-10 text-left">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                  <ShieldCheck size={16} className="text-white" />
                </div>
                <span className="text-white font-bold text-sm leading-tight block">Aprovar Fornecedores</span>
              </div>
            </button>

            <button onClick={() => navigate('/admin/financial')} className="h-32 rounded-3xl p-4 relative overflow-hidden flex items-end">
              <div className="absolute inset-0 bg-purple-950"></div>
              {/* Bar chart decoration */}
              <div className="absolute bottom-0 right-0 flex items-end gap-1 p-4 opacity-30">
                <div className="w-2 h-8 bg-purple-400 rounded-t"></div>
                <div className="w-2 h-12 bg-purple-300 rounded-t"></div>
                <div className="w-2 h-6 bg-purple-500 rounded-t"></div>
                <div className="w-2 h-16 bg-white rounded-t"></div>
              </div>

              <div className="relative z-10 text-left">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                  <BarChart3 size={16} className="text-white" />
                </div>
                <span className="text-white font-bold text-sm leading-tight block">Relatórios Financeiros</span>
              </div>
            </button>
          </div>
        </div>

        {/* Activity Feed (Bottom) */}
        <div>
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <div className="space-y-6">

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600">
                  <Store size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 text-sm">Novo Condomínio Cadastrado</h4>
                    <span className="text-[10px] text-gray-400">2m atrás</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Residencial Flores do Campo • Plano Pro</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-500">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 text-sm">Pagamento Recusado</h4>
                    <span className="text-[10px] text-gray-400">15m atrás</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Condomínio Solar • R$ 1.200,00</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                  <Users size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 text-sm">Novos Usuários (Lote)</h4>
                    <span className="text-[10px] text-gray-400">1h atrás</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Importação via CSV concluída • 120 registros</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav Placeholder for Master */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center text-gray-400 text-[10px] font-medium z-50">
        <div onClick={() => navigate('/admin')} className="flex flex-col items-center gap-1 text-purple-600 cursor-pointer">
          <Store size={24} />
          <span>Painel</span>
        </div>
        <div onClick={() => navigate('/admin/condos')} className="flex flex-col items-center gap-1 cursor-pointer hover:text-purple-600 transition-colors">
          <Building size={24} />
          <span>Condos</span>
        </div>
        <div onClick={() => navigate('/admin/users')} className="flex flex-col items-center gap-1 cursor-pointer hover:text-purple-600 transition-colors">
          <Users size={24} />
          <span>Usuários</span>
        </div>
        <div onClick={() => navigate('/admin/financial')} className="flex flex-col items-center gap-1 cursor-pointer hover:text-purple-600 transition-colors">
          <DollarSign size={24} />
          <span>Financeiro</span>
        </div>
        <div onClick={() => navigate('/admin/settings')} className="flex flex-col items-center gap-1 cursor-pointer hover:text-purple-600 transition-colors">
          <Settings size={24} />
          <span>Ajustes</span>
        </div>
      </div>
    </div>
  );
};

export default MasterDashboard;