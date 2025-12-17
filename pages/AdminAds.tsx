import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Store, Image as ImageIcon, Link as LinkIcon, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Ad {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
    link?: string;
    active: boolean;
}

const AdminAds: React.FC = () => {
    const navigate = useNavigate();
    const [ads, setAds] = useState<Ad[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newAd, setNewAd] = useState<Partial<Ad>>({ title: '', description: '', imageUrl: '', link: '', active: true });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('destaques').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            if (data) setAds(data);
        } catch (error) {
            console.error('Error fetching ads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('ads')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('ads').getPublicUrl(filePath);

            setNewAd({ ...newAd, imageUrl: data.publicUrl });
        } catch (error) {
            alert('Erro no upload da imagem!');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveAd = async () => {
        if (!newAd.title || !newAd.description) return;

        try {
            const adData = {
                title: newAd.title,
                description: newAd.description,
                image_url: newAd.imageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400',
                link: newAd.link || '#',
                active: newAd.active ?? true
            };

            if (editingId) {
                // Update
                const { error } = await supabase
                    .from('destaques')
                    .update(adData)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('destaques')
                    .insert([adData]);
                if (error) throw error;
            }

            fetchAds();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar anúncio');
        }
    };

    const handleEdit = (ad: Ad) => {
        setNewAd({
            title: ad.title,
            description: ad.description,
            imageUrl: ad.imageUrl,
            link: ad.link,
            active: ad.active
        });
        setEditingId(ad.id);
        setShowModal(true);
    };

    const handleDeleteAd = async (id: number) => {
        if (window.confirm('Tem certeza que deseja remover este anúncio?')) {
            await supabase.from('destaques').delete().eq('id', id);
            fetchAds();
        }
    };

    const toggleActive = async (id: number, currentStatus: boolean) => {
        await supabase.from('destaques').update({ active: !currentStatus }).eq('id', id);
        fetchAds();
    };

    const resetForm = () => {
        setNewAd({ title: '', description: '', imageUrl: '', link: '', active: true });
        setEditingId(null);
        setUploading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900">Gerenciar Anúncios</h1>
                    <p className="text-xs text-gray-500">Controle o que aparece para os moradores</p>
                </div>
            </div>

            <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Store size={20} className="text-pink-600" />
                            Anúncios Ativos
                        </h2>
                    </div>
                    <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-pink-200 hover:bg-pink-700 transition-colors">
                        <Plus size={18} /> Novo
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <div className="col-span-1 md:col-span-2 text-center py-10 text-gray-400">Carregando anúncios...</div>
                    ) : ads.map(ad => (
                        <div key={ad.id} className={`bg-white rounded-3xl p-4 shadow-sm border border-gray-100 relative group overflow-hidden ${!ad.active ? 'opacity-60 grayscale' : ''}`}>
                            <div className="flex gap-3">
                                <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
                                    <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                                    {!ad.active && <div className="absolute inset-0 bg-black/10 flex items-center justify-center font-bold text-white text-[10px] uppercase">Inativo</div>}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-900 truncate pr-2 text-sm">{ad.title}</h3>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{ad.description}</p>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-3">
                                        <button onClick={() => handleEdit(ad)} className="px-3 py-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs font-bold">
                                            Editar
                                        </button>
                                        <button onClick={() => toggleActive(ad.id, ad.active)} className={`p-1.5 rounded-lg ${ad.active ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`} title={ad.active ? "Ocultar" : "Mostrar"}>
                                            {ad.active ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                        <button onClick={() => handleDeleteAd(ad.id)} className="p-1.5 rounded-lg text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && ads.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-400">Nenhum anúncio cadastrado.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">{editingId ? 'Editar Anúncio' : 'Novo Anúncio'}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-1">Imagem do Anúncio</label>
                                <div className="relative group">
                                    {newAd.imageUrl ? (
                                        <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2 bg-gray-100 border border-gray-200">
                                            <img src={newAd.imageUrl} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setNewAd({ ...newAd, imageUrl: '' })}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer">
                                            <ImageIcon size={32} className="text-gray-400 mb-2" />
                                            <span className="text-xs text-gray-500 font-medium">Toque para enviar foto</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={uploading}
                                            />
                                        </div>
                                    )}
                                    {uploading && <p className="text-xs text-pink-600 font-bold text-center mt-1 animate-pulse">Enviando imagem...</p>}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Título</label>
                                <input
                                    value={newAd.title}
                                    onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                                    placeholder="Ex: Oferta de Natal"
                                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:outline-none font-bold text-gray-900 bg-gray-50 focus:bg-white transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Descrição</label>
                                <textarea
                                    value={newAd.description}
                                    onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                                    placeholder="Detalhes da oferta..."
                                    rows={3}
                                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:outline-none resize-none bg-gray-50 focus:bg-white transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Link (Opcional)</label>
                                <div className="relative">
                                    <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        value={newAd.link}
                                        onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
                                        placeholder="Ex: https://promocao.com"
                                        className="w-full mt-1 pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newAd.active ?? true}
                                        onChange={(e) => setNewAd({ ...newAd, active: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">Anúncio Ativo</span>
                                </label>
                            </div>

                            <button
                                onClick={handleSaveAd}
                                disabled={uploading}
                                className="w-full bg-pink-600 text-white py-3.5 rounded-xl font-bold mt-2 shadow-lg shadow-pink-200 hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {editingId ? 'Salvar Alterações' : 'Criar Anúncio'}
                            </button>
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="w-full text-gray-400 font-bold text-sm py-2 hover:text-gray-600"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAds;
