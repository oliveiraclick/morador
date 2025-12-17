import React, { useState, useEffect } from 'react';
import { ArrowLeft, Ticket, Plus, CreditCard, Trash2, Edit2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AdminPlans: React.FC = () => {
    const navigate = useNavigate();

    const [coupons, setCoupons] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showCouponModal, setShowCouponModal] = useState(false);
    const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', duration: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [couponsRes, plansRes] = await Promise.all([
                supabase.from('coupons').select('*').order('created_at', { ascending: false }),
                supabase.from('plans').select('*').order('price', { ascending: true })
            ]);

            if (couponsRes.data) setCoupons(couponsRes.data);
            // Plans allow for mock if empty
            setPlans([
                { id: 1, name: 'Morador Pro', price: 'R$ 29,90', features: ['Sem anúncios', 'Clube de Descontos', 'Suporte Prioritário'], color: 'bg-purple-600' },
            ]);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCoupon = async () => {
        try {
            const { error } = await supabase.from('coupons').insert([{
                code: newCoupon.code.toUpperCase(),
                discount_label: '100% OFF', // Fixed column name
                duration_months: parseInt(newCoupon.duration || '1'), // Fixed column name
                uses_count: 0, // Fixed column name
                active: true
            }]);

            if (error) throw error;

            fetchData();
            setShowCouponModal(false);
            setNewCoupon({ code: '', discount: '', duration: '' });
        } catch (error) {
            alert('Erro ao criar cupom: ' + error.message);
        }
    };

    const handleDeleteCoupon = async (id: number) => {
        if (window.confirm('Excluir cupom?')) {
            await supabase.from('coupons').delete().eq('id', id);
            fetchData();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Planos & Ofertas</h1>
            </div>

            <div className="p-6 space-y-8">
                {/* Plans Section - Simplified to Static View since it's just one plan now */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <CreditCard size={20} className="text-purple-600" />
                            Plano Ativo (Kiwify)
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-purple-600"></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Morador Pro</h3>
                                <p className="text-2xl font-bold text-gray-700 mt-1">R$ 29,90<span className="text-xs text-gray-400 font-normal">/mês</span></p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-1 rounded-lg">Kiwify Integrado</span>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Coupons Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Ticket size={20} className="text-teal-600" />
                            Cupons de Desconto
                        </h2>
                        <button onClick={() => setShowCouponModal(true)} className="text-teal-600 text-sm font-bold flex items-center gap-1">
                            <Plus size={16} /> Criar Cupom
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        {coupons.map((coupon, index) => (
                            <div key={coupon.id} className={`p-4 flex items-center justify-between ${index !== coupons.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100 border-dashed">
                                        <Ticket size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900">{coupon.code}</h4>
                                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">
                                                {coupon.discount_label || '100% OFF'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400">{coupon.uses_count || 0} utilizações</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleDeleteCoupon(coupon.id)} className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showCouponModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">Novo Cupom</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nome do Cupom</label>
                                <input
                                    value={newCoupon.code}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                                    placeholder="Ex: PRO30DIAS"
                                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:outline-none uppercase font-bold text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Meses Grátis</label>
                                <input
                                    type="number"
                                    value={newCoupon.duration}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, duration: e.target.value })}
                                    placeholder="Ex: 3"
                                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:outline-none"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">O usuário terá isenção total por esse período.</p>
                            </div>

                            <button
                                onClick={handleAddCoupon}
                                className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold mt-2 shadow-lg shadow-teal-200"
                            >
                                Criar Cupom
                            </button>
                            <button
                                onClick={() => setShowCouponModal(false)}
                                className="w-full text-gray-400 font-bold text-sm py-2"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPlans;
