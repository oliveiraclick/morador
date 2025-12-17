import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, RotateCcw, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AdminBranding: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);

    // Constants
    const BUCKET_NAME = 'marketplace'; // Using existing bucket for simplicity
    const FILE_PATH = 'app/logo.png';

    useEffect(() => {
        fetchCurrentLogo();
    }, []);

    const fetchCurrentLogo = async () => {
        // Construct public URL with timestamp to bust cache
        const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(FILE_PATH);
        // We append a random param to ensure we see the latest version
        setCurrentLogoUrl(`${publicUrl}?t=${Date.now()}`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedInfo = e.target.files[0];
            setFile(selectedInfo);

            // Preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedInfo);
        }
    };

    const handleSave = async () => {
        if (!file) return;
        setLoading(true);

        try {
            // 1. Upload/Overwrite file
            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(FILE_PATH, file, {
                    upsert: true,
                    contentType: 'image/png'
                });

            if (error) throw error;

            alert('Logo atualizada com sucesso! Reinicie o app para ver as mudanças.');
            fetchCurrentLogo();
            setPreview(null);
            setFile(null);

        } catch (err: any) {
            console.error('Error uploading logo:', err);
            alert('Erro ao salvar logo: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} className="text-gray-900" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">Identidade Visual</h1>
            </div>

            <div className="p-6 max-w-md mx-auto space-y-8">

                {/* Current Logo Section */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                    <h2 className="text-sm font-bold text-gray-500 uppercase mb-4">Logo Atual</h2>
                    <div className="w-32 h-32 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 p-2 overflow-hidden mb-4">
                        {currentLogoUrl ? (
                            <img src={currentLogoUrl} alt="App Logo" className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                        ) : (
                            <ImageIcon className="text-gray-300" size={40} />
                        )}
                    </div>
                    <p className="text-xs text-gray-400">
                        Esta imagem é usada na tela de Splash e Login.
                    </p>
                </div>

                {/* Upload Section */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-sm font-bold text-gray-900 mb-4">Alterar Logo</h2>

                    <div className="mb-6">
                        <label className="block w-full cursor-pointer group">
                            <div className="w-full h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-purple-200 group-hover:border-purple-500 transition-colors flex flex-col items-center justify-center relative overflow-hidden">
                                {preview ? (
                                    <img src={preview} alt="New Logo" className="w-full h-full object-contain p-4" />
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                                            <Upload className="text-purple-600" size={24} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">Toque para selecionar</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG Transparente (512x512)</span>
                                    </>
                                )}
                                <input type="file" className="hidden" accept="image/png" onChange={handleFileChange} />
                            </div>
                        </label>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!file || loading}
                        className="w-full bg-[#7c3aed] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-[#6d28d9] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Salvar Alterações
                    </button>
                </div>

                {/* PWA Warning */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-blue-700">
                    <RotateCcw className="shrink-0 mt-0.5" size={18} />
                    <div className="text-xs leading-relaxed">
                        <strong>Nota sobre Ícone do App (PWA):</strong><br />
                        O ícone que aparece na tela inicial do celular é definido na instalação. Alterações aqui podem demorar para propagar ou exigir reinstalação.
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminBranding;
