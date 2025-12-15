import React, { useState } from 'react';
import { Search, Heart, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Todos');

  const categories = ['Todos', 'Móveis', 'Eletrônicos', 'Infantil', 'Roupas'];

  const items = [
    { 
      id: 1, 
      title: 'Bicicleta Infantil Aro 16', 
      price: 150.00, 
      img: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&q=80&w=800', 
      description: 'Bicicleta em ótimo estado, pouco uso. Minha filha cresceu e não usa mais. Acompanha rodinhas. Precisa buscar no bloco A.',
      seller: 'Ana Silva', 
      sellerAvatar: 'AS',
      sellerColor: 'bg-purple-500',
      location: 'Bloco A, Ap 402', 
      time: '2h atrás',
      condition: 'Usado'
    },
    { 
      id: 2, 
      title: 'Sofá 3 lugares Retrátil', 
      price: 800.00, 
      originalPrice: 950.00,
      img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800', 
      description: 'Sofá super confortável, retrátil e reclinável. Tecido Suede. Tem um pequeno detalhe no braço esquerdo, mas imperceptível. Motivo: mudança.',
      seller: 'Carlos Souza', 
      sellerAvatar: 'CS',
      sellerColor: 'bg-blue-500',
      location: 'Bloco C, Ap 101', 
      time: '5h atrás',
      condition: 'Seminovo'
    },
    { 
      id: 3, 
      title: 'Mesa de Jantar 4 Lugares', 
      price: 450.00, 
      img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800', 
      description: 'Motivo da venda: mudança. Mesa em vidro temperado, muito resistente. Precisa vir buscar até sexta-feira.',
      seller: 'Mariana Lima', 
      sellerAvatar: 'ML',
      sellerColor: 'bg-orange-500',
      location: 'Bloco B, Ap 205', 
      time: '1d atrás',
      condition: 'Usado'
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-20 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
           <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
             <ArrowLeft size={24} className="text-gray-900" />
           </button>
           <h1 className="text-lg font-bold text-gray-900">Bazar do Condomínio</h1>
           <button className="p-2 -mr-2 hover:bg-gray-100 rounded-full">
             <Search size={24} className="text-gray-900" />
           </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === cat ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-200' : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {items.map((item) => (
           <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 overflow-hidden">
             
             {/* Seller Header */}
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full ${item.sellerColor} flex items-center justify-center text-white text-xs font-bold`}>
                      {item.sellerAvatar}
                   </div>
                   <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-none">{item.seller}</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.location}</p>
                   </div>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
             </div>

             {/* Image */}
             <div className="relative h-64 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                <img src={item.img} className="w-full h-full object-cover" alt={item.title} />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-wide">
                   {item.condition}
                </div>
             </div>

             {/* Content */}
             <div>
                <div className="flex justify-between items-start mb-1">
                   <h2 className="text-lg font-bold text-gray-900">{item.title}</h2>
                   <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Heart size={24} />
                   </button>
                </div>
                
                <div className="flex items-baseline gap-2 mb-3">
                   <span className="text-xl font-bold text-[#7c3aed]">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                   {item.originalPrice && (
                     <span className="text-sm text-gray-400 line-through decoration-gray-400">R$ {item.originalPrice}</span>
                   )}
                </div>

                <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-3">
                   {item.description}
                </p>

                <button 
                  onClick={() => alert('Chat iniciado com o vendedor!')}
                  className="w-full bg-[#7c3aed] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-100 hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-2"
                >
                   <MessageSquare size={18} fill="currentColor" className="text-white" />
                   Tenho Interesse
                </button>
             </div>

           </div>
        ))}
        
        {/* Floating Add Button */}
        <button 
          onClick={() => navigate('/sell')}
          className="fixed bottom-24 right-4 w-14 h-14 bg-[#7c3aed] rounded-full shadow-xl shadow-purple-300 flex items-center justify-center text-white z-20 hover:scale-105 transition-transform"
        >
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </div>
  );
};

export default Marketplace;