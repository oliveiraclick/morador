
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let fileContent;
try {
    fileContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    console.error(".env.local not found. Please ensure it exists with VITE_SUPABASE_URL.");
    process.exit(1);
}

const env = {};
fileContent.split('\n').forEach(line => {
    // Remove comments
    const cleanLine = line.split('#')[0].trim();
    if (!cleanLine) return;

    const match = cleanLine.match(/^([^=]+)=(.*)$/);
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
let isServiceRole = true;

if (!supabaseKey) {
    console.log("SUPABASE_SERVICE_ROLE_KEY not found. Fallback to VITE_SUPABASE_ANON_KEY.");
    supabaseKey = env['VITE_SUPABASE_ANON_KEY'];
    isServiceRole = false;
}

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials.");
    console.log("Keys found:", Object.keys(env));
    process.exit(1);
}

console.log(`Supabase URL: ${supabaseUrl ? supabaseUrl.substring(0, 15) + '...' : 'undefined'}`);
console.log(`Key used: ${isServiceRole ? 'SERVICE_ROLE' : 'ANON'}`);

const supabase = createClient(supabaseUrl, supabaseKey);

// --- DATA DEFINITIONS ---

const USERS = [
    // Custom Admin/User
    { email: 'denys@morador.app', password: 'Vendas@123', full_name: 'Denys', user_type: 'provider', role: 'provider', provider_type: 'product', categories: ['outros'], avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200' },
    // Residents
    { email: 'resident.one.test@gmail.com', password: 'password123', full_name: 'Morador Um', user_type: 'resident', role: 'resident', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    { email: 'resident.two.test@gmail.com', password: 'password123', full_name: 'Morador Dois', user_type: 'resident', role: 'resident', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
    { email: 'resident.three.test@gmail.com', password: 'password123', full_name: 'Morador Tres', user_type: 'resident', role: 'resident', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },

    // Providers
    { email: 'provider.alpha.test@gmail.com', password: 'password123', full_name: 'Prestador Alfa', user_type: 'provider', role: 'provider', provider_type: 'service', categories: ['limpeza'], avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200' },
    { email: 'provider.beta.test@gmail.com', password: 'password123', full_name: 'Prestador Beta', user_type: 'provider', role: 'provider', provider_type: 'service', categories: ['manutencao'], avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { email: 'provider.gamma.test@gmail.com', password: 'password123', full_name: 'Prestador Gama', user_type: 'provider', role: 'provider', provider_type: 'service', categories: ['aulas', 'beleza'], avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },

    // Sellers
    { email: 'seller.x.test@gmail.com', password: 'password123', full_name: 'Vendedor X', user_type: 'provider', role: 'provider', provider_type: 'product', categories: ['comida'], avatar_url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=200' },
    { email: 'seller.y.test@gmail.com', password: 'password123', full_name: 'Vendedor Y', user_type: 'provider', role: 'provider', provider_type: 'product', categories: ['artesanato'], avatar_url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200' },
    { email: 'seller.z.test@gmail.com', password: 'password123', full_name: 'Vendedor Z', user_type: 'provider', role: 'provider', provider_type: 'product', categories: ['outros'], avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' },
];

const SERVICE_TEMPLATES = [
    { title: "Serviço Padrão", price: 100.00, description: "Descrição do serviço padrão", image_url: "https://images.unsplash.com/photo-1581578731117-104f2a863a17?auto=format&fit=crop&q=80&w=400" }, // Repair/Service
    { title: "Serviço Premium", price: 200.00, description: "Descrição do serviço premium, alta qualidade", image_url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400" }, // Meeting/Service
    { title: "Reparo Rápido", price: 50.00, description: "Serviço rápido e eficiente", image_url: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&q=80&w=400" } // Tools/Service
];

const PRODUCT_TEMPLATES = [
    { title: "Produto A da Loja", price: 25.00, description: "Item de boa qualidade", condition: "new", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400"] }, // Product
    { title: "Produto B da Loja", price: 55.00, description: "Mais vendido", condition: "new", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400"] }, // Product
    { title: "Produto C da Loja", price: 15.00, description: "Escolha econômica", condition: "new", images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400"] } // Product
];

const DESAPEGO_TEMPLATES = [
    { title: "Cadeira Usada", price: 30.00, description: "Pouco uso", condition: "good", category: "moveis", images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400"] },
    { title: "Livro Antigo", price: 5.00, description: "Romance clássico", condition: "fair", category: "outros", images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400"] },
    { title: "Bicicleta", price: 150.00, description: "Precisa de pneus novos", condition: "poor", category: "esportes", images: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400"] }
];

const CATEGORIES_LIST = [
    { name: 'Limpeza', slug: 'limpeza' },
    { name: 'Manutenção', slug: 'manutencao' },
    { name: 'Aulas', slug: 'aulas' },
    { name: 'Beleza', slug: 'beleza' },
    { name: 'Comida', slug: 'comida' },
    { name: 'Artesanato', slug: 'artesanato' },
    { name: 'Outros', slug: 'outros' },
    { name: 'Móveis', slug: 'moveis' },
    { name: 'Esportes', slug: 'esportes' }
];

async function seed() {
    console.log("Starting seed process...");

    // 0. Create Categories
    const categoryMap = {}; // slug -> id
    for (const cat of CATEGORIES_LIST) {
        const { data: existing } = await supabase.from('categories').select('id').eq('slug', cat.slug).maybeSingle();
        let catId;
        if (existing) {
            catId = existing.id;
        } else {
            const { data, error } = await supabase.from('categories').insert(cat).select('id').single();
            if (!error && data) {
                catId = data.id;
                console.log(`Created Category: ${cat.name}`);
            } else {
                console.error(`Error creating category ${cat.name}:`, error);
            }
        }
        if (catId) categoryMap[cat.slug] = catId;
    }

    const usersMap = {}; // email -> id

    // 1. Create Users
    for (const user of USERS) {
        let userId;

        if (isServiceRole) {
            const { data: { users }, error } = await supabase.auth.admin.listUsers();
            const existing = users?.find(u => u.email === user.email);
            if (existing) {
                userId = existing.id;
                console.log(`User ${user.email} already exists.`);
            } else {
                const { data, error: createError } = await supabase.auth.admin.createUser({
                    email: user.email,
                    password: user.password,
                    email_confirm: true,
                    user_metadata: {
                        full_name: user.full_name,
                        user_type: user.user_type,
                        role: user.role
                    }
                });
                if (createError) {
                    console.error(`Error creating user ${user.email}:`, createError);
                    continue;
                }
                userId = data.user.id;
                console.log(`Created user ${user.email}`);
            }
        } else {
            // Client side attempt
            const { data, error } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: user.password
            });

            if (data.user) {
                userId = data.user.id;
            } else {
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email: user.email,
                    password: user.password,
                    options: {
                        data: {
                            full_name: user.full_name,
                            user_type: user.user_type,
                            role: user.role
                        }
                    }
                });
                if (!signUpError && signUpData.user) {
                    userId = signUpData.user.id;
                    console.log(`Signed up user ${user.email}`);
                } else {
                    console.error(`Error signing up ${user.email}:`, signUpError);
                }
            }
        }

        if (userId) {
            usersMap[user.email] = userId;
            // Update profile with extra fields if needed
            if (user.avatar_url || user.provider_type) {
                const updates = {};
                updates.full_name = user.full_name; // Force update full_name for translation
                if (user.provider_type) {
                    updates.provider_type = user.provider_type;
                    updates.categories = user.categories;
                }
                if (user.avatar_url) {
                    updates.avatar_url = user.avatar_url;
                }
                await supabase.from('profiles').update(updates).eq('id', userId);
            }
        }
    }

    // 2. Create Services for Each Provider (3 Services per Provider)
    const providers = USERS.filter(u => u.provider_type === 'service');
    let serviceIds = [];

    for (const prov of providers) {
        const provId = usersMap[prov.email];
        if (!provId) continue;

        // Cleanup old English services mostly to avoid duplicates for test users
        await supabase.from('services').delete().eq('provider_id', provId);

        for (let i = 0; i < 3; i++) {
            const template = SERVICE_TEMPLATES[i];
            const title = `${template.title} por ${prov.full_name}`;

            const { data: existing } = await supabase.from('services').select('id').eq('title', title).eq('provider_id', provId).maybeSingle();

            let svcId;
            if (!existing) {
                const { data, error } = await supabase.from('services').insert({
                    provider_id: provId,
                    title: title,
                    description: template.description,
                    price: template.price,
                    image_url: template.image_url,
                    category_id: categoryMap[prov.categories[0]], // Use UUID from map
                    is_active: true
                }).select('id').single();

                if (!error) {
                    svcId = data.id;
                    console.log(`Created Service: ${title}`);
                } else {
                    console.error(`Error creating service ${title}:`, error);
                }
            } else {
                svcId = existing.id;
                // Update with image if missing (or always update to ensure fresh seed data)
                await supabase.from('services').update({
                    image_url: template.image_url,
                    price: template.price, // ensure price sync
                    description: template.description
                }).eq('id', svcId);
            }
            if (svcId) serviceIds.push({ id: svcId, provider_id: provId, price: template.price });
        }
    }

    // 3. Create Products for Each Seller (3 Products per Seller)
    const sellers = USERS.filter(u => u.provider_type === 'product');
    let productIds = [];

    for (const seller of sellers) {
        const sellerId = usersMap[seller.email];
        if (!sellerId) continue;

        // Cleanup old English products
        await supabase.from('products').delete().eq('seller_id', sellerId);

        for (let i = 0; i < 3; i++) {
            const template = PRODUCT_TEMPLATES[i];
            const title = `${template.title} por ${seller.full_name}`;

            const { data: existing } = await supabase.from('products').select('id').eq('title', title).eq('seller_id', sellerId).maybeSingle();

            let prodId;
            if (!existing) {
                const { data, error } = await supabase.from('products').insert({
                    seller_id: sellerId,
                    title: title,
                    description: template.description,
                    price: template.price,
                    category: seller.categories[0],
                    condition: template.condition,
                    product_type: 'store',
                    images: template.images,
                    is_available: true
                }).select('id').single();

                if (!error) {
                    prodId = data.id;
                    console.log(`Created Product: ${title}`);
                }
            } else {
                prodId = existing.id;
                await supabase.from('products').update({
                    images: template.images,
                    price: template.price,
                    description: template.description
                }).eq('id', prodId);
            }
            if (prodId) productIds.push({ id: prodId, seller_id: sellerId, price: template.price });
        }
    }

    // 4. Create Desapego Items for Residents (3 items per Resident)
    const residents = USERS.filter(u => u.user_type === 'resident');

    for (const resident of residents) {
        const resId = usersMap[resident.email];
        if (!resId) continue;

        // Cleanup old English desapegos
        await supabase.from('products').delete().eq('seller_id', resId).eq('product_type', 'desapego');

        for (let i = 0; i < 3; i++) {
            const template = DESAPEGO_TEMPLATES[i];
            const title = `${template.title} de ${resident.full_name}`;

            const { data: existing } = await supabase.from('products').select('id').eq('title', title).eq('seller_id', resId).maybeSingle();

            if (!existing) {
                await supabase.from('products').insert({
                    seller_id: resId,
                    title: title,
                    description: template.description,
                    price: template.price,
                    category: template.category,
                    condition: template.condition,
                    product_type: 'desapego',
                    images: template.images,
                    is_available: true
                });
                console.log(`Created Desapego: ${title}`);
            } else {
                await supabase.from('products').update({
                    images: template.images,
                    price: template.price,
                    description: template.description
                }).eq('id', existing.id);
            }
        }
    }

    // 5. Create Bookings (1 for each resident with different status)
    // Resident1 -> Book Service 1 (Pending)
    // Resident2 -> Book Service 2 (Confirmed)
    // Resident3 -> Book Service 3 (Completed)

    const statuses = ['pending', 'confirmed', 'completed'];
    for (let i = 0; i < residents.length; i++) {
        const resId = usersMap[residents[i].email];
        const svc = serviceIds[i % serviceIds.length]; // Cycle through services
        if (!resId || !svc) continue;

        const { data: existing } = await supabase.from('bookings')
            .select('id')
            .eq('customer_id', resId)
            .eq('service_id', svc.id)
            .eq('status', statuses[i])
            .maybeSingle();

        if (!existing) {
            await supabase.from('bookings').insert({
                customer_id: resId,
                provider_id: svc.provider_id,
                service_id: svc.id,
                booking_date: new Date().toISOString().split('T')[0],
                booking_time: '14:00',
                status: statuses[i],
                total_price: svc.price,
                notes: `Auto-generated booking status: ${statuses[i]}`
            });
            console.log(`Created Booking: ${statuses[i]} for ${residents[i].email}`);
        }
    }

    // 6. Create Orders (1 for each resident with different status)
    // Resident1 -> Order Product 1 (New)
    // Resident2 -> Order Product 2 (Ready)
    // Resident3 -> Order Product 3 (Completed)

    const orderStatuses = ['new', 'ready', 'completed'];
    for (let i = 0; i < residents.length; i++) {
        const resId = usersMap[residents[i].email];
        const prod = productIds[i % productIds.length];
        if (!resId || !prod) continue;

        // Check if an order with this specific total amount and status exists for this user today roughly to avoid dups
        // Not perfect check but good enough for seed

        const { data: orderData, error: orderError } = await supabase.from('orders').insert({
            customer_id: resId,
            provider_id: prod.seller_id,
            status: orderStatuses[i],
            total_amount: prod.price,
            payment_method: 'pix',
            delivery_address: 'Rua Exemplo, 123'
        }).select('id').single();

        if (orderData) {
            await supabase.from('order_items').insert({
                order_id: orderData.id,
                product_id: prod.id,
                quantity: 1,
                price_at_purchase: prod.price
            });
            console.log(`Created Order: ${orderStatuses[i]} for ${residents[i].email}`);
        }
    }

    console.log("Seed complete!");
}

seed().catch(console.error);
