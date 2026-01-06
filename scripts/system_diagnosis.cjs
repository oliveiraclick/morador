const https = require('https');

// Configuration
const SUPABASE_URL = "https://ynpogzyojijqzrngsnac.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucG9nenlvamlqcXpybmdzbmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4Mjc5MDYsImV4cCI6MjA4MTQwMzkwNn0.mSG0dzO9A-SAUlqgmTmx-tUV6XlnKM2ieliAbzYYdoE";

const HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
};

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            headers: HEADERS
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
}

async function checkTable(tableName) {
    console.log(`\n--- Checking Table: ${tableName} ---`);
    try {
        const response = await makeRequest(`${SUPABASE_URL}/rest/v1/${tableName}?select=count&limit=1`);
        if (response.statusCode >= 200 && response.statusCode < 300) {
            console.log(`✅ Table '${tableName}' is accessible.`);
            const range = response.headers['content-range'];
            if (range) {
                console.log(`   Records: ${range.split('/').pop()}`);
            }
        } else {
            console.log(`❌ Table '${tableName}' access failed. Status: ${response.statusCode}`);
        }
    } catch (e) {
        console.log(`❌ Error checking table '${tableName}': ${e.message}`);
    }
}

async function checkBucket(bucketName) {
    console.log(`\n--- Checking Bucket: ${bucketName} ---`);
    try {
        const response = await makeRequest(`${SUPABASE_URL}/storage/v1/object/list/${bucketName}`);
        if (response.statusCode === 200) {
            console.log(`✅ Bucket '${bucketName}' is accessible.`);
        } else {
            console.log(`❌ Bucket '${bucketName}' access failed. Status: ${response.statusCode}`);
            if (response.statusCode === 404) console.log("   Result: Bucket likely does NOT exist.");
            if (response.statusCode === 400) console.log("   Result: Bad Request.");
        }
    } catch (e) {
        console.log(`❌ Error checking bucket '${bucketName}': ${e.message}`);
    }
}

async function main() {
    console.log("=========================================");
    console.log("      SUPABASE SYSTEM DIAGNOSIS (Node)");
    console.log("=========================================");

    const tables = ["profiles", "marketplace_items", "condos", "messages", "plans"];
    for (const t of tables) {
        await checkTable(t);
    }

    const buckets = ["marketplace", "avatars"];
    for (const b of buckets) {
        await checkBucket(b);
    }

    console.log("\n=========================================");
    console.log("Diagnosis Complete.");
}

main();
