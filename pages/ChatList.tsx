import React, { useEffect, useState } from 'react';
import { ArrowLeft, MessageSquare, ShoppingBag, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ChatSummary {
    conversationId: string;
    partnerId: string;
    partnerName: string;
    partnerAvatar: string | null;
    lastMessage: string;
    timestamp: Date;
    unreadCount: number;
    productTitle: string | null;
    productImage: string | null; // If available in future
}

const ChatList: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState<ChatSummary[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchChats = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }
            setCurrentUserId(user.id);

            // Fetch all messages involving the user
            const { data: messages, error } = await supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching messages:", error);
                setLoading(false);
                return;
            }

            if (messages) {
                // Group by Conversation
                const conversationMap = new Map<string, any[]>();
                const partnerIds = new Set<string>();

                messages.forEach(msg => {
                    const isSender = msg.sender_id === user.id;
                    const partnerId = isSender ? msg.receiver_id : msg.sender_id;

                    if (!partnerId) return; // Skip system messages or broken records
                    partnerIds.add(partnerId);

                    const key = `${partnerId}_${msg.product_context || 'general'}`;

                    if (!conversationMap.has(key)) {
                        conversationMap.set(key, []);
                    }
                    conversationMap.get(key)?.push(msg);
                });

                // Fetch Partner Profiles
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url')
                    .in('id', Array.from(partnerIds));

                const profileMap = new Map(profiles?.map(p => [p.id, p]));

                // Build Summaries
                const summaries: ChatSummary[] = [];

                conversationMap.forEach((msgs, key) => {
                    // msgs are already roughly ordered by created_at desc from the main fetch, 
                    // but mapped group order might depend on insertion.
                    // Sort msgs just in case
                    msgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

                    const lastMsg = msgs[0];
                    const isSender = lastMsg.sender_id === user.id;
                    const partnerId = isSender ? lastMsg.receiver_id : lastMsg.sender_id;
                    const partner = profileMap.get(partnerId);

                    const unread = msgs.filter(m => m.receiver_id === user.id && !m.read).length;

                    summaries.push({
                        conversationId: key,
                        partnerId: partnerId,
                        partnerName: partner?.full_name || 'Usuário',
                        partnerAvatar: partner?.avatar_url || null,
                        lastMessage: lastMsg.content,
                        timestamp: new Date(lastMsg.created_at),
                        unreadCount: unread,
                        productTitle: lastMsg.product_context,
                        productImage: null
                    });
                });

                // Sort summaries by latest message
                summaries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
                setChats(summaries);
            }
            setLoading(false);
        };

        fetchChats();
    }, [navigate]);

    const handleOpenChat = (chat: ChatSummary) => {
        // Navigate to Chat Page
        // We need to pass state expected by Chat.tsx: { seller, product }
        // seller: Name of the other person? Chat.tsx uses "seller" string for header title.
        // product: { title, ... }

        // Note: Chat.tsx uses "seller" as a string name.

        navigate('/chat', {
            state: {
                seller: chat.partnerName,
                product: {
                    title: chat.productTitle,
                    sellerId: chat.partnerId, // Crucial for reply
                    // We don't have full product object here (like price, image) unless we fetch items.
                    // For MVP, we pass minimum. Chat.tsx handles missing image/price gracefully?
                    // Let's check Chat.tsx again... it conditionally renders Product Context Banner.
                    // If we want the banner to look good, we might need more data.
                    // But 'product_context' is just a string in messages.
                    // We'd need to fetch the item from 'marketplace_items' by TITLE or ID?
                    // Message schema only saves context string name. Ideally it should save Item ID.
                    // We will proceed with Title only.
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-[#7c3aed] text-white p-4 pt-12 rounded-b-[30px] shadow-lg mb-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold">Minhas Conversas</h1>
                        <p className="text-xs text-purple-200">Negociações e contatos</p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 px-4 pb-20 space-y-3">
                {loading ? (
                    <div className="text-center py-10 text-gray-400">Carregando conversas...</div>
                ) : chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <MessageSquare size={32} />
                        </div>
                        <p>Nenhuma conversa ainda.</p>
                        <button onClick={() => navigate('/market')} className="mt-4 text-[#7c3aed] font-bold text-sm">Explorar Ofertas</button>
                    </div>
                ) : (
                    chats.map(chat => (
                        <div
                            key={chat.conversationId}
                            onClick={() => handleOpenChat(chat)}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors active:scale-98"
                        >
                            <div className="relative">
                                {chat.partnerAvatar ? (
                                    <img src={chat.partnerAvatar} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                                        {chat.partnerName.charAt(0)}
                                    </div>
                                )}
                                {chat.unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                        {chat.unreadCount}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h3 className="font-bold text-gray-900 truncate">{chat.partnerName}</h3>
                                    <span className={`text-[10px] whitespace-nowrap ${chat.unreadCount > 0 ? 'text-[#7c3aed] font-bold' : 'text-gray-400'}`}>
                                        {chat.timestamp.toLocaleDateString() === new Date().toLocaleDateString()
                                            ? chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : chat.timestamp.toLocaleDateString()}
                                    </span>
                                </div>

                                {chat.productTitle && (
                                    <div className="flex items-center gap-1 text-[10px] text-[#7c3aed] font-bold mb-1 bg-purple-50 w-fit px-1.5 py-0.5 rounded-md">
                                        <ShoppingBag size={8} />
                                        <span className="truncate max-w-[150px]">{chat.productTitle}</span>
                                    </div>
                                )}

                                <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                                    {chat.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatList;
