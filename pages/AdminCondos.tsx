import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, MapPin, Building, Trash2, Edit2, Search, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Condo {
    id: number;
    name: string;
    address: string;
    units: number;
    manager: string;
    status: 'active' | 'inactive';
}

const AdminCondos: React.FC = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Data State
    const [condos, setCondos] = useState<Condo[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCondos = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('condos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setCondos(data);
        } catch (error) {
            console.error('Error fetching condos:', error);
            alert('Erro ao carregar condomínios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCondos();
    }, []);

    // List State
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form State
    const [newCondo, setNewCondo] = useState({ name: '', address: '', units: '', manager: '' });

    const handleEdit = (condo: Condo) => {
        setEditingId(condo.id);
        setNewCondo({
            name: condo.name,
            address: condo.address,
            units: condo.units.toString(),
            manager: condo.manager
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este condomínio?')) {
            try {
                const { error } = await supabase
                    .from('condos')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                fetchCondos(); // Refresh list
            } catch (error) {
                console.error('Error deleting condo:', error);
                alert('Erro ao excluir condomínio');
            }
        }
    };

    const handleSaveCondo = async () => {
        if (!newCondo.name || !newCondo.address) return;

        try {
            if (editingId) {
                // Update existing
                const { error } = await supabase
                    .from('condos')
                    .update({
                        name: newCondo.name,
                        address: newCondo.address,
                        units: Number(newCondo.units) || 0,
                        manager: newCondo.manager
                    })
                    .eq('id', editingId);

                if (error) throw error;
            } else {
                // Create new
                const { error } = await supabase
                    .from('condos')
                    .insert([{
                        name: newCondo.name,
                        address: newCondo.address,
                        units: Number(newCondo.units) || 0,
                        manager: newCondo.manager,
                        status: 'active'
                    }]);

                if (error) throw error;
            }

            fetchCondos(); // Refresh list
            setNewCondo({ name: '', address: '', units: '', manager: '' });
            setEditingId(null);
            setShowModal(false);
        } catch (error) {
            console.error('Error saving condo:', error);
            alert('Erro ao salvar condomínio');
        }
    };

    const handleCloseModal = () => {
        setNewCondo({ name: '', address: '', units: '', manager: '' });
        setEditingId(null);
        setShowModal(false);
    };

    const filteredCondos = condos.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative">
            {/* Header */}
            <div className="bg-white px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900">Condomínios</h1>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setNewCondo({ name: '', address: '', units: '', manager: '' });
                        setShowModal(true);
                    }}
                    className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200 hover:scale-105 transition-transform"
                >
                    <Plus size={24} />
                </button>
            </div>

            <div className="p-6">
                {/* Search */}
                <div className="bg-white rounded-xl border border-gray-200 flex items-center px-4 py-3 mb-6">
                    <Search size={20} className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Buscar condomínio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 outline-none text-sm"
                    />
                </div>

                {/* List */}
                <div className="space-y-4">
                    {filteredCondos.map(condo => (
                        <div key={condo.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <Building size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{condo.name}</h3>
                                        <p className="text-xs text-gray-500">{condo.units} unidades • {condo.manager}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${condo.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {condo.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg mb-3">
                                <MapPin size={14} className="text-gray-400" />
                                <span className="truncate">{condo.address}</span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(condo)}
                                    className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 flex items-center justify-center gap-1"
                                >
                                    <Edit2 size={14} /> Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(condo.id)}
                                    className="w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 animate-in slide-in-from-bottom-10 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Editar Condomínio' : 'Novo Condomínio'}</h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <ArrowLeft size={20} className="rotate-[-90deg]" />
                            </button>
                        </div>

                        <div className="space-y-4 pb-8"> {/* Added bottom padding */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Nome do Condomínio</label>
                                <input
                                    type="text"
                                    value={newCondo.name} onChange={e => setNewCondo({ ...newCondo, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                                    placeholder="Ex: Residencial Flores"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Endereço Completo</label>
                                <input
                                    type="text"
                                    value={newCondo.address} onChange={e => setNewCondo({ ...newCondo, address: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                                    placeholder="Rua, Número, Bairro, Cidade"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Unidades</label>
                                    <input
                                        type="number"
                                        value={newCondo.units} onChange={e => setNewCondo({ ...newCondo, units: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                                        placeholder="Ex: 50"
                                    />
                                </div>
                                <div className="flex-[2]">
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Responsável/Síndico</label>
                                    <input
                                        type="text"
                                        value={newCondo.manager} onChange={e => setNewCondo({ ...newCondo, manager: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
                                        placeholder="Nome do Responsável"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSaveCondo}
                                disabled={!newCondo.name || !newCondo.address}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 mt-4 mb-2"
                            >
                                <CheckCircle size={20} /> {editingId ? 'Salvar Alterações' : 'Salvar Cadastro'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCondos;
