import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, MapPin } from 'lucide-react';
import { UserRole } from '../types';

const RoleSelection: React.FC = () => {
    const navigate = useNavigate();

    const handleSelection = (role: UserRole) => {
        if (role === UserRole.RESIDENT) {
            navigate('/register/resident');
        } else if (role === UserRole.PROFESSIONAL) {
            navigate('/register/professional');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] flex flex-col items-center justify-center p-6 text-white">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-white/20">
                <MapPin size={40} className="text-white drop-shadow-lg" />
            </div>
            <h1 className="text-4xl font-bold mb-3 tracking-tight">Bem-vindo(a)</h1>
            <p className="text-purple-200 mb-12 text-center max-w-xs text-sm leading-relaxed">
                Para começarmos, conte-nos qual é o seu perfil no condomínio.
            </p>

            <div className="grid gap-4 w-full max-w-sm">
                <button
                    onClick={() => handleSelection(UserRole.RESIDENT)}
                    className="bg-white text-[#4c1d95] p-4 rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-xl group"
                >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-[#7c3aed] group-hover:bg-[#7c3aed] group-hover:text-white transition-colors">
                        <User size={24} />
                    </div>
                    <div className="text-left">
                        <span className="block font-bold text-lg">Sou Morador</span>
                        <span className="text-xs text-gray-500">Buscar serviços e produtos</span>
                    </div>
                </button>

                <button
                    onClick={() => handleSelection(UserRole.PROFESSIONAL)}
                    className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-colors"
                >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                        <Briefcase size={24} />
                    </div>
                    <div className="text-left">
                        <span className="block font-bold text-lg">Sou Profissional</span>
                        <span className="text-xs text-purple-200">Oferecer serviços</span>
                    </div>
                </button>


                <div className="mt-8 text-center">
                    <p className="text-xs text-purple-300">Já tem uma conta?</p>
                    <button onClick={() => navigate('/login')} className="text-white font-bold text-sm hover:underline mt-1">Fazer Login</button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
