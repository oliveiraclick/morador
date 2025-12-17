import React, { useState } from 'react';
import { Plus, Bell, Search, MapPin, QrCode, ShoppingBag as ShoppingBagIcon, Sparkles as SparklesIcon, Utensils as UtensilsIcon, LayoutGrid, Hammer as HammerIcon, Megaphone, ChevronRight, ChevronLeft, Heart, Building, Home, Star, Calendar, FileText, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ReferralModal from '../components/ReferralModal';

const ResidentHome: React.FC = () => {
  const navigate = useNavigate();

  const AdLinkButton = (link: string) => (
    <button onClick={() => navigate(link)} className="text-xs font-bold text-pink-600 flex items-center gap-1 hover:underline">
      Ver detalhes <ChevronRight size={12} />
    </button>
  );

  const [showReferral, setShowReferral] = useState(false);
  const [activePros, setActivePros] = useState<any[]>([]);
  const [desapegoItems, setDesapegoItems] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await import('../lib/supabase').then(m => m.supabase
        .from('broadcasts')
        .select('*')
        .or(`target.eq.all,target.eq.residents`)
        .order('created_at', { ascending: false })
        .limit(10)
      );

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
        if (parsed) {
          const pros = Array.isArray(parsed) ? parsed : [parsed];
          setActivePros(pros.filter(p => p && typeof p === 'object'));
        } else {
          setActivePros([]);
        }
      } catch (e) {
        console.error("Failed to parse prof_on_siteData", e);
        setActivePros([]);
      }
    } else {
      setActivePros([]);
    }
  }, []);

  // Fetch User & Profile
  const [userName, setUserName] = React.useState("Vizinho(a)");
  const [userAvatar, setUserAvatar] = React.useState<string | null>(null);
  const [condoName, setCondoName] = React.useState("Seu Condomínio");

  // Profile Completion State
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
  const [condos, setCondos] = useState<any[]>([]);
  const [selectedCondo, setSelectedCondo] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [userId, setUserId] = useState('');

  React.useEffect(() => {
    // 1. Load from cache first for immediate feedback
    const cachedName = localStorage.getItem('user_name_cache');
    const cachedAvatar = localStorage.getItem('user_avatar_cache');
    const cachedCondo = localStorage.getItem('user_condo_cache');

    if (cachedName) setUserName(cachedName);
    if (cachedAvatar) setUserAvatar(cachedAvatar);
    if (cachedCondo) setCondoName(cachedCondo);

    const fetchUser = async (session: any) => {
      const user = session?.user;

      if (user) {
        setUserId(user.id);

        let newName = user.user_metadata?.full_name?.split(' ')[0] || userName;
        let newAvatar = user.user_metadata?.avatar_url || userAvatar;

        // Fetch Profile for Condo Name and Completeness Check
        // We use maybeSingle() instead of single() to avoid errors if profile doesn't exist yet
        const { data: profile } = await supabase.from('profiles')
          .select('full_name, avatar_url, condo_id, unit, condos(name)')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          // Fallback for name if metadata failure
          if (profile.full_name) {
            newName = profile.full_name.split(' ')[0];
          }
          // Fallback for avatar
          if (profile.avatar_url) {
            newAvatar = profile.avatar_url;
          }

          if (profile.condos?.name) {
            setCondoName(profile.condos.name);
            localStorage.setItem('user_condo_cache', profile.condos.name);
          }

          // Check if profile is incomplete (missing condo or unit)
          if (!profile.condo_id || !profile.unit) {
            // Fetch condos for selection only if needed
            const { data: condosData } = await supabase.from('condos').select('*');
            if (condosData) setCondos(condosData);
            setShowCompleteProfileModal(true);
          }
        }

        // Update State & Cache
        setUserName(newName);
        setUserAvatar(newAvatar);

        localStorage.setItem('user_name_cache', newName);
        if (newAvatar) localStorage.setItem('user_avatar_cache', newAvatar);

      } else {
        // No user found, redirect to login
        // But delay slightly or check if we are really logged out?
        // navigate('/login'); 
      }
    };

    // 2. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUser(session);
    });

    // 3. Listen for auth changes (real-time)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUser(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Desapego Items
  React.useEffect(() => {
    const fetchDesapego = async () => {
      const { data, error } = await import('../lib/supabase').then(m => m.supabase
        .from('marketplace_items')
        .select('*')
        .eq('type', 'desapego')
        .order('created_at', { ascending: false })
        .limit(20)
      );

      if (error) {
        console.error('Error fetching desapego:', error);
      }

      if (data) {
        setDesapegoItems(data);
      }
    };
    fetchDesapego();
  }, []);

  // Fetch Ads
  React.useEffect(() => {
    const fetchAds = async () => {
      const { data } = await import('../lib/supabase').then(m => m.supabase
        .from('ads')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
      );
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

      setShowCompleteProfileModal(false);
      // Refresh page or state
      window.location.reload();

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
      <header className="bg-[#7c3aed] text-white pt-12 pb-24 rounded-b-[40px] px-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-overlay blur-3xl -ml-16 -mb-16"></div>
        </div>

        <div className="relative z-10 flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div onClick={() => navigate('/resident-profile')} className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 cursor-pointer overflow-hidden relative">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  className="w-full h-full object-cover"
                  alt="Avatar"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    // Fallback to initials happens because img is hidden? 
                    // actually better to set userAvatar to null to trigger the fallback UI
                    setUserAvatar(null);
                  }}
                />
              ) : (
                <span className="font-bold text-lg">{userName.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="font-bold text-2xl leading-tight text-white mb-0.5">Olá, {userName} 👋</h1>
              <p className="text-sm text-purple-200 font-medium tracking-wide bg-white/10 px-2 py-0.5 rounded-md inline-block backdrop-blur-sm border border-white/5">{condoName}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleOpenNotifications} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center relative hover:bg-white/20 transition-colors">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-400 border-2 border-[#7c3aed] rounded-full"></span>
              )}
            </button>
            <button onClick={() => setShowReferral(true)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <QrCode size={20} />
            </button>
          </div>
        </div>

        {/* Categories / Quick Actions */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-2 -mx-2">
          {[
            { name: 'Anunciar', icon: <Plus size={24} />, color: 'bg-white/20 text-white border-white/30', action: () => navigate('/sell') },
            { name: 'Desapego', icon: <ShoppingBagIcon />, color: 'bg-white/10 text-purple-100 border-white/10', action: () => navigate('/market', { state: { category: 'Todos' } }) },
            { name: 'Beleza', icon: <SparklesIcon />, color: 'bg-white/10 text-purple-100 border-white/10', action: () => navigate('/market', { state: { category: 'Beleza' } }) },
            { name: 'Comida', icon: <UtensilsIcon />, color: 'bg-white/10 text-purple-100 border-white/10', action: () => navigate('/market', { state: { category: 'Comida' } }) },
            { name: 'Serviços', icon: <HammerIcon />, color: 'bg-white/10 text-purple-100 border-white/10', action: () => navigate('/service-search') },
            { name: 'Ver todos', icon: <LayoutGrid size={24} />, color: 'bg-white/5 text-purple-200 border-white/5', action: () => navigate('/categories') },
          ].map((cat, idx) => (
            <button onClick={cat.action} key={idx} className="flex flex-col items-center gap-2 min-w-[72px] flex-shrink-0 transition-transform active:scale-95">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border backdrop-blur-sm ${cat.color} ${idx === 0 ? 'border-dashed border-2' : ''} shadow-lg shadow-purple-900/10`}>
                {cat.icon}
              </div>
              <span className="text-xs font-medium text-white/90 whitespace-nowrap">{cat.name}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-6 -mt-6 mb-6 relative z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem('search') as HTMLInputElement;
            if (input.value.trim()) {
              navigate(`/service-search?q=${encodeURIComponent(input.value)}`);
            }
          }}
          className="bg-white p-2 rounded-2xl shadow-lg shadow-purple-200/50 flex items-center gap-2 border border-purple-50"
        >
          <Search className="text-purple-400 ml-2" size={20} />
          <input
            name="search"
            type="text"
            placeholder="Busque por encanador, eletricista..."
            className="w-full p-2 outline-none text-gray-700 placeholder-gray-400 font-medium"
          />
          <button type="submit" className="bg-[#7c3aed] text-white p-2.5 rounded-xl hover:bg-[#6d28d9] transition-colors">
            <Search size={18} />
          </button>
        </form>
      </div >

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
                  <div key={idx} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-lg shadow-blue-200 relative overflow-hidden group">
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>

                    <div className={`flex ${activePros.length > 1 ? 'flex-col items-center text-center' : 'items-center gap-4'}`}>
                      <div className="relative">
                        <img src={prof.avatar} className="w-14 h-14 rounded-full border-2 border-white/30 shadow-md" />
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-blue-600 rounded-full"></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg leading-tight truncate w-full">{prof.profession}</h3>
                        <p className="text-xs text-blue-100 truncate w-full">{prof.name}</p>

                        <button
                          onClick={() => navigate('/chat', { state: { seller: prof.name, product: { title: `Serviço de ${prof.profession}`, price: 0 } } })}
                          className={`mt-3 bg-white text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm ${activePros.length > 1 ? 'w-full py-2' : 'px-6 py-2 w-auto'}`}
                        >
                          Chamar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        {/* Admin News / Offers Card - Dynamic */}
        {
          notifications.length > 0 ? (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-l-4 border-l-primary-500 border-gray-100 flex gap-4 mb-8 animate-in slide-in-from-bottom-2">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                <Megaphone size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Avisos e Ofertas</span>
                  <span className="text-xs text-gray-400">
                    {new Date(notifications[0].created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900">{notifications[0].title}</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
                  {notifications[0].message}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-l-4 border-gray-200 border-gray-100 flex gap-4 mb-8 opacity-50">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                <Megaphone size={24} />
              </div>
              <div className="flex items-center">
                <p className="text-sm text-gray-400">Nenhum aviso no momento.</p>
              </div>
            </div>
          )}

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
                <div key={item.id} className="min-w-[200px] bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col shrink-0 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/market')}>
                  <div className="relative mb-3 bg-gray-100 rounded-xl h-32 overflow-hidden">
                    <img
                      src={item.image_url}
                      onError={(e) => {
                        console.error('Image load error for:', item.title, item.image_url);
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=500';
                      }}
                      className="w-full h-full object-cover"
                      alt={item.title}
                    />
                    <span className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg font-medium">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 leading-tight mb-1 truncate">{item.title}</h3>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="font-bold text-primary-600">R$ {Number(item.price).toFixed(2).replace('.', ',')}</span>
                    <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
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
                <div key={ad.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 mb-4 relative overflow-hidden group">
                  <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0">
                    <img src={ad.image_url} className="w-full h-full object-cover rounded-xl" alt={ad.title} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 truncate pr-2">{ad.title}</h3>
                      <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold">Oferta</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 mb-2 line-clamp-2">{ad.description}</p>
                    {ad.link && AdLinkButton(ad.link)}
                  </div>
                </div>
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