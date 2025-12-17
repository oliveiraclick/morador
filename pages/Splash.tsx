import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time then check persistence
    const timer = setTimeout(() => {
      const isRegistered = localStorage.getItem('user_registered');
      if (isRegistered === 'true') {
        navigate('/login');
      } else {
        navigate('/role-selection');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#7c3aed] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-600 to-[#7c3aed]"></div>

      <div className="z-10 flex flex-col items-center animate-fade-in-up">
        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 shadow-2xl border border-white/10">
          <Home size={48} className="text-white fill-white" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Morador</h1>
        <p className="text-purple-200 text-sm font-medium">Conectando você ao seu lar</p>
      </div>

      <div className="absolute bottom-12 w-64 z-10">
        <div className="h-1.5 w-full bg-purple-900/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
        </div>
        <p className="text-center text-purple-300 text-[10px] mt-2 font-medium">V1.30</p>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; margin-left: 0; }
          50% { width: 70%; margin-left: 0; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Splash;