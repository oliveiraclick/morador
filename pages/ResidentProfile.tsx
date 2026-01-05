
import React from 'react';
import { ArrowLeft, User, MapPin, Heart, Settings, LogOut, ChevronRight, Bell, Camera, ShoppingBag as ShoppingBagIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { APP_VERSION } from '../lib/constants';

import { useGlobal } from '../context/GlobalContext';

const ResidentProfile: React.FC = () => {
    const navigate = useNavigate();
    const { profile, refreshProfile, condos: globalCondos } = useGlobal(); // Use Global Context

    // Initial State from Context
    const [name, setName] = React.useState(profile?.full_name || localStorage.getItem('user_name') || 'Morador');
    const [condo, setCondo] = React.useState(profile?.condo_name || localStorage.getItem('user_condo') || 'Condomínio não informado');

    const [activeModal, setActiveModal] = React.useState<'favorites' | 'notifications' | 'personal' | 'address' | null>(null);

    // Form States
    const [loading, setLoading] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);

    // We can assume profile is loaded or loading, but for form fields we need local state
    const [userId, setUserId] = React.useState(profile?.id || '');
    const [phone, setPhone] = React.useState(profile?.phone || '');
    const [email, setEmail] = React.useState(profile?.email || '');
    const [avatarUrl, setAvatarUrl] = React.useState(profile?.avatar_url || '');

    // Address Form
    const [condos, setCondos] = React.useState<any[]>(globalCondos || []);
    const [selectedCondo, setSelectedCondo] = React.useState(profile?.condo_id || '');
    const [unit, setUnit] = React.useState(profile?.unit || '');

    // Sync with Global Profile when it changes (e.g. after refresh)
    React.useEffect(() => {
        if (profile) {
            setUserId(profile.id);
            setName(profile.full_name || 'Morador');
            setPhone(profile.phone || '');
            setEmail(profile.email || '');
            setAvatarUrl(profile.avatar_url || '');
            setCondo(profile.condo_name || 'Condomínio não informado');
            setSelectedCondo(profile.condo_id || '');
            setUnit(profile.unit || '');
        }
        if (globalCondos.length > 0) {
            setCondos(globalCondos);
        }
    }, [profile, globalCondos]);

    // Fallback: If no profile in context yet, fetch it (handled by Global, but we can trigger refresh)
    React.useEffect(() => {
        if (!profile) refreshProfile();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleUpdateProfile = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const { error } = await supabase.from('profiles').upsert({
                id: userId,
                full_name: name,
                phone: phone,
                updated_at: new Date().toISOString()
            });

            if (error) throw error;
            alert("Dados atualizados com sucesso!");

            localStorage.setItem('user_name', name);

            await refreshProfile(); // Refresh Global Context
            setActiveModal(null);
        } catch (e: any) {
            alert("Erro ao atualizar: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAddress = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const { error } = await supabase.from('profiles').upsert({
                id: userId,
                condo_id: selectedCondo,
                unit: unit,
                updated_at: new Date().toISOString()
            });

            if (error) throw error;

            // Update local display
            const sel = condos.find(c => String(c.id) === String(selectedCondo));
            if (sel) {
                setCondo(sel.name);
                localStorage.setItem('user_condo', sel.name);
                localStorage.setItem('user_condo_id', String(sel.id));
            }

            alert("Endereço atualizado com sucesso!");
            await refreshProfile(); // Refresh Global Context
            setActiveModal(null);
        } catch (e: any) {
            alert("Erro ao atualizar endereço: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            console.log('Starting avatar upload for user:', userId);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Você precisa selecionar uma imagem para fazer upload.');
            }

            if (!userId) {
                console.error('UserId is missing during upload');
                throw new Error('Sessão expirada. Por favor, faça login novamente.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            console.log('Uploading file to path:', filePath);

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { cacheControl: '3600', upsert: true });

            if (uploadError) {
                console.error('Storage Upload Error:', uploadError);
                throw uploadError;
            }

            console.log('Upload successful, getting public URL...');
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    avatar_url: publicUrl,
                    updated_at: new Date().toISOString()
                });

            if (updateError) {
                console.error('Profile Update Error after upload:', updateError);
                throw updateError;
            }

            setAvatarUrl(publicUrl);
            alert('Foto de perfil atualizada!');
            console.log('Avatar upload complete and profile updated.');

        } catch (error: any) {
            console.error('Global handleAvatarUpload Error:', error);
            alert('Erro ao fazer upload da imagem: ' + (error.message || 'Erro desconhecido'));
        } finally {
            setUploading(false);
        }
    };

    // Render Modal Content
    const renderModal = () => {
        if (!activeModal) return null;

        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-2xl">
                    <button
                        onClick={() => setActiveModal(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <Settings size={20} className="transform rotate-45" />
                    </button>

                    {activeModal === 'favorites' && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Heart className="text-pink-500" fill="currentColor" /> Meus Favoritos
                            </h3>
                            <div className="text-center py-8 text-gray-500">
                                <p>Você ainda não tem favoritos.</p>
                                <p className="text-xs mt-2">Explore o mercado para adicionar!</p>
                                <button onClick={() => navigate('/market')} className="mt-4 text-purple-600 font-bold text-sm">Explorar Agora</button>
                            </div>
                        </div>
                    )}

                    {activeModal === 'notifications' && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Bell className="text-amber-500" /> Notificações
                            </h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    Nenhuma notificação por enquanto.
                                </div>
                            </div>
                        </div>
                    )}

                    {activeModal === 'personal' && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <User className="text-blue-500" /> Dados Pessoais
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                    <input
                                        type="text"
                                        value={email}
                                        disabled
                                        className="w-full p-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Telefone</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="(00) 00000-0000"
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeModal === 'address' && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MapPin className="text-green-500" /> Endereços
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Condomínio</label>
                                    <select
                                        value={selectedCondo}
                                        onChange={e => setSelectedCondo(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none bg-white"
                                    >
                                        <option value="" disabled>Selecione</option>
                                        {condos.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Complemento / Unidade</label>
                                    <input
                                        type="text"
                                        value={unit}
                                        onChange={e => setUnit(e.target.value)}
                                        placeholder="Ex: Bloco A, Apto 101"
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
                                    />
                                </div>
                                <button
                                    onClick={handleUpdateAddress}
                                    disabled={loading}
                                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50"
                                >
                                    {loading ? 'Salvando...' : 'Salvar Endereço'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            {/* Header */}
            <div className="bg-[#7c3aed] pt-12 pb-24 px-6 rounded-b-[2.5rem] relative">
                <div className="flex justify-between items-center mb-6 text-white">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="font-bold text-lg">Meu Perfil</h1>
                    <button onClick={() => navigate('/settings')} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <Settings size={24} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-full bg-white p-1 shadow-xl overflow-hidden">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-2 border-white"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl">
                                    {name.charAt(0)}
                                </div>
                            )}
                        </div>
                        {/* Upload Button Overlay */}
                        <label className="absolute bottom-0 right-0 p-1.5 bg-green-400 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform shadow-sm">
                            <Camera size={14} className="text-white" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={uploading}
                            />
                        </label>
                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white leading-tight">{name}</h2>
                        <div className="flex items-center text-purple-200 text-sm mt-1">
                            <MapPin size={14} className="mr-1" />
                            {condo}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-12 space-y-6">

                {/* Stats Card */}
                <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100 flex justify-around">
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-gray-900">12</span>
                        <span className="text-xs text-gray-500 font-medium uppercase">Pedidos</span>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-gray-900">5</span>
                        <span className="text-xs text-gray-500 font-medium uppercase">Favoritos</span>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-gray-900">4.9</span>
                        <span className="text-xs text-gray-500 font-medium uppercase">Nota</span>
                    </div>
                </div>

                {/* Menu Options */}
                <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
                    {[
                        { icon: <Heart size={20} />, label: 'Meus Favoritos', color: 'text-pink-500 bg-pink-50', id: 'favorites', action: 'modal' },
                        { icon: <Bell size={20} />, label: 'Notificações', color: 'text-amber-500 bg-amber-50', id: 'notifications', action: 'modal' },
                        { icon: <User size={20} />, label: 'Dados Pessoais', color: 'text-blue-500 bg-blue-50', id: 'personal', action: 'modal' },
                        { icon: <ShoppingBagIcon size={20} />, label: 'Meus Anúncios', color: 'text-purple-500 bg-purple-50', id: 'my-ads', action: 'navigate', path: '/my-store' },
                        { icon: <MapPin size={20} />, label: 'Endereços', color: 'text-green-500 bg-green-50', id: 'address', action: 'modal' },
                        { icon: <Settings size={20} />, label: 'Configurações', color: 'text-gray-500 bg-gray-50', id: 'settings', action: 'navigate', path: '/settings' },
                    ].map((item, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                if (item.action === 'modal') {
                                    setActiveModal(item.id as any);
                                } else if (item.action === 'navigate' && item.path) {
                                    navigate(item.path);
                                }
                            }}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                                    {item.icon}
                                </div>
                                <span className="font-bold text-gray-700">{item.label}</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                        </button>
                    ))}
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                >
                    <LogOut size={20} />
                    Sair da Conta
                </button>

                <p className="text-center text-xs text-gray-400 mt-6">Versão {APP_VERSION} • Morador App</p>
            </div>

            {renderModal()}
        </div>
    );
};

export default ResidentProfile;
