-- Kiwify Webhook Handler (Alternative to Edge Function)
-- This creates a database function that can be called via Supabase's Database Webhooks

-- Create a function to handle Kiwify webhook payload
CREATE OR REPLACE FUNCTION public.handle_kiwify_webhook(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    customer_email text;
    user_record record;
    order_status text;
    transaction_amount numeric;
    expires_date timestamp with time zone;
BEGIN
    -- Extract order status
    order_status := payload->>'order_status';
    
    -- Only process if order is paid
    IF order_status != 'paid' THEN
        RETURN jsonb_build_object('message', 'Order not paid, ignored');
    END IF;
    
    -- Extract customer email (try both capitalizations)
    customer_email := COALESCE(
        payload->'Customer'->>'email',
        payload->'customer'->>'email'
    );
    
    IF customer_email IS NULL THEN
        RETURN jsonb_build_object('error', 'No email found in payload');
    END IF;
    
    -- Find user by email
    SELECT id INTO user_record
    FROM public.profiles
    WHERE email = customer_email;
    
    IF user_record IS NULL THEN
        RETURN jsonb_build_object('error', 'User not found', 'email', customer_email);
    END IF;
    
    -- Calculate expiration date (30 days from now)
    expires_date := NOW() + INTERVAL '30 days';
    
    -- Update or insert subscription
    INSERT INTO public.subscriptions (user_id, status, expires_at, plan_type)
    VALUES (user_record.id, 'active', expires_date, 'professional')
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        status = 'active',
        expires_at = expires_date,
        plan_type = 'professional';
    
    -- Update profile
    UPDATE public.profiles
    SET role = 'professional', status = 'active'
    WHERE id = user_record.id;
    
    -- Log financial transaction
    transaction_amount := COALESCE(
        (payload->'order_ref'->>'amount')::numeric / 100,
        29.90
    );
    
    INSERT INTO public.financial_transactions (title, amount, type, status, date, contact_phone)
    VALUES (
        'Assinatura Pro - ' || customer_email,
        transaction_amount,
        'in',
        'paid',
        NOW(),
        payload->'Customer'->>'mobile'
    );
    
    RETURN jsonb_build_object(
        'message', 'Subscription activated successfully',
        'user_id', user_record.id,
        'email', customer_email
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('error', SQLERRM);
END;
$$;

-- Grant execute permission to authenticated users and anon (for webhook)
GRANT EXECUTE ON FUNCTION public.handle_kiwify_webhook(jsonb) TO anon;
GRANT EXECUTE ON FUNCTION public.handle_kiwify_webhook(jsonb) TO authenticated;

-- Create a simple HTTP endpoint wrapper (if using PostgREST)
COMMENT ON FUNCTION public.handle_kiwify_webhook IS 'Handles Kiwify webhook payments and activates professional subscriptions';
