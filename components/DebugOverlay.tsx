import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const DebugOverlay = ({ roleFromState }: { roleFromState: string }) => {
    const location = useLocation();
    const [storageRole, setStorageRole] = useState(localStorage.getItem('user_role'));
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setStorageRole(localStorage.getItem('user_role'));
        }, 1000);

        // Check session
        import('../lib/supabase').then(({ supabase }) => {
            supabase.auth.getSession().then(({ data }) => {
                setSession(data.session?.user?.id || 'No Session');
            });
        });

        return () => clearInterval(interval);
    }, []);

    // if (import.meta.env.PROD) return null; // Optional: Hide in prod
    // For now, let's keep it visible even in prod to diagnose the user's issue, 
    // or use a specific query param? 
    // Let's just remove the check for this debugging session to BE SURE it shows.
    // if (process.env.NODE_ENV === 'production') return null; 


    return (
        <div className="fixed top-0 left-0 bg-black/80 text-green-400 p-4 z-[9999] text-xs font-mono max-w-xs pointer-events-none">
            <h3 className="font-bold underline mb-2">DEBUG INFO (Tire Print)</h3>
            <div>Current Path: <span className="text-white">{location.pathname}</span></div>
            <div>Role (State): <span className="text-white">{roleFromState}</span></div>
            <div>Role (Storage): <span className="text-white">{storageRole}</span></div>
            <div>User ID: <span className="text-white">{session ? session.slice(0, 8) + '...' : 'Loading'}</span></div>
            <div className="mt-2 text-gray-400">If White Screen: ProtectedRoute blocked render or Component crashed.</div>

            <button
                onClick={() => {
                    localStorage.clear();
                    window.location.href = '/login';
                }}
                className="mt-4 w-full bg-red-600 text-white font-bold py-2 px-4 rounded pointer-events-auto hover:bg-red-700"
            >
                RESET APP (Fix White Screen)
            </button>
        </div>
    );
};

export default DebugOverlay;
