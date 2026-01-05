import React, { useState } from 'react';
import { ArrowLeft, Camera, Wand2, Loader2, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateItemDescription } from '../services/geminiService';
import { supabase } from '../lib/supabase';
import { useGlobal } from '../context/GlobalContext';

const SellItem: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useGlobal();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Móveis');
  const [condition, setCondition] = useState(''); // Added state
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Robust Session Check
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.warn('Session not found in SellItem, redirecting to login...');
        alert('Sessão expirada. Por favor, faça login novamente.');
        navigate('/login');
        return;
      }

      // If session exists but profile is incomplete (from global state or direct check)
      const { data: profileCheck } = await supabase
        .from('profiles')
        .select('condo_id, unit')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!profileCheck?.condo_id || !profileCheck?.unit) {
        navigate('/complete-registration');
      }
    };
    checkAuth();
  }, [navigate]);

  const categories = ['Móveis', 'Eletrônicos', 'Roupas', 'Brinquedos', 'Livros', 'Outros'];

  const handleGenerateDescription = async () => {
    if (!title) return alert("Por favor, digite o nome do item primeiro para a IA criar a descrição.");

    setIsGenerating(true);
    const desc = await generateItemDescription(title, category);
    setDescription(desc);
    setIsGenerating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!title || !price) return alert('Preencha título e preço.');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não logado. Por favor, faça login novamente.");

      let imageUrl = null;
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Attempt upload
        const { error: uploadError } = await supabase.storage
          .from('marketplace')
          .upload(filePath, selectedFile);

        if (uploadError) {
          console.error("Upload Error:", uploadError);
          if (uploadError.message.includes("Bucket not found")) {
            alert("Errocrítico: O sistema de arquivos não está configurado (Bucket 'marketplace' não existe). Contate o suporte.");
            setLoading(false);
            return;
          }
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('marketplace')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error } = await supabase.from('marketplace_items').insert({
        seller_id: user.id,
        title,
        description,
        price: parseFloat(price),
        category,
        type: 'DESAPEGO',
        condition,
        image_url: imageUrl,
        status: 'active'
      });

      if (error) throw error;

      alert('Anúncio criado com sucesso!');
      navigate('/home');
    } catch (error: any) {
      console.error(error);
      alert('Erro ao publicar: ' + (error.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col pb-32">
      {/* Header */}
      <div className="bg-white p-4 flex items-center shadow-sm justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">Vender Item</h1>
        </div>
        <button className="text-primary-600 font-semibold text-sm">Limpar</button>
      </div>

      <div className="p-4 space-y-6">

        {/* Image Upload */}
        <div className="w-full aspect-[4/3] bg-white rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <Camera size={32} />
              </div>
              <span className="text-sm font-medium">Adicionar Fotos</span>
              <span className="text-xs opacity-70">0/5 fotos</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageUpload}
          />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">O que você está vendendo?</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Bicicleta Aro 29"
            className="w-full bg-white p-4 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors font-medium"
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Categoria</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white p-4 rounded-xl border border-gray-200 text-gray-900 appearance-none focus:outline-none focus:border-primary-500"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Valor (R$)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0,00"
              className="w-full bg-white p-4 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 font-bold"
            />
          </div>
        </div>

        {/* Description with AI */}
        <div className="space-y-1 relative">
          <div className="flex justify-between items-end mb-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Descrição</label>
            <button
              onClick={handleGenerateDescription}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-70"
            >
              {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
              {isGenerating ? 'Gerando...' : 'IA Mágica'}
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva os detalhes do seu item..."
            rows={5}
            className="w-full bg-white p-4 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 resize-none"
          />
          <p className="text-[10px] text-gray-400 mt-1 text-right">{description.length}/300 caracteres</p>
        </div>

        {/* Condition - Fixed */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Estado de conservação</label>
          <div className="flex gap-2">
            {['Novo', 'Seminovo', 'Usado'].map((cond) => (
              <button
                key={cond}
                onClick={() => setCondition(cond)}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${condition === cond
                  ? 'bg-purple-100 border-purple-500 text-purple-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {cond}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Actions - Ensured Visibility */}
      <div className="bg-white p-4 border-t border-gray-100 fixed bottom-0 left-0 right-0 md:max-w-[480px] md:mx-auto z-50">
        <button
          onClick={handlePublish}
          disabled={loading}
          className="w-full bg-[#7c3aed] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
          {loading ? 'Publicando...' : 'Publicar Anúncio'}
        </button>
      </div>

    </div>
  );
};

export default SellItem;
