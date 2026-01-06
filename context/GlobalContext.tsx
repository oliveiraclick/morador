import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    condo_id: string;
    unit: string;
    avatar_url: string;
    role: string;
    condo_name?: string;
}

interface Item {
    id: number;
    title: string;
    description: string;
    price: number;
    image_url: string;
    seller_id: string;
    category: string;
    type: 'desapego' | 'loja';
    created_at: string;
    profiles?: {
        full_name: string;
        unit: string;
        avatar_url: string;
    };
    // Mapped properties for UI
    img: string;
    seller: string;
    sellerAvatar: string;
    sellerAvatarUrl?: string;
    sellerColor: string;
    location: string;
    time: string;
    condition: string;
    originalPrice?: number;
}

interface Condo {
    id: string;
    name: string;
    address: string;
}

interface GlobalContextType {
    profile: UserProfile | null;
    items: Item[];
    condos: Condo[];
    loading: boolean;
    refreshProfile: () => Promise<void>;
    refreshItems: () => Promise<void>;
    refreshCondos: () => Promise<void>;
    refreshAll: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    // Unified synchronization logic
    const syncLocalProfile = (data: any) => {
        if (!data) return;
        if (data.id) localStorage.setItem('user_id', data.id);
        localStorage.setItem('user_name', data.full_name || '');
        localStorage.setItem('user_role', data.role || '');
        if (data.condo_name) localStorage.setItem('user_condo', data.condo_name);
        if (data.condo_id) localStorage.setItem('user_condo_id', data.condo_id);
        if (data.avatar_url) localStorage.setItem('user_avatar', data.avatar_url);
        if (data.unit) localStorage.setItem('user_unit', data.unit);
        if (data.phone) localStorage.setItem('user_phone', data.phone);
        localStorage.setItem('user_registered', 'true');
    };

    const [profile, setProfile] = useState<UserProfile | null>(() => {
        // Hydrate from localStorage for instant UI
        const savedId = localStorage.getItem('user_id');
        const savedName = localStorage.getItem('user_name');
        const savedRole = localStorage.getItem('user_role');
        const savedCondo = localStorage.getItem('user_condo');
        const savedCondoId = localStorage.getItem('user_condo_id');
        const savedAvatar = localStorage.getItem('user_avatar');

        if (savedId || savedName || savedRole) {
            return {
                id: savedId || '',
                full_name: savedName || '',
                role: savedRole || '',
                condo_name: savedCondo || '',
                condo_id: savedCondoId || '',
                avatar_url: savedAvatar || '',
                email: '',
                phone: '',
                unit: ''
            };
        }
        return null;
    });

    const [items, setItems] = useState<Item[]>([]);
    const [condos, setCondos] = useState<Condo[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                console.log('Fetching profile for user:', user.id);

                // 1. Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (profileError) {
                    console.error('Profile fetch error:', profileError);
                }

                if (profileData) {
                    // 2. Fetch Condo Name independently (more robust than join)
                    let condoName = '';
                    if (profileData.condo_id) {
                        const { data: condoData } = await supabase
                            .from('condos')
                            .select('name')
                            .eq('id', profileData.condo_id)
                            .maybeSingle();
                        if (condoData) condoName = condoData.name;
                    }

                    const updatedProfile = {
                        ...profileData,
                        email: user.email || '',
                        condo_name: condoName
                    };

                    setProfile(updatedProfile);
                    syncLocalProfile(updatedProfile);
                    console.log('Profile synced successfully');
                } else {
                    console.warn('No profile found for authenticated user');
                }
            } else {
                setProfile(null);
                localStorage.removeItem('user_id');
                localStorage.removeItem('user_role');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const refreshItems = async () => {
        try {
            const { data, error } = await supabase
                .from('marketplace_items')
                .select(`
                    *,
                    profiles:seller_id (full_name, unit, avatar_url)
                `)
                .order('created_at', { ascending: false });

            if (data) {
                const mappedItems: Item[] = data.map(item => ({
                    ...item,
                    type: item.type ? item.type.trim().toUpperCase() : 'DESAPEGO',
                    img: item.image_url,
                    seller: item.profiles?.full_name || 'Vendedor',
                    sellerAvatar: item.profiles?.full_name?.substring(0, 2).toUpperCase() || 'VA',
                    sellerAvatarUrl: item.profiles?.avatar_url,
                    sellerColor: 'bg-purple-500',
                    location: item.profiles?.unit || 'Condomínio',
                    time: new Date(item.created_at).toLocaleDateString(),
                    condition: 'Novo',
                    originalPrice: item.original_price
                }));
                setItems(mappedItems);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const refreshCondos = async () => {
        try {
            const { data } = await supabase.from('condos').select('*');
            if (data) setCondos(data);
        } catch (error) {
            console.error('Error fetching condos:', error);
        }
    };

    const refreshAll = async () => {
        setLoading(true);
        try {
            await Promise.all([refreshProfile(), refreshItems(), refreshCondos()]);
        } catch (error) {
            console.error('Error in refreshAll:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshAll();

        // One-stop listener for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event change in GlobalContext:', event);
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                await refreshProfile();
            } else if (event === 'SIGNED_OUT') {
                setProfile(null);
                localStorage.clear();
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <GlobalContext.Provider value={{
            profile,
            items,
            condos,
            loading,
            refreshProfile,
            refreshItems,
            refreshCondos,
            refreshAll
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
};
