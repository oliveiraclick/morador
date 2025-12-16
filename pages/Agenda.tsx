import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, User, MoreVertical, CheckCircle, XCircle, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Agenda: React.FC = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('Hoje');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'NEW' | 'BLOCK'>('NEW');

    // Generate next 7 days dynamically
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            label: i === 0 ? 'Hoje' : (i === 1 ? 'Amanhã' : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][d.getDay()]),
            date: d.getDate().toString(),
            fullDate: d.toISOString().split('T')[0] // Store full date for querying
        };
    });

    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<any[]>([]);

    // Form States
    const [time, setTime] = useState('');
    const [clientName, setClientName] = useState('');
    const [serviceTitle, setServiceTitle] = useState('');

    React.useEffect(() => {
        fetchAppointments();
    }, [selectedDate]); // Refetch when date changes (mock logic for now, ideally filter by date)

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await import('../lib/supabase').then(m => m.supabase.auth.getUser());
            if (!user) return;

            // Fetch all for the Pro (In production, filter by 'date' = selectedDate)
            const { data, error } = await import('../lib/supabase').then(m => m.supabase
                .from('appointments')
                .select('*')
                .eq('professional_id', user.id)
                .order('start_time', { ascending: true })
            );

            if (error) throw error;

            // Simple formatting to match UI
            const formatted = (data || []).map(apt => {
                const start = new Date(`1970-01-01T${apt.start_time}`);
                const end = new Date(`1970-01-01T${apt.end_time || apt.start_time}`); // Fallback if end_time missing
                const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                const duration = diff > 0 ? `${diff}h` : '1h';

                return {
                    id: apt.id,
                    time: apt.start_time.substring(0, 5),
                    client: apt.client_name,
                    service: apt.service_title,
                    status: apt.status === 'BLOQUEADO' ? 'Livre' : (apt.status === 'AGENDADO' ? 'Agendado' : apt.status),
                    duration: duration,
                    address: 'No condomínio'
                };
            });
            setAppointments(formatted);

        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenNew = () => {
        setModalMode('NEW');
        setClientName('');
        setServiceTitle('');
        setTime('');
        setShowModal(true);
    };

    const handleOpenBlock = () => {
        setModalMode('BLOCK');
        setClientName('Bloqueio');
        setServiceTitle('Indisponível');
        setTime('');
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!time) {
            alert('Selecione um horário');
            return;
        }

        const { data: { user } } = await import('../lib/supabase').then(m => m.supabase.auth.getUser());
        if (!user) return;

        const isBlock = modalMode === 'BLOCK';

        const payload = {
            professional_id: user.id,
            client_name: isBlock ? 'Bloqueio de Agenda' : clientName,
            service_title: isBlock ? 'Indisponível' : serviceTitle,
            date: new Date().toISOString().split('T')[0], // Using today for simplicity in this demo
            start_time: time,
            status: isBlock ? 'BLOQUEADO' : 'AGENDADO',
            condo_id: (user.user_metadata as any)?.condo_id
        };

        const { error } = await import('../lib/supabase').then(m => m.supabase
            .from('appointments')
            .insert(payload)
        );

        if (error) {
            alert('Erro ao salvar agendamento');
            console.error(error);
        } else {
            alert(isBlock ? 'Horário Bloqueado!' : 'Agendado com sucesso!');
            setShowModal(false);
            fetchAppointments(); // Refresh
            // Reset form
            setTime('');
            setClientName('');
            setServiceTitle('');
        }
    };

    return (
        <div className="bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-20 border-b border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Minha Agenda</h1>
                    <button
                        onClick={handleOpenNew}
                        className="p-2 -mr-2 hover:bg-gray-100 rounded-full text-primary-600"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                {/* Calendar Strip */}
                <div className="flex justify-between items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                    {days.map((day, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedDate(day.label)}
                            className={`flex flex-col items-center min-w-[50px] p-2 rounded-2xl transition-all ${selectedDate === day.label
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                : 'bg-white text-gray-400 border border-gray-100'
                                }`}
                        >
                            <span className="text-[10px] font-medium uppercase mb-1">{day.label}</span>
                            <span className="text-lg font-bold">{day.date}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Compromissos</h2>
                    <span className="text-xs text-gray-500 font-medium">{appointments.length} Total</span>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-400">Carregando agenda...</div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-10 px-6 border-2 border-dashed border-gray-200 rounded-3xl">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">Nenhum compromisso para hoje.</p>
                        <button onClick={handleOpenNew} className="text-primary-600 text-sm font-bold mt-2">Agendar agora</button>
                    </div>
                ) : (
                    appointments.map((apt) => (
                        <div key={apt.id} className="flex gap-4">
                            {/* Time Column */}
                            <div className="flex flex-col items-center pt-2 min-w-[50px]">
                                <span className="font-bold text-gray-900">{apt.time}</span>
                                <div className="h-full w-0.5 bg-gray-200 mt-2 rounded-full"></div>
                            </div>

                            {/* Card */}
                            <div className={`flex-1 rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden ${apt.status === 'Livre' ? 'bg-gray-100 border-dashed border-gray-300 opacity-70' : 'bg-white'
                                }`}>
                                {apt.status === 'Livre' ? (
                                    <div className="flex justify-between items-center h-full">
                                        <span className="text-gray-500 font-bold text-sm">Bloqueado / Livre</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 inline-block ${apt.status === 'Agendado' ? 'bg-blue-100 text-blue-700' :
                                                    apt.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                                <h3 className="font-bold text-gray-900 leading-tight">{apt.service}</h3>
                                            </div>
                                            <button className="text-gray-400 hover:text-red-500 transition-colors" title="Cancelar?">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <User size={14} className="text-gray-400" />
                                                {apt.client}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <MapPin size={14} className="text-gray-400" />
                                                {apt.address}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                                            <button
                                                onClick={() => navigate('/chat')}
                                                className="flex-1 bg-primary-50 text-primary-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-primary-100 transition-colors"
                                            >
                                                <MessageSquare size={14} />
                                                Chat
                                            </button>
                                            <a
                                                href={`https://wa.me/?text=Olá ${apt.client}, sobre nosso agendamento de ${apt.time}`}
                                                target="_blank"
                                                className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
                                            >
                                                WhatsApp
                                            </a>
                                        </div>
                                        <p className="mt-2 text-[10px] text-gray-400 text-center leading-tight">
                                            * O app facilita o encontro, mas a gestão da agenda é responsabilidade do prestador.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    )))}
            </div>

            {/* Action Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 animate-in slide-in-from-bottom-10 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">
                                {modalMode === 'NEW' ? 'Novo Agendamento' : 'Bloquear Horário'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Horário</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            {modalMode === 'NEW' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cliente</label>
                                        <input
                                            type="text"
                                            placeholder="Nome do Cliente"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Serviço</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Manutenção"
                                            value={serviceTitle}
                                            onChange={(e) => setServiceTitle(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </>
                            )}

                            {modalMode === 'BLOCK' && (
                                <div className="p-4 bg-orange-50 text-orange-700 rounded-xl text-sm">
                                    Ao bloquear este horário, você não receberá novos pedidos para ele.
                                </div>
                            )}

                            <button
                                onClick={handleSave}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 mt-4"
                            >
                                <CheckCircle size={20} /> Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Agenda;

