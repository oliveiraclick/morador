import React, { useState } from 'react';
import { Bell, Eye, EyeOff, TrendingUp, Star, MoreVertical, Wallet, Calendar, MessageSquare, Settings, Hammer, Plug, Paintbrush, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfDashboard: React.FC = () => {
   const navigate = useNavigate();
   const [isAvailable, setIsAvailable] = useState(true);

   return (
      <div className="bg-gray-50 min-h-screen">
         {/* Header */}
         <div className="bg-white p-6 pb-2">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border-2 border-primary-200">
                     <img src="https://picsum.photos/150/150" alt="Prof" className="w-full h-full object-cover" />
                  </div>
                  <h1 className="font-bold text-lg text-gray-900">Painel do Profissional</h1>
               </div>
               <div className="relative">
                  <Bell size={24} className="text-gray-700" />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
               </div>
            </div>

            {/* Status Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-6">
               <h3 className="font-bold text-gray-900 mb-1">Status de Disponibilidade</h3>
               <p className="text-xs text-gray-500 mb-4">Visível para novos serviços.</p>
               <button
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${isAvailable ? 'bg-primary-600 justify-end' : 'bg-gray-300 justify-start'}`}
               >
                  <div className="w-6 h-6 rounded-full bg-white shadow-md"></div>
               </button>
            </div>
         </div>

         <div className="px-4 pb-24 space-y-6">

            {/* Month Summary */}
            <div>
               <h2 className="font-bold text-xl text-gray-900 mb-3">Resumo do Mês</h2>
               <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  <div className="min-w-[160px] bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-primary-100 rounded-lg text-primary-600"><Wallet size={18} /></div>
                        <span className="text-xs text-gray-500">Renda Mensal</span>
                     </div>
                     <span className="block text-2xl font-bold text-gray-900 mb-1">R$ 3.450</span>
                     <div className="flex items-center text-xs font-bold text-green-600">
                        <TrendingUp size={12} className="mr-1" /> +15%
                     </div>
                  </div>

                  <div className="min-w-[160px] bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600"><Star size={18} fill="currentColor" /></div>
                        <span className="text-xs text-gray-500">Avaliação</span>
                     </div>
                     <span className="block text-2xl font-bold text-gray-900 mb-1">4.9</span>
                     <div className="flex items-center text-xs font-bold text-green-600">
                        <TrendingUp size={12} className="mr-1" /> +0.1
                     </div>
                  </div>
               </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div>
               <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold text-xl text-gray-900">Desempenho</h2>
                  <button onClick={() => navigate('/performance')} className="text-primary-600 text-xs font-bold">Ver tudo</button>
               </div>
               <div className="bg-white h-48 rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col justify-end">
                  <div className="flex justify-between items-end h-32 gap-2">
                     {[40, 60, 30, 70, 95, 50, 20].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                           <div
                              style={{ height: `${h}%` }}
                              className={`w-full rounded-t-lg transition-all hover:opacity-80 ${i === 4 ? 'bg-primary-600' : 'bg-gray-100'}`}
                           ></div>
                           <span className={`text-[10px] font-medium ${i === 4 ? 'text-primary-600' : 'text-gray-400'}`}>
                              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Quick Actions */}
            <div>
               <h2 className="font-bold text-xl text-gray-900 mb-3">Ações Rápidas</h2>
               <div className="grid grid-cols-4 gap-3">
                  {[
                     { name: 'Orçamento', icon: <Wallet size={20} />, bg: 'bg-primary-50 text-primary-600', action: () => navigate('/orders') },
                     { name: 'Agenda', icon: <Calendar size={20} />, bg: 'bg-pink-50 text-pink-600', action: () => navigate('/agenda') },
                     { name: 'Avaliações', icon: <MessageSquare size={20} />, bg: 'bg-purple-50 text-purple-600', action: () => navigate('/reviews') },
                     { name: 'Ajustes', icon: <Settings size={20} />, bg: 'bg-gray-50 text-gray-600', action: () => navigate('/settings') },
                  ].map((act, i) => (
                     <button key={i} onClick={act.action} className="flex flex-col items-center gap-2">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${act.bg}`}>
                           {act.icon}
                        </div>
                        <span className="text-[10px] font-medium text-gray-600">{act.name}</span>
                     </button>
                  ))}
               </div>
            </div>

            {/* Recent Activities */}
            <div>
               <h2 className="font-bold text-xl text-gray-900 mb-3">Atividades Recentes</h2>
               <div className="space-y-3">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Hammer size={18} />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">Reparo Hidráulico</h4>
                        <p className="text-xs text-gray-500">Apt 302 • Hoje, 14:00</p>
                     </div>
                     <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full">Pendente</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <Plug size={18} />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">Instalação Elétrica</h4>
                        <p className="text-xs text-gray-500">Apt 104 • Ontem</p>
                     </div>
                     <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-full">Concluído</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <Paintbrush size={18} />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm">Pintura Sala</h4>
                        <p className="text-xs text-gray-500">Bloco C • 12/Out</p>
                     </div>
                     <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">Agendado</span>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};

export default ProfDashboard;