import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Input } from './Input';
// Correção: Removido 'Plus' que não era utilizado, mantendo apenas os ícones em uso nos 3 componentes.
import { Heart, Search, User, Zap, Star, ArrowLeft, Globe, Image as ImageIcon } from 'lucide-react';
import { MOCK_PROVIDERS } from '../types';
import { supabase } from '../supabaseClient'; // Import supabase client

// ===============================================
// 1. SAAS LANDING PAGE (SAAS_LP)
// ===============================================
export const SaaS_LP: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase.from('app_settings').select('logo_url').eq('id', 1).single();
      if (data?.logo_url) {
        setLogoUrl(data.logo_url);
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
          {logoUrl ? (
            <img src={logoUrl} alt="LIVIN Pro" className="w-12 h-12 object-contain" />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          )}
          <span className="text-3xl font-black text-slate-800">LIVIN <span className="gradient-text">Pro</span></span>
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
  const filteredProviders = MOCK_PROVIDERS.filter(p => p.type === activeTab);
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
        {filteredProviders.map((provider) => (
          <div key={provider.id} onClick={() => navigate(`/provider/${provider.id}`)} className="bg-white rounded-[32px] p-4 shadow-soft border border-slate-50 flex gap-4 cursor-pointer">
            <div className="w-24 h-24 rounded-[24px] overflow-hidden relative shrink-0">
              <img src={provider.coverImage} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex-1 py-1">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">{provider.subcategory}</span>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-slate-700">{provider.rating}</span>
                </div>
              </div>
              <h3 className="text-lg font-black text-slate-800 leading-tight mb-2">{provider.name}</h3>
              {provider.isPresent && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-green-600">No condomínio</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===============================================
// 3. SAAS ADMIN PANEL
// ===============================================
export const SaaSAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'providers' | 'appearance'>('overview');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase.from('app_settings').select('logo_url').eq('id', 1).single();
      if (data?.logo_url) {

        setLogoPreview(data.logo_url);
      }
    };
    void fetchLogo();
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

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setIsUploading(true);

    const fileName = `logo-${Date.now()}`;
    // Upload to Supabase Storage in 'branding' bucket
    const { error: uploadError } = await supabase.storage.from('branding').upload(fileName, logoFile, {
      cacheControl: '3600',
      upsert: true,
    });

    if (uploadError) {
      alert('Erro no upload: ' + uploadError.message);
      setIsUploading(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('branding').getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    // Save URL to app_settings table
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

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <div className="bg-gradient-to-br from-violet-800 to-fuchsia-800 pt-12 pb-8 px-6 rounded-b-[40px] shadow-2xl relative">
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"><Globe size={20} /></div>
            <h1 className="text-xl font-bold text-white">Painel SaaS</h1>
          </div>
          <button onClick={() => navigate('/saas-lp')} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"><ArrowLeft size={20} /></button>
        </div>
        <div className="relative z-10 flex bg-white/10 p-1 rounded-2xl backdrop-blur-sm">
          <button onClick={() => setActiveTab('overview')} className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'overview' ? 'bg-white text-slate-900' : 'text-slate-400'}`}>Visão Geral</button>
          <button onClick={() => setActiveTab('plans')} className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'plans' ? 'bg-white text-slate-900' : 'text-slate-400'}`}>Planos</button>
          <button onClick={() => setActiveTab('providers')} className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'providers' ? 'bg-white text-slate-900' : 'text-slate-400'}`}>Prestadores</button>
          <button onClick={() => setActiveTab('appearance')} className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'appearance' ? 'bg-white text-slate-900' : 'text-slate-400'}`}>Aparência</button>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-20 space-y-6 animate-fade-in">
        {activeTab === 'appearance' && (
          <div className="bg-white p-6 rounded-[32px] shadow-soft border border-slate-50">
            <h2 className="text-xl font-black text-slate-900 mb-2">Aparência da Marca</h2>
            <p className="text-sm text-slate-500 mb-6">Faça o upload da sua logomarca oficial. Ela aparecerá na tela de abertura e login.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Sua Logo</label>
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
                    <span>Escolher Arquivo</span>
                  </label>
                </div>
              </div>
              <Button fullWidth onClick={handleLogoUpload} disabled={isUploading || !logoFile}>
                {isUploading ? 'Enviando...' : 'Salvar Logomarca'}
              </Button>
            </div>
          </div>
        )}
        {/* Other tabs content would go here */}
      </div>
    </div>
  );
};