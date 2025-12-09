import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProviderProfile } from '../types';
import { ArrowLeft, Search, Star } from 'lucide-react';
import { supabase } from '../supabaseClient';

export const CategoryFeed: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [activeSub, setActiveSub] = useState('Todos');
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    navigate('/dashboard', { state: { role: 'resident' } });
  };

  // Normaliza o tipo (ex: 'comida' -> 'Comida') para filtrar
  const categoryName = type ? type.charAt(0).toUpperCase() + type.slice(1) : '';

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        // Fetch providers that have this category in their categories array
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_type', 'provider')
          .contains('categories', [categoryName]);

        if (error) throw error;

        // Map to ProviderProfile
        const mappedProviders: ProviderProfile[] = (data || []).map((p: any) => ({
          ...p,
          rating: 5.0, // Mock rating
          reviewCount: 10, // Mock review count
          isVerified: true, // Mock verification
          offers: []
        }));

        setProviders(mappedProviders);
      } catch (err) {
        console.error("Error fetching providers:", err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchProviders();
    }
  }, [categoryName]);

  const subcategories = ['Todos'];

  // Configuração visual baseada na categoria
  const getHeaderStyle = () => {
    switch (type) {
      case 'comida': return { bg: 'bg-orange-500', icon: '🍔', gradient: 'from-orange-400 to-red-500' };
      case 'beleza': return { bg: 'bg-fuchsia-500', icon: '💅', gradient: 'from-fuchsia-400 to-pink-500' };
      case 'casa': return { bg: 'bg-blue-500', icon: '🏠', gradient: 'from-blue-400 to-cyan-500' };
      case 'pets': return { bg: 'bg-green-500', icon: '🐶', gradient: 'from-green-400 to-emerald-500' };
      default: return { bg: 'bg-violet-500', icon: '✨', gradient: 'from-violet-400 to-fuchsia-500' };
    }
  };

  const style = getHeaderStyle();

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* Immersive Header */}
      <div className={`relative pt-12 pb-16 px-6 bg-gradient-to-br ${style.gradient} rounded-b-[48px] shadow-glow overflow-hidden`}>
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full blur-[40px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <button className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all">
            <Search size={24} />
          </button>
        </div>

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-[24px] bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-4xl mb-4 shadow-lg">
            {style.icon}
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">{categoryName}</h1>
          <p className="text-white/80 font-bold text-sm">Encontre as melhores opções perto de você.</p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="-mt-8 px-6 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-3 relative z-20">
        {subcategories.map(sub => (
          <button
            key={sub}
            onClick={() => setActiveSub(sub)}
            className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all ${activeSub === sub ? 'bg-white text-slate-900 scale-105' : 'bg-slate-900/40 backdrop-blur-md text-white border border-white/10 hover:bg-slate-900/60'}`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="px-6 space-y-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <p className="font-bold text-slate-400">Nenhum prestador encontrado nesta categoria.</p>
          </div>
        ) : (
          providers.map(provider => (
            <div
              key={provider.id}
              onClick={() => navigate(`/provider/${provider.id}`)}
              className="bg-white rounded-[32px] p-4 shadow-soft border border-slate-50 flex gap-4 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95 group"
            >
              <div className="w-24 h-24 rounded-[24px] overflow-hidden relative shrink-0 bg-slate-200">
                {provider.avatar_url ? (
                  <img src={provider.avatar_url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                )}
              </div>

              <div className="flex-1 py-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{provider.categories?.[0] || 'Geral'}</span>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-slate-700">{provider.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-800 leading-tight mb-2">{provider.full_name}</h3>

                <div className="flex items-center gap-1.5 opacity-50">
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  <span className="text-xs font-bold text-slate-400">Ver perfil</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};