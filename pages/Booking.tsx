import React, { useState } from 'react';
import { ArrowLeft, Star, Calendar, Sun, Moon, Check, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(5);
  const [selectedPeriod, setSelectedPeriod] = useState('Manhã');

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg text-gray-900 mr-8">Agendar Serviço</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Service Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg mb-2">Serviço Selecionado</span>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Faxina Completa – 2 Quartos</h2>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Star size={14} className="text-amber-400 fill-amber-400 mr-1" />
            <span className="font-medium mr-1">4.9</span>
            <span>(120 avaliações)</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">A partir de <span className="text-primary-600 font-bold text-base">R$ 120,00</span></p>

          <div className="h-40 rounded-xl overflow-hidden bg-gray-200">
            <img src="https://picsum.photos/600/300" className="w-full h-full object-cover" alt="Cleaning Room" />
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg">Escolha a Data</h3>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <button className="p-1 hover:bg-gray-100 rounded"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg></button>
              <span className="font-bold text-gray-900">Dezembro 2023</span>
              <button className="p-1 hover:bg-gray-100 rounded"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg></button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <span key={i} className="text-xs text-gray-400 font-medium">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-y-2 gap-x-1 place-items-center">
              <span className="text-sm text-gray-300">29</span>
              <span className="text-sm text-gray-300">30</span>
              <span className="text-sm text-gray-300">31</span>
              <span className="text-sm text-gray-600 font-medium">1</span>
              <span className="text-sm text-gray-600 font-medium">2</span>
              <span className="text-sm text-gray-600 font-medium">3</span>
              <span className="text-sm text-gray-600 font-medium">4</span>

              {[5, 6, 7, 8, 9, 10, 11].map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${d === 10 ? 'text-gray-300 line-through cursor-not-allowed' :
                      selectedDate === d ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Period */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg">Período</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setSelectedPeriod('Manhã')} className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${selectedPeriod === 'Manhã' ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-white border-transparent text-gray-600'}`}>
              <Sun size={28} />
              <div className="text-center">
                <span className="block font-bold">Manhã</span>
                <span className={`text-[10px] ${selectedPeriod === 'Manhã' ? 'text-primary-100' : 'text-gray-400'}`}>08:00 - 12:00</span>
              </div>
            </button>
            <button onClick={() => setSelectedPeriod('Tarde')} className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${selectedPeriod === 'Tarde' ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-white border-transparent text-gray-600'}`}>
              <div className="relative">
                <Sun size={18} className="absolute -top-1 -left-3 opacity-50" />
                <div className="w-8 h-1 bg-current rounded-full mt-4"></div>
              </div>
              <div className="text-center mt-1">
                <span className="block font-bold">Tarde</span>
                <span className={`text-[10px] ${selectedPeriod === 'Tarde' ? 'text-primary-100' : 'text-gray-400'}`}>13:00 - 18:00</span>
              </div>
            </button>
          </div>
        </div>

        {/* Add-ons */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg">Turbine seu pedido</h3>
          <div className="space-y-3">
            <label className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 cursor-pointer">
              <img src="https://picsum.photos/80/80" className="w-14 h-14 rounded-lg object-cover" alt="Iron" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-sm">Passar Roupa</h4>
                <p className="text-xs text-gray-500">Até 20 peças</p>
                <span className="text-primary-600 font-bold text-sm">+ R$ 50,00</span>
              </div>
              <div className="w-6 h-6 rounded border-2 border-gray-200 flex items-center justify-center">
                <input type="checkbox" className="hidden peer" />
                <div className="w-full h-full bg-primary-600 hidden peer-checked:block"></div>
              </div>
            </label>
            <label className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 cursor-pointer">
              <img src="https://picsum.photos/81/81" className="w-14 h-14 rounded-lg object-cover" alt="Fridge" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-sm">Limpeza de Geladeira</h4>
                <p className="text-xs text-gray-500">Interior completo</p>
                <span className="text-primary-600 font-bold text-sm">+ R$ 30,00</span>
              </div>
              <div className="w-6 h-6 rounded border-2 border-gray-200 flex items-center justify-center">
                <input type="checkbox" className="hidden peer" />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Footer Total */}
      <div className="bg-white p-4 border-t border-gray-100 sticky bottom-0 safe-pb">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-xs text-gray-500 block">Valor Total</span>
            <span className="text-2xl font-bold text-gray-900">R$ 120,00</span>
          </div>
          <button onClick={() => { alert("Agendamento Confirmado!"); navigate('/home'); }} className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;