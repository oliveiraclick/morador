import React from 'react';

interface AdminSectorChartProps {
    data: {
        name: string;
        count: number;
        color: string;
    }[];
    total: number;
}

const AdminSectorChart: React.FC<AdminSectorChartProps> = ({ data, total }) => {
    return (
        <div className="col-span-2 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Prestadores por Setor</h3>
            <div className="space-y-3">
                {data.map((sec, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${sec.color}`}></span>
                        <span className="text-xs text-gray-500 flex-1">{sec.name}</span>
                        <span className="text-xs font-bold text-gray-900">{sec.count}</span>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${sec.color}`} style={{ width: `${(sec.count / total) * 100}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSectorChart;
