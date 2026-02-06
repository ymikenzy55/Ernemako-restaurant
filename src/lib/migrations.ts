import { supabase } from './supabase';

/**
 * Run database migrations automatically
 * This checks if tables exist and creates them if needed
 */
export async function runMigrations() {
  console.log('🔄 Running database migrations...');

  try {
    // Check if contact_messages table exists
    const { data: tables, error: tablesError } = await supabase
      .from('contact_messages')
      .select('id')
      .limit(1);

    // If table doesn't exist, create it
    if (tablesError && tablesError.code === '42P01') {
      console.log('📝 Creating contact_messages table...');
      
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
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
        `
      });

      if (createError) {
        console.error('❌ Error creating contact_messages table:', createError);
      } else {
        console.log('✅ contact_messages table created successfully');
      }
    } else if (!tablesError) {
      console.log('✅ contact_messages table already exists');
    }

    // Verify all required tables exist
    const requiredTables = ['gallery', 'menu_items', 'reservations', 'about_content', 'settings'];
    for (const table of requiredTables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        console.error(`❌ Table ${table} is missing or has issues:`, error.message);
      } else {
        console.log(`✅ Table ${table} exists`);
      }
    }

    console.log('✅ Migrations completed');
    return true;
  } catch (error) {
    console.error('❌ Migration error:', error);
    return false;
  }
}

/**
 * Initialize database with default data if needed
 */
export async function initializeDefaultData() {
  try {
    // Check if about_content exists
    const { data: aboutData } = await aboutApi.get();
    if (!aboutData) {
      console.log('📝 Creating default about content...');
      await aboutApi.update({
        content: 'Founded in the heart of Sunyani, Ernemako Restaurant began with a simple mission: to serve authentic, soul-warming Ghanaian dishes in a modern, welcoming environment.',
        years_experience: 10,
        menu_items_count: 50
      });
    }

    // Check if settings exist
    const { data: settingsData } = await settingsApi.get();
    if (!settingsData) {
      console.log('📝 Creating default settings...');
      await settingsApi.update({
        phone: '+233 123 456 789',
        email: 'hello@ernemakorestaurant.com',
        address: 'Opposite Fiapre Park, Sunyani, Bono Region, Ghana',
        business_hours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: 'closed'
        }
      });
    }

    console.log('✅ Default data initialized');
  } catch (error) {
    console.error('❌ Error initializing default data:', error);
  }
}

// Import APIs for default data
import { aboutApi, settingsApi } from './adminApi';
