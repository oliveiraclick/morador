import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
    const [messages, setMessages] = useState<any[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const initializeChat = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUserId(user.id);
                fetchMessages(user.id);

                // Realtime subscription
                const subscription = supabase
                    .channel('public:messages')
                    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                        // Only add if it belongs to this chat context (simple check)
                        if (payload.new.product_context === product?.title || !product) {
                            fetchMessages(user.id); // Refresh to be safe/simple
                        }
                    })
                    .subscribe();

                return () => {
                    supabase.removeChannel(subscription);
                };
            }
        };

        initializeChat();
    }, []);

    // Initial Context Message (Optimistic / Check if exists)
    useEffect(() => {
        if (product && currentUserId && messages.length === 0) {
            // Check if we already sent an initial hello? For now, we just let the user type.
            // Or we can pre-fill the input
            setInputText(`Olá! Tenho interesse em: ${product.title}. Podemos negociar?`);
        }
    }, [product, currentUserId]);

    const fetchMessages = async (userId: string) => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order('created_at', { ascending: true });

        if (error) console.error(error);

        if (data) {
            // Filter by "context" if we want to separate chats by product, 
            // OR just show all for this specific seller/demo flow.
            // For MVP, we'll try to match product_context if available, otherwise show all chronologically
            const filtered = product
                ? data.filter(m => m.product_context === product.title || !m.product_context)
                : data;

            const formatted = filtered.map(m => ({
                id: m.id,
                text: m.content,
                sender: m.sender_id === userId ? 'me' : 'them',
                time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: m.read ? 'read' : 'sent'
            }));
            setMessages(formatted);
        }
    };

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || !currentUserId) return;

        const text = inputText;
        setInputText(''); // Optimistic clear

        // 1. Optimistic UI update
        const tempId = Date.now();
        const newMessage = {
            id: tempId,
            text: text,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };
        setMessages(prev => [...prev, newMessage]);

        // 2. Play Sound
        try {
            const audio = new Audio(DING_SOUND);
            audio.play().catch(e => console.log('Audio play blocked', e));
        } catch (e) {
            console.log('Audio error', e);
        }

        // 3. Send to Supabase
        const { error } = await supabase.from('messages').insert([{
            sender_id: currentUserId,
            receiver_id: product?.sellerId || null,
            content: text,
            product_context: product?.title || null
        }]);

        if (error) {
            console.error('Error sending message:', error);
            // Optionally rollback UI
        }
    };

    return (
        <div className="bg-[#e5ddd5] min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-[#008069] text-white p-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-1 hover:bg-white/10 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="font-bold text-base leading-tight">{seller}</h1>
                        <p className="text-xs text-white/80">Online agora</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Video size={24} />
                    <Phone size={24} />
                    <MoreVertical size={24} />
                </div>
            </div>

            {/* Product Context Banner */}
            {product && (
                <div className="bg-white p-3 flex gap-3 shadow-sm border-b border-gray-200 sticky top-[72px] z-10">
                    <img src={product.image || product.img} className="w-12 h-12 bg-gray-100 rounded-lg object-cover" />
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-sm">{product.title}</h3>
                        <p className="text-xs text-[#008069] font-bold">R$ {product.price?.toFixed(2)}</p>
                    </div>
                </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                {messages.map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-lg shadow-sm text-sm relative ${msg.sender === 'me' ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none'
                            }`}>
                            <p className="mb-1">{msg.text}</p>
                            <div className="flex justify-end items-center gap-1">
                                <span className="text-[10px] text-gray-500">{msg.time}</span>
                                {msg.sender === 'me' && (
                                    <span className="text-[#53bdeb] font-bold text-[10px]">✓✓</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-2 bg-[#f0f2f5] flex items-center gap-2 fixed bottom-0 left-0 right-0">
                <div className="bg-white flex-1 rounded-full flex items-center px-4 py-2 shadow-sm">
                    <Smile size={24} className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Mensagem"
                        className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    />
                    <Paperclip size={24} className="text-gray-400 ml-2" />
                </div>
                <button
                    onClick={handleSend}
                    className="w-12 h-12 bg-[#008069] rounded-full flex items-center justify-center text-white shadow-md transform active:scale-95 transition-transform"
                >
                    <Send size={24} />
                </button>
            </div>
        </div>
    );
};

export default Chat;
