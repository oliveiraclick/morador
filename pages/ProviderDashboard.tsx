

import React from 'react';
import { LogOut, Plus, ArrowUpRight, Calendar, Box, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProviderDashboardProps {
   onLogout: () => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ onLogout }) => {
   const navigate = useNavigate();
   const { profile } = useAuth();


   return (
      <div className="min-h-screen bg-[#f8fafc] pb-40">

         {/* Wallet Header */}
         <div className="bg-slate-900 pt-12 pb-12 px-6 rounded-b-[40px] relative overflow-hidden shadow-2xl">
            {/* Background gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/30 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/20 rounded-full blur-[80px]"></div>

            <div className="relative z-10 flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                     <span className="text-xl">💼</span>
                  </div>
                  <div>
                     <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Modo Negócio</h2>
                     <p className="text-white font-bold">{profile?.full_name || 'Prestador'}</p>
                  </div>
               </div>
               <button onClick={onLogout} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                  <LogOut size={16} />
               </button>
            </div>

            <div className="relative z-10 mb-8">
               <p className="text-slate-400 font-medium mb-1">Saldo Total</p>
               <div className="flex items-baseline gap-2">
                  <h1 className="text-5xl font-black text-white tracking-tight">R$ 1.250<span className="text-2xl text-slate-500">,00</span></h1>
               </div>
               <div className="flex items-center gap-2 mt-2 text-green-400 text-sm font-bold bg-green-400/10 inline-flex px-3 py-1 rounded-full border border-green-400/20">
                  <ArrowUpRight size={14} /> +12.5% na semana
               </div>
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="text-violet-400 text-xs font-bold uppercase mb-2">Visitas</div>
                  <div className="text-2xl font-black text-white">2.4k</div>
               </div>
               <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="text-fuchsia-400 text-xs font-bold uppercase mb-2">Pedidos</div>
                  <div className="text-2xl font-black text-white">48</div>
               </div>
            </div>
         </div>

         {/* Action Grid */}
         <div className="px-6 -mt-6 relative z-20">
            <div className="grid grid-cols-2 gap-4">
               <button
                  onClick={() => navigate('/provider/offer/new')}
                  className="bg-white p-6 rounded-[24px] shadow-soft flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform group"
               >
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors shadow-sm">
                     <Plus size={24} />
                  </div>
                  <div className="text-left">
                     <h3 className="font-bold text-slate-800">Nova Oferta</h3>
                     <p className="text-xs text-slate-400 font-medium">Criar serviço/produto</p>
                  </div>
               </button>

               <button
                  onClick={() => navigate('/provider/schedule')}
                  className="bg-white p-6 rounded-[24px] shadow-soft flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform group"
               >
                  <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 flex items-center justify-center text-fuchsia-600 group-hover:bg-fuchsia-600 group-hover:text-white transition-colors shadow-sm">
                     <Calendar size={24} />
                  </div>
                  <div className="text-left">
                     <h3 className="font-bold text-slate-800">Agenda</h3>
                     <p className="text-xs text-slate-400 font-medium">Gerenciar horários</p>
                  </div>
               </button>

               <button
                  onClick={() => navigate('/provider/orders')}
                  className="bg-white p-6 rounded-[24px] shadow-soft flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform group"
               >
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors shadow-sm">
                     <Box size={24} />
                  </div>
                  <div className="text-left">
                     <h3 className="font-bold text-slate-800">Pedidos</h3>
                     <p className="text-xs text-slate-400 font-medium">Entregas pendentes</p>
                  </div>
               </button>

               <button className="bg-white p-6 rounded-[24px] shadow-soft flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors shadow-sm">
                     <Settings size={24} />
                  </div>
                  <div className="text-left">
                     <h3 className="font-bold text-slate-800">Ajustes</h3>
                     <p className="text-xs text-slate-400 font-medium">Perfil e Conta</p>
                  </div>
               </button>
            </div>

            {/* Visibility Toggle */}
            <div className="mt-6 bg-white rounded-[24px] p-2 flex shadow-soft border border-slate-50">
               <button className="flex-1 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-500 border-2 border-slate-900 box-content"></span> Visível
               </button>
               <button className="flex-1 py-3 rounded-2xl text-slate-400 text-xs font-bold hover:bg-slate-50">
                  Oculto
               </button>
            </div>
         </div>
      </div>
   );
};