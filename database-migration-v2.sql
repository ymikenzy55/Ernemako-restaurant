-- ============================================
-- ERNEMAKO RESTAURANT DATABASE MIGRATION V2
-- Run this in Supabase SQL Editor to add missing columns
-- ============================================

-- Add storage_path to gallery table (for proper image deletion)
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- Add featured column to menu_items table
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Create index for faster featured item queries
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(featured) WHERE featured = true;

-- ============================================
-- STORAGE BUCKET SETUP
-- Go to Storage in Supabase Dashboard and ensure:
-- 1. Bucket "restaurant-images" exists
-- 2. Public bucket is enabled
-- 3. File size limit is set (e.g., 5MB)
-- 4. Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
-- ============================================

-- Storage policies (if bucket exists)
-- These allow authenticated users to upload/delete, and public to read
-- Run these ONLY if you get storage permission errors:

-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('restaurant-images', 'restaurant-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- CREATE POLICY "Allow authenticated uploads" ON storage.objects 
-- FOR INSERT TO authenticated 
-- WITH CHECK (bucket_id = 'restaurant-images');

-- CREATE POLICY "Allow authenticated deletes" ON storage.objects 
-- FOR DELETE TO authenticated 
-- USING (bucket_id = 'restaurant-images');

-- CREATE POLICY "Allow public reads" ON storage.objects 
-- FOR SELECT TO public 
-- USING (bucket_id = 'restaurant-images');

-- ============================================
-- DONE! 
-- ============================================
