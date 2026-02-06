-- ============================================
-- ERNEMAKO RESTAURANT DATABASE SETUP
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- Then click "Run" - Done in 30 seconds!
-- ============================================

-- 1. GALLERY TABLE
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access" ON gallery FOR ALL USING (auth.role() = 'authenticated');

-- 2. MENU ITEMS TABLE
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access" ON menu_items FOR ALL USING (auth.role() = 'authenticated');

-- 3. RESERVATIONS TABLE
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON reservations FOR ALL USING (auth.role() = 'authenticated');

-- 4. ABOUT CONTENT TABLE
CREATE TABLE about_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  years_experience INTEGER DEFAULT 10,
  menu_items_count INTEGER DEFAULT 50,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO about_content (content, years_experience, menu_items_count)
VALUES (
  'Founded in the heart of Sunyani, Ernemako Restaurant began with a simple mission: to serve authentic, soul-warming Ghanaian dishes in a modern, welcoming environment.',
  10,
  50
);

ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON about_content FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access" ON about_content FOR ALL USING (auth.role() = 'authenticated');

-- 5. SETTINGS TABLE
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
('business_hours', '{
  "monday": {"open": "08:00", "close": "22:00"},
  "tuesday": {"open": "08:00", "close": "22:00"},
  "wednesday": {"open": "08:00", "close": "22:00"},
  "thursday": {"open": "08:00", "close": "22:00"},
  "friday": {"open": "08:00", "close": "22:00"},
  "saturday": {"open": "08:00", "close": "22:00"},
  "sunday": {"closed": true}
}'::jsonb),
('contact_info', '{
  "phone": "+233 123 456 789",
  "email": "hello@ernemakorestaurant.com",
  "address": "Opposite Fiapre Park, Sunyani, Bono Region, Ghana"
}'::jsonb);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- 6. CONTACT MESSAGES TABLE
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- DONE! You should see "Success. No rows returned"
-- ============================================
