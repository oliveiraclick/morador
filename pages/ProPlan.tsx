import React, { useState } from 'react';
import { ArrowLeft, X, Calendar, Wallet, CheckCircle2, ChevronDown, Star, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ProPlan: React.FC = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setLoadingCoupon(true);
    try {
      // Check coupon validity
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('active', true)
        .single();

      if (error || !data) {
        alert('Cupom inválido ou expirado.');
        return;
      }

      // Apply 100% Discount Logic
      if (data.discount_label && (data.discount_label.includes('100%') || data.discount_label.includes('OFF'))) {
        // Determine current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return navigate('/login');

        // Activate Subscription (Mocking a subscription record for now or just handling profile status)
        // Ideally insert into subscriptions table.
        const { error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            status: 'active',
            plan_type: 'professional',
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 * (data.duration_months || 1)).toISOString()
          });

        // Update usage count
        await supabase.from('coupons').update({ uses_count: (data.uses_count || 0) + 1 }).eq('id', data.id);

        alert(`Cupom ${data.code} aplicado com sucesso! Você ganhou ${data.duration_months} meses de acesso.`);
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        alert(`Cupom de desconto parcial aplicado! Prossiga para o checkout.`);
        // For partial discounts, we would append ?coupon=CODE to Kiwify URL if supported
      }

    } catch (error) {
      console.error(error);
      alert('Erro ao validar cupom.');
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handleSubscribe = () => {
    // Kiwify Direct Link
    window.open('https://pay.kiwify.com.br/6CblNjX', '_blank');
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between sticky top-0 z-20 bg-white/80 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <span className="font-bold text-gray-900">Morador Pro</span>
        <button onClick={() => navigate('/home')} className="p-2 hover:bg-gray-100 rounded-full">
          <X size={24} className="text-gray-900" />
        </button>
      </div>

      {/* Hero */}
      <div className="relative mx-4 rounded-[2rem] overflow-hidden h-[400px] mb-8 shadow-2xl">
        <img src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover" alt="Pro" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-900/60 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8 text-center flex flex-col items-center">
          <span className="px-4 py-1.5 bg-[#7c3aed] text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wide">Novo Plano</span>
          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
            Transforme seu negócio no condomínio
          </h1>
          <p className="text-gray-200 text-sm leading-relaxed max-w-xs">
            Agenda automática, pagamentos online e mais visibilidade para seus vizinhos.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 space-y-8 mb-12">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Por que ser Pro?</h2>
          <p className="text-gray-500 text-sm mb-6">Funcionalidades exclusivas para quem quer crescer.</p>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-5 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Agenda Inteligente</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Seus clientes agendam sozinhos nos horários que você definir. Evite conflitos e automatize sua rotina.</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Gestão Financeira</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Receba via Pix ou Cartão diretamente pelo app, sem precisar de maquininha extra.</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5 flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 flex-shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Vitrine Premium</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Seu perfil aparece em destaque no topo das buscas do condomínio com o selo "Pro".</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="flex gap-2 items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Quem usa aprova</h2>
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            <div className="min-w-[280px] p-5 rounded-2xl border border-gray-100 shadow-sm bg-white">
              <p className="text-xs text-gray-500 italic mb-4 leading-relaxed">"Minha agenda vivia bagunçada no WhatsApp. Com o Morador Pro, organizou tudo e parei de perder clientes."</p>
              <div className="flex items-center gap-3">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-10 h-10 rounded-full" alt="User" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Ana Silva</p>
                  <p className="text-[10px] text-purple-600 font-medium">Manicure</p>
                </div>
              </div>
            </div>

            <div className="min-w-[280px] p-5 rounded-2xl border border-gray-100 shadow-sm bg-white">
              <p className="text-xs text-gray-500 italic mb-4 leading-relaxed">"O pagamento via app é incrível. Não preciso ficar cobrando, o dinheiro cai na hora."</p>
              <div className="flex items-center gap-3">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-10 h-10 rounded-full" alt="User" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Carlos Eduardo</p>
                  <p className="text-[10px] text-purple-600 font-medium">Personal Trainer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div id="plans">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Invista em você</h2>

          <div className="space-y-4">
            {/* Pro */}
            <div className="border-2 border-purple-500 rounded-3xl p-6 bg-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-purple-400 to-pink-500"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg tracking-wider uppercase">Pagamento Único / Mensal</div>

              <span className="text-sm font-bold text-purple-600 mt-2 block">Morador Pro</span>
              <div className="flex items-end gap-1 mb-2 mt-1">
                <h3 className="text-4xl font-bold text-gray-900">R$ 29,90</h3>
                <span className="text-gray-500 text-xs font-medium mb-1">/mês</span>
              </div>
              <p className="text-[10px] text-green-600 font-bold mb-6">Cancele quando quiser.</p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <CheckCircle2 size={18} className="text-purple-600 fill-purple-100" />
                  Perfil com selo <span className="text-purple-600">Destacado</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <CheckCircle2 size={18} className="text-purple-600 fill-purple-100" />
                  Pagamentos online (Pix/Cartão)
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <CheckCircle2 size={18} className="text-purple-600 fill-purple-100" />
                  Agenda 100% automática
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <CheckCircle2 size={18} className="text-purple-600 fill-purple-100" />
                  Relatórios de faturamento
                </li>
              </ul>

              <button
                onClick={handleSubscribe}
                className="w-full py-3.5 bg-gradient-to-r from-[#7c3aed] to-[#9333ea] rounded-xl text-white font-bold text-sm shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Assinar Agora (via Kiwify)
              </button>
              <p className="text-[10px] text-gray-400 text-center mt-3">Ambiente seguro.</p>
            </div>
          </div>
        </div>

        {/* FAQ Dropdowns */}
        <div className="mt-8 px-6 space-y-2 mb-10">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Dúvidas Frequentes</h3>
          {['Preciso de cartão de crédito?', 'Posso cancelar quando quiser?', 'Como recebo os pagamentos?'].map((q, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 flex justify-between items-center cursor-pointer">
              <span className="text-sm font-medium text-gray-700">{q}</span>
              <ChevronDown size={18} className="text-gray-400" />
            </div>
          ))}
        </div>

        {/* Coupon Input Section */}
        <div className="px-6 mb-8">
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 block mb-2">Tem um cupom?</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Código"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold text-gray-900 uppercase focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={loadingCoupon}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {loadingCoupon ? '...' : 'Aplicar'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-30 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">R$ 29,90</span>
            <span className="text-xs text-gray-500">/mês</span>
          </div>
        </div>
        <button onClick={handleSubscribe} className="bg-[#7c3aed] text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg shadow-purple-200">
          Assinar Pro
        </button>
      </div>

    </div>
  );
};

export default ProPlan;