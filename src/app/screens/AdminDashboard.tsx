import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, Image as ImageIcon, UtensilsCrossed, Calendar, 
  FileText, Settings, LogOut, MessageSquare, UserPlus, Clock
} from 'lucide-react';
import { Button } from '../components/Button';
import { 
  galleryApi, menuApi, reservationApi, contactApi, dashboardApi, adminApi,
  type GalleryImage, type MenuItem, type Reservation, type ContactMessage
} from '../../lib/adminApi';

// Admin Dashboard - Complete working version
type AdminSection = 'dashboard' | 'gallery' | 'menu' | 'reservations' | 'messages' | 'about' | 'settings' | 'admin';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    adminApi.getCurrentUser().then(user => {
      if (user) setAdminEmail(user.email || '');
    });
  }, []);

  const menuItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'messages' as AdminSection, label: 'Messages', icon: MessageSquare },
    { id: 'reservations' as AdminSection, label: 'Reservations', icon: Calendar },
    { id: 'menu' as AdminSection, label: 'Menu', icon: UtensilsCrossed },
    { id: 'gallery' as AdminSection, label: 'Gallery', icon: ImageIcon },
  ];

  return (
    <div className="flex h-screen bg-[#FDFBF7]">
      <aside className="w-64 bg-gradient-to-b from-[#3E2723] to-[#2C1810] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-bold text-lg">ERNEMAKO</h1>
          <p className="text-xs text-[#D7CCC8]">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeSection === item.id ? 'bg-[#8D6E63]' : 'hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={async () => { await adminApi.logout(); onLogout(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-4">
          <h2 className="text-2xl font-bold text-[#3E2723]">
            {menuItems.find(i => i.id === activeSection)?.label}
          </h2>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {activeSection === 'dashboard' && <DashboardSection />}
          {activeSection === 'messages' && <MessagesSection />}
          {activeSection === 'reservations' && <ReservationsSection />}
          {activeSection === 'menu' && <MenuSection />}
          {activeSection === 'gallery' && <GallerySection />}
        </main>
      </div>
    </div>
  );
};

const DashboardSection = () => {
  const [stats, setStats] = useState({ totalReservations: 0, unreadMessages: 0, menuItemsCount: 0, galleryImagesCount: 0 });
  useEffect(() => { dashboardApi.getStats().then(setStats).catch(console.error); }, []);
  return (
    <div className="grid grid-cols-4 gap-6">
      {[
        { label: 'Reservations', value: stats.totalReservations, color: 'bg-blue-500' },
        { label: 'Messages', value: stats.unreadMessages, color: 'bg-orange-500' },
        { label: 'Menu Items', value: stats.menuItemsCount, color: 'bg-green-500' },
        { label: 'Gallery', value: stats.galleryImagesCount, color: 'bg-purple-500' },
      ].map(stat => (
        <div key={stat.label} className="bg-white rounded-xl p-6 border-2 border-[#D7CCC8]">
          <div className={`w-12 h-12 rounded-lg ${stat.color} mb-4`} />
          <h3 className="text-3xl font-bold">{stat.value}</h3>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

const MessagesSection = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  useEffect(() => { contactApi.getAll().then(setMessages).catch(console.error); }, []);
  return (
    <div className="space-y-4">
      {messages.map(msg => (
        <div key={msg.id} className={`bg-white p-6 rounded-xl border-2 ${msg.status === 'unread' ? 'border-orange-500' : 'border-gray-200'}`}>
          <h4 className="font-bold">{msg.name}</h4>
          <p className="text-sm text-gray-600">{msg.email}</p>
          <p className="mt-2">{msg.message}</p>
          <div className="flex gap-2 mt-4">
            {msg.status === 'unread' && (
              <Button size="sm" onClick={() => contactApi.updateStatus(msg.id, 'read').then(() => contactApi.getAll().then(setMessages))}>
                Mark Read
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const ReservationsSection = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  useEffect(() => { reservationApi.getAll().then(setReservations).catch(console.error); }, []);
  return (
    <div className="space-y-4">
      {reservations.map(res => (
        <div key={res.id} className="bg-white p-6 rounded-xl border-2 border-gray-200">
          <h4 className="font-bold">{res.name}</h4>
          <p>{res.date} at {res.time} - {res.party_size} guests</p>
          <p className="text-sm">{res.phone}</p>
          {res.status === 'pending' && (
            <Button size="sm" className="mt-4" onClick={() => reservationApi.updateStatus(res.id, 'confirmed').then(() => reservationApi.getAll().then(setReservations))}>
              Confirm
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

const MenuSection = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  useEffect(() => { menuApi.getAll().then(setItems).catch(console.error); }, []);
  return <div className="bg-white p-6 rounded-xl">Found {items.length} menu items</div>;
};

const GallerySection = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  useEffect(() => { galleryApi.getAll().then(setImages).catch(console.error); }, []);
  return <div className="bg-white p-6 rounded-xl">Found {images.length} images</div>;
};
