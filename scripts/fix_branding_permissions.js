
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const envPath = path.resolve(process.cwd(), '.env.local');
const env = {};

// Parse .env.local
try {
    const fileContent = fs.readFileSync(envPath, 'utf8');
    fileContent.split('\n').forEach(line => {
        const cleanLine = line.split('#')[0].trim();
        if (!cleanLine) return;
        const match = cleanLine.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            env[key] = value;
        }
    });
} catch (e) {
    console.error("Error reading .env.local");
    process.exit(1);
}

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials. Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPermissions() {
    console.log("Fixing permissions...");

    // 1. Create 'branding' bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
        console.error("Error listing buckets:", listError);
    } else {
        const brandingBucket = buckets.find(b => b.name === 'branding');
        if (!brandingBucket) {
            console.log("Creating 'branding' bucket...");
            const { error: createError } = await supabase.storage.createBucket('branding', {
                public: true,
                fileSizeLimit: 10485760, // 10MB
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
            });
            if (createError) console.error("Error creating bucket:", createError);
            else console.log("'branding' bucket created.");
        } else {
            console.log("'branding' bucket already exists.");
            // Ensure public
            if (!brandingBucket.public) {
                await supabase.storage.updateBucket('branding', { public: true });
                console.log("Updated bucket to be public.");
            }
        }
    }

    // 2. Fix RLS for app_settings - We need to allow UPDATE.
    // Since we can't run RAW SQL for DDL easily via JS client (without rpc), 
    // and we already saw the user might have difficulties with the SQL Editor,
    // we will rely on the fact that if the user is using the local dev setup, 
    // we might need to instruct them or try to use a Postgres client if available (which we saw 'psql' might not be configured or we didn't check fully).
    // WAIT, we saw `psql --version` failed or wasn't fully checked? 
    // Actually, step 209 (run_command) output was empty/background? 
    // Let's assume we can't use psql. 

    // However, for `app_settings`, if RLS is enabled, we need a policy.
    // Use the Service Role to INSERT/UPDATE directly? 
    // The Frontend uses the Anon key. So we DO need the policy.

    // Workaround: We can disable RLS on `app_settings` via RPC if we had a function, or ...
    // Actually, we can try to use standard RPC if `postgres` extension is enabled (unlikely).

    // CRITICAL: The user's backend is likely Supabase hosted.
    // We MUST set the policy.
    // Since we successfully ran migration via Browser Subagent, we should do that again for the policies!
    // That is the most reliable way.

    console.log("Storage bucket check complete. RLS policies must be applied via SQL Editor.");
}

fixPermissions();
