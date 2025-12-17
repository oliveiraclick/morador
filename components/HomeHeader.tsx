import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell,
    QrCode,
    Plus,
    ShoppingBag as ShoppingBagIcon,
    Sparkles as SparklesIcon,
    Utensils as UtensilsIcon,
    Hammer as HammerIcon,
    LayoutGrid
} from 'lucide-react';

interface HomeHeaderProps {
    userAvatar: string | null;
    userName: string;
    condoName: string;
    unreadCount: number;
    onOpenNotifications: () => void;
    onOpenReferral: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
    userAvatar,
    userName,
    condoName,
    unreadCount,
    onOpenNotifications,
    onOpenReferral
}) => {
    const navigate = useNavigate();

    const categories = [
        { name: 'Anunciar', icon: <Plus size={24} />, color: 'bg-white/20 text-white border-white/30', action: () => navigate('/sell') },
        { name: 'Desapego', icon: <ShoppingBagIcon />, color: 'bg-white/10 text-purple-100 border-white/10', action: () => navigate('/market', { state: { category: 'Todos' } }) },
        { name: 'Beleza', icon: <SparklesIcon />, color: 'bg-white/10 text-purple-100 border-white/10', action: () => navigate('/market', { state: { category: 'Beleza' } }) },
        { name: 'Comida', icon: <UtensilsIcon />, color: 'bg-white/10 text-purple-100 border-white/10', action: () => navigate('/market', { state: { category: 'Comida' } }) },
        { name: 'Serviços', icon: <HammerIcon />, color: 'bg-white/10 text-purple-100 border-white/10', action: () => navigate('/service-search') },
        { name: 'Ver todos', icon: <LayoutGrid size={24} />, color: 'bg-white/5 text-purple-200 border-white/5', action: () => navigate('/categories') },
    ];

    return (
        <header className="bg-[#7c3aed] text-white pt-12 pb-10 rounded-b-[40px] px-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute left-0 bottom-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-overlay blur-3xl -ml-16 -mb-16"></div>
            </div>

            <div className="relative z-10 flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div onClick={() => navigate('/resident-profile')} className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 cursor-pointer overflow-hidden relative">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                className="w-full h-full object-cover"
                                alt="Avatar"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        ) : (
                            <span className="font-bold text-lg">{userName.charAt(0)}</span>
                        )}
                    </div>
                    <div>
                        <h1 className="font-bold text-2xl leading-tight text-white mb-0.5">Olá, {userName} 👋</h1>
                        <p className="text-sm text-purple-200 font-medium tracking-wide bg-white/10 px-2 py-0.5 rounded-md inline-block backdrop-blur-sm border border-white/5">{condoName}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={onOpenNotifications} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center relative hover:bg-white/20 transition-colors">
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-400 border-2 border-[#7c3aed] rounded-full"></span>
                        )}
                    </button>
                    <button onClick={onOpenReferral} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                        <QrCode size={20} />
                    </button>
                </div>
            </div>

            {/* Categories / Quick Actions */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-2 -mx-2">
                {categories.map((cat, idx) => (
                    <button onClick={cat.action} key={idx} className="flex flex-col items-center gap-2 min-w-[72px] flex-shrink-0 transition-transform active:scale-95">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border backdrop-blur-sm ${cat.color} ${idx === 0 ? 'border-dashed border-2' : ''} shadow-lg shadow-purple-900/10`}>
                            {cat.icon}
                        </div>
                        <span className="text-xs font-medium text-white/90 whitespace-nowrap">{cat.name}</span>
                    </button>
                ))}
            </div>
        </header>
    );
};

export default HomeHeader;
