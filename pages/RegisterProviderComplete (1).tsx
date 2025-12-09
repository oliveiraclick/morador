import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { maskCpfCnpj } from '../utils';
import { CATEGORIES_PRODUCT, CATEGORIES_SERVICE } from '../types';
import { ArrowLeft, Check, X, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export const RegisterProviderComplete: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { data, updateProviderInfo } = useRegistration();
  const [modalOpen, setModalOpen] = useState(false);
  const [tempCategories, setTempCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    // If no basic info or role is not provider, redirect back
    if (!data.role || data.role !== 'provider' || !data.basicInfo.email) {
      navigate('/register/type');
    }
  }, [data, navigate]);

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProviderInfo({ document: maskCpfCnpj(e.target.value) });
  };

  const toggleCategory = (cat: string) => {
    if (tempCategories.includes(cat)) {
      setTempCategories(tempCategories.filter(c => c !== cat));
    } else {
      setTempCategories([...tempCategories, cat]);
    }
  };

  const openCategoryModal = () => {
    if (!data.providerInfo.type) {
      alert("Por favor, selecione Serviço ou Produto primeiro.");
      return;
    }
    setTempCategories(data.providerInfo.categories);
    setModalOpen(true);
  };

  const saveCategories = () => {
    updateProviderInfo({ categories: tempCategories });
    setModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.providerInfo.type) return setError("Selecione um tipo (Serviço ou Produto).");
    if (data.providerInfo.categories.length === 0) return setError("Selecione pelo menos uma categoria.");

    setLoading(true);
    setError(null);

    const { email, password, name } = data.basicInfo;

    // 1. Create the user
    const { data: signUpData, error: signUpError } = await signUp(email, password, {
      full_name: name,
      role: 'provider',
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (signUpData.user) {
      // 2. Update the profile with provider details
      // Convert DD/MM/YYYY to YYYY-MM-DD
      const [day, month, year] = data.basicInfo.birthDate.split('/');
      const formattedBirthDate = `${year}-${month}-${day}`;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          phone: data.basicInfo.phone,
          birth_date: formattedBirthDate,
          document: data.providerInfo.document,
          provider_type: data.providerInfo.type,
          categories: data.providerInfo.categories,
          // user_type is already set by trigger based on metadata, but we can enforce it if needed
          // user_type: 'provider' 
        })
        .eq('id', signUpData.user.id);

      if (updateError) {
        setError(`Usuário criado, mas falha ao salvar perfil: ${updateError.message}`);
        setLoading(false);
        return;
      }

      alert("Cadastro realizado! Verifique seu e-mail para confirmar a conta.");
      navigate('/login');
    }

    setLoading(false);
  };

  const currentList = data.providerInfo.type === 'service' ? CATEGORIES_SERVICE : CATEGORIES_PRODUCT;

  return (
    <div className="min-h-screen p-6 bg-[#f8fafc] max-w-lg mx-auto pb-20">
      <div className="flex items-center mb-8 pt-4">
        <Link to="/register/basic" className="p-2 -ml-2 text-slate-500 hover:text-slate-900">
          <ArrowLeft size={24} />
        </Link>
        <div className="ml-2">
          <h1 className="text-2xl font-black text-slate-900">Detalhes do Negócio</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="CNPJ / CPF"
          value={data.providerInfo.document}
          onChange={handleDocumentChange}
          placeholder="00.000.000/0000-00"
          maxLength={18}
          required
          disabled={loading}
        />

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">O que você oferece?</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => updateProviderInfo({ type: 'service', categories: [] })}
              disabled={loading}
              className={`p-6 rounded-[24px] border-2 transition-all text-center flex flex-col items-center gap-2 ${data.providerInfo.type === 'service' ? 'border-violet-500 bg-violet-50 text-violet-700 font-bold' : 'border-transparent bg-white shadow-sm text-slate-500 hover:bg-slate-50'}`}
            >
              <span className="text-2xl">🛠️</span>
              Serviços
            </button>
            <button
              type="button"
              onClick={() => updateProviderInfo({ type: 'product', categories: [] })}
              disabled={loading}
              className={`p-6 rounded-[24px] border-2 transition-all text-center flex flex-col items-center gap-2 ${data.providerInfo.type === 'product' ? 'border-violet-500 bg-violet-50 text-violet-700 font-bold' : 'border-transparent bg-white shadow-sm text-slate-500 hover:bg-slate-50'}`}
            >
              <span className="text-2xl">📦</span>
              Produtos
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Categorias</label>
          <div
            onClick={!loading ? openCategoryModal : undefined}
            className="w-full min-h-[60px] bg-white rounded-[20px] p-4 cursor-pointer hover:shadow-md transition-all flex flex-wrap gap-2 items-center border border-slate-100"
          >
            {data.providerInfo.categories.length === 0 ? (
              <span className="text-slate-400 font-bold">Toque para selecionar...</span>
            ) : (
              data.providerInfo.categories.map(cat => (
                <span key={cat} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-lg text-xs font-bold">
                  {cat}
                </span>
              ))
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="pt-4">
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Finalizar'}
          </Button>
        </div>
      </form>

      {/* Modal for Categories */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl max-h-[80vh] flex flex-col animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Selecionar Categorias</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 mb-6 pr-2">
              {currentList.map(cat => {
                const isSelected = tempCategories.includes(cat.name);
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => toggleCategory(cat.name)}
                    className={`w-full text-left px-5 py-4 rounded-2xl flex justify-between items-center transition-all ${isSelected ? 'bg-violet-50 text-violet-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span className="font-bold">{cat.name}</span>
                    {isSelected && <Check size={20} className="text-violet-600" />}
                  </button>
                );
              })}
            </div>

            <Button onClick={saveCategories} fullWidth>
              Confirmar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};