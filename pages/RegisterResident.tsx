import React, { useState } from 'react';
import { ArrowLeft, User, MapPin, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

const RegisterResident: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [apt, setApt] = useState('');
    const [block, setBlock] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate registration
        localStorage.setItem('user_registered', 'true');
        localStorage.setItem('user_role', UserRole.RESIDENT);
        localStorage.setItem('user_name', name);
        // Ideally use Context or Redux to update state immediately, 
        // but for now we rely on a full reload or just navigation where checks happen

        // Force a small delay to simulate API
        setTimeout(() => {
            window.location.href = '/home'; // Using window.location to force state refresh if needed, or just navigate
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white p-4 flex items-center shadow-sm">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h1 className="flex-1 text-center font-bold text-lg text-gray-900 mr-8">Cadastro de Morador</h1>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-center max-w-md mx-auto w-full">
                <div className="mb-8 text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                        <User size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Crie sua conta</h2>
                    <p className="text-gray-500 text-sm">Junte-se ao seu condomínio digital</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nome Completo</label>
                        <div className="relative">
                            <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none" placeholder="Seu nome" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Bloco</label>
                            <div className="relative">
                                <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input required type="text" value={block} onChange={e => setBlock(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none" placeholder="Ex: A" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Apartamento</label>
                            <div className="relative">
                                <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input required type="text" value={apt} onChange={e => setApt(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none" placeholder="Ex: 101" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                        <div className="relative">
                            <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none" placeholder="seu@email.com" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Senha</label>
                        <div className="relative">
                            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none" placeholder="******" />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-[#7c3aed] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 hover:opacity-90 transition-opacity mt-6">
                        Cadastrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterResident;
