import React, { useState } from 'react';
import { ArrowLeft, Send, Users, Bell, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminBroadcast: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState<'all' | 'residents' | 'professionals'>('all');
    const [sent, setSent] = useState(false);

    const handleSend = () => {
        if (!title || !message) return;

        // Create notification object
        const newBroadcast = {
            id: Date.now().toString(),
            title,
            message,
            target,
            timestamp: new Date().toISOString(),
            read: false
        };

        // Save to LocalStorage
        const existing = localStorage.getItem('system_broadcasts');
        const broadcasts = existing ? JSON.parse(existing) : [];
        const updated = [newBroadcast, ...broadcasts];

        localStorage.setItem('system_broadcasts', JSON.stringify(updated));

        // Simulation of sending
        setSent(true);
        setTimeout(() => {
            setSent(false);
            setTitle('');
            setMessage('');
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Transmissão</h1>
            </div>

            <div className="p-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Bell size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Nova Mensagem</h2>
                            <p className="text-xs text-gray-500">Envie notificações para usuários</p>
                        </div>
                    </div>

                    {sent ? (
                        <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-green-900 mb-2">Enviado com Sucesso!</h3>
                            <p className="text-green-700 text-sm">Sua mensagem foi entregue para os destinatários selecionados.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Target Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Destinatários</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setTarget('all')}
                                        className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-colors ${target === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        Todos
                                    </button>
                                    <button
                                        onClick={() => setTarget('residents')}
                                        className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-colors ${target === 'residents' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        Moradores
                                    </button>
                                    <button
                                        onClick={() => setTarget('professionals')}
                                        className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-colors ${target === 'professionals' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        Profissionais
                                    </button>
                                </div>
                            </div>

                            {/* Inputs */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Título</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: Manutenção na Piscina"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Mensagem</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Digite sua mensagem aqui..."
                                    rows={5}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                />
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={!title || !message}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send size={20} /> Enviar Mensagem
                            </button>
                        </div>
                    )}
                </div>

                {/* History (Mock) */}
                <div className="mt-8">
                    <h3 className="font-bold text-gray-900 mb-4 px-2">Histórico Recente</h3>
                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 opacity-60">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-sm font-bold text-gray-900">Aviso: Limpeza da Caixa d'Água</h4>
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Ontem</span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-1">Informamos que amanhã haverá interrupção no fornecimento...</p>
                            <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-indigo-600">
                                <Users size={12} /> Enviado para Todos
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBroadcast;
