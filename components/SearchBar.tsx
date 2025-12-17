import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    return (
        <div className="px-6 -mt-6 mb-6 relative z-10">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const input = form.elements.namedItem('search') as HTMLInputElement;
                    if (input.value.trim()) {
                        onSearch(input.value);
                    }
                }}
                className="bg-white p-2 rounded-2xl shadow-lg shadow-purple-200/50 flex items-center gap-2 border border-purple-50"
            >
                <Search className="text-purple-400 ml-2" size={20} />
                <input
                    name="search"
                    type="text"
                    placeholder="Busque por encanador, eletricista..."
                    className="w-full p-2 outline-none text-gray-700 placeholder-gray-400 font-medium"
                />
                <button type="submit" className="bg-[#7c3aed] text-white p-2.5 rounded-xl hover:bg-[#6d28d9] transition-colors">
                    <Search size={18} />
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
