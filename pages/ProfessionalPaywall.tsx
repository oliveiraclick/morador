import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, ChevronDown, Star, Wallet, Calendar, ShieldCheck, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ProfessionalPaywall: React.FC = () => {
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState('');
    const [couponMessage, setCouponMessage] = useState('');
    const [isFree, setIsFree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [trialDays, setTrialDays] = useState(0);
    const [daysElapsed, setDaysElapsed] = useState(0);
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        const checkTrialStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get profile and settings
            const [profileRes, settingsRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('app_settings').select('*').eq('key', 'professional_trial_days').maybeSingle()
            ]);

            if (profileRes.data) {
                setUserProfile(profileRes.data);
                if (profileRes.data.is_free) setIsFree(true);

                // Calculate age of account
                const createdAt = new Date(profileRes.data.created_at);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - createdAt.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setDaysElapsed(diffDays);
            }

            if (settingsRes.data) {
                setTrialDays(parseInt(settingsRes.data.value));
            }
        };

        checkTrialStatus();
    }, []);

    const isInsideTrial = trialDays > 0 && daysElapsed <= trialDays;
    const canAccessForFree = isFree || isInsideTrial;

    const handleApplyCoupon = () => {
        if (coupon.toUpperCase() === 'VILA100' || coupon.toUpperCase() === 'INICIO') {
            setIsFree(true);
            setCouponMessage('Cupom aplicado! 100% de desconto.');
        } else {
            setCouponMessage('Cupom inválido.');
            setTimeout(() => setCouponMessage(''), 2000);
        }
    };

    const handleSubscribe = () => {
        setLoading(true);
        // Simulation of payment processing or redirection
        setTimeout(() => {
            // Set payment flag
            localStorage.setItem('professional_payment_active', 'true');

            if (isFree) {
                alert('Plano ativado com sucesso! (Isento)');
            } else {
                // Here you would redirect to Kiwify
                // window.location.href = 'https://pay.kiwify.com.br/SEU_LINK'; 
                // For now, we simulate success
                alert('Redirecionando para Kiwify... (Simulação: Pagamento Aprovado)');
            }

            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Header */}
            <div className="px-4 py-4 flex items-center justify-between sticky top-0 z-20 bg-white/80 backdrop-blur-md">
                <button onClick={() => navigate('/login')} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} className="text-gray-900" />
                </button>
                <span className="font-bold text-gray-900">Assinatura Profissional</span>
                <div className="w-8"></div>
            </div>

            {/* Hero */}
            <div className="relative mx-4 rounded-[2rem] overflow-hidden h-[300px] mb-8 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover" alt="Business" />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-teal-800/50 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-8 text-center flex flex-col items-center">
                    <span className="px-4 py-1.5 bg-teal-500 text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Plano Profissional</span>
                    <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                        Cresça seu negócio no condomínio
                    </h1>
                    <p className="text-teal-100 text-sm leading-relaxed max-w-xs">
                        Acesso exclusivo a moradores, agenda online e ferramentas de vendas.
                    </p>
                </div>
            </div>

            {/* Features */}
            <div className="px-6 space-y-8 mb-12">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">O que está incluso?</h2>
                    <p className="text-gray-500 text-sm mb-6">Tudo que você precisa para atender mais.</p>

                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-2xl p-5 flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Selo de Verificação</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">Ganhe a confiança dos moradores com um perfil verificado e profissional.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-5 flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Agenda Automática</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">Permita que clientes agendem horários diretamente pelo app, sem troca de mensagens.</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-5 flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                <Wallet size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Pagamentos Integrados</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">Receba pagamentos com segurança e organize seu fluxo de caixa.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Card */}
                <div id="plans">
                    <div className="border-2 border-teal-500 rounded-3xl p-6 bg-white shadow-xl relative overflow-hidden">
                        {isFree && (
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                                CUPOM APLICADO
                            </div>
                        )}

                        <span className="text-sm font-bold text-teal-600 mt-2 block">Assinatura Mensal</span>
                        <div className="flex items-end gap-1 mb-2 mt-1">
                            {isFree ? (
                                <>
                                    <h3 className="text-4xl font-bold text-gray-900 line-through decoration-red-500 decoration-2 opacity-50">R$ 29,90</h3>
                                    <h3 className="text-4xl font-bold text-green-600 ml-2">R$ 0,00</h3>
                                </>
                            ) : (
                                <h3 className="text-4xl font-bold text-gray-900">R$ 29,90</h3>
                            )}
                            <span className="text-gray-500 text-xs font-medium mb-1">/mês</span>
                        </div>

                        {canAccessForFree && (
                            <p className="text-[10px] text-green-600 mb-6 font-bold flex items-center gap-1">
                                <ShieldCheck size={12} />
                                {isFree ? 'Você possui isenção total' : `Em período de teste: restam ${trialDays - daysElapsed + 1} dias.`}
                            </p>
                        )}

                        {!canAccessForFree && <p className="text-[10px] text-gray-400 mb-6 font-medium">Cobrado via Kiwify. Cancele quando quiser.</p>}

                        {/* Coupon Input */}
                        <div className="mb-6 bg-gray-50 rounded-xl p-3 border border-dashed border-gray-300">
                            <div className="flex items-center gap-2 mb-2">
                                <Ticket size={14} className="text-gray-400" />
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Cupom de Desconto</label>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                    placeholder="Código..."
                                    disabled={isFree}
                                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-900 uppercase focus:outline-none focus:border-teal-500 disabled:opacity-50"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={isFree || !coupon}
                                    className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
                                >
                                    Aplicar
                                </button>
                            </div>
                            {couponMessage && (
                                <p className={`text-[10px] font-bold mt-2 ${isFree ? 'text-green-600' : 'text-red-500'}`}>
                                    {couponMessage}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleSubscribe}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl text-white font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                ${canAccessForFree ? 'bg-green-600 shadow-green-200 hover:bg-green-700' : 'bg-[#0d9488] shadow-teal-200 hover:bg-teal-700'}`}
                        >
                            {loading ? 'Processando...' : (canAccessForFree ? (isFree ? 'Acessar com Isenção' : 'Acessar Teste Grátis') : 'Pagar com Kiwify')}
                        </button>

                        {!isFree && (
                            <div className="flex justify-center mt-3 gap-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" className="h-4 opacity-60" alt="Mastercard" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Visa_Inc._logo.svg" className="h-4 opacity-60" alt="Visa" />
                                <span className="text-[10px] font-bold text-gray-400 pt-0.5">PIX</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-8 px-2 space-y-2">
                    <h3 className="font-bold text-gray-900 text-sm mb-2 text-center">Dúvidas?</h3>
                    {['Como funciona o pagamento?', 'Preciso ter CNPJ?', 'O cancelamento é fácil?'].map((q, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:bg-gray-100">
                            <span className="text-xs font-medium text-gray-600">{q}</span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default ProfessionalPaywall;
