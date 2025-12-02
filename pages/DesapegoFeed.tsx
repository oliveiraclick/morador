import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MessageCircle, MapPin, Search } from 'lucide-react';
import { MOCK_DESAPEGO_ITEMS } from '../types';
import { Button } from '../components/Button';

export const DesapegoFeed: React.FC = () => {
    const navigate = useNavigate();
    // CORRIGIDO: 'setItems' foi removido para resolver o erro TS6133
    const [items] = useState(MOCK_DESAPEGO_ITEMS);

    const handleBack = () => {
        navigate('/dashboard', { state: { role: 'resident' } });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-32">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBack}
                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Desapego</h1>
                </div>
                <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100">
                    <Search size={20} />
                </button>
            </div>

            {/* Floating Action Button for New Post */}
            <div className="fixed bottom-32 right-6 z-40">
                <button
                    onClick={() => navigate('/desapego/new')}
                    className="w-16 h-16 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-full shadow-glow text-white flex items-center justify-center active:scale-90 transition-transform hover:-translate-y-1"
                >
                    <Plus size={32} />
                </button>
            </div>

            {/* Feed */}
            <div className="p-6 space-y-8 animate-slide-up">
                {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-[32px] overflow-hidden shadow-soft border border-slate-50 group">

                        {/* Header: Seller Info */}
                        <div className="px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={item.sellerAvatar} alt={item.sellerName} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">{item.sellerName}</h3>
                                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                        <MapPin size={10} />
                                        <span>{item.sellerAddress}</span>
                                        <span>•</span>
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Item Content */}
                        <div className="px-5 pb-5">
                            <h2 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h2>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">{item.description}</p>

                            {/* Images */}
                            {item.images.length > 0 && (
                                <div className="mb-4 overflow-hidden rounded-2xl border border-slate-100">
                                    <img src={item.images[0]} alt={item.title} className="w-full h-64 object-cover" />
                                </div>
                            )}

                            {/* Footer: Price & Action */}
                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Valor</span>
                                    <div className="text-2xl font-black text-slate-900">
                                        R$ {item.price.toFixed(2).replace('.', ',')}
                                    </div>
                                </div>
                                <Button className="rounded-full px-6 h-12 shadow-lg shadow-violet-200">
                                    <MessageCircle size={18} className="mr-2" />
                                    Tenho Interesse
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};