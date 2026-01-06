import requests
import json

# Configuration (from existing scripts)
SUPABASE_URL = "https://ynpogzyojijqzrngsnac.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucG9nenlvamlqcXpybmdzbmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4Mjc5MDYsImV4cCI6MjA4MTQwMzkwNn0.mSG0dzO9A-SAUlqgmTmx-tUV6XlnKM2ieliAbzYYdoE"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def check_table(table_name):
    print(f"\n--- Checking Table: {table_name} ---")
    try:
        response = requests.get(f"{SUPABASE_URL}/rest/v1/{table_name}?select=count&limit=1", headers=HEADERS)
        if response.status_code in [200, 206]:
            print(f"✅ Table '{table_name}' is accessible.")
            # Try to get count if possible, though HEAD usually gives range
            range_header = response.headers.get("Content-Range")
            if range_header:
                 total = range_header.split("/")[-1]
                 print(f"   Records: {total}")
        else:
            print(f"❌ Table '{table_name}' access failed. Status: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
         print(f"❌ Error checking table '{table_name}': {str(e)}")

def check_bucket(bucket_name):
    print(f"\n--- Checking Bucket: {bucket_name} ---")
    try:
        # List files in bucket root to check access
        response = requests.get(f"{SUPABASE_URL}/storage/v1/object/list/{bucket_name}", headers=HEADERS)
        if response.status_code == 200:
            print(f"✅ Bucket '{bucket_name}' is accessible.")
        else:
            print(f"❌ Bucket '{bucket_name}' access failed. Status: {response.status_code}")
            # If 404, bucket might not exist. If 403, permissions/RLS issue.
            if response.status_code == 404:
                print("   Result: Bucket likely does NOT exist.")
            elif response.status_code == 400:
                 print("   Result: Bad Request (Possible configuration error).")
    except Exception as e:
        print(f"❌ Error checking bucket '{bucket_name}': {str(e)}")

def main():
    print("=========================================")
    print("      SUPABASE SYSTEM DIAGNOSIS")
    print("=========================================")

    # 1. Check Tables
    tables = ["profiles", "marketplace_items", "condos", "messages", "plans"]
    for t in tables:
        check_table(t)

    # 2. Check Storage Buckets
    buckets = ["marketplace", "avatars"]
    for b in buckets:
        check_bucket(b)

    print("\n=========================================")
    print("Diagnosis Complete.")

if __name__ == "__main__":
    main()
