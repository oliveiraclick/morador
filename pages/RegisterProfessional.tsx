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
            console.log('=== INICIANDO CADASTRO PROFISSIONAL ===');

            // 1. Cria usuário
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        full_name: name,
                        role: 'professional',
                        profession: profession,
                        service_history: serviceHistory
                    }
                }
            });

            if (authError) throw new Error(authError.message);
            if (!authData.user) throw new Error('Usuário não foi criado');

            console.log('✅ Usuário criado:', authData.user.id);

            // 2. Aguarda o trigger criar o perfil
            await new Promise(resolve => setTimeout(resolve, 3000));

            // 3. Verifica se o perfil foi criado pelo trigger
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            if (existingProfile) {
                console.log('✅ Perfil criado pelo trigger:', existingProfile);

                // Se o trigger criou, mas faltam os detalhes profissionais, atualiza
                if (!existingProfile.profession) {
                    await supabase.from('profiles').update({
                        profession: profession,
                        service_history: serviceHistory,
                        status: 'pending'
                    }).eq('id', authData.user.id);
                }
            } else {
                // 4. Se não foi criado, insere manualmente
                console.log('📝 Criando perfil manualmente...');

                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authData.user.id,
                        email: email,
                        full_name: name,
                        role: 'professional',
                        profession: profession,
                        service_history: serviceHistory,
                        status: 'active'
                    });

                if (insertError) {
                    console.warn('⚠️ Erro ao inserir perfil (FK timing?):', insertError.message);
                }
            }

            // 5. Salva no localStorage (completo para evitar "Vizinho")
            localStorage.setItem('user_registered', 'true');
            localStorage.setItem('user_role', 'professional');
            localStorage.setItem('user_name', name);
            localStorage.setItem('user_id', authData.user.id);
            localStorage.setItem('user_email', email);

            console.log('✅ Cadastro concluído.');
            // Redirect to Paywall
            window.location.href = '/plan/professional';

        } catch (err: any) {
            console.error('❌ ERRO:', err);
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

                {/* Google Login Button */}
                <button
                    onClick={async () => {
                        try {
                            const { error } = await supabase.auth.signInWithOAuth({
                                provider: 'google',
                                options: {
                                    redirectTo: window.location.origin,
                                    queryParams: {
                                        access_type: 'offline',
                                        prompt: 'consent',
                                    },
                                },
                            });
                            if (error) throw error;
                        } catch (error: any) {
                            alert('Erro ao conectar com Google: ' + error.message);
                        }
                    }}
                    className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors mb-6"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Entrar com Google
                </button>

                <div className="relative flex py-2 items-center mb-6">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase">Ou cadastre-se</span>
                    <div className="flex-grow border-t border-gray-200"></div>
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
