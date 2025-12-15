import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Store, Image as ImageIcon, Link as LinkIcon, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

    useEffect(() => {
        const storedAds = localStorage.getItem('ads_data');
        if (storedAds) {
            setAds(JSON.parse(storedAds));
        } else {
            // Seed initial data if empty
            const initialAds: Ad[] = [
                { id: 1, title: 'Promoção de Pizza', description: '50% de desconto na Pizzaria do Bairro', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400', link: '/market', active: true },
                { id: 2, title: 'Limpeza de Sofá', description: 'Agende agora e ganhe impermeabilização grátis', imageUrl: 'https://images.unsplash.com/photo-1581553698125-0d32e65c9285?auto=format&fit=crop&q=80&w=400', link: '/market', active: true }
            ];
            setAds(initialAds);
            localStorage.setItem('ads_data', JSON.stringify(initialAds));
        }
    }, []);

    const saveAds = (updatedAds: Ad[]) => {
        setAds(updatedAds);
        localStorage.setItem('ads_data', JSON.stringify(updatedAds));
    };

    const handleAddAd = () => {
        if (!newAd.title || !newAd.description) return;

        const ad: Ad = {
            id: Date.now(),
            title: newAd.title,
            description: newAd.description,
            imageUrl: newAd.imageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400',
            link: newAd.link || '#',
            active: newAd.active ?? true
        };

        const updatedAds = [...ads, ad];
        saveAds(updatedAds);
        setShowModal(false);
        setNewAd({ title: '', description: '', imageUrl: '', link: '', active: true });
    };

    const handleDeleteAd = (id: number) => {
        if (window.confirm('Tem certeza que deseja remover este anúncio?')) {
            const updatedAds = ads.filter(ad => ad.id !== id);
            saveAds(updatedAds);
        }
    };

    const toggleActive = (id: number) => {
        const updatedAds = ads.map(ad =>
            ad.id === id ? { ...ad, active: !ad.active } : ad
        );
        saveAds(updatedAds);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Gerenciar Anúncios</h1>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Store size={20} className="text-pink-600" />
                            Anúncios Ativos
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">Gerencie os destaques para os moradores</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-pink-200 hover:bg-pink-700 transition-colors">
                        <Plus size={18} /> Novo Anúncio
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ads.map(ad => (
                        <div key={ad.id} className={`bg-white rounded-3xl p-4 shadow-sm border border-gray-100 relative group overflow-hidden ${!ad.active ? 'opacity-60 grayscale' : ''}`}>
                            <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                    <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-900 truncate pr-2">{ad.title}</h3>
                                        <div className="flex gap-1">
                                            <button onClick={() => toggleActive(ad.id)} className={`p-1.5 rounded-lg ${ad.active ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`} title={ad.active ? "Ocultar" : "Mostrar"}>
                                                {ad.active ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
                                            <button onClick={() => handleDeleteAd(ad.id)} className="p-1.5 rounded-lg text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-600">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ad.description}</p>
                                    {ad.link && (
                                        <div className="flex items-center gap-1 mt-2 text-xs text-blue-500">
                                            <LinkIcon size={12} />
                                            <span className="truncate max-w-[150px]">{ad.link}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {ads.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-400">Nenhum anúncio cadastrado.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">Novo Anúncio</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Título</label>
                                <input
                                    value={newAd.title}
                                    onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                                    placeholder="Ex: Oferta de Natal"
                                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:outline-none font-bold text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Descrição</label>
                                <textarea
                                    value={newAd.description}
                                    onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                                    placeholder="Detalhes da oferta..."
                                    rows={3}
                                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">URL da Imagem</label>
                                <div className="relative">
                                    <ImageIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        value={newAd.imageUrl}
                                        onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full mt-1 pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Link de Destino (Opcional)</label>
                                <div className="relative">
                                    <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        value={newAd.link}
                                        onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
                                        placeholder="/market ou https://..."
                                        className="w-full mt-1 pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAddAd}
                                className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold mt-2 shadow-lg shadow-pink-200 hover:bg-pink-700 transition-colors"
                            >
                                Criar Anúncio
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full text-gray-400 font-bold text-sm py-2"
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
