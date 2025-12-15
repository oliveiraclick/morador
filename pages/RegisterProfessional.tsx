import React, { useState } from 'react';
import { ArrowLeft, User, Briefcase, Lock, Mail } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole } from '../types';
import { supabase } from '../lib/supabase';

const RegisterProfessional: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Referral Logic
    const queryParams = new URLSearchParams(location.search);
    const referrer = queryParams.get('ref') || '';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profession, setProfession] = useState('');
    const [referredBy, setReferredBy] = useState(referrer);
    const [serviceHistory, setServiceHistory] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 1. Create Auth User
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                // 2. Update Profile with Professional Details
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        role: UserRole.PROFESSIONAL,
                        profession: profession,
                        service_history: serviceHistory,
                        status: 'pending'
                    })
                    .eq('id', data.user.id);

                if (updateError) console.error('Error updating profile details:', updateError);

                // Maintain Legacy LocalStorage for consistency with ProtectedRoute
                localStorage.setItem('user_registered', 'true');
                localStorage.setItem('user_role', UserRole.PROFESSIONAL);
                localStorage.setItem('user_name', name);

                // Redirect to Paywall
                window.location.href = '/plan/professional';
            }
        } catch (err: any) {
            alert('Erro no cadastro: ' + err.message);
        }
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
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Quem te indicou?</label>
                        <div className="relative">
                            <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={referredBy}
                                onChange={e => setReferredBy(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none ${referrer ? 'bg-teal-50 border-teal-200 text-teal-700 font-bold' : 'border-gray-200 focus:border-teal-500'}`}
                                placeholder="Nome do morador (Opcional)"
                            />
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


                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Já prestou serviço para algum morador?</label>
                        <textarea
                            value={serviceHistory}
                            onChange={(e) => setServiceHistory(e.target.value)}
                            className="w-full p-4 rounded-xl border border-gray-200 focus:border-teal-500 focus:outline-none h-24 resize-none"
                            placeholder="Se sim, conte-nos quem e qual rua/bloco..."
                        ></textarea>
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
