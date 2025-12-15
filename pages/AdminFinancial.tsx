import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Filter, DollarSign, Calendar, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type FinancialTab = 'receivables' | 'payables';

const AdminFinancial: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<FinancialTab>('receivables');

    // Mock Transactions
    const transactions = [
        { id: 1, type: 'in', title: 'Mensalidade Cond. Jardins', amount: 4500.00, date: '12/12/2024', status: 'paid' },
        { id: 2, type: 'in', title: 'Taxa Profissional (João)', amount: 29.90, date: '12/12/2024', status: 'paid' },
        { id: 3, type: 'out', title: 'Servidor AWS', amount: 120.00, date: '10/12/2024', status: 'paid' },
        { id: 4, type: 'in', title: 'Mensalidade Cond. Flores', amount: 3200.00, date: '15/12/2024', status: 'pending' },
        { id: 5, type: 'out', title: 'Marketing Google Ads', amount: 500.00, date: '01/12/2024', status: 'paid' },
    ];

    const filteredTransactions = transactions.filter(t =>
        activeTab === 'receivables' ? t.type === 'in' : t.type === 'out'
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Financeiro Master</h1>
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
                        <h2 className="text-2xl font-bold">R$ 45.2k</h2>
                    </div>
                    <div className="bg-red-500 text-white p-5 rounded-3xl shadow-lg shadow-red-200">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <ArrowDownLeft size={20} />
                            </div>
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">Mês Atual</span>
                        </div>
                        <p className="text-xs opacity-80 mb-1">Total Pago</p>
                        <h2 className="text-2xl font-bold">R$ 12.4k</h2>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-gray-200 rounded-xl mb-6">
                    <button
                        onClick={() => setActiveTab('receivables')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'receivables' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Contas a Receber
                    </button>
                    <button
                        onClick={() => setActiveTab('payables')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'payables' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Contas a Pagar
                    </button>
                </div>

                {/* Filters */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Transações</h3>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                            <Calendar size={18} />
                        </button>
                        <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                            <Filter size={18} />
                        </button>
                        <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50">
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {filteredTransactions.map(t => (
                        <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    <DollarSign size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{t.title}</h4>
                                    <p className="text-xs text-gray-400">{t.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${t.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === 'in' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                                </p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {t.status === 'paid' ? 'Pago' : 'Pendente'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminFinancial;
