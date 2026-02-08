import { supabase } from './supabase';

// ============================================
// GALLERY OPERATIONS
// ============================================

export interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  storage_path?: string;
  created_at: string;
}

export const galleryApi = {
  // Get all gallery images
  async getAll(): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Upload image to storage and create gallery entry
  async upload(file: File, title: string): Promise<GalleryImage> {
    // Upload to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('restaurant-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('restaurant-images')
      .getPublicUrl(filePath);

    // Create database entry
    const { data, error } = await supabase
      .from('gallery')
      .insert([{ image_url: publicUrl, title, storage_path: filePath }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete image
  async delete(id: string, storagePath: string): Promise<void> {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('restaurant-images')
      .remove([storagePath]);

    if (storageError) console.error('Storage delete error:', storageError);

    // Delete from database
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ============================================
// MENU OPERATIONS
// ============================================

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  status: string;
  featured: boolean;
  created_at: string;
}

export const menuApi = {
  // Get all menu items
  async getAll(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Create menu item
  async create(item: Omit<MenuItem, 'id' | 'created_at'>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([item])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update menu item
  async update(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete menu item
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Upload menu item image
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `menu/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('restaurant-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('restaurant-images')
      .getPublicUrl(filePath);

    return publicUrl;
  }
};

// ============================================
// RESERVATION OPERATIONS
// ============================================

export interface Reservation {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  special_requests?: string;
  created_at: string;
}

export const reservationApi = {
  // Get all reservations
  async getAll(): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: false })
      .order('time', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Create reservation (public - for customers)
  async create(reservation: Omit<Reservation, 'id' | 'created_at' | 'status'>): Promise<Reservation> {
    const { data, error } = await supabase
      .from('reservations')
      .insert([{ 
        customer_name: reservation.customer_name,
        phone: reservation.phone,
        email: reservation.email,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        special_requests: reservation.special_requests,
        status: 'pending' 
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update reservation status
  async updateStatus(id: string, status: Reservation['status']): Promise<Reservation> {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Find reservation by phone or reference
  async findByPhone(phone: string): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('phone', phone)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Delete reservation
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ============================================
// CONTACT MESSAGES OPERATIONS
// ============================================

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  reply_message?: string;
  reply_sent_at?: string;
  created_at: string;
}

export const contactApi = {
  // Get all messages
  async getAll(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Create message (public - for customers)
  async create(message: Omit<ContactMessage, 'id' | 'created_at' | 'status'>): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([message]) // Let database set default status
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update message status and optionally add reply
  async updateStatus(id: string, status: ContactMessage['status'], replyMessage?: string): Promise<ContactMessage> {
    const updateData: any = { status };
    if (replyMessage) {
      updateData.reply_message = replyMessage;
      updateData.reply_sent_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('contact_messages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete message
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ============================================
// ABOUT CONTENT OPERATIONS
// ============================================

export interface AboutContent {
  id: string;
  content: string;
  years_experience: number;
  menu_items_count: number;
  image_1_url?: string;
  image_2_url?: string;
  updated_at: string;
}

export const aboutApi = {
  // Get about content
  async get(): Promise<AboutContent | null> {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Update about content
  async update(content: Omit<AboutContent, 'id' | 'updated_at'>): Promise<AboutContent> {
    const existing = await this.get();
    
    if (existing) {
      const { data, error } = await supabase
        .from('about_content')
        .update(content)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('about_content')
        .insert([content])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
};

// ============================================
// SETTINGS OPERATIONS
// ============================================

export interface Settings {
  id: string;
  phone: string;
  email: string;
  address: string;
  business_hours: {
    [key: string]: { open: string; close: string } | 'closed';
  };
  updated_at: string;
}

export const settingsApi = {
  // Get settings
  async get(): Promise<Settings | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Update settings
  async update(settings: Omit<Settings, 'id' | 'updated_at'>): Promise<Settings> {
    const existing = await this.get();
    
    if (existing) {
      const { data, error } = await supabase
        .from('settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('settings')
        .insert([settings])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
};

// ============================================
// ADMIN USER OPERATIONS
// ============================================

export interface Admin {
  id: string;
  user_id: string;
  email: string;
  role: 'super_admin' | 'admin';
  created_at: string;
}

export const adminApi = {
  // Get current admin user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Get all admins (from custom admins table)
  async getAllAdmins(): Promise<Admin[]> {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Update admin password
  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  },

  // Create new admin user (requires admin privileges)
  async createAdmin(email: string, password: string): Promise<void> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation
      }
    });
    
    if (error) throw error;
    
    // Add to admins table
    if (data.user) {
      const { error: insertError } = await supabase
        .from('admins')
        .insert([{
          user_id: data.user.id,
          email: email,
          role: 'admin'
        }]);
      
      if (insertError) {
        console.error('Failed to add admin to admins table:', insertError);
      }
    }
  },

  // Delete admin user
  async deleteAdmin(userId: string, email: string): Promise<void> {
    // Remove from admins table
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Note: Cannot delete from auth.users without service role key
    // User will remain in auth but won't be in admins table
  },

  // Logout
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};

// ============================================
// HERO BANNER OPERATIONS
// ============================================

export interface HeroBanner {
  image_url: string;
  title: string;
  subtitle: string;
}

export const heroBannerApi = {
  // Get hero banner settings
  async get(): Promise<HeroBanner | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'hero_banner')
      .maybeSingle();
    
    if (error) {
      console.error('Failed to load hero banner:', error);
      return null;
    }
    
    if (!data) {
      console.log('No hero banner found in database');
      return null;
    }
    
    return data.value || null;
  },

  // Update hero banner settings
  async update(banner: HeroBanner): Promise<void> {
    const { error } = await supabase
      .from('settings')
      .update({ value: banner })
      .eq('key', 'hero_banner');

    if (error) throw error;
  }
};

// ============================================
// DASHBOARD STATS
// ============================================

export const dashboardApi = {
  async getStats() {
    const [menuItems, galleryImages, messages] = await Promise.all([
      menuApi.getAll(),
      galleryApi.getAll(),
      contactApi.getAll()
    ]);

    const unreadMessages = messages.filter(m => m.status === 'unread').length;

    return {
      menuItemsCount: menuItems.length,
      galleryImagesCount: galleryImages.length,
      unreadMessages
    };
  }
};
