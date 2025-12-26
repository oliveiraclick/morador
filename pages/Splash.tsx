import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { APP_VERSION } from '../lib/constants';
import { supabase, getAppLogoUrl } from '../lib/supabase';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);

  useEffect(() => {
    // Priority 1: New logo copied to public
    // Priority 2: Dynamic logo from Supabase
    setLogoUrl('/new-logo.png');

    const timer = setTimeout(() => {
      const isRegistered = localStorage.getItem('user_registered');
      if (isRegistered === 'true') {
        navigate('/login');
      } else {
        navigate('/role-selection');
      }
    }, 5500); // Increased display time as requested

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#7c3aed] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#bef264]/5 rounded-full blur-[120px] animate-pulse-slow"></div>

      {/* Centralized Logo Container */}
      <div className="relative z-10 flex flex-col items-center justify-center scale-125">
        <div className="animate-float">
          {logoUrl ? (
            <div className="w-48 h-48 flex items-center justify-center mb-4 transition-all duration-1000 animate-in zoom-in-50 fade-in duration-1000">
              <img
                src={logoUrl}
                alt="Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(190,242,100,0.3)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  setLogoUrl(null);
                }}
              />
            </div>
          ) : (
            <div className="w-32 h-32 bg-white/5 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center mb-4 shadow-2xl border border-white/10 rotate-3">
              <Home size={64} className="text-[#bef264]" />
            </div>
          )}
        </div>

        {/* Brand Text Branding (Optional/Contextual) */}
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-500 text-center">
          <h1 className="text-3xl font-black text-white tracking-tighter italic">MORADOR</h1>
          <p className="text-[#bef264] text-xs font-bold tracking-[0.2em] uppercase mt-1 drop-shadow-sm">Clicou, achou.</p>
          <div className="h-1 w-12 bg-[#bef264] mx-auto mt-2 rounded-full shadow-[0_0_10px_#bef264]"></div>
        </div>
      </div>

      {/* Progress Bar & Version at the Bottom */}
      <div className="fixed bottom-16 w-48 flex flex-col items-center gap-4 z-10">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 backdrop-blur-md">
          <div className="h-full bg-[#bef264] rounded-full animate-progress-glow shadow-[0_0_15px_#bef264]"></div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-[#bef264]/60 text-[8px] font-black tracking-[0.3em] uppercase mb-1">Iniciando Experiência</p>
          <p className="text-white/20 text-[10px] font-mono">
            V{APP_VERSION}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes progress-glow {
          0% { width: 0%; margin-left: 0; }
          50% { width: 80%; margin-left: 0; }
          100% { width: 0%; margin-left: 100%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Splash;