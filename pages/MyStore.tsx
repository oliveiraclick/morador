import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const MyStore: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            // Timeout safety
            const timer = setTimeout(() => {
                if (mounted && loading) {
                    setLoading(false);
                    setError('Tempo limite excedido. Tente recarregar.');
                }
            }, 10000);

            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) {
                    if (mounted) setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('marketplace_items')
                    .select('*')
                    .eq('seller_id', session.user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (mounted) setItems(data || []);
            } catch (err: any) {
                console.error('Error fetching items:', err);
                if (mounted) setError(err.message || 'Erro ao carregar itens.');
            } finally {
                clearTimeout(timer);
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este item?')) return;

        try {
            const { error } = await supabase
                .from('marketplace_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Erro ao excluir item.');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Minha Loja</h1>
                </div>
                <button
                    onClick={() => navigate('/sell')}
                    className="flex items-center gap-1 bg-primary-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-700 transition-colors"
                >
                    <Plus size={16} />
                    Adicionar
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm font-medium">
                        Ops: {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="mb-4">Você ainda não tem itens à venda.</p>
                        <button
                            onClick={() => navigate('/sell')}
                            className="text-primary-600 font-bold hover:underline"
                        >
                            Começar a vender agora
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-3">
                                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] uppercase font-bold text-gray-400">{item.category}</span>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{item.title}</h3>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <span className="font-bold text-gray-900">R$ {item.price?.toFixed(2)}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.active !== false ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {item.active !== false ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyStore;
