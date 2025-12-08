

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  icon: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-100 to-fuchsia-100 flex items-center justify-center text-4xl mb-6 animate-float">
        {icon}
      </div>

      <h1 className="text-3xl font-black text-slate-800 mb-2">{title}</h1>
      <p className="text-slate-400 font-bold max-w-xs mx-auto">Esta funcionalidade estará disponível na próxima atualização do MORADOR.</p>
    </div>
  );
};