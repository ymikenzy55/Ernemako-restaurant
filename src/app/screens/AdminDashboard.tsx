import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  UtensilsCrossed, 
  Calendar, 
  FileText, 
  Settings,
  LogOut,
  Upload,
  Save,
  Trash2,
  Plus,
  X,
  Eye,
  Edit
} from 'lucide-react';
import { Button } from '../components/Button';

type AdminSection = 'dashboard' | 'gallery' | 'menu' | 'reservations' | 'about' | 'settings';

export const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'gallery' as AdminSection, label: 'Gallery', icon: ImageIcon },
    { id: 'menu' as AdminSection, label: 'Menu Items', icon: UtensilsCrossed },
    { id: 'reservations' as AdminSection, label: 'Reservations', icon: Calendar },
    { id: 'about' as AdminSection, label: 'About Page', icon: FileText },
    { id: 'settings' as AdminSection, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#FDFBF7]">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-[#3E2723] to-[#2C1810] text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#8D6E63] flex items-center justify-center font-bold text-xl">
              E
            </div>
            {isSidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">ERNEMAKO</h1>
                <p className="text-xs text-[#D7CCC8]">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#8D6E63] text-white shadow-lg'
                    : 'hover:bg-white/10 text-white/80'
                }`}
              >
                <Icon size={20} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-[#D7CCC8] px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#3E2723]">
              {menuItems.find((item) => item.id === activeSection)?.label}
            </h2>
            <p className="text-sm text-[#5D4037]/70">Manage your restaurant content</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-[#3E2723]">Admin User</p>
              <p className="text-xs text-[#5D4037]/70">admin@ernemako.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#8D6E63] flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeSection === 'dashboard' && <DashboardSection />}
          {activeSection === 'gallery' && <GallerySection />}
          {activeSection === 'menu' && <MenuSection />}
          {activeSection === 'reservations' && <ReservationsSection />}
          {activeSection === 'about' && <AboutSection />}
          {activeSection === 'settings' && <SettingsSection />}
        </main>
      </div>
    </div>
  );
};

// Dashboard Section
const DashboardSection = () => {
  const stats = [
    { label: 'Total Reservations', value: '24', change: '+12%', color: 'bg-blue-500' },
    { label: 'Menu Items', value: '48', change: '+3', color: 'bg-green-500' },
    { label: 'Gallery Images', value: '32', change: '+8', color: 'bg-purple-500' },
    { label: 'Pending Reviews', value: '5', change: '-2', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border-2 border-[#D7CCC8] shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white`}>
                <LayoutDashboard size={24} />
              </div>
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-3xl font-bold text-[#3E2723] mb-1">{stat.value}</h3>
            <p className="text-sm text-[#5D4037]/70">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border-2 border-[#D7CCC8] shadow-sm">
        <h3 className="text-xl font-bold text-[#3E2723] mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New reservation', user: 'John Doe', time: '5 minutes ago' },
            { action: 'Menu item updated', user: 'Admin', time: '1 hour ago' },
            { action: 'Gallery image added', user: 'Admin', time: '2 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-[#D7CCC8] last:border-0">
              <div>
                <p className="font-medium text-[#3E2723]">{activity.action}</p>
                <p className="text-sm text-[#5D4037]/70">{activity.user}</p>
              </div>
              <span className="text-xs text-[#5D4037]/50">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Gallery Section
const GallerySection = () => {
  const [images, setImages] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400', title: 'Jollof Rice' },
    { id: 2, url: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=400', title: 'Kelewele' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#3E2723]">Gallery Images</h3>
        <Button className="flex items-center gap-2">
          <Plus size={20} />
          Add Image
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <motion.div
            key={image.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl overflow-hidden border-2 border-[#D7CCC8] shadow-sm group"
          >
            <div className="relative aspect-square">
              <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 bg-white rounded-lg hover:bg-[#8D6E63] hover:text-white transition-colors">
                  <Eye size={20} />
                </button>
                <button className="p-2 bg-white rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="font-medium text-[#3E2723]">{image.title}</p>
            </div>
          </motion.div>
        ))}

        {/* Upload Card */}
        <div className="bg-white rounded-xl border-2 border-dashed border-[#8D6E63] p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#8D6E63]/5 transition-colors aspect-square">
          <Upload size={48} className="text-[#8D6E63] mb-4" />
          <p className="text-sm font-medium text-[#3E2723]">Upload Image</p>
          <p className="text-xs text-[#5D4037]/70 mt-1">Click to browse</p>
        </div>
      </div>
    </div>
  );
};

// Menu Section
const MenuSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#3E2723]">Menu Items</h3>
        <Button className="flex items-center gap-2">
          <Plus size={20} />
          Add Menu Item
        </Button>
      </div>

      <div className="bg-white rounded-xl border-2 border-[#D7CCC8] shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#FDFBF7] border-b-2 border-[#D7CCC8]">
            <tr>
              <th className="text-left p-4 font-bold text-[#3E2723]">Image</th>
              <th className="text-left p-4 font-bold text-[#3E2723]">Name</th>
              <th className="text-left p-4 font-bold text-[#3E2723]">Category</th>
              <th className="text-left p-4 font-bold text-[#3E2723]">Price</th>
              <th className="text-left p-4 font-bold text-[#3E2723]">Status</th>
              <th className="text-left p-4 font-bold text-[#3E2723]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Jollof Rice', category: 'Main Course', price: 'GH₵15.00', status: 'Active', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=100' },
              { name: 'Kelewele', category: 'Appetizer', price: 'GH₵8.00', status: 'Active', image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=100' },
            ].map((item, index) => (
              <tr key={index} className="border-b border-[#D7CCC8] last:border-0 hover:bg-[#FDFBF7] transition-colors">
                <td className="p-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                </td>
                <td className="p-4 font-medium text-[#3E2723]">{item.name}</td>
                <td className="p-4 text-[#5D4037]/70">{item.category}</td>
                <td className="p-4 font-bold text-[#8D6E63]">{item.price}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {item.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-[#8D6E63]/10 rounded-lg transition-colors">
                      <Edit size={18} className="text-[#8D6E63]" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Reservations Section
const ReservationsSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#3E2723]">Reservations</h3>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-lg border-2 border-[#D7CCC8] bg-white text-[#3E2723] font-medium">
            <option>All Status</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { name: 'John Doe', date: '2026-02-10', time: '7:00 PM', guests: 4, status: 'Pending', phone: '+233 24 123 4567' },
          { name: 'Jane Smith', date: '2026-02-11', time: '8:00 PM', guests: 2, status: 'Confirmed', phone: '+233 24 987 6543' },
        ].map((reservation, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border-2 border-[#D7CCC8] shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h4 className="text-lg font-bold text-[#3E2723]">{reservation.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reservation.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {reservation.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-[#5D4037]/70">Date</p>
                    <p className="font-medium text-[#3E2723]">{reservation.date}</p>
                  </div>
                  <div>
                    <p className="text-[#5D4037]/70">Time</p>
                    <p className="font-medium text-[#3E2723]">{reservation.time}</p>
                  </div>
                  <div>
                    <p className="text-[#5D4037]/70">Guests</p>
                    <p className="font-medium text-[#3E2723]">{reservation.guests} people</p>
                  </div>
                  <div>
                    <p className="text-[#5D4037]/70">Phone</p>
                    <p className="font-medium text-[#3E2723]">{reservation.phone}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {reservation.status === 'Pending' && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Confirm
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  Contact
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// About Section
const AboutSection = () => {
  const [content, setContent] = useState(
    'Founded in the heart of Sunyani, Ernemako Restaurant began with a simple mission: to serve authentic, soul-warming Ghanaian dishes in a modern, welcoming environment.'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#3E2723]">About Page Content</h3>
        <Button className="flex items-center gap-2">
          <Save size={20} />
          Save Changes
        </Button>
      </div>

      <div className="bg-white rounded-xl p-6 border-2 border-[#D7CCC8] shadow-sm">
        <label className="block mb-2 font-medium text-[#3E2723]">About Text</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full px-4 py-3 rounded-lg border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none resize-none"
        />
        <p className="text-sm text-[#5D4037]/70 mt-2">{content.length} characters</p>
      </div>

      <div className="bg-white rounded-xl p-6 border-2 border-[#D7CCC8] shadow-sm">
        <h4 className="font-bold text-[#3E2723] mb-4">Statistics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-[#3E2723]">Years Experience</label>
            <input
              type="number"
              defaultValue={10}
              className="w-full px-4 py-2 rounded-lg border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-[#3E2723]">Menu Items</label>
            <input
              type="number"
              defaultValue={50}
              className="w-full px-4 py-2 rounded-lg border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Section
const SettingsSection = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[#3E2723]">Restaurant Settings</h3>

      <div className="bg-white rounded-xl p-6 border-2 border-[#D7CCC8] shadow-sm">
        <h4 className="font-bold text-[#3E2723] mb-4">Business Hours</h4>
        <div className="space-y-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <div key={day} className="flex items-center gap-4">
              <span className="w-32 font-medium text-[#3E2723]">{day}</span>
              <input
                type="time"
                defaultValue="08:00"
                className="px-4 py-2 rounded-lg border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none"
              />
              <span className="text-[#5D4037]/70">to</span>
              <input
                type="time"
                defaultValue="22:00"
                className="px-4 py-2 rounded-lg border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none"
              />
            </div>
          ))}
          <div className="flex items-center gap-4">
            <span className="w-32 font-medium text-[#3E2723]">Sunday</span>
            <span className="text-red-600 font-medium">Closed</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border-2 border-[#D7CCC8] shadow-sm">
        <h4 className="font-bold text-[#3E2723] mb-4">Contact Information</h4>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-[#3E2723]">Phone Number</label>
            <input
              type="tel"
              defaultValue="+233 123 456 789"
              className="w-full px-4 py-2 rounded-lg border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-[#3E2723]">Email</label>
            <input
              type="email"
              defaultValue="hello@ernemakorestaurant.com"
              className="w-full px-4 py-2 rounded-lg border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-[#3E2723]">Address</label>
            <textarea
              defaultValue="Opposite Fiapre Park, Sunyani, Bono Region, Ghana"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="flex items-center gap-2">
          <Save size={20} />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};
