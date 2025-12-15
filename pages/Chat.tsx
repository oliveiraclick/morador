import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Simple "Ding" sound as Base64 to ensure it works without external assets
const DING_SOUND = 'data:audio/mp3;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAG1xisiYkL02ECq8/3Xzwj3/9f/////////5///////4zAAABAAAASAAIAAAAAEAAAMAAAAAAAABAAAA/////////wAAAAAA//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAG1xisiYkL02ECq8/3Xzwj3/9f/////////5///////4zAAABAAAASAAIAAAAAEAAAMAAAAAAAABAAAA/////////wAAAAAA';

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'them';
    time: string;
    status: 'sent' | 'delivered' | 'read';
}

const Chat: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { seller, product } = location.state || { seller: 'Vendedor', product: null };
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputText, setInputText] = useState('');

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: 'Olá! Ainda está disponível?', sender: 'me', time: '10:30', status: 'read' },
        { id: 2, text: 'Oi! Sim, está disponível.', sender: 'them', time: '10:32', status: 'read' },
    ]);

    // Initial Context Message
    useEffect(() => {
        if (product) {
            const initialMsg = `Olá! Tenho interesse em: ${product.title}. Podemos negociar?`;
            setMessages(prev => [
                ...prev,
                { id: Date.now(), text: initialMsg, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'sent' }
            ]);
        }

        // Play sound on mount
        const audio = new Audio(DING_SOUND);
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio autoplay blocked', e));

    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMsg: Message = {
            id: Date.now(),
            text: inputText,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        setMessages([...messages, newMsg]);
        setInputText('');

        // Simulate auto-reply
        setTimeout(() => {
            const reply: Message = {
                id: Date.now() + 1,
                text: 'Combinado! Vou deixar reservado para você.',
                sender: 'them',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'read'
            };
            setMessages(prev => [...prev, reply]);
            const audio = new Audio(DING_SOUND);
            audio.play().catch(() => { });
        }, 3000);
    };

    return (
        <div className="flex flex-col h-screen bg-[#e5ddd5]">
            {/* WhatsApp Header */}
            <div className="bg-[#008069] text-white p-2 px-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-white/10">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="w-9 h-9 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center text-gray-600 font-bold text-sm bg-white">
                        {seller.charAt(0)}
                    </div>
                    <div className="ml-1 cursor-pointer">
                        <h1 className="text-sm font-bold leading-tight">{seller}</h1>
                        <p className="text-[10px] text-white/80">Online agora</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Video size={22} className="cursor-pointer" />
                    <Phone size={20} className="cursor-pointer" />
                    <MoreVertical size={20} className="cursor-pointer" />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat shadow-inner">
                <div className="text-center text-[10px] bg-yellow-100/80 text-gray-600 py-1 px-3 rounded-lg w-fit mx-auto mb-4 shadow-sm">
                    As mensagens são protegidas. Ninguém fora dessa conversa pode ler ou ouvir.
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`
                    max-w-[75%] rounded-lg px-3 py-1.5 shadow-sm text-sm relative
                    ${msg.sender === 'me' ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'}
                 `}>
                            <p className="text-gray-900 leading-relaxed pb-1">{msg.text}</p>
                            <div className="flex justify-end items-center gap-1">
                                <span className="text-[10px] text-gray-500 min-w-[30px] text-right">{msg.time}</span>
                                {msg.sender === 'me' && (
                                    <span className={`text-[10px] ${msg.status === 'read' ? 'text-blue-500' : 'text-gray-400'}`}>
                                        ✓✓
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-2 bg-[#f0f2f5] flex items-center gap-2">
                <div className="bg-white p-2 rounded-full cursor-pointer text-gray-500">
                    <Smile size={24} />
                </div>
                <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2 border border-white focus-within:border-white">
                    <input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        type="text"
                        placeholder="Mensagem"
                        className="flex-1 outline-none text-sm bg-transparent placeholder:text-gray-500"
                    />
                    <Paperclip size={20} className="text-gray-500 ml-2 cursor-pointer rotate-45" />
                </div>
                <button
                    onClick={handleSend}
                    className="bg-[#008069] p-3 rounded-full text-white shadow-md hover:bg-[#006d59] transition-colors"
                >
                    <Send size={20} className="ml-0.5" />
                </button>
            </div>

        </div>
    );
};

export default Chat;
