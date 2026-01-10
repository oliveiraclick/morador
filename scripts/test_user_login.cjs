const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = "https://ynpogzyojijqzrngsnac.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucG9nenlvamlqcXpybmdzbmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4Mjc5MDYsImV4cCI6MjA4MTQwMzkwNn0.mSG0dzO9A-SAUlqgmTmx-tUV6XlnKM2ieliAbzYYdoE";

async function testLogin() {
    console.log("--- Testing Login: denyscobrges@gmail.com ---");

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // 1. Auth Login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'denyscobrges@gmail.com',
        password: '123456'
    });

    if (authError) {
        console.error("❌ Authentication Failed:");
        console.error(authError.message);
        return;
    }

    console.log("✅ Authentication Successful!");
    console.log(`   User ID: ${authData.user.id}`);

    // 2. Check Profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

    if (profileError) {
        console.error("❌ Error fetching profile:");
        console.error(profileError.message);
    } else if (!profile) {
        console.warn("⚠️ Profile NOT FOUND in 'profiles' table.");
        console.warn("   (The user exists in Auth, but not in public.profiles)");
    } else {
        console.log("✅ Profile Found!");
        console.log("   Role:", profile.role);
        console.log("   Name:", profile.full_name);
        console.log("   Condo ID:", profile.condo_id);
    }
}

testLogin();
