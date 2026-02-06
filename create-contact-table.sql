-- Run this in Supabase SQL Editor to create the contact_messages table
-- This is the only missing table needed for the system to work fully

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON contact_messages;
CREATE POLICY "Allow public insert" ON contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access" ON contact_messages;
CREATE POLICY "Allow authenticated full access" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- Done! You should see "Success. No rows returned"
