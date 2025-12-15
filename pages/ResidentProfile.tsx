import React from 'react';
import { ArrowLeft, User, MapPin, Heart, Settings, LogOut, ChevronRight, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResidentProfile: React.FC = () => {
    const navigate = useNavigate();
    const name = localStorage.getItem('user_name') || 'Morador';
    const condo = localStorage.getItem('user_condo') || 'Condomínio Jardins do Sol';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Header */}
            <div className="bg-[#7c3aed] pt-12 pb-24 px-6 rounded-b-[2.5rem] relative">
                <div className="flex justify-between items-center mb-6 text-white">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="font-bold text-lg">Meu Perfil</h1>
                    <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <Settings size={24} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white p-1 shadow-xl">
                        <img
                            src="https://picsum.photos/200/200"
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover border-2 border-white"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white leading-tight">{name}</h2>
                        <div className="flex items-center text-purple-200 text-sm mt-1">
                            <MapPin size={14} className="mr-1" />
                            {condo}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-12 space-y-6">

                {/* Stats Card */}
                <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100 flex justify-around">
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-gray-900">12</span>
                        <span className="text-xs text-gray-500 font-medium uppercase">Pedidos</span>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-gray-900">5</span>
                        <span className="text-xs text-gray-500 font-medium uppercase">Favoritos</span>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-gray-900">4.9</span>
                        <span className="text-xs text-gray-500 font-medium uppercase">Nota</span>
                    </div>
                </div>

                {/* Menu Options */}
                <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
                    {[
                        { icon: <Heart size={20} />, label: 'Meus Favoritos', color: 'text-pink-500 bg-pink-50' },
                        { icon: <Bell size={20} />, label: 'Notificações', color: 'text-amber-500 bg-amber-50' },
                        { icon: <User size={20} />, label: 'Dados Pessoais', color: 'text-blue-500 bg-blue-50' },
                        { icon: <MapPin size={20} />, label: 'Endereços', color: 'text-green-500 bg-green-50' },
                    ].map((item, i) => (
                        <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                                    {item.icon}
                                </div>
                                <span className="font-bold text-gray-700">{item.label}</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                        </button>
                    ))}
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                >
                    <LogOut size={20} />
                    Sair da Conta
                </button>

                <p className="text-center text-xs text-gray-400 mt-6">Versão 1.0.0 • Morador App</p>
            </div>
        </div>
    );
};

export default ResidentProfile;
