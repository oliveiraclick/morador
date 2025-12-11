
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
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const email = 'resident.one.test@gmail.com';
    const password = 'password123';
    console.log(`Attempting login for ${email}...`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error("Login Error:", error);
    } else {
        console.log("Login Success! User ID:", data.user.id);
        console.log("Email Confirmed at:", data.user.email_confirmed_at);
        console.log("Last Sign In:", data.user.last_sign_in_at);
    }
}

test();
