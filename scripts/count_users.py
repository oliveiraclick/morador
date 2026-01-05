import requests
import os

url = "https://ynpogzyojijqzrngsnac.supabase.co/rest/v1/profiles"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucG9nenlvamlqcXpybmdzbmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4Mjc5MDYsImV4cCI6MjA4MTQwMzkwNn0.mSG0dzO9A-SAUlqgmTmx-tUV6XlnKM2ieliAbzYYdoE",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucG9nenlvamlqcXpybmdzbmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4Mjc5MDYsImV4cCI6MjA4MTQwMzkwNn0.mSG0dzO9A-SAUlqgmTmx-tUV6XlnKM2ieliAbzYYdoE",
    "Range": "0-0",
    "Prefer": "count=exact"
}

def get_count(role):
    params = {"role": f"eq.{role}"}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200 or response.status_code == 206:
        content_range = response.headers.get("Content-Range")
        if content_range:
            return content_range.split("/")[-1]
    return "Erro"

residents = get_count("resident")
professionals = get_count("professional")

print(f"Moradores: {residents}")
print(f"Prestadores: {professionals}")
