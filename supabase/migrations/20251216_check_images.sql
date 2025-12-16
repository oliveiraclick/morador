-- Check for base64 images
SELECT id, title, left(image_url, 50) as image_start 
FROM marketplace_items 
ORDER BY created_at DESC 
LIMIT 5;
