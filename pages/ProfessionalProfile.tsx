import React from 'react';
import { ArrowLeft, Star, Clock, MapPin, Share2, Settings, ShieldCheck, Camera, PenSquare, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

const ProfessionalProfile: React.FC = () => {
    const navigate = useNavigate();
    const { profile, refreshProfile } = useGlobal();

    React.useEffect(() => {
        if (!profile) refreshProfile();
    }, [profile, refreshProfile]);

    const handleLogout = async () => {
        const { supabase } = await import('../lib/supabase');
        await supabase.auth.signOut();
        localStorage.clear();
        window.location.href = '/login';
    };

    if (!profile) return <div className="min-h-screen bg-white flex items-center justify-center">Carregando...</div>;

    return (
        <div className="bg-white pb-24">
            {/* Cover Image */}
            <div className="h-48 relative bg-gray-200">
                <img src="https://images.unsplash.com/photo-1581578731117-104f8a3d3dfa?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Cover" />
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                        <Share2 size={24} />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                        <Settings size={24} />
                    </button>
                </div>
            </div>

            <div className="px-6 relative">
                {/* Profile Avatar */}
                <div className="-mt-16 mb-4 flex justify-between items-end">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl flex items-center justify-center bg-gray-50 overflow-hidden">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} className="w-full h-full rounded-2xl object-cover" alt="Profile" />
                            ) : (
                                <span className="text-4xl font-bold text-gray-300">{profile.full_name?.charAt(0)}</span>
                            )}
                        </div>
                        <button className="absolute bottom-[-10px] right-[-10px] bg-primary-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                            <Camera size={16} />
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
                        <ShieldCheck size={20} className="text-blue-500" fill="currentColor" />
                    </div>
                    <p className="text-gray-500 text-sm mb-3">{profile.profession || 'Profissional'}</p>

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                        <div className="flex items-center gap-1">
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                            <span className="text-gray-900 font-bold">4.9</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {profile.is_on_site ? 'No Condomínio' : 'Indisponível'}
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-2">Sobre</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Especialista em reparos residenciais com mais de 10 anos de experiência. Faço desde troca de lâmpadas até instalações elétricas completas. Atendo com agilidade e limpeza.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100">
                        <span className="block text-2xl font-bold text-primary-700">350+</span>
                        <span className="text-xs text-primary-500 font-bold uppercase">Serviços Realizados</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                        <span className="block text-2xl font-bold text-green-700">98%</span>
                        <span className="text-xs text-green-600 font-bold uppercase">Clientes Satisfeitos</span>
                    </div>
                </div>

                {/* Portfolio Preview */}
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="font-bold text-gray-900">Portfólio Recente</h3>
                        <button className="text-primary-600 text-xs font-bold">Ver tudo</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group">
                                <img src={`https://picsum.photos/300/300?random=${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Work" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-50 text-red-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={20} />
                        Sair da Conta Profissional
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalProfile;
