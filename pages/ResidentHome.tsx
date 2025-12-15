import React from 'react';
import { Bell, Search, MapPin, Plus, Calendar, FileText, Key, Megaphone, Heart, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResidentHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-0">
      {/* Header */}
      <div className="bg-white p-6 pb-4 rounded-b-3xl shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="https://picsum.photos/100/100" alt="Profile" className="w-12 h-12 rounded-full border-2 border-primary-100" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <div className="flex items-center text-primary-600 text-sm font-medium">
                <MapPin size={14} className="mr-1" />
                Condomínio Jardins do Sol
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-0.5">
                Bom dia, <span className="text-primary-600">Ricardo!</span> 👋
              </h1>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="p-2.5 bg-white border border-gray-100 shadow-sm rounded-full text-gray-600">
              <Search size={20} />
            </button>
            <button className="p-2.5 bg-white border border-gray-100 shadow-sm rounded-full text-gray-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Categories / Quick Actions */}
        <div className="flex justify-between gap-2 overflow-x-auto no-scrollbar py-2">
          {[
            { name: 'Anunciar', icon: <Plus size={24} />, color: 'bg-primary-50 text-primary-600 border-primary-200', action: () => navigate('/sell') },
            { name: 'Desapego', icon: <ShoppingBagIcon />, color: 'bg-pink-50 text-pink-600 border-pink-200', action: () => navigate('/market') },
            { name: 'Beleza', icon: <SparklesIcon />, color: 'bg-teal-50 text-teal-600 border-teal-200', action: () => navigate('/beauty') },
            { name: 'Comida', icon: <UtensilsIcon />, color: 'bg-orange-50 text-orange-600 border-orange-200', action: () => navigate('/food') },
          ].map((cat, idx) => (
            <button onClick={cat.action} key={idx} className="flex flex-col items-center gap-2 min-w-[72px]">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border ${cat.color} ${idx === 0 ? 'border-dashed border-2' : ''}`}>
                {cat.icon}
              </div>
              <span className="text-xs font-medium text-gray-700">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { name: 'Reservas', icon: <Calendar size={20} />, color: 'text-purple-600 bg-purple-50', action: () => navigate('/booking') },
            { name: 'Boletos', icon: <FileText size={20} />, color: 'text-blue-600 bg-blue-50', action: () => navigate('/slips') },
            { name: 'Portaria', icon: <Key size={20} />, color: 'text-amber-600 bg-amber-50', action: () => navigate('/concierge') },
            { name: 'Avisos', icon: <Megaphone size={20} />, color: 'text-rose-600 bg-rose-50', action: () => navigate('/notices') },
          ].map((item, idx) => (
            <button key={idx} onClick={item.action} className="flex flex-col items-center gap-2">
              <div className={`w-14 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                {item.icon}
              </div>
              <span className="text-[11px] font-medium text-gray-600">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="px-6 mt-6">

        {/* Pro Plan Banner */}
        <div
          onClick={() => navigate('/pro')}
          className="mb-6 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#9333ea] p-4 text-white shadow-lg shadow-purple-200 flex items-center justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 bg-white/20 rounded-lg">
                <Sparkles size={14} className="text-yellow-300" fill="currentColor" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-100">Morador Pro</span>
            </div>
            <h3 className="font-bold text-lg leading-tight">Venda mais no<br />seu condomínio</h3>
          </div>
          <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-purple-600 transition-colors">
            <ChevronRight size={24} />
          </div>
        </div>

        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-gray-900">Destaques</h2>
          <button onClick={() => navigate('/notices')} className="text-sm text-primary-600 font-medium">Ver tudo</button>
        </div>

        {/* Maintenance Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-l-4 border-l-primary-500 border-gray-100 flex gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
            <ToolIcon />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Manutenção</span>
              <span className="text-xs text-gray-400">Hoje, 14:00</span>
            </div>
            <h3 className="font-bold text-gray-900">Manutenção na Piscina</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              A piscina estará fechada para limpeza e tratamento químico até as 18:00.
            </p>
          </div>
        </div>

        {/* Sales Item */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
          <img src="https://picsum.photos/300/300" className="w-24 h-24 rounded-xl object-cover" alt="Bike" />
          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">Venda</span>
              <Heart size={18} className="text-gray-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">Bicicleta Infantil Aro 20</h3>
              <p className="text-xs text-gray-500 mt-0.5">Ótimo estado, pouco uso.</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg font-bold text-primary-700">R$ 200</span>
              <div className="flex items-center text-xs text-gray-500">
                <img src="https://picsum.photos/50/50" className="w-5 h-5 rounded-full mr-1" alt="Seller" />
                Apto 302
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple icon components to save space
const ShoppingBagIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
const SparklesIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"></path></svg>;
const UtensilsIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>;
const ToolIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>;
const CarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>;

export default ResidentHome;