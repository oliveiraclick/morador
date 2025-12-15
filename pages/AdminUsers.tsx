import React, { useState } from 'react';
import { ArrowLeft, Search, User, Briefcase, CheckCircle, XCircle, MoreVertical, Filter, MapPin, Building, Shield, Slash, Award, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Tab = 'residents' | 'professionals';

const AdminUsers: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('residents');

    // Mock Data State
    const [residents, setResidents] = useState([
        { id: 1, name: 'Ana Silva', condo: 'Condomínio Jardins do Sol', unit: 'Bl A, Ap 101', street: 'Rua das Flores, 123', status: 'active', email: 'ana@email.com' },
        { id: 2, name: 'Carlos Oliveira', condo: 'Residencial Flores do Campo', unit: 'Bl C, Ap 44', street: 'Av. Principal, 500', status: 'pending', email: 'carlos@email.com' },
        { id: 3, name: 'Mariana Santos', condo: 'Edifício Blue Tower', unit: 'Ap 902', street: 'Rua do Porto, 88', status: 'active', email: 'mari@email.com' },
    ]);

    const [professionals, setProfessionals] = useState([
        { id: 1, name: 'João Elétrica', profession: 'Eletricista', serviceHistory: 'Já atendi a Dona Maria do Bloco A. Troquei a fiação do chuveiro.', status: 'pending', email: 'joao@eletrica.com', isFree: false, isVerified: false },
        { id: 2, name: 'Limpeza Total', profession: 'Diarista', serviceHistory: 'Trabalho fixo na casa do Sr. Pedro, Bloco B, toda terça.', status: 'active', email: 'contato@limpezatotal.com', isFree: true, isVerified: true },
        { id: 3, name: 'Marcos Reparos', profession: 'Pedreiro', serviceHistory: 'Fiz a reforma da portaria mês passado.', status: 'blocked', email: 'marcos@obr.com', isFree: false, isVerified: false },
    ]);

    const toggleStatus = (id: number, type: 'residents' | 'professionals', newStatus: string) => {
        if (type === 'residents') {
            setResidents(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
        } else {
            setProfessionals(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
        }
    };

    const toggleProp = (id: number, prop: 'isFree' | 'isVerified') => {
        setProfessionals(prev => prev.map(u => u.id === id ? { ...u, [prop]: !u[prop] } : u));
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Gerenciar Usuários</h1>
            </div>

            <div className="p-6">
                {/* Tabs */}
                <div className="flex p-1 bg-gray-200 rounded-xl mb-6">
                    <button
                        onClick={() => setActiveTab('residents')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'residents' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Moradores
                    </button>
                    <button
                        onClick={() => setActiveTab('professionals')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'professionals' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Profissionais
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-3 mb-6">
                    <div className="flex-1 bg-white rounded-xl border border-gray-200 flex items-center px-4 py-3">
                        <Search size={20} className="text-gray-400 mr-2" />
                        <input type="text" placeholder="Buscar por nome..." className="flex-1 outline-none text-sm" />
                    </div>
                    <button className="bg-white border border-gray-200 w-12 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50">
                        <Filter size={20} />
                    </button>
                </div>

                {/* Lists */}
                <div className="space-y-4">
                    {activeTab === 'residents' ? (
                        residents.map(user => (
                            <div key={user.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">{user.name}</h3>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-700' : user.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {user.status === 'active' ? 'Ativo' : user.status === 'blocked' ? 'Bloqueado' : 'Pendente'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        {user.status !== 'blocked' ? (
                                            <button onClick={() => toggleStatus(user.id, 'residents', 'blocked')} className="text-gray-400 hover:text-red-500 p-1">
                                                <Slash size={18} />
                                            </button>
                                        ) : (
                                            <button onClick={() => toggleStatus(user.id, 'residents', 'active')} className="text-gray-400 hover:text-green-500 p-1">
                                                <CheckCircle size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Building size={14} className="text-gray-400" />
                                        <span className="font-medium text-gray-700">{user.condo}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-gray-400" />
                                        <span>{user.street} • {user.unit}</span>
                                    </div>
                                    <div className="text-gray-400 pl-6">{user.email}</div>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-200">Detalhes</button>
                                    {user.status === 'pending' && (
                                        <button onClick={() => toggleStatus(user.id, 'residents', 'active')} className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-purple-700">Aprovar</button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        professionals.map(user => (
                            <div key={user.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <h3 className="font-bold text-gray-900 text-sm">{user.name}</h3>
                                                {user.isVerified && <Shield size={12} className="text-blue-500 fill-blue-500" />}
                                            </div>
                                            <p className="text-xs text-teal-600 font-medium">{user.profession}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-700' : user.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {user.status === 'active' ? 'Ativo' : user.status === 'blocked' ? 'Bloqueado' : 'Pendente'}
                                    </span>
                                </div>

                                <div className="bg-teal-50 p-3 rounded-xl mb-3">
                                    <p className="text-[10px] font-bold text-teal-800 uppercase mb-1">Histórico / Referência</p>
                                    <p className="text-xs text-teal-900 italic">"{user.serviceHistory}"</p>
                                </div>

                                <div className="flex gap-2 mb-3">
                                    <button
                                        onClick={() => toggleProp(user.id, 'isFree')}
                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors ${user.isFree ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}
                                    >
                                        <DollarSign size={12} /> {user.isFree ? 'Isento' : 'Cobrar'}
                                    </button>
                                    <button
                                        onClick={() => toggleProp(user.id, 'isVerified')}
                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors ${user.isVerified ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}
                                    >
                                        <Award size={12} /> {user.isVerified ? 'Verificado' : 'Não Verif.'}
                                    </button>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-gray-100">
                                    {user.status === 'blocked' ? (
                                        <button
                                            onClick={() => toggleStatus(user.id, 'professionals', 'active')}
                                            className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-gray-800 flex items-center justify-center gap-1"
                                        >
                                            <CheckCircle size={14} /> Desbloquear
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => toggleStatus(user.id, 'professionals', 'blocked')}
                                                className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg text-xs font-bold hover:bg-red-50 flex items-center justify-center gap-1"
                                            >
                                                <Slash size={14} /> Bloquear
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(user.id, 'professionals', 'active')}
                                                className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-teal-700 flex items-center justify-center gap-1"
                                            >
                                                <CheckCircle size={14} /> Aprovar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
