import React, { useState } from 'react';
import { ArrowLeft, Star, ThumbsUp, Medal, MessageSquare, CheckCircle2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Reviews: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'received' | 'pending'>('received');
    const [showRateModal, setShowRateModal] = useState(false);
    const [selectedService, setSelectedService] = useState<any>(null);

    // Mock Data: Reviews Received (My Reputation)
    const receivedReviews = [
        { id: 1, author: 'Maria Silva', unit: 'Apt 302', rating: 5, date: '12/Dez', text: 'Profissional excelente! Chegou no horário e resolveu o problema da pia rapidinho. Muito educado.', tags: ['Pontual', 'Educado', 'Rápido'] },
        { id: 2, author: 'João Souza', unit: 'Bloco C', rating: 5, date: '10/Dez', text: 'Serviço impecável. Deixou tudo limpo depois.', tags: ['Limpeza', 'Profissional'] },
        { id: 3, author: 'Ana Clara', unit: 'Apt 104', rating: 4, date: '05/Dez', text: 'Bom serviço, mas demorou um pouco para responder no chat.', tags: ['Técnico Bom'] },
    ];

    // Mock Data: Pending Reviews (To Rate)
    const pendingReviews = [
        { id: 101, target: 'Roberto Martins', service: 'Instalação Ventilador', date: 'Hoje, 10:00', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
        { id: 102, target: 'Carla Dias', service: 'Reparo Tomada', date: 'Ontem', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    ];

    const [rating, setRating] = useState(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleOpenRate = (service: any) => {
        setSelectedService(service);
        setRating(0);
        setSelectedTags([]);
        setShowRateModal(true);
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmitReview = () => {
        if (rating === 0) {
            alert('Por favor, selecione uma nota!');
            return;
        }
        // Logic to save review would go here
        console.log({ service: selectedService, rating, tags: selectedTags });
        setShowRateModal(false);
        // Remove from pending list (simulation)
        alert('Avaliação enviada com sucesso!');
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Avaliações</h1>
            </div>

            {/* Tabs */}
            <div className="px-6 mt-4">
                <div className="bg-white p-1 rounded-xl flex shadow-sm border border-gray-100">
                    <button
                        onClick={() => setActiveTab('received')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'received' ? 'bg-purple-100 text-purple-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Minha Reputação
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'pending' ? 'bg-purple-100 text-purple-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Pendentes
                        {pendingReviews.length > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingReviews.length}</span>}
                    </button>
                </div>
            </div>

            <div className="p-6">

                {/* Received Reviews List */}
                {activeTab === 'received' && (
                    <div className="space-y-4">
                        {/* Summary Card */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-purple-200 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Nota Geral</p>
                                    <div className="flex items-end gap-2">
                                        <span className="text-4xl font-bold">4.9</span>
                                        <div className="flex mb-1 text-yellow-400">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <Medal size={24} className="text-yellow-300" />
                                </div>
                            </div>
                            <p className="text-xs text-purple-200 mt-2">Baseado em 42 avaliações nos últimos 3 meses.</p>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-2">Comentários Recentes</h3>
                        {receivedReviews.map(review => (
                            <div key={review.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                            <User size={14} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">{review.author}</h4>
                                            <span className="text-xs text-gray-400">{review.unit} • {review.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed mb-3">"{review.text}"</p>
                                <div className="flex gap-2">
                                    {review.tags.map((tag, i) => (
                                        <span key={i} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100 font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pending Reviews List */}
                {activeTab === 'pending' && (
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
                            <MessageSquare size={20} className="text-blue-500 mt-0.5" />
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Avaliar seus clientes ajuda a comunidade a saber quem são os bons moradores!
                            </p>
                        </div>

                        {pendingReviews.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <img src={item.avatar} alt="User" className="w-12 h-12 rounded-full object-cover" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">{item.target}</h4>
                                    <p className="text-xs text-gray-500">{item.service}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{item.date}</p>
                                </div>
                                <button
                                    onClick={() => handleOpenRate(item)}
                                    className="bg-primary-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200"
                                >
                                    Avaliar
                                </button>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Rate Modal */}
            {showRateModal && selectedService && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
                    <div className="bg-white w-full sm:w-[400px] rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom-10 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Avaliar Morador</h3>
                            <button onClick={() => setShowRateModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                                <CheckCircle2 size={24} />
                            </button>
                        </div>

                        <div className="text-center mb-8">
                            <img src={selectedService.avatar} className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-white shadow-lg" />
                            <h4 className="font-bold text-xl text-gray-900">{selectedService.target}</h4>
                            <p className="text-sm text-gray-500">Como foi trabalhar no local?</p>
                        </div>

                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1 hover:scale-110 transition-transform"
                                >
                                    <Star
                                        size={32}
                                        className={`${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} transition-colors duration-200`}
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3 mb-8">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Pontos Positivos</label>
                            <div className="flex flex-wrap gap-2">
                                {['Ambiente Limpo', 'Educado', 'Pagamento Rápido', 'Fácil Acesso'].map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${selectedTags.includes(tag) ? 'bg-green-50 text-green-600 border-green-200 ring-2 ring-green-100' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmitReview}
                            className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-primary-200 hover:opacity-90 transition-opacity"
                        >
                            Enviar Avaliação
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;
