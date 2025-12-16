import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Clock, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'NEGOCIACOES' | 'SERVICOS'>('NEGOCIACOES');

    // State for items
    const [negotiations, setNegotiations] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load negotiations from localStorage (Keep as is for now, or move to DB if time permits)
        const stored = localStorage.getItem('active_negotiations');
        if (stored) {
            setNegotiations(JSON.parse(stored));
        }

        // Fetch Real Services (Appointments)
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await import('../lib/supabase').then(m => m.supabase.auth.getUser());
            if (!user) return;

            // Fetch appointments for the current user (Client side)
            const { data } = await import('../lib/supabase').then(m => m.supabase
                .from('appointments')
                .select('*')
                // Note: In a real scenario, filter by resident_id = user.id
                .order('date', { ascending: true })
            );

            if (data) {
                const formatted = data.map(apt => ({
                    id: apt.id,
                    title: apt.service_title,
                    provider: 'Prestador',
                    date: new Date(apt.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) + ' ' + (new Date(apt.date).getFullYear()),
                    time: apt.start_time.substring(0, 5),
                    status: apt.status === 'AGENDADO' ? 'Agendado' : apt.status,
                    price: 0,
                }));
                setServices(formatted);
            }

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-20 border-b border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Minha Sacolinha</h1>
                    <div className="w-10"></div>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('NEGOCIACOES')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'NEGOCIACOES' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Negociações
                    </button>
                    <button
                        onClick={() => setActiveTab('SERVICOS')}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'SERVICOS' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Serviços
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {activeTab === 'NEGOCIACOES' ? (
                    negotiations.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p>Nenhuma negociação em andamento.</p>
                            <button onClick={() => navigate('/market')} className="mt-4 text-[#7c3aed] font-bold text-sm">Explorar Marketplace</button>
                        </div>
                    ) : (
                        negotiations.map(item => (
                            <div key={item.id} onClick={() => navigate('/chat', { state: { seller: item.seller, product: item } })} className="bg-white cursor-pointer hover:bg-gray-50 transition-colors rounded-2xl p-3 flex gap-4 shadow-sm border border-gray-100">
                                <img src={item.image} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                                <div className="flex-1 py-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</h3>
                                        <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full whitespace-nowrap">{item.status}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">Vendedor: {item.seller}</p>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[#7c3aed] font-bold">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                                        <div className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-[#7c3aed]">
                                            <MessageSquare size={14} />
                                            Chat
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                ) : (
                    loading ? (
                        <div className="text-center py-10 text-gray-400">Carregando serviços...</div>
                    ) : services.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p>Nenhum serviço agendado.</p>
                        </div>
                    ) : (
                        services.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">{item.status}</span>
                                </div>

                                <div className="flex gap-4 mb-4">
                                    <div className="text-center bg-gray-50 rounded-xl p-2 min-w-[60px]">
                                        <span className="block text-xl font-bold text-gray-900">{item.date.split(' ')[0]}</span>
                                        <span className="text-[10px] text-gray-500 uppercase">{item.date.split(' ')[1]}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                            <Clock size={14} />
                                            {item.time}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <MapPin size={14} />
                                            Profissional: <span className="font-bold text-gray-700">{item.provider}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => alert('Em breve você verá os detalhes do agendamento aqui!')}
                                    className="w-full py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50"
                                >
                                    Ver Detalhes
                                </button>
                            </div>
                        )))
                )}
            </div>

        </div>
    );
};

export default Orders;
