import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserRole, Profile } from '../types';
import { Star, Search } from 'lucide-react';
import { ProviderDashboard } from './ProviderDashboard';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const role = (location.state as { role: UserRole })?.role || 'resident';

  const [activeTab, setActiveTab] = useState<'product' | 'service'>('service');
  const [providers, setProviders] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Redireciona para Splash se for provider logout, mas para Perfil se for morador
  const handleLogout = () => navigate('/');
  const handleProfileClick = () => navigate('/profile', { state: { role: 'resident' } });

  const isResident = role === 'resident';

  useEffect(() => {
    if (isResident) {
      fetchProviders();
    }
  }, [isResident, activeTab]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'provider')
        .eq('provider_type', activeTab);

      if (error) {
        console.error('Error fetching providers:', error);
      } else {
        setProviders(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isResident) {
    return <ProviderDashboard onLogout={handleLogout} />;
  }

  const categories = ['Desapego', 'Tudo', 'Beleza', 'Comida', 'Casa', 'Pets'];
  const categoryIcons = ['🏷️', '✨', '💅', '🍔', '🏠', '🐶'];

  const handleCategoryClick = (cat: string) => {
    if (cat === 'Desapego') {
      navigate('/desapego');
    } else if (cat === 'Tudo') {
      // Logica para resetar ou mostrar tudo
    } else {
      navigate(`/category/${cat.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-40">

      {/* 1. Header Hero */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Bom dia,<br />
              <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'Vizinho'}.</span>
            </h1>
          </div>
          <div
            onClick={handleProfileClick}
            className="w-12 h-12 rounded-2xl bg-white shadow-glass border border-white flex items-center justify-center relative cursor-pointer active:scale-95 transition-transform hover:shadow-lg"
            title="Meu Perfil"
          >
            <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="w-full h-full rounded-2xl object-cover opacity-90" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-fuchsia-500 rounded-full border-2 border-white"></div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="flex-1 h-14 bg-white rounded-[20px] shadow-sm flex items-center px-4 gap-3 border border-slate-50">
            <Search size={20} className="text-slate-300" />
            <input type="text" placeholder="Buscar profissionais e serviços..." className="flex-1 bg-transparent font-bold text-slate-600 outline-none placeholder-slate-300" />
          </div>
          <button className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center text-white shadow-lg shadow-slate-900/20 active:scale-95 transition-transform">
            <Search size={20} /> {/* Replaced Filter icon with Search as a placeholder */}
          </button>
        </div>
      </header>

      {/* 2. Categories (Stories Style) */}
      <div className="pl-6 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide pb-2">
        {categories.map((cat, i) => {
          let containerClass = "bg-white border border-slate-100 text-slate-600";

          if (i === 0) {
            // Desapego: Strong Purple Gradient
            containerClass = "bg-gradient-to-tr from-violet-700 to-fuchsia-700 text-white shadow-glow shadow-violet-500/40";
          } else if (i === 1) {
            // Tudo: Light Purple
            containerClass = "bg-violet-100 border border-violet-200 text-violet-600";
          }

          return (
            <div
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="inline-flex flex-col items-center mr-5 cursor-pointer group"
            >
              <div className={`w-16 h-16 rounded-[24px] mb-2 flex items-center justify-center text-2xl shadow-sm transition-all group-hover:-translate-y-1 ${containerClass}`}>
                {categoryIcons[i]}
              </div>
              <span className={`text-[10px] font-bold ${i === 0 ? 'text-violet-700' : i === 1 ? 'text-violet-500' : 'text-slate-400'}`}>
                {cat}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3. Featured Section (Snap Scroll) */}
      <div className="mb-4 px-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800">Destaques</h2>

          {/* Toggles - Bigger and Highlighted */}
          <div className="bg-white p-1.5 rounded-[20px] flex shadow-soft border border-slate-100">
            <button
              onClick={() => setActiveTab('service')}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'service'
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 scale-105'
                : 'text-slate-400 hover:bg-slate-50'
                }`}
            >
              Serviços
            </button>
            <button
              onClick={() => setActiveTab('product')}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'product'
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 scale-105'
                : 'text-slate-400 hover:bg-slate-50'
                }`}
            >
              Produtos
            </button>
          </div>
        </div>
      </div>

      <div className="pl-6 overflow-x-auto whitespace-nowrap scrollbar-hide pb-8 flex gap-6 snap-x snap-mandatory">
        {loading ? (
          // Loading Skeletons
          [1, 2, 3].map(i => (
            <div key={i} className="snap-center shrink-0 w-[200px] h-[260px] rounded-[32px] bg-slate-200 animate-pulse"></div>
          ))
        ) : providers.length === 0 ? (
          <div className="w-full text-center py-10 text-slate-400 font-bold">
            Nenhum {activeTab === 'service' ? 'serviço' : 'produto'} encontrado.
          </div>
        ) : (
          providers.map((provider) => (
            <div
              key={provider.id}
              onClick={() => navigate(`/provider/${provider.id}`, {
                state: { role: 'resident', initialTab: activeTab }
              })}
              className="snap-center shrink-0 w-[200px] h-[260px] rounded-[32px] relative overflow-hidden group cursor-pointer shadow-soft hover:shadow-xl transition-all"
            >
              <img src={provider.avatar_url || "https://via.placeholder.com/400x600?text=No+Image"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>

              {/* Floating Tag */}
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20 ${provider.user_type === 'resident' ? 'bg-white/20 text-white' : 'bg-black/40 text-white'}`}>
                  {provider.user_type === 'resident' ? 'Morador' : 'Profissional'}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-accent-500 font-bold text-[9px] uppercase tracking-wider truncate max-w-[80px]">
                    {provider.categories?.[0] || 'Geral'}
                  </span>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded-lg">
                    <Star size={8} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[9px] font-bold text-white">5.0</span>
                  </div>
                </div>
                <h3 className="text-lg font-black text-white leading-tight whitespace-normal line-clamp-2">{provider.full_name}</h3>
                {provider.condo_name && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></span>
                    <span className="text-[8px] font-bold text-slate-300">No condomínio</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};