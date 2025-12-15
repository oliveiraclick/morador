import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

const Login: React.FC = ({ setRole }: { setRole?: (role: UserRole) => void }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // In a real app we would validate against backend. 
        // Here we check localStorage or default to what was last saved.
        const storedRole = localStorage.getItem('user_role') as UserRole || UserRole.RESIDENT;

        // If the parent component passed a setter (from App.tsx), update it.
        if (setRole) {
            setRole(storedRole);
        }

        if (storedRole === UserRole.RESIDENT) {
            navigate('/home');
        } else if (storedRole === UserRole.ADMIN) {
            navigate('/admin');
        } else {
            navigate('/dashboard');
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

                    <button type="submit" className="w-full bg-[#7c3aed] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 hover:opacity-90 transition-all hover:scale-[1.01] active:scale-95">
                        Entrar
                    </button>

                    <div className="text-center pt-2">
                        <button type="button" onClick={() => {
                            // Reset flow for demo purposes if needed, or navigate to recover
                            alert("Funcionalidade de recuperação de senha em breve!");
                        }} className="text-sm text-purple-600 font-bold hover:underline">
                            Esqueci minha senha
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
