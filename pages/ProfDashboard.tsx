import React, { useState, useEffect } from 'react';
import { Bell, TrendingUp, Star, Wallet, Calendar, MessageSquare, Settings, Hammer, Plug, Paintbrush, Store, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface UserProfile {
   id: string;
   full_name: string;
   avatar_url?: string;
   profession?: string;
   is_on_site?: boolean;
   is_vacation?: boolean;
}

const ProfDashboard: React.FC = () => {
   const navigate = useNavigate();
   const [profile, setProfile] = useState<UserProfile | null>(null);
   const [isAvailable, setIsAvailable] = useState(true);
   const [loading, setLoading] = useState(true);

   // Notifications State
   const [notifications, setNotifications] = useState<any[]>([]);
   const [showNotifications, setShowNotifications] = useState(false);
   const [unreadCount, setUnreadCount] = useState(0);

   useEffect(() => {
      fetchUser();
      fetchNotifications();

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
         if (session) {
            fetchUser();
         } else {
            navigate('/login');
         }
      });

      return () => subscription.unsubscribe();
   }, []);

   const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
         navigate('/login');
         return;
      }

      const { data, error } = await supabase
         .from('profiles')
         .select('*')
         .eq('id', user.id)
         .single();

      if (data) {
         setProfile(data);
         // Sync local state with DB state
         if (data.is_vacation !== undefined) setIsAvailable(!data.is_vacation);
      } else if (error) {
         console.error('Error fetching profile:', error);
      }
      setLoading(false);
   };

   const fetchNotifications = async () => {
      const { data } = await supabase
         .from('broadcasts')
         .select('*')
         .or(`target.eq.all,target.eq.professionals`)
         .order('created_at', { ascending: false })
         .limit(10);

      if (data) {
         setNotifications(data);
         const lastSeen = localStorage.getItem('last_seen_notification');
         const unread = data.filter(n => !lastSeen || new Date(n.created_at) > new Date(lastSeen));
         setUnreadCount(unread.length);
      }
   };

   // Paywall Check
   useEffect(() => {
      const verifyAccess = async () => {
         const { data: { user } } = await supabase.auth.getUser();
         if (!user) return;

         const [profileRes, settingsRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', user.id).single(),
            supabase.from('app_settings').select('*').eq('key', 'professional_trial_days').maybeSingle()
         ]);

         if (profileRes.data) {
            // Priority 1: Manual exemption
            if (profileRes.data.is_free) return;

            // Priority 2: Paid status (simulated by localStorage for this demo/flow)
            const hasPaid = localStorage.getItem('professional_payment_active') === 'true';
            if (hasPaid) return;

            // Priority 3: Trial period
            if (settingsRes.data) {
               const trialDays = parseInt(settingsRes.data.value);
               const createdAt = new Date(profileRes.data.created_at);
               const now = new Date();
               const diffTime = Math.abs(now.getTime() - createdAt.getTime());
               const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

               if (diffDays <= trialDays) return;
            }

            // No access -> Paywall
            navigate('/plan/professional');
         }
      };

      verifyAccess();
   }, []);

   const toggleStatus = async () => {
      if (!profile) return;

      const newState = !profile.is_on_site;

      // Optimistic update
      setProfile({ ...profile, is_on_site: newState });

      const { error } = await supabase
         .from('profiles')
         .update({ is_on_site: newState })
         .eq('id', profile.id);

      if (error) {
         console.error('Error updating status:', error);
         // Revert on error
         setProfile({ ...profile, is_on_site: !newState });
      }
   };

   const handleToggleVacation = async () => {
      if (!profile) return;

      const newState = !profile.is_vacation;

      // Optimistic update
      setProfile({ ...profile, is_vacation: newState });

      // If going on vacation, also set is_on_site to false
      const updates: any = { is_vacation: newState };
      if (newState) {
         updates.is_on_site = false;
         setIsAvailable(false);
      } else {
         setIsAvailable(true);
      }

      const { error } = await supabase
         .from('profiles')
         .update(updates)
         .eq('id', profile.id);

      if (error) {
         console.error('Error updating vacation mode:', error);
         // Revert
         setProfile({ ...profile, is_vacation: !newState }); // Simplified revert
      }
   };

   const handleOpenNotifications = () => {
      setShowNotifications(!showNotifications);
      if (notifications.length > 0) {
         setUnreadCount(0);
         localStorage.setItem('last_seen_notification', new Date().toISOString());
      }
   };

   if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>;
   }

   if (!profile) return null;

   return (
      <div className="bg-gray-50 pb-24 relative">
         {/* Notifications Modal/Dropdown */}
         {showNotifications && (
            <div className="absolute top-20 right-4 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-900">Notificações</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600 text-xs font-bold">Fechar</button>
               </div>
               <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                     <div className="p-8 text-center text-gray-400 text-sm">Nenhuma notificação recente.</div>
                  ) : (
                     notifications.map(n => (
                        <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50">
                           <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{n.title}</h4>
                              <span className="text-[10px] text-gray-400 whitespace-nowrap">{new Date(n.created_at).toLocaleDateString()}</span>
                           </div>
                           <p className="text-xs text-gray-500 line-clamp-3">{n.message}</p>
                        </div>
                     ))
                  )}
               </div>
            </div>
         )}

         {/* Backdrop for notifications */}
         {showNotifications && <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>}

         {/* Header */}
         <div className="bg-white p-6 pb-2 relative z-30">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                  <div onClick={() => navigate('/professional-profile')} className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 border-primary-200 cursor-pointer">
                     {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Prof" className="w-full h-full object-cover"
                           onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=random`;
                           }}
                        />
                     ) : (
                        <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold border-2 border-white">
                           {profile.full_name?.substring(0, 2).toUpperCase()}
                        </div>
                     )}
                  </div>
                  <div>
                     <h1 className="font-bold text-lg text-gray-900">Olá, {profile.full_name?.split(' ')[0]}!</h1>
                     <p className="text-xs text-gray-500">{profile.profession || "Profissional"}</p>
                  </div>
               </div>
               <div className="relative cursor-pointer" onClick={handleOpenNotifications}>
                  <Bell size={24} className="text-gray-700 hover:text-primary-600 transition-colors" />
                  {unreadCount > 0 && (
                     <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                        {unreadCount}
                     </span>
                  )}
               </div>
            </div>

            {/* Vacation Mode Card */}
            <div className={`mb-4 rounded-2xl p-4 shadow-sm border transition-all ${profile.is_vacation ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-100'}`}>
               <div className="flex justify-between items-center">
                  <div>
                     <h3 className={`font-bold ${profile.is_vacation ? 'text-white' : 'text-gray-900'}`}>Modo Férias / Offline</h3>
                     <p className={`text-xs ${profile.is_vacation ? 'text-purple-100' : 'text-gray-500'}`}>
                        {profile.is_vacation ? 'Você está invisível no app.' : 'Pause todas as atividades.'}
                     </p>
                  </div>
                  <button
                     onClick={handleToggleVacation}
                     className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center shadow-inner cursor-pointer ${profile.is_vacation ? 'bg-white/30 justify-end' : 'bg-gray-200 justify-start'}`}
                  >
                     <div className="w-6 h-6 rounded-full bg-white shadow-sm"></div>
                  </button>
               </div>
            </div>

            {/* Status Card (CHECK-IN) */}
            <div className={`rounded-2xl p-4 shadow-sm mb-6 border transition-all duration-300 ${profile.is_on_site ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${profile.is_on_site ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <MapPin size={20} />
                     </div>
                     <div>
                        <h3 className={`font-bold ${profile.is_on_site ? 'text-green-800' : 'text-gray-900'}`}>{profile.is_on_site ? 'No Condomínio' : 'Fora do Condomínio'}</h3>
                        <p className={`text-xs ${profile.is_on_site ? 'text-green-600' : 'text-gray-500'}`}>{profile.is_on_site ? 'Disponível para chamados' : 'Faça check-in ao chegar'}</p>
                     </div>
                  </div>

                  <button
                     disabled={profile.is_vacation}
                     onClick={toggleStatus}
                     className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${profile.is_vacation
                        ? 'bg-gray-100 cursor-not-allowed justify-start'
                        : (profile.is_on_site ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start')
                        }`}
                  >
                     <div className="w-6 h-6 rounded-full bg-white shadow-md"></div>
                  </button>
               </div>
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
                     { name: 'Loja', icon: <Store size={20} />, bg: 'bg-primary-50 text-primary-600', action: () => navigate('/create-offer') },
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