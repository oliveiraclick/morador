import React, { useEffect, useState } from 'react';
import { Bell, Settings, TrendingUp, TrendingDown, Users, Building, DollarSign, Store, BarChart3, ShieldCheck, FileText, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const MasterDashboard: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [greeting, setGreeting] = useState('');
  const [metrics, setMetrics] = useState({
    mrr: 0,
    condos: 0,
    users: 0,
    churn: 1.2 // Hardcoded for now
  });
  const [sectorData, setSectorData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. MRR (Sum of 'in' transactions)
        const { data: financial } = await supabase
          .from('financial_transactions')
          .select('amount')
          .eq('type', 'in')
          .eq('status', 'paid');

        const mrr = financial ? financial.reduce((sum, item) => sum + Number(item.amount), 0) : 0;

        // 2. Condos Count
        const { count: condoCount } = await supabase
          .from('condos')
          .select('*', { count: 'exact', head: true });

        // 3. Users Count
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // 4. Sectors (Professionals)
        const { data: pros } = await supabase
          .from('profiles')
          .select('profession')
          .eq('role', 'professional');

        let sectors: any[] = [];
        if (pros) {
          const counts: { [key: string]: number } = {};
          pros.forEach(p => {
            const prof = p.profession || 'Outros';
            counts[prof] = (counts[prof] || 0) + 1;
          });

          sectors = Object.entries(counts)
            .map(([name, count]) => ({ name, count, color: getRandomColor() }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4); // Top 4
        }

        // Mock fallback if empty
        if (sectors.length === 0) {
          sectors = [
            { name: 'Limpeza', count: 0, color: 'bg-blue-500' },
            { name: 'Manutenção', count: 0, color: 'bg-orange-500' }
          ];
        }

        setMetrics({
          mrr,
          condos: condoCount || 0,
          users: userCount || 0,
          churn: 1.2
        });
        setSectorData(sectors);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRandomColor = () => {
    const colors = ['bg-blue-500', 'bg-orange-500', 'bg-pink-500', 'bg-purple-500', 'bg-green-500', 'bg-indigo-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

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
            {greeting}, Admin <span className="text-2xl">👋</span>
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
            <p className="text-xl font-bold text-gray-900">
              {loading ? '...' : `R$ ${(metrics.mrr / 1000).toFixed(1)}k`}
            </p>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Building size={20} />
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">+5%</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">Condomínios</p>
            <p className="text-xl font-bold text-gray-900">
              {loading ? '...' : metrics.condos}
            </p>
          </div>

          <div className="col-span-2 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Prestadores por Setor</h3>
            <div className="space-y-3">
              {loading ? (
                <p className="text-center text-gray-400 text-xs py-4">Carregando dados...</p>
              ) : (
                sectorData.map((sec, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${sec.color}`}></span>
                    <span className="text-xs text-gray-500 flex-1 capitalize">{sec.name}</span>
                    <span className="text-xs font-bold text-gray-900">{sec.count}</span>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${sec.color}`}
                        style={{ width: `${Math.min((sec.count / (metrics.users || 1)) * 100 * 5, 100)}%` }} // Scaling for visual
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Users size={20} />
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">+8%</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">Usuários Totais</p>
            <p className="text-xl font-bold text-gray-900">
              {loading ? '...' : (metrics.users > 1000 ? `${(metrics.users / 1000).toFixed(1)}k` : metrics.users)}
            </p>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                <TrendingDown size={20} />
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">-0.2%</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">Churn Rate</p>
            <p className="text-xl font-bold text-gray-900">{metrics.churn}%</p>
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
    </div>
  );
};

export default MasterDashboard;