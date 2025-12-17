import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminStatsCardProps {
    icon: LucideIcon;
    iconColorClass: string; // e.g., "text-purple-600"
    iconBgClass: string; // e.g., "bg-purple-100"
    percentage: string;
    percentageColorClass: string; // e.g., "text-green-700"
    percentageBgClass: string; // e.g., "bg-green-100"
    label: string;
    value: string;
}

const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
    icon: Icon,
    iconColorClass,
    iconBgClass,
    percentage,
    percentageColorClass,
    percentageBgClass,
    label,
    value,
}) => {
    return (
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-2xl ${iconBgClass} flex items-center justify-center ${iconColorClass}`}>
                    <Icon size={20} />
                </div>
                <span className={`px-2 py-1 ${percentageBgClass} ${percentageColorClass} text-[10px] font-bold rounded-full`}>
                    {percentage}
                </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
    );
};

export default AdminStatsCard;
