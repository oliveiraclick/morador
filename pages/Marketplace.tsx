import React, { useState, useEffect } from 'react';
import { Search, Heart, MessageSquare, ArrowLeft, Store, Repeat, Utensils, Smartphone, Sparkles, ShoppingBag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(location.state?.category || 'Todos');
  const [viewItem, setViewItem] = useState<any>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  // Deep Link Logic: Check if an item was passed via navigation state to open immediately
  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category);
    }
    if (location.state?.viewItem) {
      setViewItem(location.state.viewItem);
    }
  }, [location.state]);

  const categories = ['Todos', 'Móveis', 'Eletrônicos', 'Infantil', 'Roupas', 'Beleza', 'Comida'];

  // Theme Logic
  const themes: Record<string, any> = {
    'Todos': {
      gradient: 'bg-white',
      text: 'text-gray-900',
      accent: 'text-[#7c3aed]',
      icon: ShoppingBag,
      headerTitle: 'Explorar'
    },
    'Comida': {
      gradient: 'bg-gradient-to-r from-orange-500 to-red-500',
      text: 'text-white',
      accent: 'text-white',
      icon: Utensils,
      headerTitle: 'Sabores da Vila'
    },
    'Beleza': {
      gradient: 'bg-gradient-to-r from-pink-400 to-rose-400',
      text: 'text-white',
      accent: 'text-white',
      icon: Sparkles,
      headerTitle: 'Espaço Beleza'
    },
    'Eletrônicos': {
      gradient: 'bg-gradient-to-r from-blue-600 to-indigo-700',
      text: 'text-white',
      accent: 'text-white',
      icon: Smartphone,
      headerTitle: 'Tech & Gadgets'
    }
  };

  const currentTheme = themes[activeCategory] || themes['Todos'];
  const HeaderIcon = currentTheme.icon;

  // State for items
  const [items, setItems] = useState<any[]>([]);
  const [condoName, setCondoName] = useState('Vila');

  useEffect(() => {
    const fetchData = async () => {
      // Fetch user's condo name
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('condos(name)')
          .eq('id', user.id)
          .single();

        if (profile?.condos?.name) {
          setCondoName(profile.condos.name);
        }
      }

      // Fetch marketplace items
      const { data, error } = await supabase
        .from('marketplace_items')
        .select(`
          *,
          profiles:seller_id (full_name, unit)
        `)
        .order('created_at', { ascending: false });

      if (data) {
        // Map DB fields to UI fields expected by current render
        const mappedItems = data.map(item => ({
          id: item.id,
          type: item.type === 'desapego' ? 'DESAPEGO' : 'LOJA',
          title: item.title,
          price: item.price,
          img: item.image_url,
          description: item.description,
          seller: item.profiles?.full_name || 'Vendedor',
          sellerAvatar: item.profiles?.full_name?.substring(0, 2).toUpperCase() || 'VA',
          sellerColor: 'bg-purple-500',
          location: item.profiles?.unit || 'Condomínio',
          time: new Date(item.created_at).toLocaleDateString(),
          condition: 'Novo',
          category: item.category,
          originalPrice: item.original_price // Assuming column exists or is null
        }));
        setItems(mappedItems);

        // If we have an ID but not the object (e.g. from a link), find it
        if (location.state?.viewItemId && !location.state.viewItem) {
          const found = mappedItems.find(i => i.id === location.state.viewItemId);
          if (found) setViewItem(found);
        }
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  const desapegoItems = items.filter(item =>
    item.type === 'DESAPEGO' && (activeCategory === 'Todos' || item.category === activeCategory)
  );

  const lojaItems = items.filter(item =>
    item.type === 'LOJA' && (activeCategory === 'Todos' || item.category === activeCategory)
  );

  const SectionHeader = ({ title, icon: Icon, count }: { title: string, icon: any, count: number }) => (
    <div className="flex items-center justify-between px-4 mb-3 mt-6">
      <div className="flex items-center gap-2 text-[#7c3aed]">
        <Icon size={20} />
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{count}</span>
      </div>
      <button className="text-xs text-gray-400 font-medium hover:text-[#7c3aed]">Ver todos</button>
    </div>
  );

  const handleNegotiate = (item: any) => {
    // 1. Get existing negotiations
    const stored = localStorage.getItem('active_negotiations');
    const negotiations = stored ? JSON.parse(stored) : [];

    // 2. Check if already exists
    const exists = negotiations.find((n: any) => n.id === item.id);

    if (!exists) {
      // 3. Add to list
      const newItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        seller: item.seller,
        image: item.img,
        status: 'Em negociação',
        type: item.type,
        timestamp: new Date().toISOString()
      };
      const updated = [newItem, ...negotiations];
      localStorage.setItem('active_negotiations', JSON.stringify(updated));
    }

    // 4. Navigate
    navigate('/chat', { state: { seller: item.seller, product: item } });
  };

  const HorizontalList = ({ items }: { items: any[] }) => (
    <div className="flex gap-3 overflow-x-auto px-4 pb-4 no-scrollbar snap-x snap-mandatory w-full">
      {items.length === 0 ? (
        <div className="w-full text-center py-6 bg-white rounded-2xl border border-gray-100 border-dashed text-gray-400 text-sm">
          Nenhum item nesta categoria
        </div>
      ) : (
        items.map((item) => (
          <div key={item.id} className="min-w-[220px] max-w-[220px] snap-center bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex-shrink-0">
            {/* Seller Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${item.sellerColor} flex items-center justify-center text-white text-[9px] font-bold shadow-sm`}>
                  {item.sellerAvatar}
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-gray-900 leading-tight truncate max-w-[80px]">{item.seller}</h3>
                </div>
              </div>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${item.condition === 'Novo' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                {item.condition}
              </span>
            </div>

            {/* Image */}
            <div
              onClick={() => setViewItem(item)}
              className="relative h-32 rounded-xl overflow-hidden mb-2 bg-gray-100 group cursor-pointer"
            >
              <img
                src={item.img}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=500';
                }}
              />
            </div>

            {/* Content */}
            <div className="px-1">
              <h2 className="text-xs font-bold text-gray-800 line-clamp-1 mb-1">{item.title}</h2>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-sm font-bold text-[#7c3aed]">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                {item.originalPrice && (
                  <span className="text-[9px] text-gray-400 line-through">R$ {item.originalPrice}</span>
                )}
              </div>

              <button
                onClick={() => handleNegotiate(item)}
                className="w-full bg-white border border-[#7c3aed] text-[#7c3aed] py-2 rounded-lg font-bold text-[10px] hover:bg-[#7c3aed] hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare size={12} />
                Negociar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Dynamic Header */}
      <div className={`${currentTheme.gradient} sticky top-0 z-20 shadow-sm pb-2 transition-colors duration-500`}>

        {/* Top Bar */}
        <div className="p-4 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className={`p-2 -ml-2 rounded-full ${currentTheme.text === 'text-white' ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100 text-gray-900'}`}>
            <ArrowLeft size={24} />
          </button>

          <div className={`flex items-center gap-2 ${currentTheme.text}`}>
            <HeaderIcon size={20} />
            <h1 className="text-lg font-bold">{currentTheme.headerTitle}</h1>
          </div>

          <button className={`p-2 -mr-2 rounded-full ${currentTheme.text === 'text-white' ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100 text-gray-900'}`}>
            <Search size={24} />
          </button>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat
                ? 'bg-white text-gray-900 shadow-lg scale-105'
                : `${currentTheme.text === 'text-white' ? 'bg-white/20 text-white border-white/30 hover:bg-white/30' : 'bg-gray-100 text-gray-500 border-gray-200'}`
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {/* Section 1: Desapegos */}
        <SectionHeader title={`Desapego do ${condoName}`} icon={Repeat} count={desapegoItems.length} />
        <HorizontalList items={desapegoItems} />

        {/* Section 2: Lojas */}
        <SectionHeader title="Lojas & Vitrines" icon={Store} count={lojaItems.length} />
        <HorizontalList items={lojaItems} />
      </div>

      {/* Product Detail Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 bg-white animate-in slide-in-from-bottom-5 duration-300 flex flex-col">

          {/* Header Image (Top 45%) */}
          <div className="relative h-[45vh] shrink-0 bg-gray-900">
            <img
              src={viewItem.img}
              className="w-full h-full object-cover cursor-zoom-in"
              alt={viewItem.title}
              onClick={(e) => {
                e.stopPropagation();
                setShowLightbox(true);
              }}
            />
            {/* Improved Back Button Visibility */}
            <button
              onClick={() => setViewItem(null)}
              className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-gray-900 shadow-md hover:bg-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                {viewItem.condition}
              </span>
            </div>
          </div>

          {/* Content (Scrollable Middle) */}
          <div className="flex-1 overflow-y-auto bg-white -mt-6 rounded-t-3xl relative z-10 px-6 pt-8 pb-4">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>

            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1">{viewItem.title}</h2>
                <p className="text-sm text-gray-500">{viewItem.category} • {viewItem.time}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#7c3aed]">R$ {viewItem.price.toFixed(2).replace('.', ',')}</p>
                {viewItem.originalPrice && <p className="text-sm text-gray-400 line-through">R$ {viewItem.originalPrice}</p>}
              </div>
            </div>

            <hr className="border-gray-100 my-6" />

            {/* Seller Info */}
            <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className={`w-12 h-12 rounded-full ${viewItem.sellerColor} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                {viewItem.sellerAvatar}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{viewItem.seller}</h3>
                <p className="text-xs text-gray-500">{viewItem.location}</p>
              </div>
              <div className="ml-auto">
                <button className="p-2 bg-white rounded-full text-gray-400 shadow-sm border border-gray-100 hover:text-red-500 transition-colors">
                  <Heart size={20} />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {viewItem.description}
              </p>
            </div>
          </div>

          {/* Fixed Footer (Bottom) */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0 relative z-20 pb-8">
            <button
              onClick={() => {
                handleNegotiate(viewItem);
                setViewItem(null);
              }}
              className="w-full bg-[#7c3aed] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 active:scale-95"
            >
              <MessageSquare size={20} />
              Negociar Agora
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Overlay */}
      {showLightbox && viewItem && (
        <div
          className="fixed inset-0 z-[60] bg-black flex items-center justify-center animate-in fade-in active:scale-100"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 z-50"
          >
            <ArrowLeft size={24} />
          </button>

          <img
            src={viewItem.img}
            className="max-w-full max-h-full object-contain p-4"
            alt={viewItem.title}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Marketplace;