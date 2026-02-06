-- ============================================
-- FIX CONTACT MESSAGES TABLE
-- Run this if contact form submissions are failing
-- ============================================

-- Ensure contact_messages table exists with correct structure
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated full access" ON contact_messages;

-- Recreate policies
CREATE POLICY "Allow public insert" ON contact_messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow authenticated full access" ON contact_messages 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contact_messages'
ORDER BY ordinal_position;

-- ============================================
-- DONE! Try submitting the contact form again
-- ============================================
