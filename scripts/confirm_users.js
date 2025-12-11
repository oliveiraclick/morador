
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const envPath = path.resolve(process.cwd(), '.env.local');
const fileContent = fs.readFileSync(envPath, 'utf8');
const env = {};
fileContent.split('\n').forEach(line => {
    // Remove comments
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

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY']; // Must be present now

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials (SERVICE_ROLE_KEY needed).");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const EMAILS_TO_CONFIRM = [
    'resident.one.test@gmail.com',
    'resident.two.test@gmail.com',
    'resident.three.test@gmail.com',
    'provider.alpha.test@gmail.com',
    'provider.beta.test@gmail.com',
    'provider.gamma.test@gmail.com',
    'seller.x.test@gmail.com',
    'seller.y.test@gmail.com',
    'seller.z.test@gmail.com'
];

async function confirmUsers() {
    console.log("Confirming users...");
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error("Error listing users:", error);
        return;
    }

    for (const email of EMAILS_TO_CONFIRM) {
        const user = users.find(u => u.email === email);
        if (user) {
            if (!user.email_confirmed_at) {
                const { error: updateError } = await supabase.auth.admin.updateUserById(
                    user.id,
                    { email_confirm: true }
                );
                if (updateError) {
                    console.error(`Error confirming ${email}:`, updateError);
                } else {
                    console.log(`Confirmed ${email}`);
                }
            } else {
                console.log(`${email} already confirmed.`);
            }
        } else {
            console.log(`User ${email} not found.`);
        }
    }
}

confirmUsers();
