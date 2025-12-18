import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Building, Home, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useGlobal } from '../context/GlobalContext'; // Global Context
import ReferralModal from '../components/ReferralModal';
import HomeHeader from '../components/HomeHeader';
import DesapegoCard from '../components/DesapegoCard';
import ProfessionalCard from '../components/ProfessionalCard';
import SearchBar from '../components/SearchBar';
import SystemNotice from '../components/SystemNotice';
import OfferCard from '../components/OfferCard';

const ResidentHome: React.FC = () => {
  const navigate = useNavigate();
  const { profile, items, refreshProfile } = useGlobal(); // Use Global

  const [showReferral, setShowReferral] = useState(false);
  const [activePros, setActivePros] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);

  // Derived State from Global Context
  const userName = profile?.full_name?.split(' ')[0] || "Vizinho(a)";
  const userAvatar = profile?.avatar_url || null;
  const condoName = profile?.condo_name || "Seu Condomínio";
  const userId = profile?.id || '';

  // Desapego items from Global Context
  const desapegoItems = items.filter(i => i.type === 'DESAPEGO').slice(0, 20);

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('broadcasts')
        .select('*')
        .or(`target.eq.all,target.eq.residents`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching notifications:', error);
      }

      if (data) {
        setNotifications(data);
        const lastSeen = localStorage.getItem('last_seen_notification_resident');
        const unread = data.filter(n => !lastSeen || new Date(n.created_at) > new Date(lastSeen));
        setUnreadCount(unread.length);
      }
    };
    fetchNotifications();
  }, []);

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (notifications.length > 0) {
      setUnreadCount(0);
      localStorage.setItem('last_seen_notification_resident', new Date().toISOString());
    }
  };

  const [latestBroadcast, setLatestBroadcast] = useState<any>(null);

  // Check for broadcasts
  React.useEffect(() => {
    const checkBroadcasts = () => {
      const stored = localStorage.getItem('system_broadcasts');
      if (stored) {
        try {
          const broadcasts = JSON.parse(stored);
          if (Array.isArray(broadcasts) && broadcasts.length > 0) {
            setLatestBroadcast(broadcasts[0]);
          }
        } catch (e) {
          console.error("Failed to parse system_broadcasts", e);
        }
      }
    };

    checkBroadcasts();
  }, []);

  // Check for pros on site
  React.useEffect(() => {
    const stored = localStorage.getItem('prof_on_site');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setActivePros(parsed);
        }
      } catch (e) { console.error(e) }
    }
  }, []);

  // Profile Completion State
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
  const [condos, setCondos] = useState<any[]>([]);
  const [selectedCondo, setSelectedCondo] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');

  // Check if profile is incomplete
  React.useEffect(() => {
    if (profile && (!profile.condo_id || !profile.unit)) {
      // Load condos if needed
      supabase.from('condos').select('*').then(({ data }) => {
        if (data) setCondos(data);
      });
      setShowCompleteProfileModal(true);
    }
  }, [profile]);

  // Fetch Ads
  React.useEffect(() => {
    const fetchAds = async () => {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ads:', error);
      }

      if (data) setAds(data);
    };
    fetchAds();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving profile...", { userId, selectedCondo, street, number });

    if (!selectedCondo || !street || !number) {
      alert("Preencha todos os campos!");
      return;
    }

    if (!userId) {
      alert("Erro: UserID não encontrado. Tente recarregar a página.");
      return;
    }

    try {
      const { error } = await import('../lib/supabase').then(m => m.supabase
        .from('profiles')
        .update({
          condo_id: parseInt(selectedCondo),
          unit: `${street}, ${number}` // Combining due to simple schema 
          // In a real app we might have separate columns
        })
        .eq('id', userId)
      );

      if (error) throw error;

      await refreshProfile(); // Update Global Cache
      setShowCompleteProfileModal(false);
      // No reload needed

    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Erro ao salvar perfil. Tente novamente.");
    }
  };

  const carouselRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="p-0 bg-gray-50 min-h-screen pb-24 relative">
      {/* Notifications Modal */}
      {showNotifications && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
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
        </>
      )}

      {/* Header */}
      {/* Header */}
      <HomeHeader
        userAvatar={userAvatar}
        userName={userName}
        condoName={condoName}
        unreadCount={unreadCount}
        onOpenNotifications={handleOpenNotifications}
        onOpenReferral={() => setShowReferral(true)}
      />

      {/* Search Bar */}
      <SearchBar onSearch={(query) => navigate(`/service-search?q=${encodeURIComponent(query)}`)} />

      {/* Highlights */}
      < div className="px-6 mt-2" >

        {/* Active Professionals on Site Section */}
        {
          activePros.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">No condomínio agora</h2>
              </div>

              <div className={`grid gap-3 ${activePros.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {activePros.map((prof, idx) => (
                  <ProfessionalCard
                    key={idx}
                    professional={prof}
                    isMultiple={activePros.length > 1}
                    onCall={() => navigate('/chat', { state: { seller: prof.name, product: { title: `Serviço de ${prof.profession}`, price: 0 } } })}
                  />
                ))}
              </div>
            </div>
          )
        }

        {/* Admin News / Offers Card - Dynamic */}
        {
          notifications.length > 0 ? (
            <SystemNotice notice={notifications[0]} />
          ) : null}

        {/* Desapego Carousel */}
        <div className="mb-8 relative group">
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-lg font-bold text-gray-900">Destaques do Desapego</h2>
            <button onClick={() => navigate('/market')} className="text-primary-600 text-sm font-bold flex items-center">
              Ver tudo <ChevronRight size={16} />
            </button>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-[60%] -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-gray-700 hover:bg-white transition-opacity disabled:opacity-0 hidden md:group-hover:block"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-[60%] -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-gray-700 hover:bg-white transition-opacity hidden md:group-hover:block"
          >
            <ChevronRight size={24} />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide no-scrollbar"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {desapegoItems.length === 0 ? (
              <div className="w-full text-center py-8 text-gray-400 bg-gray-100 rounded-2xl mx-1">
                <p>Nenhum item em destaque hoje.</p>
              </div>
            ) : (
              desapegoItems.map((item) => (
                <DesapegoCard
                  key={item.id}
                  item={item}
                  onClick={() => navigate('/market', { state: { viewItemId: item.id, category: 'Todos' } })}
                />
              ))
            )}
          </div>
        </div>

        {/* Ads / Services Section */}
        <div>
          <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-lg font-bold text-gray-900">Ofertas e Serviços</h2>
            <button onClick={() => navigate('/service-search')} className="text-primary-600 text-sm font-bold flex items-center">
              Ver tudo <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {ads.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-400">
                Nenhuma oferta no momento.
              </div>
            ) : (
              ads.map((ad) => (
                <OfferCard
                  key={ad.id}
                  ad={ad}
                  onLinkClick={(link) => navigate(link)}
                />
              ))
            )}
          </div>
        </div>
      </div >

      {/* Complete Profile Modal */}
      {
        showCompleteProfileModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home size={32} className="text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Complete seu Cadastro</h2>
                <p className="text-gray-500 mt-2">Para conectarmos você ao seu condomínio, precisamos de alguns dados.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Condomínio</label>
                  <div className="relative">
                    <Building size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      required
                      value={selectedCondo}
                      onChange={e => setSelectedCondo(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none appearance-none bg-white text-gray-700 font-medium"
                    >
                      <option value="" disabled>Selecione seu condomínio</option>
                      {condos.length === 0 ? (
                        <>
                          <option value="" disabled>Nenhum condomínio encontrado...</option>
                        </>
                      ) : (
                        condos.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                      )}
                    </select>
                  </div>
                  {condos.length === 0 && (
                    <p className="text-xs text-red-500 mt-2">Nenhum condomínio encontrado. Contate o suporte.</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Rua/Bloco</label>
                    <div className="relative">
                      <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input required type="text" value={street} onChange={e => setStreet(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none font-medium" placeholder="Ex: Bloco A" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nº / Apto</label>
                    <div className="relative">
                      <Home size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input required type="text" value={number} onChange={e => setNumber(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none font-medium" placeholder="101" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#7c3aed] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 hover:opacity-90 transition-all mt-4 transform active:scale-95">
                  Confirmar e Entrar
                </button>
              </form>
            </div>
          </div>
        )
      }

      <ReferralModal
        isOpen={showReferral}
        onClose={() => setShowReferral(false)}
        userName={userName}
      />
    </div >
  );
};

// Simple icon components to save space


export default ResidentHome;