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

    const handleGoogleLogin = async () => {
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
                        <span className="text-xs text-gray-400 font-medium uppercase">Ou</span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-white text-slate-600 border border-slate-200 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Entrar com Google
                    </button>

                    {/* Mock buttons removed for production feel, can be re-enabled for dev if needed */}
                </form>

                <p className="text-center mt-8 text-sm text-gray-500">
                    Ainda não tem conta? <a href="/role-selection" className="text-purple-600 font-bold hover:underline">Cadastre-se</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
