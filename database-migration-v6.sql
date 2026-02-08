-- Migration v6: Create action_cards table for homepage action cards
-- Run this in Supabase SQL Editor

-- Create action_cards table
CREATE TABLE IF NOT EXISTS action_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  image_url TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('menu', 'order', 'help', 'custom')),
  link_screen TEXT, -- Which screen to navigate to (MENU, HELP, etc.)
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for simplicity
ALTER TABLE action_cards DISABLE ROW LEVEL SECURITY;

-- Insert default action cards
INSERT INTO action_cards (title, subtitle, image_url, action_type, link_screen, display_order) VALUES
('Order Now', 'Start your order', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=75&auto=format&fit=crop', 'order', 'MENU', 1),
('View Menu', 'Browse our dishes', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=75&auto=format&fit=crop', 'menu', 'MENU', 2),
('Help & Info', 'Get assistance', '', 'help', 'HELP', 3);

-- Add comment
COMMENT ON TABLE action_cards IS 'Manages the action cards displayed on the homepage';
