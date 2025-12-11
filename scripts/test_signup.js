
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const envPath = path.resolve(process.cwd(), '.env.local');
const fileContent = fs.readFileSync(envPath, 'utf8');
const env = {};
fileContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

console.log(`Supabase URL: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const email = `test.user.${Date.now()}@gmail.com`;
    console.log(`Testing signup with ${email}...`);

    // Attempt standard signup
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: 'password123',
    });

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Success:", data.user?.email);
    }
}

test();
