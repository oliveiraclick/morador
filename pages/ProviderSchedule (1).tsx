

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

// Types
interface Slot {
  id: string;
  period: 'm1' | 'm2' | 't1' | 't2';
  label: string;
  time: string;
  icon: React.ReactNode;
  status: 'free' | 'booked' | 'blocked' | 'pending';
  source?: 'platform' | 'manual'; // Distinguish source
  client?: {
    name: string;
    avatar?: string;
    service: string;
    address: string;
    phone: string;
  };
}

export const ProviderSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(0); 
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null); // For Management Modal
  const [manualSlotId, setManualSlotId] = useState<string | null>(null); // For Manual Add Modal
  
  // Manual Form State
  const [manualForm, setManualForm] = useState({ name: '', service: '', address: '' });

  // Mock Data Generators
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d.getDate(),
      day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      fullDate: d,
      isToday: i === 0
    };
  });

  const handleBack = () => {
    navigate('/dashboard', { state: { role: 'provider' } });
  };

  const PERIOD_CONFIG = [
    { id: 'm1', label: 'Manhã I', time: '07:00 - 09:00', icon: <span className="text-2xl">🌅</span> },
    { id: 'm2', label: 'Manhã II', time: '09:01 - 12:00', icon: <span className="text-2xl">☀️</span> },
    { id: 't1', label: 'Tarde I', time: '13:00 - 15:00', icon: <span className="text-2xl">🌤️</span> },
    { id: 't2', label: 'Tarde II', time: '15:01 - 18:00', icon: <span className="text-2xl">🌙</span> },
  ];

  // Mock Appointments
  const [slots, setSlots] = useState<Slot[]>([
    { 
      id: 'm1', period: 'm1', label: 'Manhã I', time: '07:00 - 09:00', icon: <span className="text-2xl">🌅</span>, 
      status: 'pending', 
      source: 'platform',
      client: { name: 'João da Silva', avatar: 'https://i.pravatar.cc/100?u=joao', service: 'Orçamento Elétrica', address: 'Bl. A - 101', phone: '5511999999999' }
    },
    { 
      id: 'm2', period: 'm2', label: 'Manhã II', time: '09:01 - 12:00', icon: <span className="text-2xl">☀️</span>, 
      status: 'booked',
      source: 'platform',
      client: { name: 'Ana Souza', avatar: 'https://i.pravatar.cc/100?u=ana', service: 'Limpeza Pesada', address: 'Bl. C - 302', phone: '5511988888888' }
    },
    { 
      id: 't1', period: 't1', label: 'Tarde I', time: '13:00 - 15:00', icon: <span className="text-2xl">🌤️</span>, 
      status: 'free',
    },
    { 
      id: 't2', period: 't2', label: 'Tarde II', time: '15:01 - 18:00', icon: <span className="text-2xl">🌙</span>, 
      status: 'free', // Changed from blocked to free for demo
    },
  ]);

  const handleSlotClick = (configId: string) => {
    const slot = slots.find(s => s.id === configId);
    
    // Se tiver agendamento (pendente ou confirmado), abre modal de gestão
    if (slot && (slot.status === 'booked' || slot.status === 'pending')) {
      setSelectedSlot(slot);
      return;
    }

    // Se estiver livre, abre modal de Adição Manual
    setManualSlotId(configId);
    setManualForm({ name: '', service: '', address: '' });
  };

  const handleSaveManual = () => {
    if (!manualSlotId) return;
    
    setSlots(prev => prev.map(s => {
      if (s.id === manualSlotId) {
        return {
          ...s,
          status: 'booked',
          source: 'manual',
          client: {
            name: manualForm.name || 'Cliente Externo',
            service: manualForm.service || 'Serviço Diverso',
            address: manualForm.address || 'Externo',
            avatar: `https://ui-avatars.com/api/?name=${manualForm.name}&background=random`,
            phone: ''
          }
        };
      }
      return s;
    }));
    setManualSlotId(null);
  };

  const handleConfirm = () => {
    if (!selectedSlot) return;
    setSlots(prev => prev.map(s => s.id === selectedSlot.id ? { ...s, status: 'booked' } : s));
    setSelectedSlot(null);
  };

  const handleNegotiate = () => {
    if (!selectedSlot?.client) return;
    const msg = `Olá ${selectedSlot.client.name}, vi seu pedido de agendamento para ${selectedSlot.label}. Podemos confirmar ou prefere outro horário?`;
    window.open(`https://wa.me/${selectedSlot.client.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleReschedule = () => {
    alert("Simulação: O agendamento foi movido.");
    setSlots(prev => prev.map(s => s.id === selectedSlot?.id ? { ...s, status: 'free', client: undefined, source: undefined } : s));
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* Header */}
      <div className="bg-slate-900 pb-8 pt-6 px-6 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/20 rounded-full blur-[80px]"></div>

        <div className="relative z-10 flex items-center justify-between mb-8">
           <button onClick={handleBack} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
             <ArrowLeft size={20} />
           </button>
           <h1 className="text-xl font-bold text-white">Minha Agenda</h1>
           <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
             <span className="text-xl">...</span>
           </button>
        </div>

        {/* Date Strip */}
        <div className="relative z-10 overflow-x-auto scrollbar-hide flex gap-3 pb-2 -mr-6 pr-6">
          {days.map((d, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(index)}
              className={`flex flex-col items-center min-w-[64px] p-3 rounded-[20px] transition-all duration-300 border border-transparent ${
                selectedDate === index 
                  ? 'bg-gradient-to-b from-fuchsia-500 to-violet-600 text-white shadow-glow transform scale-105' 
                  : 'bg-white/10 text-slate-400 hover:bg-white/20'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">{d.day}</span>
              <span className="text-2xl font-black">{d.date}</span>
              {d.isToday && <span className="w-1 h-1 bg-white rounded-full mt-1"></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Helper Text */}
      <div className="px-6 mt-6 bg-violet-50 p-4 mx-6 rounded-2xl border border-violet-100 flex gap-3 items-start">
         <span className="text-violet-500 shrink-0 mt-0.5 text-lg">💡</span>
         <p className="text-xs text-violet-700 font-medium leading-relaxed">
            Use esta agenda para controlar todos os seus atendimentos. Agendamentos da plataforma entram automaticamente, mas você pode adicionar clientes externos manualmente.
         </p>
      </div>

      {/* Title */}
      <div className="px-6 mt-6 mb-4 flex justify-between items-end">
         <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Visão do Dia</p>
            <h2 className="text-2xl font-black text-slate-800">
              {days[selectedDate].date} de {days[selectedDate].fullDate.toLocaleString('pt-BR', { month: 'long' })}
            </h2>
         </div>
      </div>

      {/* Periods Grid */}
      <div className="px-6 space-y-4 animate-slide-up">
        {PERIOD_CONFIG.map((config, idx) => {
           const slot = slots.find(s => s.id === config.id) || { ...config, status: 'free' };
           const isManual = (slot as any).source === 'manual';
           
           return (
             <div key={config.id} className="relative group">
               {idx !== PERIOD_CONFIG.length - 1 && (
                  <div className="absolute left-[26px] top-12 bottom-[-16px] w-0.5 bg-slate-100 z-0"></div>
               )}

               <div className="flex gap-4 items-stretch">
                  <div className="w-[52px] flex flex-col items-center pt-2 relative z-10">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm border mb-1 transition-colors ${
                       slot.status === 'booked' ? 'bg-violet-100 border-violet-200 text-violet-600' : 
                       slot.status === 'pending' ? 'bg-orange-100 border-orange-200 text-orange-500' :
                       'bg-white border-slate-200 text-slate-300'
                     }`}>
                        {config.icon}
                     </div>
                  </div>

                  <div className="flex-1">
                     <div 
                       onClick={() => handleSlotClick(config.id)}
                       className={`rounded-[28px] p-5 border-2 transition-all cursor-pointer active:scale-[0.98] ${
                         slot.status === 'booked' || slot.status === 'pending' ? 'bg-white border-transparent shadow-soft' :
                         'bg-slate-50 border-dashed border-slate-200 hover:bg-white hover:border-violet-300 group/empty'
                       }`}
                     >
                        <div className="flex justify-between items-start mb-2">
                           <span className={`text-xs font-black uppercase tracking-wider ${
                             slot.status === 'booked' ? 'text-violet-600' : slot.status === 'pending' ? 'text-orange-500' : 'text-slate-400'
                           }`}>
                             {config.label}
                           </span>
                           <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                             {config.time}
                           </span>
                        </div>

                        {(slot.status === 'booked' || slot.status === 'pending') && (slot as any).client ? (
                          <div className="flex items-center gap-3 mt-3">
                             <img src={(slot as any).client.avatar} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
                             <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-slate-800 leading-tight">{(slot as any).client.name}</h3>
                                  {isManual && <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">Manual</span>}
                                </div>
                                <p className="text-xs text-slate-500 font-medium">{(slot as any).client.service} • {(slot as any).client.address}</p>
                             </div>
                             {slot.status === 'pending' && (
                                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center animate-pulse shadow-lg shadow-orange-500/30">
                                   <span className="text-lg">🕒</span>
                                </div>
                             )}
                          </div>
                        ) : (
                          <div className="h-10 flex items-center justify-center w-full gap-2 text-slate-400 group-hover/empty:text-violet-600 transition-colors">
                             <span className="text-xl">+</span>
                             <span className="font-bold text-sm">Adicionar Agendamento</span>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
             </div>
           );
        })}
      </div>

      {/* Manual Add Modal */}
      {manualSlotId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
           <div className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900">Novo Agendamento</h3>
                <button onClick={() => setManualSlotId(null)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100"><span className="text-xl">×</span></button>
              </div>
              
              <div className="space-y-4">
                 <Input 
                   label="Nome do Cliente" 
                   placeholder="Ex: Maria Oliveira" 
                   icon={<span className="text-lg">👤</span>}
                   value={manualForm.name}
                   onChange={e => setManualForm({...manualForm, name: e.target.value})}
                 />
                 <Input 
                   label="Serviço" 
                   placeholder="Ex: Faxina Completa" 
                   value={manualForm.service}
                   onChange={e => setManualForm({...manualForm, service: e.target.value})}
                 />
                 <Input 
                   label="Local (Opcional)" 
                   placeholder="Ex: Rua das Flores, 123" 
                   icon={<span className="text-lg">📍</span>}
                   value={manualForm.address}
                   onChange={e => setManualForm({...manualForm, address: e.target.value})}
                 />

                 <Button fullWidth onClick={handleSaveManual}>
                    Salvar na Agenda
                 </Button>
              </div>
           </div>
        </div>
      )}

      {/* Appointment Management Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
           <div className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl animate-slide-up">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block ${selectedSlot.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-violet-100 text-violet-600'}`}>
                       {selectedSlot.source === 'manual' ? 'Agendamento Manual' : selectedSlot.status === 'pending' ? 'Solicitação Pendente' : 'Agendamento Confirmado'}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">
                       {selectedSlot.period.toUpperCase()} • {selectedSlot.client?.service}
                    </h2>
                 </div>
                 <button onClick={() => setSelectedSlot(null)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100">
                    <span className="text-xl">×</span>
                 </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-8 flex items-center gap-4 border border-slate-100">
                 <img src={selectedSlot.client?.avatar} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" alt="" />
                 <div>
                    <h3 className="font-bold text-slate-800 text-lg">{selectedSlot.client?.name}</h3>
                    <p className="text-sm text-slate-500">{selectedSlot.client?.address}</p>
                 </div>
              </div>

              <div className="space-y-3">
                 {selectedSlot.status === 'pending' && (
                    <Button fullWidth onClick={handleConfirm} className="!bg-green-500 hover:!bg-green-600 shadow-lg shadow-green-500/30">
                       <span className="text-lg">✅</span> Confirmar Atendimento
                    </Button>
                 )}
                 
                 {selectedSlot.source !== 'manual' && (
                    <Button fullWidth variant="secondary" onClick={handleNegotiate}>
                       <span className="text-lg">💬</span> Negociar no WhatsApp
                    </Button>
                 )}

                 <Button fullWidth variant="ghost" onClick={handleReschedule}>
                    <span className="text-lg">🗓️</span> Ajustar Data e Horário
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};