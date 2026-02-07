-- Migration v4: Create admins table for admin management
-- Run this in Supabase SQL Editor

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies (disabled for simplicity)
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Insert the super admin
INSERT INTO admins (user_id, email, role)
SELECT id, email, 'super_admin'
FROM auth.users
WHERE email = 'yeboahmichael977@gmail.com'
ON CONFLICT (email) DO NOTHING;

-- Create function to automatically add new admins to the table
CREATE OR REPLACE FUNCTION public.handle_new_admin()
RETURNS TRIGGER AS $$
BEGIN
  -- Only add to admins table if not already there
  INSERT INTO public.admins (user_id, email, role, created_by)
  VALUES (NEW.id, NEW.email, 'admin', auth.uid())
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON TABLE admins IS 'Tracks all admin users for management purposes';
