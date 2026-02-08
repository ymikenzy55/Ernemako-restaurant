-- Migration v5: Add image fields to about_content table
-- Run this in Supabase SQL Editor

-- Add image URL columns to about_content table
ALTER TABLE about_content 
ADD COLUMN IF NOT EXISTS image_1_url TEXT,
ADD COLUMN IF NOT EXISTS image_2_url TEXT;

-- Add comment
COMMENT ON COLUMN about_content.image_1_url IS 'URL for first about section image';
COMMENT ON COLUMN about_content.image_2_url IS 'URL for second about section image';
