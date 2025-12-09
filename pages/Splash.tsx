import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-slate-900 p-8 relative overflow-hidden">

      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-violet-600 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-600 rounded-full blur-[100px] opacity-30 animate-pulse delay-1000"></div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full animate-fade-in">
        <div className="w-60 h-60 flex items-center justify-center mb-8">
          <img src="/white-logo.png" alt="MORADOR Logo" className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(139,92,246,0.6)]" />
        </div>
        <div className="mt-4 px-3 py-1 bg-white/20 rounded-full text-[9px] font-bold text-slate-300">v4.1 - ATUALIZADO AGORA</div>
      </div>

      <div className="w-full z-10 pb-10">
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-1/3 animate-[slideUp_2s_ease-in-out_infinite]"></div>
        </div>
        <p className="text-center text-white/40 text-[10px] font-bold mt-4 uppercase tracking-widest">Iniciando Experiência...</p>
      </div>
    </div>
  );
};