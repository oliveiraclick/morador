import React from 'react';
import { ChevronRight } from 'lucide-react';

interface OfferCardProps {
    ad: {
        id: string;
        title: string;
        description: string;
        image_url: string;
        link?: string;
    };
    onLinkClick: (link: string) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ ad, onLinkClick }) => {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 mb-4 relative overflow-hidden group">
            <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0">
                <img src={ad.image_url} className="w-full h-full object-cover rounded-xl" alt={ad.title} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 truncate pr-2">{ad.title}</h3>
                    <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-bold">Oferta</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 mb-2 line-clamp-2">{ad.description}</p>
                {ad.link && (
                    <button
                        onClick={() => onLinkClick(ad.link!)}
                        className="text-xs font-bold text-pink-600 flex items-center gap-1 hover:underline"
                    >
                        Ver detalhes <ChevronRight size={12} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default OfferCard;
