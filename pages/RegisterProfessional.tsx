import React, { useState } from 'react';
import { ArrowLeft, User, Briefcase, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

const RegisterProfessional: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profession, setProfession] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('user_registered', 'true');
        localStorage.setItem('user_role', UserRole.PROFESSIONAL);
        localStorage.setItem('user_name', name);

        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white p-4 flex items-center shadow-sm">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h1 className="flex-1 text-center font-bold text-lg text-gray-900 mr-8">Cadastro Profissional</h1>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-center max-w-md mx-auto w-full">
                <div className="mb-8 text-center">
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                        <Briefcase size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Ofereça seus serviços</h2>
                    <p className="text-gray-500 text-sm">Conecte-se com clientes no condomínio</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nome Completo</label>
                        <div className="relative">
                            <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:outline-none" placeholder="Seu nome ou da empresa" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Profissão / Serviço</label>
                        <div className="relative">
                            <Briefcase size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="text" value={profession} onChange={e => setProfession(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:outline-none" placeholder="Ex: Eletricista, Manicure..." />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                        <div className="relative">
                            <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:outline-none" placeholder="seu@email.com" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Senha</label>
                        <div className="relative">
                            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:outline-none" placeholder="******" />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-[#0d9488] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-teal-200 hover:opacity-90 transition-opacity mt-6">
                        Criar Perfil Profissional
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterProfessional;
