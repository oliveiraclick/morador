import React from 'react';
import { ArrowLeft, ShoppingBag, Sparkles, Utensils, Hammer, Car, Dog, Book, Music, Gamepad2, Laptop, Shirt, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Categories: React.FC = () => {
    const navigate = useNavigate();

    const categories = [
        { name: 'Desapego', icon: <ShoppingBag size={24} />, route: '/market', params: { category: 'Todos' }, color: 'bg-purple-100 text-purple-600' },
        { name: 'Beleza', icon: <Sparkles size={24} />, route: '/market', params: { category: 'Beleza' }, color: 'bg-pink-100 text-pink-600' },
        { name: 'Comida', icon: <Utensils size={24} />, route: '/market', params: { category: 'Comida' }, color: 'bg-orange-100 text-orange-600' },
        { name: 'Serviços', icon: <Hammer size={24} />, route: '/service-search', color: 'bg-blue-100 text-blue-600' },
        { name: 'Automóveis', icon: <Car size={24} />, route: '/market', params: { category: 'Automóveis' }, color: 'bg-gray-100 text-gray-600' },
        { name: 'Pets', icon: <Dog size={24} />, route: '/market', params: { category: 'Pets' }, color: 'bg-yellow-100 text-yellow-600' },
        { name: 'Educação', icon: <Book size={24} />, route: '/market', params: { category: 'Educação' }, color: 'bg-green-100 text-green-600' },
        { name: 'Lazer', icon: <Music size={24} />, route: '/market', params: { category: 'Lazer' }, color: 'bg-red-100 text-red-600' },
        { name: 'Eletrônicos', icon: <Laptop size={24} />, route: '/market', params: { category: 'Eletrônicos' }, color: 'bg-indigo-100 text-indigo-600' },
        { name: 'Moda', icon: <Shirt size={24} />, route: '/market', params: { category: 'Moda' }, color: 'bg-rose-100 text-rose-600' },
        { name: 'Imóveis', icon: <Home size={24} />, route: '/market', params: { category: 'Imóveis' }, color: 'bg-teal-100 text-teal-600' },
        { name: 'Games', icon: <Gamepad2 size={24} />, route: '/market', params: { category: 'Games' }, color: 'bg-violet-100 text-violet-600' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} className="text-gray-700" />
                </button>
                <h1 className="font-bold text-lg text-gray-900">Todas as Categorias</h1>
            </div>

            <div className="p-4 grid grid-cols-3 gap-4">
                {categories.map((cat, idx) => (
                    <button
                        key={idx}
                        onClick={() => navigate(cat.route, { state: cat.params })}
                        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3 hover:scale-105 transition-transform aspect-square"
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cat.color}`}>
                            {cat.icon}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{cat.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Categories;
