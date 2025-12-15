import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { supabase } from '../lib/supabase';

const Login: React.FC = ({ setRole }: { setRole?: (role: UserRole) => void }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Check Hardcoded Admin (Backdoor/Legacy)
        if (email === 'denys@morador.app' && password === 'Vendas@123') {
            localStorage.setItem('user_role', UserRole.ADMIN);
            localStorage.setItem('user_registered', 'true');
            if (setRole) setRole(UserRole.ADMIN);
            navigate('/admin');
            return;
        }

        // 2. Supabase Auth
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                // Fetch Profile to get Role
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                const role = profile?.role || UserRole.RESIDENT;

                localStorage.setItem('user_role', role);
                localStorage.setItem('user_registered', 'true');
                if (setRole) setRole(role as UserRole);

                // Redirect
                if (role === UserRole.ADMIN) navigate('/admin');
                else if (role === UserRole.PROFESSIONAL) navigate('/dashboard');
                else navigate('/home');
            }
        } catch (err: any) {
            alert('Erro ao entrar: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center p-6">
            <div className="max-w-md w-full mx-auto">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[#7c3aed] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-200 rotate-3 transform hover:rotate-6 transition-transform">
                        <LogIn size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta!</h1>
                    <p className="text-gray-500 mt-2">Acesse sua conta para continuar</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                        <div className="relative">
                            <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Senha</label>
                        <div className="relative">
                            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                                placeholder="••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#7c3aed] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-[#6d28d9] hover:shadow-purple-300 transition-all transform hover:-translate-y-0.5"
                    >
                        Entrar
                    </button>

                    <div className="relative flex items-center gap-4 py-2">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-xs text-gray-400 font-medium uppercase">Ou teste como</span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.setItem('user_role', UserRole.RESIDENT);
                                localStorage.setItem('user_registered', 'true');
                                if (setRole) setRole(UserRole.RESIDENT);
                                navigate('/home');
                            }}
                            className="w-full py-3 rounded-xl font-bold text-xs border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors"
                        >
                            Testar Morador
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.setItem('user_role', UserRole.PROFESSIONAL);
                                localStorage.setItem('user_registered', 'true');
                                if (setRole) setRole(UserRole.PROFESSIONAL);
                                navigate('/dashboard');
                            }}
                            className="w-full py-3 rounded-xl font-bold text-xs border border-teal-200 text-teal-700 hover:bg-teal-50 transition-colors"
                        >
                            Testar Profissional
                        </button>
                    </div>

                </form>

                <p className="text-center mt-8 text-sm text-gray-500">
                    Ainda não tem conta? <a href="/role-selection" className="text-purple-600 font-bold hover:underline">Cadastre-se</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
