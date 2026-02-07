-- Migration v3: Add reply tracking to contact_messages table
-- Run this in Supabase SQL Editor

-- Add reply_message and reply_sent_at columns to contact_messages table
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS reply_message TEXT,
ADD COLUMN IF NOT EXISTS reply_sent_at TIMESTAMPTZ;

-- Add comment for documentation
COMMENT ON COLUMN contact_messages.reply_message IS 'The reply message sent by admin to the customer';
COMMENT ON COLUMN contact_messages.reply_sent_at IS 'Timestamp when the reply was sent';
