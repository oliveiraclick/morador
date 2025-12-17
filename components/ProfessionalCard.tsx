import React from 'react';

interface ProfessionalCardProps {
    professional: {
        avatar: string;
        profession: string;
        name: string;
    };
    isMultiple: boolean;
    onCall: () => void;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional, isMultiple, onCall }) => {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-lg shadow-blue-200 relative overflow-hidden group">
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>

            <div className={`flex ${isMultiple ? 'flex-col items-center text-center' : 'items-center gap-4'}`}>
                <div className="relative">
                    <img src={professional.avatar} className="w-14 h-14 rounded-full border-2 border-white/30 shadow-md" alt={professional.name} />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-blue-600 rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg leading-tight truncate w-full">{professional.profession}</h3>
                    <p className="text-xs text-blue-100 truncate w-full">{professional.name}</p>

                    <button
                        onClick={onCall}
                        className={`mt-3 bg-white text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm ${isMultiple ? 'w-full py-2' : 'px-6 py-2 w-auto'}`}
                    >
                        Chamar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalCard;
