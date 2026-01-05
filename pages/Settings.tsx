import React from 'react';
import { ArrowLeft, User, Bell, Shield, CircleHelp, LogOut, ChevronRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_VERSION } from '../lib/constants';
import { supabase } from '../lib/supabase';
import { useGlobal } from '../context/GlobalContext';

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useGlobal();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.clear();
        window.location.href = '/login';
    };

    const handleHardRefresh = async () => {
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                await registration.unregister();
            }
        }
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(key => caches.delete(key)));
        }
        window.location.reload();
    };

    const sections = [
        {
            title: 'Conta e Perfil',
            items: [
                {
                    icon: <User size={20} />,
                    label: 'Meus Dados',
                    action: () => {
                        if (profile?.role === 'professional') {
                            navigate('/professional-profile');
                        } else {
                            navigate('/profile');
                        }
                    }
                },
                { icon: <Shield size={20} />, label: 'Privacidade e Segurança', action: () => { } },
            ]
        },
        {
            title: 'Preferências',
            items: [
                { icon: <Bell size={20} />, label: 'Notificações', action: () => { } },
            ]
        },
        {
            title: 'Suporte',
            items: [
                { icon: <CircleHelp size={20} />, label: 'Ajuda e Suporte', action: () => { } },
                { icon: <RotateCcw size={20} />, label: 'Atualizar Aplicativo (Limpar Cache)', action: handleHardRefresh },
            ]
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} className="text-gray-900" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">Ajustes</h1>
            </div>

            <div className="p-4 space-y-6">
                {sections.map((section, idx) => (
                    <div key={idx}>
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">{section.title}</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {section.items.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={item.action}
                                    className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${i !== section.items.length - 1 ? 'border-b border-gray-50' : ''}`}
                                >
                                    <div className="flex items-center gap-3 text-gray-700">
                                        {item.icon}
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-400" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleLogout}
                    className="w-full bg-white text-red-600 p-4 rounded-2xl shadow-sm border border-red-100 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                >
                    <LogOut size={20} />
                    Sair da Conta
                </button>

                <p className="text-center text-xs text-gray-400">
                    Versão {APP_VERSION}
                </p>
            </div>
        </div>
    );
};

export default Settings;
