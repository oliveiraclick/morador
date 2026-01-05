import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building, MapPin, CheckCircle2 } from 'lucide-react';

const CompleteRegistration: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [condos, setCondos] = useState<any[]>([]);

    // Form Data
    const [formData, setFormData] = useState({
        condo_id: '',
        unit: '',
        phone: '' // Optional but good to have
    });

    useEffect(() => {
        const fetchCondos = async () => {
            const { data } = await supabase.from('condos').select('id, name').eq('status', 'active');
            if (data) {
                setCondos(data);
                // Add hardcoded option if needed, or rely on DB
                if (!data.find(c => c.name.includes('Splendido'))) {
                    setCondos(prev => [...prev, { id: 'splendido-mock-id', name: 'Residencial Splendido (Teste)' }]);
                }
            }
        };
        fetchCondos();
    }, []);

    const handleSave = async () => {
        if (!formData.condo_id || !formData.unit) {
            alert('Por favor, selecione seu condomínio e unidade.');
            return;
        }

        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('Usuário não autenticado');

            const { error } = await supabase
                .from('profiles')
                .update({
                    condo_id: formData.condo_id,
                    unit: formData.unit,
                    //   phone: formData.phone, // Update if you have phone column
                    status: 'active' // Mark as fully active
                })
                .eq('id', user.id);

            if (error) throw error;

            const selectedCondoObj = condos.find(c => String(c.id) === String(formData.condo_id));
            if (selectedCondoObj) {
                localStorage.setItem('user_condo', selectedCondoObj.name);
            }

            alert('Cadastro completo! Agora você pode aproveitar tudo.');
            navigate(-1); // Go back to where they were (e.g., Sell Item) or Home
        } catch (error: any) {
            console.error('Error updating profile:', error);
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-xl text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
                    <Building size={32} />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Quase lá!</h1>
                <p className="text-gray-500 mb-8 text-sm">
                    Para anunciar ou interagir, precisamos saber onde você mora.
                </p>

                <div className="space-y-4 text-left">

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Condomínio</label>
                        <div className="relative">
                            <select
                                value={formData.condo_id}
                                onChange={e => setFormData({ ...formData, condo_id: e.target.value })}
                                className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none appearance-none bg-white text-gray-700"
                            >
                                <option value="" disabled>Selecione...</option>
                                {condos.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <Building size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Apartamento / Unidade</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.unit}
                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                placeholder="Ex: Bloco A, Ap 102"
                                className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:outline-none"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <MapPin size={16} />
                            </div>
                        </div>
                    </div>

                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full mt-8 bg-[#7c3aed] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    {loading ? 'Salvando...' : 'Concluir Acesso'}
                    {!loading && <CheckCircle2 size={20} />}
                </button>

                <button onClick={() => navigate('/home')} className="mt-4 text-xs text-gray-400 font-medium hover:text-gray-600">
                    Pular por enquanto (Apenas visualizar)
                </button>

            </div>
        </div>
    );
};

export default CompleteRegistration;
