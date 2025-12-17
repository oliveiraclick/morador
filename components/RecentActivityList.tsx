import React from 'react';
import { Store, FileText, Users, LucideIcon } from 'lucide-react';

// Map icon names to components if needed, or pass component directly in data
// For simplicity, we'll assume a static structure or pass type
interface ActivityItem {
    type: 'new_condo' | 'payment_refused' | 'new_users';
    title: string;
    time: string;
    detail: string;
}

const iconMap: Record<string, { icon: LucideIcon; bg: string; color: string }> = {
    new_condo: { icon: Store, bg: 'bg-purple-100', color: 'text-purple-600' },
    payment_refused: { icon: FileText, bg: 'bg-red-100', color: 'text-red-500' },
    new_users: { icon: Users, bg: 'bg-blue-100', color: 'text-blue-600' },
};

const RecentActivityList: React.FC = () => {
    // In a real app, this would be props.data
    const activities: ActivityItem[] = [
        { type: 'new_condo', title: 'Novo Condomínio Cadastrado', time: '2m atrás', detail: 'Residencial Flores do Campo • Plano Pro' },
        { type: 'payment_refused', title: 'Pagamento Recusado', time: '15m atrás', detail: 'Condomínio Solar • R$ 1.200,00' },
        { type: 'new_users', title: 'Novos Usuários (Lote)', time: '1h atrás', detail: 'Importação via CSV concluída • 120 registros' },
    ];

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <div className="space-y-6">
                {activities.map((item, idx) => {
                    const style = iconMap[item.type];
                    const Icon = style.icon;
                    return (
                        <div key={idx} className="flex gap-4">
                            <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center flex-shrink-0 ${style.color}`}>
                                <Icon size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                                    <span className="text-[10px] text-gray-400">{item.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentActivityList;
