
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, Settings, LogOut, Package, Heart, ChevronRight, Shield, CreditCard, User as UserIcon } from 'lucide-react';

export const ResidentProfile: React.FC = () => {
   const navigate = useNavigate();

   // Banner state with static fallback
   const [bannerUrl, setBannerUrl] = useState<string>("https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg?auto=compress&cs=tinysrgb&w=800");

   useEffect(() => {
      const fetchBanner = async () => {
         const { data } = await supabase.from('app_settings').select('banner_url').eq('id', 1).single();
         if (data?.banner_url) {
            setBannerUrl(data.banner_url);
         }
      };
      fetchBanner();
   }, []);

   const handleBack = () => {
      navigate('/dashboard', { state: { role: 'resident' } });
   };

   const handleLogout = () => {
      // Limpa sessão e volta para Splash
      sessionStorage.removeItem('app_loaded');
      navigate('/');
   };

   // Mock User Data
   const user = {
      name: 'Ricardo Souza',
      unit: 'Bloco C - 402',
      avatar: 'https://i.pravatar.cc/150?img=11',
      role: 'Morador Verificado',
      memberSince: '2023'
   };

   return (
      <div className="min-h-screen bg-[#f8fafc] pb-32">
         {/* Header Imersivo */}
         <div className="bg-slate-900 pt-8 pb-24 px-6 rounded-b-[48px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/30 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/20 rounded-full blur-[80px]"></div>

            <div className="relative z-10 flex items-center justify-between mb-8">
               <button onClick={handleBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                  <ArrowLeft size={20} />
               </button>
               <h1 className="text-xl font-bold text-white">Meu Perfil</h1>
               <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                  <Settings size={20} />
               </button>
            </div>

            <div className="relative z-10 flex flex-col items-center">
               <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-violet-500 to-fuchsia-500 mb-4 shadow-glow">
                  <img src={user.avatar} className="w-full h-full rounded-full object-cover border-4 border-slate-900" alt="" />
               </div>
               <h2 className="text-2xl font-black text-white">{user.name}</h2>
               <p className="text-violet-200 font-bold text-sm">{user.unit}</p>
            </div>
         </div>

         {/* Main Content Actions */}
         <div className="px-6 -mt-16 relative z-20 space-y-6 animate-slide-up">

            {/* Promotional Banner (Ad Space) - Dynamic from Supabase/Admin */}
            <div className="relative p-6 rounded-[32px] shadow-lg shadow-orange-500/20 flex items-center justify-between overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform h-32 bg-amber-600">
               {/* Background Image & Overlay */}
               <div className="absolute inset-0 z-0">
                  <img src={bannerUrl} className="w-full h-full object-cover" alt="Banner" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
               </div>

               <div className="relative z-10 text-white flex-1">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="bg-amber-500/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white">Parceiro</span>
                  </div>
                  <h3 className="text-xl font-black leading-tight">Cerveja Gelada?</h3>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">Cupom de R$ 15,00 no Zé Delivery!</p>
               </div>

               <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-amber-500 group-hover:border-amber-500 transition-colors relative z-10">
                  <span className="text-2xl">🍻</span>
               </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
               <button className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-50 flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform group">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                     <Package size={24} />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">Meus Pedidos</span>
               </button>

               <button onClick={() => navigate('/desapego')} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-50 flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform group">
                  <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center group-hover:bg-fuchsia-600 group-hover:text-white transition-colors">
                     <Heart size={24} />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">Meus Desapegos</span>
               </button>
            </div>

            {/* Settings List */}
            <div className="bg-white rounded-[32px] p-2 shadow-soft border border-slate-50">
               <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                        <UserIcon size={20} />
                     </div>
                     <div className="text-left">
                        <h4 className="font-bold text-slate-800">Dados Pessoais</h4>
                        <p className="text-xs text-slate-400 font-medium">Editar nome, telefone...</p>
                     </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-violet-500" />
               </button>

               <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                        <Shield size={20} />
                     </div>
                     <div className="text-left">
                        <h4 className="font-bold text-slate-800">Segurança</h4>
                        <p className="text-xs text-slate-400 font-medium">Senha e biometria</p>
                     </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-violet-500" />
               </button>

               <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                        <CreditCard size={20} />
                     </div>
                     <div className="text-left">
                        <h4 className="font-bold text-slate-800">Pagamentos</h4>
                        <p className="text-xs text-slate-400 font-medium">Cartões salvos</p>
                     </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-violet-500" />
               </button>
            </div>

            {/* Logout Button */}
            <button
               onClick={handleLogout}
               className="w-full py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-2"
            >
               <LogOut size={20} /> Sair da Conta
            </button>

            <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest pb-6">
               MORADOR App v4.0 • Build 2024
            </p>
         </div>
      </div>
   );
};
