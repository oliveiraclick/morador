import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Check, X, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Category {
    id: string;
    name: string;
}

const AdminCategories: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('professional_categories')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert('Erro ao carregar categorias.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            const { error } = await supabase
                .from('professional_categories')
                .insert([{ name: newCategoryName.trim() }]);

            if (error) throw error;

            setShowAddModal(false);
            setNewCategoryName('');
            fetchCategories();
        } catch (error: any) {
            console.error('Error adding category:', error);
            alert('Erro ao adicionar categoria: ' + error.message);
        }
    };

    const handleDeleteCategory = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja remover a categoria "${name}"? isso não afetará usuários já cadastrados.`)) return;

        try {
            const { error } = await supabase
                .from('professional_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchCategories();
        } catch (error: any) {
            console.error('Error deleting category:', error);
            alert('Erro ao deletar categoria.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/admin')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                    <h1 className="font-bold text-lg text-gray-900">Gerenciar Categorias</h1>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 shadow-md transition-all active:scale-95"
                >
                    <Plus size={24} />
                </button>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Tag size={20} />
                                    </div>
                                    <span className="font-medium text-gray-800">{category.name}</span>
                                </div>
                                <button
                                    onClick={() => handleDeleteCategory(category.id, category.name)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}

                        {categories.length === 0 && (
                            <div className="text-center text-gray-500 py-10">
                                Nenhuma categoria encontrada.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Nova Categoria</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddCategory}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Nome da Categoria</label>
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:outline-none"
                                    placeholder="Ex: Eletricista"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newCategoryName.trim()}
                                    className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
