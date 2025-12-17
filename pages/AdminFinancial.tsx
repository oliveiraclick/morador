import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Filter, DollarSign, Calendar, Download, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type FinancialTab = 'receivables' | 'payables';

const AdminFinancial: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<FinancialTab>('receivables');

    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({ in: 0, out: 0 });

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        title: '',
        amount: '',
        type: 'out', // Default to expense
        status: 'paid',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('financial_transactions')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            if (data) {
                setTransactions(data);
                calculateTotals(data);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotals = (data: any[]) => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        let totalIn = 0;
        let totalOut = 0;

        data.forEach(t => {
            const tDate = new Date(t.date);
            // Check if in current month (ignoring time for simplicity or using strict date compare)
            // Ideally we compare YYYY-MM
            if (tDate >= startOfMonth && tDate <= endOfMonth && t.status === 'paid') {
                if (t.type === 'in') totalIn += Number(t.amount);
                else if (t.type === 'out') totalOut += Number(t.amount);
            }
        });

        setTotals({ in: totalIn, out: totalOut });
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!newItem.title || !newItem.amount) return;

            const { error } = await supabase.from('financial_transactions').insert([{
                title: newItem.title,
                amount: parseFloat(newItem.amount.replace(',', '.')),
                type: newItem.type,
                status: newItem.status,
                date: newItem.date
            }]);

            if (error) throw error;

            setShowModal(false);
            setNewItem({ title: '', amount: '', type: 'out', status: 'paid', date: new Date().toISOString().split('T')[0] });
            fetchTransactions();

        } catch (error) {
            alert('Erro ao adicionar transação');
            console.error(error);
        }
    };

    const filteredTransactions = transactions.filter(t =>
        activeTab === 'receivables' ? t.type === 'in' : t.type === 'out'
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative">
            {/* Header */}
            <div className="bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Financeiro</h1>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-200 hover:bg-purple-700 transition-colors"
                >
                    <Plus size={24} />
                </button>
            </div>

            <div className="p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-500 text-white p-5 rounded-3xl shadow-lg shadow-green-200">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <ArrowUpRight size={20} />
                            </div>
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">Mês Atual</span>
                        </div>
                        <p className="text-xs opacity-80 mb-1">Total Recebido</p>
                        <h2 className="text-xl font-bold truncate">R$ {totals.in.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                    </div>
                    <div className="bg-red-500 text-white p-5 rounded-3xl shadow-lg shadow-red-200">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <ArrowDownLeft size={20} />
                            </div>
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">Mês Atual</span>
                        </div>
                        <p className="text-xs opacity-80 mb-1">Total Pago</p>
                        <h2 className="text-xl font-bold truncate">R$ {totals.out.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-gray-200 rounded-xl mb-6">
                    <button
                        onClick={() => setActiveTab('receivables')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'receivables' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Entradas
                    </button>
                    <button
                        onClick={() => setActiveTab('payables')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'payables' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Saídas
                    </button>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {loading ? (
                        <p className="text-center text-gray-400 text-sm mt-10">Carregando...</p>
                    ) : filteredTransactions.length === 0 ? (
                        < div className="text-center text-gray-400 py-10 bg-white rounded-2xl border border-gray-100 border-dashed">
                            <p>Nenhuma transação encontrada.</p>
                        </div>
                    ) : (
                        filteredTransactions.map(t => (
                            <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        <DollarSign size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{t.title}</h4>
                                        <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <p className={`font-bold ${t.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'in' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === 'paid' ? 'bg-green-100 text-green-700' : t.status === 'late' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {t.status === 'paid' ? 'Pago' : t.status === 'late' ? 'Atrasado' : 'Pendente'}
                                        </span>
                                        {t.status === 'late' && t.contact_phone && (
                                            <button
                                                onClick={() => {
                                                    const msg = `Olá! Notamos uma pendência referente a "${t.title}". Poderia verificar? Obrigado!`;
                                                    window.open(`https://wa.me/${t.contact_phone}?text=${encodeURIComponent(msg)}`, '_blank');
                                                }}
                                                className="bg-green-500 text-white p-1.5 rounded-lg hover:bg-green-600 transition-colors"
                                                title="Cobrar no WhatsApp"
                                            >
                                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Transaction Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Nova Transação</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewItem({ ...newItem, type: 'in' })}
                                        className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${newItem.type === 'in' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200 text-gray-500'}`}
                                    >
                                        Receita (Entrada)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewItem({ ...newItem, type: 'out' })}
                                        className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${newItem.type === 'out' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200 text-gray-500'}`}
                                    >
                                        Despesa (Saída)
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                                <input
                                    type="text"
                                    value={newItem.title}
                                    onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 font-medium"
                                    placeholder="Ex: Servidor, Manutenção, Mensalidade..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newItem.amount}
                                        onChange={e => setNewItem({ ...newItem, amount: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 font-medium"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data</label>
                                    <input
                                        type="date"
                                        value={newItem.date}
                                        onChange={e => setNewItem({ ...newItem, date: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                                <select
                                    value={newItem.status}
                                    onChange={e => setNewItem({ ...newItem, status: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-purple-500 font-medium bg-white"
                                >
                                    <option value="paid">Pago / Recebido</option>
                                    <option value="pending">Pendente</option>
                                    <option value="late">Atrasado</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 hover:opacity-90 transition-all mt-4"
                            >
                                Salvar Transação
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFinancial;
