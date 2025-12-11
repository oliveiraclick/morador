import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
let fileContent;
try {
    fileContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    console.error(".env.local not found in " + process.cwd());
    process.exit(1);
}

const env = {};
fileContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        env[key] = value;
    }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
let supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseKey) {
    console.log("SUPABASE_SERVICE_ROLE_KEY not found. Fallback to VITE_SUPABASE_ANON_KEY.");
    supabaseKey = env['VITE_SUPABASE_ANON_KEY'];
}

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    console.error("Found keys:", Object.keys(env));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { count: profilesCount, error: profilesError } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: servicesCount, error: servicesError } = await supabase.from('services').select('*', { count: 'exact', head: true });
    const { count: productsCount, error: productsError } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: bookingsCount, error: bookingsError } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
    const { count: ordersCount, error: ordersError } = await supabase.from('orders').select('*', { count: 'exact', head: true });

    console.log(JSON.stringify({
        profiles: profilesCount,
        services: servicesCount,
        products: productsCount,
        bookings: bookingsCount,
        orders: ordersCount,
        errors: {
            profiles: profilesError,
            services: servicesError,
            products: productsError,
            bookings: bookingsError,
            orders: ordersError
        }
    }, null, 2));
}

check();
