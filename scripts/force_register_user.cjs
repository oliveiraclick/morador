const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = "https://ynpogzyojijqzrngsnac.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucG9nenlvamlqcXpybmdzbmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4Mjc5MDYsImV4cCI6MjA4MTQwMzkwNn0.mSG0dzO9A-SAUlqgmTmx-tUV6XlnKM2ieliAbzYYdoE";

async function forceRegister() {
    console.log("--- ATTEMPTING TO REGISTER USER: denyscobrges@gmail.com ---");

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data, error } = await supabase.auth.signUp({
        email: 'denyscobrges@gmail.com',
        password: '123456'
    });

    if (error) {
        console.error("❌ Registration Failed:");
        console.error("   Reason:", error.message);
        if (error.message.includes("already registered")) {
            console.log("\n>>> ACTION REQUIRED: The user exists but password is wrong.");
            console.log(">>> You must DELETE this user from Supabase to start fresh.");
        }
    } else {
        console.log("✅ SUCCESS! Account Created.");
        console.log("   User ID:", data.user?.id);
        console.log("   Now try logging in with password '123456'.");
    }
}

forceRegister();
