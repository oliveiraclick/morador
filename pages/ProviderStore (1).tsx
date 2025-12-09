import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Package, Wrench, MoreVertical, Edit2, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Offer } from '../types';
import { supabase } from '../supabaseClient';

export const ProviderStore: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeTab, setActiveTab] = useState<'service' | 'product'>('service');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching offers:", error);
      } else {
        setOffers(data as Offer[]);
      }
      setLoading(false);
    };

    void fetchOffers();
  }, [navigate]);

  const handleBack = () => {
    navigate('/dashboard', { state: { role: 'provider' } });
  };

  const filteredOffers = offers.filter(o => o.type === activeTab);

  const toggleAvailability = async (id: string, currentStatus: boolean | undefined) => {
    const newStatus = currentStatus === false ? true : false;
    const { error } = await supabase
      .from('offers')
      .update({ is_available_for_order: newStatus })
      .eq('id', id);

    if (error) {
      alert("Erro ao atualizar status.");
    } else {
      setOffers(prev => prev.map(o => o.id === id ? { ...o, isAvailableForOrder: newStatus } : o));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta oferta?")) {
      const { error } = await supabase.from('offers').delete().eq('id', id);
      if (error) {
        alert("Erro ao excluir oferta.");
      } else {
        setOffers(prev => prev.filter(o => o.id !== id));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* Header */}
      <div className="bg-slate-900 pt-6 pb-8 px-6 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
             <button onClick={handleBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
               <ArrowLeft size={20} />
             </button>
             <h1 className="text-xl font-bold text-white">Minha Loja</h1>
           </div>
           <button 
             onClick={() => navigate('/provider/offer/new')}
             className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
           >
             <Plus size={20} />
           </button>
        </div>

        {/* Tabs - Swapped Order: Service First */}
        <div className="relative z-10 flex bg-white/10 p-1 rounded-2xl backdrop-blur-sm">
           <button
             onClick={() => setActiveTab('service')}
             className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
               activeTab === 'service' 
                 ? 'bg-white text-slate-900 shadow-lg' 
                 : 'text-slate-400 hover:bg-white/5'
             }`}
           >
             <Wrench size={16} /> Serviços
           </button>
           <button
             onClick={() => setActiveTab('product')}
             className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
               activeTab === 'product' 
                 ? 'bg-white text-slate-900 shadow-lg' 
                 : 'text-slate-400 hover:bg-white/5'
             }`}
           >
             <Package size={16} /> Produtos
           </button>
        </div>
      </div>

      {/* Helper Text */}
      <div className="px-6 mt-6">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">
          Gerenciando {activeTab === 'product' ? 'Estoque' : 'Serviços'}
        </p>
      </div>

      {/* List */}
      <div className="px-6 space-y-4 animate-slide-up">
         {loading ? <p className="text-center text-slate-400">Carregando...</p> : (
            filteredOffers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-[32px] border border-slate-50 border-dashed">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-4">
                  {activeTab === 'product' ? <Package size={32} /> : <Wrench size={32} />}
                </div>
                <p className="font-bold text-slate-400 mb-4">Você ainda não tem {activeTab === 'product' ? 'produtos' : 'serviços'}.</p>
                <button 
                  onClick={() => navigate('/provider/offer/new')}
                  className="text-violet-600 font-bold text-sm hover:underline"
                >
                  Cadastrar agora
                </button>
              </div>
            ) : (
              filteredOffers.map(offer => (
                <div key={offer.id} className="bg-white rounded-[24px] p-4 shadow-soft border border-slate-50 flex gap-4 group">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 relative overflow-hidden shrink-0">
                      {offer.imageUrl ? (
                        <img src={offer.imageUrl} className="w-full h-full object-cover" alt={offer.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          {offer.type === 'product' ? <Package /> : <Wrench />}
                        </div>
                      )}
                  </div>

                  <div className="flex-1 py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-800 leading-tight">{offer.title}</h3>
                        <div className="relative">
                          <button className="text-slate-300 hover:text-slate-600 peer">
                            <MoreVertical size={16} />
                          </button>
                           <div className="absolute right-0 top-6 w-32 bg-white border border-slate-100 rounded-xl shadow-lg p-1 hidden peer-focus:block hover:block">
                              <button onClick={() => toggleAvailability(offer.id, offer.isAvailableForOrder)} className="w-full text-left text-xs font-bold text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                                {offer.isAvailableForOrder !== false ? <EyeOff size={14} /> : <Eye size={14} />} {offer.isAvailableForOrder !== false ? 'Ocultar' : 'Exibir'}
                              </button>
                              <button onClick={() => navigate(`/provider/offer/edit/${offer.id}`)} className="w-full text-left text-xs font-bold text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                                 <Edit2 size={14}/> Editar
                              </button>
                              <button onClick={() => handleDelete(offer.id)} className="w-full text-left text-xs font-bold text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 flex items-center gap-2">
                                <Trash2 size={14}/> Excluir
                              </button>
                           </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mb-2 line-clamp-1">{offer.description}</p>
                      <span className="font-black text-violet-600">R$ {offer.price.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )
         )}
      </div>

      <div className="fixed bottom-32 right-6 z-40">
        <button 
          onClick={() => navigate('/provider/offer/new')}
          className="w-14 h-14 bg-slate-900 rounded-full shadow-xl shadow-slate-900/40 text-white flex items-center justify-center active:scale-90 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};