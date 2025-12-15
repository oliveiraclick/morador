import React from 'react';
import { X, Copy, QrCode } from 'lucide-react';

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
    userName: string;
}

const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose, userName }) => {
    if (!isOpen) return null;

    // Generate URL for professional registration with referrer param
    // Using window.location.origin to adapt to local or deployed environment
    const referralLink = `${window.location.origin}/register/professional?ref=${encodeURIComponent(userName)}`;

    // QR Code API (using Google Charts API or similar public one for stability)
    // api.qrserver.com is also good: https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=...
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(referralLink)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        alert('Link copiado!');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative">

                {/* Header */}
                <div className="bg-[#7c3aed] p-6 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center text-[#7c3aed]">
                        <QrCode size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Indicar Profissional</h2>
                    <p className="text-purple-100 text-sm mt-1">Peça para o prestador escanear</p>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center gap-6">

                    {/* QR Code */}
                    <div className="p-2 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                        <img src={qrCodeUrl} alt="QR Code de Indicação" className="w-48 h-48 rounded-lg mix-blend-multiply" />
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-4">Ou compartilhe o link direto</p>
                        <button
                            onClick={handleCopy}
                            className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-gray-100 rounded-xl text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors"
                        >
                            <Copy size={16} />
                            Copiar Link de Indicação
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReferralModal;
