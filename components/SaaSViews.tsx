import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Input } from './Input';
// Correção: Removido 'Plus' que não era utilizado, mantendo apenas os ícones em uso nos 3 componentes.
import { Heart, Search, User, Zap, Star, ArrowLeft, Globe, Image as ImageIcon, BarChart3, Users, Wallet, LogOut, Trash2, Edit, Plus, CheckCircle, TrendingUp, Settings } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Import supabase client
import type { Profile } from '../types';

// ===============================================
// 1. SAAS LANDING PAGE (SAAS_LP)
// ===============================================
export const SaaS_LP: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const setLogoPreview = setLogoUrl;

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase.from('app_settings').select('logo_url').eq('id', 1).single();
      if (data?.logo_url) {
        setLogoPreview(data.logo_url);
      }
    };
    void fetchLogo();
  }, []);

  const handleTrial = () => {
    alert(`Iniciando teste gratuito para: ${email}`);
    navigate('/dashboard', { state: { role: 'provider' } });
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-xl mx-auto py-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={logoUrl || "/brand-logo.png"} alt="MORADOR Pro" className="w-12 h-12 object-contain" />
          <span className="text-3xl font-black text-slate-800">MORADOR <span className="gradient-text">Pro</span></span>
        </div>

        <p className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-fuchsia-100 text-fuchsia-700 rounded-full text-xs font-bold uppercase tracking-widest">
          <Zap size={16} /> SOFTWARE PARA SALÕES
        </p>

        <h1 className="text-6xl font-black text-slate-900 leading-tight mb-6 tracking-tighter">
          Seu salão com <br />
          <span className="gradient-text">agendamento online</span> <br />
          e gestão completa.
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed font-medium mb-12">
          Chega de papel, agenda lotada e confusão no atendimento. Com nossa plataforma, seu salão ganha organização, profissionalismo e mais clientes.
        </p>

        <div className="space-y-4 max-w-sm mx-auto">
          <Button
            fullWidth
            icon={<Heart size={20} className="text-red-500 fill-red-500" />}
            variant="secondary"
            className="!border-fuchsia-100 !text-fuchsia-700 hover:!border-fuchsia-200"
          >
            Já aderiram <span className="ml-2 flex -space-x-2 overflow-hidden">
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-fuchsia-50" src="https://i.pravatar.cc/32?img=6" alt="Avatar 1" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-fuchsia-50" src="https://i.pravatar.cc/32?img=12" alt="Avatar 2" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-fuchsia-50" src="https://i.pravatar.cc/32?img=17" alt="Avatar 3" />
            </span>
          </Button>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">ou</p>
          <Button fullWidth onClick={handleTrial} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 !shadow-lg !shadow-fuchsia-500/40">
            Eu Quero
          </Button>
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="!h-14 !rounded-[20px] !bg-white !border-slate-100 !text-slate-800 !text-center font-bold"
          />
        </div>
      </div>

      <div className="absolute bottom-6 w-full flex items-center justify-center gap-6 text-slate-500 text-xs font-medium z-10">
        <Link to="/marketplace" className="hover:text-slate-800">Ver Marketplace</Link>
        <Link to="/saas-admin" className="hover:text-slate-800">Painel Admin</Link>
      </div>
    </div>
  );
};

// ===============================================
// 2. MARKETPLACE
// ===============================================
export const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'product' | 'service'>('service');
  const [providers, setProviders] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProviders = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'provider')
        .eq('provider_type', activeTab);

      if (data) {
        setProviders(data);
      }
    };
    void fetchProviders();
  }, [activeTab]);
  const categories = ['Tudo', 'Beleza', 'Comida', 'Casa', 'Pets'];
  const categoryIcons = ['✨', '💅', '🍔', '🏠', '🐶'];

  const handleCategoryClick = (cat: string) => {
    if (cat === 'Tudo') { /* Reset logic */ }
    else { navigate(`/category/${cat.toLowerCase()}`); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <header className="px-6 pt-12 pb-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Explore os <br />
            <span className="gradient-text">Melhores Salões</span>
          </h1>
          <button
            onClick={() => navigate('/login')}
            className="w-12 h-12 rounded-2xl bg-slate-50 shadow-glass border border-white flex items-center justify-center"
            title="Minha Conta"
          >
            <User size={24} className="text-slate-400" />
          </button>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 h-14 bg-white rounded-[20px] shadow-sm flex items-center px-4 gap-3 border border-slate-50">
            <Search size={20} className="text-slate-300" />
            <input type="text" placeholder="Buscar salões, serviços..." className="flex-1 bg-transparent font-bold text-slate-600 outline-none placeholder-slate-300" />
          </div>
          <button className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center text-white">
            <Search size={20} />
          </button>
        </div>
      </header>
      <div className="pl-6 my-8 overflow-x-auto whitespace-nowrap scrollbar-hide pb-2">
        {categories.map((cat, i) => (
          <div key={cat} onClick={() => handleCategoryClick(cat)} className="inline-flex flex-col items-center mr-5 cursor-pointer group">
            <div className={`w-16 h-16 rounded-[24px] mb-2 flex items-center justify-center text-2xl shadow-sm group-hover:-translate-y-1 transition-all ${i === 0 ? 'bg-violet-100' : 'bg-white'}`}>
              {categoryIcons[i]}
            </div>
            <span className={`text-[10px] font-bold ${i === 0 ? 'text-violet-500' : 'text-slate-400'}`}>{cat}</span>
          </div>
        ))}
      </div>
      <div className="mb-4 px-6 flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800">Salões em Destaque</h2>
        <div className="bg-white p-1.5 rounded-[20px] flex shadow-soft border border-slate-100">
          <button onClick={() => setActiveTab('service')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'service' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg' : 'text-slate-400'}`}>Serviços</button>
          <button onClick={() => setActiveTab('product')} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'product' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg' : 'text-slate-400'}`}>Produtos</button>
        </div>
      </div>
      <div className="px-6 space-y-6">
        {providers.map((provider: Profile) => (
          <div key={provider.id} onClick={() => navigate(`/provider/${provider.id}`)} className="bg-white rounded-[32px] p-4 shadow-soft border border-slate-50 flex gap-4 cursor-pointer">
            <div className="w-24 h-24 rounded-[24px] overflow-hidden relative shrink-0 bg-slate-200">
              {provider.avatar_url ? (
                <img src={provider.avatar_url} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
              )}
            </div>
            <div className="flex-1 py-1">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">{provider.categories?.[0] || 'Geral'}</span>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-slate-700">{(provider as any).rating || '5.0'}</span>
                </div>
              </div>
              <h3 className="text-lg font-black text-slate-800 leading-tight mb-2">{provider.full_name}</h3>
              <div className="flex items-center gap-1.5 opacity-50">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <span className="text-xs font-bold text-slate-400">Ver perfil</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===============================================
// 3. SAAS ADMIN PANEL / DASHBOARD
// ===============================================
export const SaaSAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics' | 'finance' | 'settings'>('overview');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  // Admin Management
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchAdmins();
    }
  }, [activeTab]);

  const fetchAdmins = async () => {
    const { data } = await supabase.from('admins').select('*').order('created_at', { ascending: false });
    if (data) setAdminsList(data);
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail) return;
    const { error } = await supabase.from('admins').insert([{ email: newAdminEmail, full_name: 'Novo Admin' }]);
    if (error) {
      alert('Erro ao adicionar admin: ' + error.message);
    } else {
      setNewAdminEmail('');
      fetchAdmins();
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este administrador?')) {
      const { error } = await supabase.from('admins').delete().eq('id', id);
      if (error) {
        alert('Erro ao remover: ' + error.message);
      } else {
        fetchAdmins();
      }
    }
  };

  // --- MOCK DATA FOR DEMONSTRATION (SEED DATA) ---
  const initialResidents = [
    { id: 1, name: 'Ana Silva', email: 'ana@email.com', unit: 'Bloco A - 101', status: 'ativo' },
    { id: 2, name: 'Bruno Torres', email: 'bruno@email.com', unit: 'Bloco B - 504', status: 'pendente' },
    { id: 3, name: 'Carla Dias', email: 'carla@email.com', unit: 'Bloco C - 202', status: 'ativo' }
  ];

  const initialProviders = [
    { id: 1, name: 'Salão da Juju', category: 'Beleza', type: 'Serviço', revenue: 'R$ 2.400' },
    { id: 2, name: 'Pet Shop Amigo', category: 'Pets', type: 'Produto + Serviço', revenue: 'R$ 5.100' },
    { id: 3, name: 'Marmitas Gourmet', category: 'Comida', type: 'Produto', revenue: 'R$ 800' }
  ];

  const initialFinancials = {
    grossRevenue: 15400.00,
    netRevenue: 12320.00,
    toReceive: 3200.00,
    toPay: 1500.00,
    history: [
      { id: 1, desc: 'Comissão Salão', value: 120.00, type: 'in', date: '08/12' },
      { id: 2, desc: 'Servidor AWS', value: -50.00, type: 'out', date: '07/12' },
      { id: 3, desc: 'Assinatura Pet Shop', value: 200.00, type: 'in', date: '06/12' }
    ]
  };

  const topSelling = [
    { id: 1, name: 'Corte de Cabelo', sales: 142, provider: 'Salão da Juju' },
    { id: 2, name: 'Banho e Tosa', sales: 89, provider: 'Pet Shop Amigo' },
    { id: 3, name: 'Marmita Fitness', sales: 54, provider: 'Marmitas Gourmet' }
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('app_settings').select('logo_url, banner_url').eq('id', 1).single();
      if (data) {
        if (data.logo_url) setLogoPreview(data.logo_url);
        if (data.banner_url) setBannerPreview(data.banner_url);
      }
    };
    void fetchSettings();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setIsUploading(true);

    const fileName = `logo-${Date.now()}`;
    const { error: uploadError } = await supabase.storage.from('branding').upload(fileName, logoFile, {
      cacheControl: '3600',
      upsert: true,
    });

    if (uploadError) {
      alert('Erro no upload: ' + uploadError.message);
      setIsUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('branding').getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    const { error: dbError } = await supabase
      .from('app_settings')
      .update({ logo_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (dbError) {
      alert('Erro ao salvar no banco de dados: ' + dbError.message);
    } else {
      alert('Logo atualizada com sucesso!');
    }
    setIsUploading(false);
  };

  const handleBannerUpload = async () => {
    if (!bannerFile) return;
    setIsUploading(true);

    const fileName = `banner-${Date.now()}`;
    const { error: uploadError } = await supabase.storage.from('branding').upload(fileName, bannerFile, {
      cacheControl: '3600',
      upsert: true,
    });

    if (uploadError) {
      alert('Erro no upload: ' + uploadError.message);
      setIsUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('branding').getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    const { error: dbError } = await supabase
      .from('app_settings')
      .update({ banner_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (dbError) {
      alert('Erro ao salvar no banco de dados: ' + dbError.message);
    } else {
      alert('Banner atualizado com sucesso!');
    }
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20 font-sans">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 pt-8 pb-8 px-6 shadow-2xl relative border-b border-white/5">
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src="/admin-logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Painel Master</h1>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Controle Total</p>
            </div>
          </div>
          <button onClick={() => navigate('/saas-lp')} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all"><LogOut size={20} /></button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <BarChart3 size={16} /> Visão Geral
          </button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <Users size={16} /> Cadastros
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <TrendingUp size={16} /> Relatórios
          </button>
          <button onClick={() => setActiveTab('finance')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'finance' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <Wallet size={16} /> Financeiro
          </button>
          <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <Settings size={16} /> Configs
          </button>
        </div>
      </div>

      <div className="px-6 mt-6 relative z-20 space-y-6 animate-fade-in text-slate-200">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 p-4 rounded-3xl">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Faturamento Bruto</p>
                <h3 className="text-2xl font-black text-white">R$ 15.4k</h3>
                <span className="text-[10px] text-green-400 font-bold flex items-center gap-1"><TrendingUp size={12} /> +12% esse mês</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-3xl">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Novos Usuários</p>
                <h3 className="text-2xl font-black text-white">124</h3>
                <span className="text-[10px] text-green-400 font-bold flex items-center gap-1"><User size={12} /> +24 cadastros</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><CheckCircle className="text-violet-500" size={20} /> Metas da Plataforma</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 text-slate-300">
                    <span>Receita Mensal (75%)</span>
                    <span>R$ 15k / 20k</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 text-slate-300">
                    <span>Novos Lojistas (40%)</span>
                    <span>4 / 10</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-2/5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            {/* Residents Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-white">Moradores <span className="text-slate-500 text-sm">({initialResidents.length})</span></h3>
                <button className="bg-violet-600 p-2 rounded-xl text-white"><Plus size={16} /></button>
              </div>
              <div className="space-y-3">
                {initialResidents.map(res => (
                  <div key={res.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">{res.name.charAt(0)}</div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{res.name}</h4>
                        <p className="text-xs text-slate-400">{res.unit}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white"><Edit size={16} /></button>
                      <button className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Providers Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-white">Prestadores <span className="text-slate-500 text-sm">({initialProviders.length})</span></h3>
                <button className="bg-violet-600 p-2 rounded-xl text-white"><Plus size={16} /></button>
              </div>
              <div className="space-y-3">
                {initialProviders.map(prov => (
                  <div key={prov.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-900/50 flex items-center justify-center text-lg">{prov.category === 'Pets' ? '🐶' : prov.category === 'Comida' ? '🍔' : '💅'}</div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{prov.name}</h4>
                        <p className="text-xs text-slate-400">{prov.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-green-400">{prov.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2"><Star className="text-yellow-400" size={20} /> Top 3 Serviços/Produtos</h3>
              <div className="space-y-4">
                {topSelling.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <span className="text-2xl font-black text-slate-600">0{index + 1}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-slate-400">{item.provider}</p>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-lg text-xs font-bold text-white">
                      {item.sales} vds
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FINANCE TAB */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-3xl">
                <p className="text-xs text-emerald-400 font-bold uppercase mb-1">A Receber</p>
                <h3 className="text-xl font-black text-white">R$ {initialFinancials.toReceive}</h3>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-3xl">
                <p className="text-xs text-red-400 font-bold uppercase mb-1">A Pagar</p>
                <h3 className="text-xl font-black text-white">R$ {initialFinancials.toPay}</h3>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/5">
                <h3 className="font-bold text-white">Extrato Recente</h3>
              </div>
              <div className="divide-y divide-white/5">
                {initialFinancials.history.map(tx => (
                  <div key={tx.id} className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'in' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {tx.type === 'in' ? <ArrowLeft className="rotate-45" size={16} /> : <ArrowLeft className="-rotate-[135deg]" size={16} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{tx.desc}</h4>
                        <p className="text-xs text-slate-500">{tx.date}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${tx.type === 'in' ? 'text-green-400' : 'text-white'}`}>
                      {tx.type === 'in' ? '+' : '-'} R$ {Math.abs(tx.value).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-50 text-slate-800">
            <h2 className="text-xl font-black text-slate-900 mb-2">Identidade Visual</h2>
            <p className="text-sm text-slate-500 mb-6">Personalize a cara do seu aplicativo.</p>

            <div className="space-y-4">
              {/* Logo Section */}
              <div>
                <div className="flex justify-between items-center mb-3 ml-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Logo Principal</label>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Max: 500x500px</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <ImageIcon size={32} className="text-slate-300" />
                    )}
                  </div>
                  <label className="flex-1 h-24 flex items-center justify-center px-6 bg-slate-50 text-slate-500 font-bold rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 transition-colors">
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/svg+xml" />
                    <span>Escolher Logo</span>
                  </label>
                </div>
                <Button fullWidth onClick={handleLogoUpload} disabled={isUploading || !logoFile} className="mt-2">
                  {isUploading ? 'Enviando...' : 'Salvar Logomarca'}
                </Button>
              </div>

              <div className="h-px bg-slate-100 my-6"></div>

              {/* Banner Section */}
              <div>
                <div className="flex justify-between items-center mb-3 ml-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Banner Promocional</label>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Max: 1200x400px</span>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="w-full h-32 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative group">
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={48} />
                      </div>
                    )}
                  </div>
                  <label className="w-full py-4 flex items-center justify-center px-6 bg-slate-50 text-slate-500 font-bold rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 transition-colors">
                    <input type="file" className="hidden" onChange={handleBannerFileChange} accept="image/png, image/jpeg" />
                    <span>Escolher Banner</span>
                  </label>
                </div>
                <Button fullWidth onClick={handleBannerUpload} disabled={isUploading || !bannerFile} className="mt-2" variant="secondary">
                  {isUploading ? 'Enviando...' : 'Salvar Banner'}
                </Button>
              </div>

              <div className="h-px bg-slate-100 my-6"></div>

              <div className="h-px bg-slate-100 my-6"></div>

              <div>
                <h3 className="font-bold mb-2 text-slate-800">Administradores</h3>
                <p className="text-xs text-slate-500 mb-4">Gerencie quem tem acesso ao Painel Master.</p>

                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="novo.admin@email.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="!h-10 text-sm"
                  />
                  <Button
                    onClick={handleAddAdmin}
                    disabled={isUploading || !newAdminEmail}
                    className="!h-10 !px-4"
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                <div className="space-y-2">
                  {adminsList.map(admin => (
                    <div key={admin.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center font-bold text-xs">
                          {admin.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">{admin.full_name || 'Admin'}</span>
                          <span className="text-[10px] text-slate-400">{admin.email}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remover acesso"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {adminsList.length === 0 && (
                    <p className="text-sm text-slate-400 italic">Nenhum administrador extra cadastrado.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};