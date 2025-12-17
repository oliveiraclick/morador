import React, { useState } from 'react';
import { ArrowLeft, Camera, Package, Wrench, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateOffer: React.FC = () => {
    const navigate = useNavigate();
    const [type, setType] = useState<'PRODUCT' | 'SERVICE'>('PRODUCT');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Móveis');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const productCategories = ['Infantil', 'Beleza', 'Comida', 'Eletrônicos', 'Roupas', 'Outros'];
    const serviceCategories = ['Limpeza', 'Manutenção', 'Beleza', 'Aulas', 'Transporte', 'Outros'];

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Lazy Registration Check
    React.useEffect(() => {
        // ... (keep existing)
        const checkRegistration = async () => {
            const { data: { user } } = await import('../lib/supabase').then(m => m.supabase.auth.getUser());
            if (user) {
                const { data: profile } = await import('../lib/supabase').then(m => m.supabase.from('profiles').select('condo_id, unit').eq('id', user.id).single());
                if (!profile?.condo_id || !profile?.unit) {
                    navigate('/complete-registration');
                }
            }
        };
        checkRegistration();
    }, []);

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
        if (!title || !price) {
            alert('Preencha título e preço!');
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await import('../lib/supabase').then(m => m.supabase.auth.getUser());

            if (!user) throw new Error('Usuário não autenticado');

            // 1. Upload Image if selected
            let finalImageUrl = imagePreview || 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=200';

            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;
                const { error: uploadError } = await import('../lib/supabase').then(m => m.supabase.storage
                    .from('marketplace')
                    .upload(fileName, selectedFile));

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = import('../lib/supabase').then(m => m.supabase.storage
                    .from('marketplace')
                    .getPublicUrl(fileName)) as any;

                // Note: The above line might return a promise if not awaited or configured differently in the mock, 
                // but standard supabase-js is synchronous for getPublicUrl usually, 
                // however dynamic import makes it tricky. Let's do it safely:

                const sb = await import('../lib/supabase').then(m => m.supabase);
                const urlData = sb.storage.from('marketplace').getPublicUrl(fileName);
                finalImageUrl = urlData.data.publicUrl;
            }

            const { error } = await import('../lib/supabase').then(m => m.supabase
                .from('marketplace_items')
                .insert({
                    seller_id: user.id,
                    title,
                    description,
                    price: parseFloat(price.replace('R$', '').replace('.', '').replace(',', '.').trim()),
                    category: type === 'PRODUCT' ? category : 'Serviços',
                    type: type === 'PRODUCT' ? 'desapego' : 'loja',
                    image_url: finalImageUrl,
                    condo_id: (user.user_metadata as any)?.condo_id // This might be null if not in metadata, trigger handles it usually
                })
            );

            if (error) throw error;

            alert('Oferta publicada com sucesso!');
            navigate('/store'); // Redirect to My Store
        } catch (error: any) {
            console.error('Erro ao publicar:', error);
            alert('Erro ao publicar oferta: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 flex flex-col pb-32">
            {/* Header */}
            <div className="bg-white p-4 flex items-center shadow-sm justify-between sticky top-0 z-10 hidden md:flex">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                    <h1 className="font-bold text-lg text-gray-900">Nova Oferta</h1>
                </div>
            </div>

            {/* Mobile Header (Back button in content) */}
            <div className="md:hidden p-4 pb-0">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-200 rounded-full inline-flex">
                    <ArrowLeft size={24} className="text-gray-900" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">O que você vai ofertar?</h1>
            </div>

            <div className="p-4 space-y-6">

                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setType('PRODUCT')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${type === 'PRODUCT' ? 'border-[#7c3aed] bg-purple-50 text-[#7c3aed]' : 'border-gray-200 bg-white text-gray-500'}`}
                    >
                        <Package size={24} />
                        <span className="font-bold text-sm">Produto</span>
                    </button>
                    <button
                        onClick={() => setType('SERVICE')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${type === 'SERVICE' ? 'border-[#7c3aed] bg-purple-50 text-[#7c3aed]' : 'border-gray-200 bg-white text-gray-500'}`}
                    >
                        <Wrench size={24} />
                        <span className="font-bold text-sm">Serviço</span>
                    </button>
                </div>

                {/* Image Upload */}
                <div className="w-full aspect-video bg-white rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                <Camera size={24} />
                            </div>
                            <span className="text-sm font-medium">Foto da Oferta</span>
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
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={type === 'PRODUCT' ? "Ex: Kit Body Bebê" : "Ex: Manutenção de Ar Condicionado"}
                        className="w-full bg-white p-4 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7c3aed] transition-colors font-medium"
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
                                className="w-full bg-white p-4 rounded-xl border border-gray-200 text-gray-900 appearance-none focus:outline-none focus:border-[#7c3aed]"
                            >
                                {(type === 'PRODUCT' ? productCategories : serviceCategories).map(c => <option key={c} value={c}>{c}</option>)}
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
                            className="w-full bg-white p-4 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7c3aed] font-bold"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <div className="flex justify-between items-end mb-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Detalhes</label>
                    </div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descreva o produto ou serviço..."
                        rows={4}
                        className="w-full bg-white p-4 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#7c3aed] resize-none"
                    />
                </div>

            </div>

            {/* Footer Actions */}
            <div className="bg-white p-4 border-t border-gray-100 fixed bottom-0 left-0 right-0 md:max-w-[480px] md:mx-auto z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="w-full bg-[#7c3aed] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <CheckCircle2 size={20} />
                            Publicar na Loja
                        </>
                    )}
                </button>
            </div>

        </div>
    );
};

export default CreateOffer;
