import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, User, MoreVertical, CheckCircle, XCircle, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Agenda: React.FC = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('Hoje');

    // Mock Calendar Days
    const days = [
        { label: 'Hoje', date: '15' },
        { label: 'Amanhã', date: '16' },
        { label: 'Qua', date: '17' },
        { label: 'Qui', date: '18' },
        { label: 'Sex', date: '19' },
        { label: 'Sáb', date: '20' },
        { label: 'Dom', date: '21' },
    ];

    // Mock Appointments
    const appointments = [
        {
            id: 1,
            time: '09:00',
            client: 'Ricardo Oliveira',
            service: 'Instalação Elétrica',
            address: 'Bloco A, Ap 402',
            status: 'Agendado',
            price: 150.00
        },
        {
            id: 2,
            time: '11:00',
            client: 'Maria F.',
            service: 'Reparo Hidráulico',
            address: 'Bloco C, Ap 101',
            status: 'Pendente',
            price: 80.00
        },
        {
            id: 3,
            time: '14:00',
            status: 'Livre',
            duration: '1h'
        },
        {
            id: 4,
            time: '15:30',
            client: 'Ana Clara',
            service: 'Montagem de Móveis',
            address: 'Bloco B, Ap 205',
            status: 'Concluído',
            price: 200.00
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-20 border-b border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Minha Agenda</h1>
                    <button className="p-2 -mr-2 hover:bg-gray-100 rounded-full text-primary-600">
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

                {appointments.map((apt) => (
                    <div key={apt.id} className="flex gap-4">
                        {/* Time Column */}
                        <div className="flex flex-col items-center pt-2 min-w-[50px]">
                            <span className="font-bold text-gray-900">{apt.time}</span>
                            <div className="h-full w-0.5 bg-gray-200 mt-2 rounded-full"></div>
                        </div>

                        {/* Card */}
                        <div className={`flex-1 rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden ${apt.status === 'Livre' ? 'bg-gray-100 border-dashed border-gray-300' : 'bg-white'
                            }`}>
                            {apt.status === 'Livre' ? (
                                <div className="flex justify-between items-center h-full">
                                    <span className="text-gray-400 font-medium text-sm">Horário Livre ({apt.duration})</span>
                                    <button className="text-primary-600 font-bold text-xs bg-white px-3 py-1.5 rounded-lg shadow-sm">
                                        + Bloquear
                                    </button>
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
                                        <button className="text-gray-400 hover:text-gray-600">
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
                                        <button className="flex-1 bg-primary-50 text-primary-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-primary-100 transition-colors">
                                            <MessageSquare size={14} />
                                            Chat
                                        </button>
                                        <button className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
                                            Detalhes
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Agenda;
