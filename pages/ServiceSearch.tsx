import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, MapPin, Star, MessageSquare } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';

interface Professional {
    id: string;
    full_name: string;
    profession: string;
    service_history: string;
    avatar_url: string;
}

const ServiceSearch: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const [results, setResults] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(false);

    const searchProfessionals = async (term: string) => {
        if (!term.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            // Fetch profiles with role PROFESSIONAL and matching profession or name
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, profession, service_history, avatar_url')
                .eq('role', UserRole.PROFESSIONAL)
                .ilike('profession', `%${term}%`); // Simple search on profession for now

            // Allow searching by name as well?
            // .or(`profession.ilike.%${term}%,full_name.ilike.%${term}%`) 

            if (error) throw error;
            setResults(data || []);
        } catch (error) {
            console.error('Error searching professionals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialQuery) {
            searchProfessionals(initialQuery);
        }
    }, [initialQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchProfessionals(searchTerm);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                    <h1 className="font-bold text-lg text-gray-900">Buscar Profissionais</h1>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Ex: Encanador, Eletricista..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-500 focus:outline-none transition-colors"
                        autoFocus
                    />
                </form>
            </div>

            {/* Results */}
            <div className="p-4 space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">
                        Buscando...
                    </div>
                ) : results.length > 0 ? (
                    results.map(prof => (
                        <div key={prof.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg flex-shrink-0">
                                {prof.avatar_url ? (
                                    <img src={prof.avatar_url} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    prof.full_name?.substring(0, 2).toUpperCase()
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-900 truncate">{prof.full_name}</h3>
                                    <div className="flex items-center text-xs text-yellow-500 font-bold gap-1">
                                        <Star size={12} fill="currentColor" />
                                        4.9
                                    </div>
                                </div>
                                <p className="text-purple-600 font-medium text-sm mb-1">{prof.profession}</p>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{prof.service_history || 'Sem descrição.'}</p>

                                <button
                                    onClick={() => navigate('/chat', { state: { seller: prof.full_name, product: { title: `Serviço de ${prof.profession}`, price: 0 } } })}
                                    className="w-full bg-purple-50 text-purple-700 py-2 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageSquare size={14} />
                                    Chamar no Chat
                                </button>
                            </div>
                        </div>
                    ))
                ) : searchTerm ? (
                    <div className="text-center py-10 text-gray-500">
                        <p>Nenhum profissional encontrado para "{searchTerm}".</p>
                        <p className="text-sm mt-2">Tente buscar por termos como "Pedreiro", "Pintor", etc.</p>
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        Digite uma profissão para buscar.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceSearch;
