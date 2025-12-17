import React from 'react';
import { Megaphone } from 'lucide-react';

interface SystemNoticeProps {
    notice: {
        title: string;
        message: string;
        created_at: string;
    };
}

const SystemNotice: React.FC<SystemNoticeProps> = ({ notice }) => {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-l-4 border-l-primary-500 border-gray-100 flex gap-4 mb-8 animate-in slide-in-from-bottom-2">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                <Megaphone size={24} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Avisos e Ofertas</span>
                    <span className="text-xs text-gray-400">
                        {new Date(notice.created_at).toLocaleDateString()}
                    </span>
                </div>
                <h3 className="font-bold text-gray-900">{notice.title}</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
                    {notice.message}
                </p>
            </div>
        </div>
    );
};

export default SystemNotice;
