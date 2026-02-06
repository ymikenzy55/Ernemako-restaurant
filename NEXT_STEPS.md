# Next Steps to Complete Admin Dashboard

## ✅ What's Been Done

1. **Created API Helper Functions** (`src/lib/adminApi.ts`)
   - Gallery operations (upload, delete, list)
   - Menu operations (CRUD)
   - Reservation operations (create, list, update status, find by phone)
   - Contact messages (create, list, update status)
   - About content management
   - Settings management
   - Admin user management (password change, create admin)
   - Dashboard stats

2. **Added Contact Form** to homepage
   - Users can now send messages that go to admin dashboard
   - Form validates input and shows success/error messages

3. **Updated Reservations** to save to database
   - New reservations are saved to Supabase
   - Users can find existing reservations by phone number

4. **Updated Database Schema**
   - Added `contact_messages` table

## 🔧 What Still Needs to Be Done

### 1. Add Contact Messages Table to Supabase

Run this SQL in Supabase SQL Editor:

```sql
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
```

### 2. Update Admin Dashboard Components

The admin dashboard UI exists but needs to be connected to the API functions. You need to update `src/app/screens/AdminDashboard.tsx` to:

#### Gallery Section
- Load images from `galleryApi.getAll()`
- Upload images using `galleryApi.upload(file, title)`
- Delete images using `galleryApi.delete(id, storagePath)`

#### Menu Section
- Load menu items from `menuApi.getAll()`
- Add new items using `menuApi.create()`
- Edit items using `menuApi.update(id, updates)`
- Delete items using `menuApi.delete(id)`
- Upload menu images using `menuApi.uploadImage(file)`

#### Reservations Section
- Load reservations from `reservationApi.getAll()`
- Update status using `reservationApi.updateStatus(id, status)`
- Delete reservations using `reservationApi.delete(id)`

#### Messages Section (NEW)
- Load messages from `contactApi.getAll()`
- Mark as read using `contactApi.updateStatus(id, 'read')`
- Delete messages using `contactApi.delete(id)`

#### About Section
- Load content from `aboutApi.get()`
- Save changes using `aboutApi.update(content)`

#### Settings Section
- Load settings from `settingsApi.get()`
- Save changes using `settingsApi.update(settings)`

#### Admin Users Section (NEW)
- Change password using `adminApi.updatePassword(newPassword)`
- Create new admin using `adminApi.createAdmin(email, password)`

### 3. Update App.tsx

Make sure the admin dashboard receives the `onLogout` prop:

```typescript
{isAdminAuthenticated && (
  <AdminDashboard onLogout={() => setIsAdminAuthenticated(false)} />
)}
```

### 4. Test Everything

1. **Test Contact Form**
   - Go to homepage
   - Scroll to contact section
   - Fill out and submit form
   - Check admin dashboard messages section

2. **Test Reservations**
   - Make a new reservation
   - Check admin dashboard reservations section
   - Try finding reservation by phone number

3. **Test Gallery**
   - Upload images from admin
   - Delete images
   - Verify they appear on homepage

4. **Test Menu**
   - Add menu items from admin
   - Edit existing items
   - Delete items
   - Verify they appear on menu page

5. **Test Settings**
   - Update business hours
   - Update contact info
   - Verify changes reflect on homepage

## 📝 Quick Reference

### API Functions Available

```typescript
// Gallery
await galleryApi.getAll()
await galleryApi.upload(file, title)
await galleryApi.delete(id, storagePath)

// Menu
await menuApi.getAll()
await menuApi.create(item)
await menuApi.update(id, updates)
await menuApi.delete(id)
await menuApi.uploadImage(file)

// Reservations
await reservationApi.getAll()
await reservationApi.create(reservation)
await reservationApi.updateStatus(id, status)
await reservationApi.findByPhone(phone)
await reservationApi.delete(id)

// Contact Messages
await contactApi.getAll()
await contactApi.create(message)
await contactApi.updateStatus(id, status)
await contactApi.delete(id)

// About
await aboutApi.get()
await aboutApi.update(content)

// Settings
await settingsApi.get()
await settingsApi.update(settings)

// Admin
await adminApi.getCurrentUser()
await adminApi.updatePassword(newPassword)
await adminApi.createAdmin(email, password)
await adminApi.logout()

// Dashboard
await dashboardApi.getStats()
```

## 🚀 Deployment

Once everything is working locally:

1. Commit and push changes to GitHub
2. Vercel will automatically deploy
3. Test on production URL
4. Admin dashboard will be at: `your-site.vercel.app/admin`

## 🔐 Admin Credentials

- Email: `yeboahmichael977@gmail.com`
- Password: `firatata45`

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Verify environment variables in Vercel
4. Make sure RLS policies are correct
