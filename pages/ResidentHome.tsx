import React, { useState } from 'react';
import { Bell, Search, MapPin, Plus, Calendar, FileText, Key, Megaphone, Heart, ChevronRight, ChevronLeft, Sparkles, QrCode, Star, Building, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReferralModal from '../components/ReferralModal';

const ResidentHome: React.FC = () => {
  const navigate = useNavigate();
  const [showReferral, setShowReferral] = useState(false);
  const [activePros, setActivePros] = useState<any[]>([]);

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
  const [condoName, setCondoName] = React.useState("Seu Condomínio");

  // Profile Completion State
  const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
  const [condos, setCondos] = useState<any[]>([]);
  const [selectedCondo, setSelectedCondo] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [userId, setUserId] = useState('');

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await import('../lib/supabase').then(m => m.supabase.auth.getUser());
      if (user) {
        setUserId(user.id);
        if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name.split(' ')[0]);
        }

        // Fetch Profile for Condo Name and Completeness Check
        const { data: profile } = await import('../lib/supabase').then(m => m.supabase.from('profiles').select('condo_id, unit, condos(name)').eq('id', user.id).single());

        if (profile) {
          if (profile.condos?.name) {
            setCondoName(profile.condos.name);
          }

          // Check if profile is incomplete (missing condo or unit)
          if (!profile.condo_id || !profile.unit) {
            // Fetch condos for selection
            const { data: condosData } = await import('../lib/supabase').then(m => m.supabase.from('condos').select('*'));
            if (condosData) setCondos(condosData);
            setShowCompleteProfileModal(true);
          }
        }
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCondo || !street || !number) {
      alert("Preencha todos os campos!");
      return;
    }

    const { error } = await import('../lib/supabase').then(m => m.supabase.from('profiles').update({
      condo_id: selectedCondo,
      unit: `${street}, ${number}`
    }).eq('id', userId));

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      // Refresh local state to close modal and update UI
      const { data: condo } = await import('../lib/supabase').then(m => m.supabase.from('condos').select('name').eq('id', selectedCondo).single());
      if (condo) setCondoName(condo.name);
      setShowCompleteProfileModal(false);
      alert("Perfil atualizado com sucesso!");
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
    <div className="p-0 bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-600 to-indigo-600 p-6 pb-8 rounded-b-[40px] shadow-lg shadow-purple-200/50">

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src="https://picsum.photos/100/100" alt="Profile" className="w-14 h-14 rounded-full border-[3px] border-white/30" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-indigo-600"></div>
            </div>
            <div>
              <div className="flex items-center text-purple-100 text-sm font-medium mb-0.5">
                <MapPin size={14} className="mr-1" />
                {condoName}
              </div>
              <h1 className="text-2xl font-bold text-white">
                Bom dia, {userName}! 👋
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowReferral(true)}
              className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors"
              title="Indicar Profissional"
            >
              <QrCode size={20} />
            </button>
            <button className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white relative hover:bg-white/20 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-400 rounded-full border border-indigo-600"></span>
            </button>
          </div>
        </div>

        {/* Categories / Quick Actions */}
        <div className="flex justify-between gap-2 overflow-x-auto no-scrollbar py-2">
          {[
            { name: 'Anunciar', icon: <Plus size={24} />, color: 'bg-white/20 text-white border-white/30', action: () => navigate('/sell') },
            { name: 'Desapego', icon: <ShoppingBagIcon />, color: 'bg-white/10 text-purple-100 border-white/10', action: () => navigate('/market', { state: { category: 'Todos' } }) },
            { name: 'Beleza', icon: <SparklesIcon />, color: 'bg-white/10 text-purple-100 border-white/10', action: () => navigate('/market', { state: { category: 'Beleza' } }) },
            { name: 'Comida', icon: <UtensilsIcon />, color: 'bg-white/10 text-purple-100 border-white/10', action: () => navigate('/market', { state: { category: 'Comida' } }) },
          ].map((cat, idx) => (
            <button onClick={cat.action} key={idx} className="flex flex-col items-center gap-2 min-w-[72px]">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border backdrop-blur-sm ${cat.color} ${idx === 0 ? 'border-dashed border-2' : ''}`}>
                {cat.icon}
              </div>
              <span className="text-xs font-medium text-white/90">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="px-6 mt-6">

        {/* Active Professionals on Site Section */}
        {activePros.length > 0 && (
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
        )}

        {/* Admin News / Offers Card - Dynamic */}
        {latestBroadcast ? (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-l-4 border-l-primary-500 border-gray-100 flex gap-4 mb-8 animate-in slide-in-from-bottom-2">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
              <Megaphone size={24} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Avisos e Ofertas</span>
                <span className="text-xs text-gray-400">
                  {latestBroadcast?.timestamp ? new Date(latestBroadcast.timestamp).toLocaleDateString() : 'Hoje'}
                </span>
              </div>
              <h3 className="font-bold text-gray-900">{latestBroadcast.title}</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                {latestBroadcast.message}
              </p>
            </div>
          </div>
        ) : (
          // Fallback (empty or default message if needed, or null to hide)
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
            {(() => {
              const stored = localStorage.getItem('marketplace_items');
              const items = stored ? JSON.parse(stored) : [];
              const desapegoItems = items.filter((i: any) => i.type === 'DESAPEGO');
              const displayItems = desapegoItems.length > 0 ? desapegoItems : [
                { title: 'Bicicleta Aro 29', price: 850, img: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=300', category: 'Esporte' },
                { title: 'Sofá 2 Lugares', price: 400, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=300', category: 'Móveis' },
                { title: 'Monitor 24"', price: 600, img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=300', category: 'Eletrônicos' }
              ];

              return displayItems.map((item: any, idx: number) => (
                <div key={idx} className="min-w-[200px] bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col shrink-0">
                  <div className="relative mb-3">
                    <img src={item.img} className="w-full h-32 rounded-xl object-cover" alt={item.title} />
                    <span className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg font-medium">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 leading-tight mb-1 truncate">{item.title}</h3>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="font-bold text-primary-600">R$ {Number(item.price).toFixed(2).replace('.', ',')}</span>
                    <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Ads / Services Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ofertas e Serviços</h2>
          <div className="space-y-4">
            {/* Dynamic Ads from localStorage */}
            {(() => {
              const storedAds = localStorage.getItem('ads_data');
              const ads = storedAds ? JSON.parse(storedAds) : [];
              return ads.filter((ad: any) => ad.active).map((ad: any) => (
                <div key={ad.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 mb-4 relative overflow-hidden group">
                  <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0">
                    <img src={ad.imageUrl} className="w-full h-full object-cover rounded-xl" alt={ad.title} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 truncate pr-2">{ad.title}</h3>
                      <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold">Oferta</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 mb-2 line-clamp-2">{ad.description}</p>
                    {ad.link && (
                      <button onClick={() => navigate(ad.link)} className="text-xs font-bold text-pink-600 flex items-center gap-1 hover:underline">
                        Ver detalhes <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ));
            })()}

            {/* Keeping the 'Limpeza Pós-Obra' as a static service example for now, or we can make it dynamic later too. User asked for 'Ads' integration first. */}\n
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
              <img src="https://images.unsplash.com/photo-1581578731117-104f2a8d23e9?auto=format&fit=crop&q=80&w=300" className="w-20 h-20 rounded-xl object-cover" alt="Service" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900">Limpeza Pós-Obra</h3>
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Novo</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 mb-2">Equipe especializada para seu apê novo.</p>
                <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                  <Star size={12} fill="currentColor" />
                  <span>4.9</span>
                  <span className="text-gray-400 font-normal">(32 avaliações)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Complete Profile Modal */}
      {showCompleteProfileModal && (
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
                    {condos.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    <option value="splendido-test-id">Residencial Splendido</option>
                  </select>
                </div>
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
      )}

      <ReferralModal
        isOpen={showReferral}
        onClose={() => setShowReferral(false)}
        userName={userName}
      />
    </div >
  );
};

// Simple icon components to save space
const ShoppingBagIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const SparklesIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"></path></svg>;
const UtensilsIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>;
const ToolIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>;
const CarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>;

export default ResidentHome;