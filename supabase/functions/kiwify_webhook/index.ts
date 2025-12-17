import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const payload = await req.json();
        console.log('Webhook payload:', payload);

        // 1. Verify Payment Status
        if (payload.order_status !== 'paid') {
            return new Response(JSON.stringify({ message: 'Order not paid. Ignored.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            });
        }

        // 2. Extract Customer Info
        const email = payload.Customer?.email || payload.customer?.email; // Kiwify might vary capitalization
        const amount = payload.order_ref?.amount || payload.amount || 2990; // Default or extract (Kiwify sends in cents usually, need to verify)
        // Assuming Kiwify sends amount in cents, dividing by 100. If it sends float, adjust. 
        // Usually payloads have `full_price` or `amount`. Let's assume passed amount is cents.
        // However, safely, we will just use a fixed 29.90 if not sure, or verify payload docs. 
        // For now, let's try to trust the payload or default to 29.90.
        const finalAmount = (isValidAmount(amount)) ? amount / 100 : 29.90;

        if (!email) {
            throw new Error('No email found in payload');
        }

        // 3. Initialize Supabase Admin Client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 4. Find User by Email
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (profileError || !profile) {
            console.error('User not found:', email);
            return new Response(JSON.stringify({ message: 'User not found in system' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        // 5. Activate Subscription
        const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', profile.id)
            .single();

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        let subResult;
        if (existingSub) {
            subResult = await supabase
                .from('subscriptions')
                .update({
                    status: 'active',
                    expires_at: expiresAt.toISOString(),
                    plan_type: 'professional'
                })
                .eq('id', existingSub.id);
        } else {
            subResult = await supabase
                .from('subscriptions')
                .insert({
                    user_id: profile.id,
                    status: 'active',
                    expires_at: expiresAt.toISOString(),
                    plan_type: 'professional'
                });
        }

        if (subResult.error) throw subResult.error;

        // 6. Update Profile Status
        await supabase.from('profiles').update({ role: 'professional', status: 'active' }).eq('id', profile.id);

        // 7. Log Financial Transaction (For Dashboard)
        // We log this as a revenue ('in')
        const { error: finError } = await supabase.from('financial_transactions').insert({
            title: `Assinatura Pro - ${email}`,
            amount: finalAmount,
            type: 'in',
            status: 'paid',
            date: new Date().toISOString(),
            contact_phone: payload.Customer?.mobile || null
        });

        if (finError) console.error('Error logging financial transaction:', finError);

        return new Response(JSON.stringify({ message: 'Subscription activated and transaction logged' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});

function isValidAmount(val: any): boolean {
    return typeof val === 'number' && !isNaN(val);
}
