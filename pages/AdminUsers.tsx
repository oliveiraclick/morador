import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, User, Briefcase, CheckCircle, XCircle, MoreVertical, Filter, MapPin, Building, Shield, Slash, Award, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type Tab = 'residents' | 'professionals';

const AdminUsers: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('residents');

    // Data State
    const [residents, setResidents] = useState<any[]>([]);
    const [professionals, setProfessionals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            // 1. Fetch Profiles
            const { data: profiles, error: profError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            // 2. Fetch Condos (for mapping names)
            const { data: condos, error: condoError } = await supabase
                .from('condos')
                .select('id, name');

            if (profError) throw profError;

            // 3. Process Data
            if (profiles) {
                const resList = profiles
                    .filter(p => p.role === 'resident')
                    .map(p => ({
                        id: p.id,
                        name: p.full_name || 'Sem Nome',
                        condo: condos?.find(c => c.id === p.condo_id)?.name || 'Condomínio',
                        unit: p.unit || '-',
                        street: p.unit?.split(',')[0] || '-', // Attempt to extract street
                        status: p.status || 'pending',
                        email: p.email || 'email@oculto.com'
                    }));

                const profList = profiles
                    .filter(p => p.role === 'professional')
                    .map(p => ({
                        id: p.id,
                        name: p.full_name || 'Sem Nome',
                        profession: p.profession || 'Geral',
                        serviceHistory: p.service_history || 'Sem histórico',
                        status: p.status || 'pending',
                        email: p.email || 'email@oculto.com',
                        isFree: p.is_free || false,
                        isVerified: p.is_verified || false
                    }));

                setResidents(resList);
                setProfessionals(profList);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id: any, type: 'residents' | 'professionals', newStatus: string) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            // Optimistic UI Update
            if (type === 'residents') {
                setResidents(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
            } else {
                setProfessionals(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
            }
        } catch (error) {
            alert('Erro ao atualizar status');
        }
    };

    const toggleProp = async (id: any, prop: 'isFree' | 'isVerified') => {
        // Map UI prop to DB column
        const dbCol = prop === 'isFree' ? 'is_free' : 'is_verified';
        const currentList = professionals.find(u => u.id === id);
        if (!currentList) return;

        const newVal = !currentList[prop];

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ [dbCol]: newVal })
                .eq('id', id);

            if (error) throw error;

            setProfessionals(prev => prev.map(u => u.id === id ? { ...u, [prop]: newVal } : u));
        } catch (error) {
            alert('Erro ao atualizar propriedade');
        }
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
