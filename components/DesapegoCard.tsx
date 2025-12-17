import React from 'react';
import { Heart } from 'lucide-react';

interface DesapegoCardProps {
    item: {
        id: string;
        title: string;
        price: number | string;
        image_url: string;
        category: string;
    };
    onClick: () => void;
}

const DesapegoCard: React.FC<DesapegoCardProps> = ({ item, onClick }) => {
    return (
        <div
            className="w-36 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col shrink-0 cursor-pointer hover:shadow-md transition-shadow"
            onClick={onClick}
        >
            <div className="relative mb-3 bg-gray-100 rounded-xl aspect-square overflow-hidden">
                <img
                    src={item.image_url}
                    onError={(e) => {
                        console.error('Image load error for:', item.title, item.image_url);
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=500';
                    }}
                    className="w-full h-full object-cover"
                    alt={item.title}
                />
                <span className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg font-medium">
                    {item.category}
                </span>
            </div>
            <h3 className="font-bold text-gray-900 leading-tight mb-1 truncate text-xs">{item.title}</h3>
            <div className="mt-auto flex justify-between items-center">
                <span className="font-bold text-primary-600 text-xs">
                    R$ {Number(item.price).toFixed(2).replace('.', ',')}
                </span>
                <button
                    className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Future like functionality
                    }}
                >
                    <Heart size={14} />
                </button>
            </div>
        </div>
    );
};

export default DesapegoCard;
