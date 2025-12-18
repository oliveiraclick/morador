import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const DebugMarketplace = () => {
    const [items, setItems] = useState<any[]>([]);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await supabase.from('marketplace_items').select('*');
            if (error) setError(error);
            if (data) setItems(data);
        };
        fetch();
    }, []);

    return (
        <div className="p-4 bg-white min-h-screen">
            <h1 className="text-xl font-bold mb-4">Debug Marketplace</h1>
            {error && <pre className="text-red-500 text-xs">{JSON.stringify(error, null, 2)}</pre>}
            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.id} className="border p-2 rounded text-xs">
                        <p><strong>ID:</strong> {item.id}</p>
                        <p><strong>Title:</strong> {item.title}</p>
                        <p><strong>Type:</strong> "{item.type}"</p>
                        <p><strong>Status:</strong> {item.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DebugMarketplace;
