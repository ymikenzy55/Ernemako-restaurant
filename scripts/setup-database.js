/**
 * Database Setup Script
 * Run this once to check database tables
 * Usage: npm run db:setup
 * 
 * Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env.local file
const envPath = join(__dirname, '..', '.env.local');
let supabaseUrl = '';
let supabaseKey = '';

try {
  const envFile = readFileSync(envPath, 'utf-8');
  const lines = envFile.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  }
} catch (error) {
  console.error('❌ Could not read .env.local file');
  process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🔄 Setting up database...\n');

  // Check if contact_messages table exists
  console.log('📝 Checking contact_messages table...');
  const { error: checkError } = await supabase
    .from('contact_messages')
    .select('id')
    .limit(1);

  if (checkError && checkError.code === '42P01') {
    console.log('⚠️  contact_messages table does not exist');
    console.log('\n📋 Please run this SQL in Supabase SQL Editor:\n');
    console.log('----------------------------------------');
    console.log(`
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
    `);
    console.log('----------------------------------------\n');
  } else if (!checkError) {
    console.log('✅ contact_messages table exists');
  }

  // Verify all tables
  const tables = [
    'gallery',
    'menu_items', 
    'reservations',
    'about_content',
    'settings',
    'contact_messages'
  ];

  console.log('\n🔍 Verifying all tables...\n');
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`❌ ${table}: Missing or has issues`);
    } else {
      console.log(`✅ ${table}: OK`);
    }
  }

  console.log('\n✅ Database check complete!');
}

setupDatabase().catch(console.error);
