import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Image as ImageIcon, UtensilsCrossed, Calendar, 
  FileText, LogOut, MessageSquare, Plus, Trash2, Edit, X, Check, Settings as SettingsIcon, Bell, Send
} from 'lucide-react';
import { Button } from '../components/Button';
import { 
  galleryApi, menuApi, reservationApi, contactApi, dashboardApi, adminApi, aboutApi,
  type GalleryImage, type MenuItem, type Reservation, type ContactMessage, type AboutContent
} from '../../lib/adminApi';
import { toast } from 'sonner';
import { ConfirmDialog } from '../components/ConfirmDialog';

type AdminSection = 'dashboard' | 'gallery' | 'menu' | 'reservations' | 'messages' | 'about' | 'hero' | 'settings';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingReservations, setPendingReservations] = useState(0);

  // Poll for new messages and reservations every 30 seconds
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const [messages, reservations] = await Promise.all([
          contactApi.getAll(),
          reservationApi.getAll()
        ]);
        setUnreadCount(messages.filter(m => m.status === 'unread').length);
        setPendingReservations(reservations.filter(r => r.status === 'pending').length);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'messages' as AdminSection, label: 'Messages', icon: MessageSquare, badge: unreadCount },
    { id: 'reservations' as AdminSection, label: 'Reservations', icon: Calendar, badge: pendingReservations },
    { id: 'menu' as AdminSection, label: 'Menu', icon: UtensilsCrossed },
    { id: 'gallery' as AdminSection, label: 'Gallery', icon: ImageIcon },
    { id: 'about' as AdminSection, label: 'About Page', icon: FileText },
    { id: 'hero' as AdminSection, label: 'Hero Banner', icon: ImageIcon },
    { id: 'settings' as AdminSection, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#FDFBF7]">
      <aside className="w-full md:w-64 bg-gradient-to-b from-[#3E2723] to-[#2C1810] text-white flex flex-col md:h-screen">
        <div className="p-4 md:p-6 border-b border-white/10">
          <h1 className="font-bold text-base md:text-lg">ERNEMAKO</h1>
          <p className="text-xs text-[#D7CCC8]">Admin Panel</p>
        </div>
        <nav className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg relative text-sm md:text-base ${
                  activeSection === item.id ? 'bg-[#8D6E63]' : 'hover:bg-white/10'
                }`}
              >
                <Icon size={18} className="md:w-5 md:h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-2 md:p-4 border-t border-white/10">
          <button onClick={async () => { await adminApi.logout(); onLogout(); }} className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg hover:bg-red-500/20 text-red-400 text-sm md:text-base">
            <LogOut size={18} className="md:w-5 md:h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-4 md:px-8 py-3 md:py-4">
          <h2 className="text-lg md:text-2xl font-bold text-[#3E2723]">
            {menuItems.find(i => i.id === activeSection)?.label}
          </h2>
        </header>
        <main className="flex-1 overflow-y-auto p-3 md:p-8">
          {activeSection === 'dashboard' && <DashboardSection />}
          {activeSection === 'messages' && <MessagesSection />}
          {activeSection === 'reservations' && <ReservationsSection />}
          {activeSection === 'menu' && <MenuSection />}
          {activeSection === 'gallery' && <GallerySection />}
          {activeSection === 'about' && <AboutSection />}
          {activeSection === 'hero' && <HeroBannerSection />}
          {activeSection === 'settings' && <SettingsSection />}
        </main>
      </div>
    </div>
  );
};

const DashboardSection = () => {
  const [stats, setStats] = useState({ totalReservations: 0, unreadMessages: 0, menuItemsCount: 0, galleryImagesCount: 0 });
  useEffect(() => { dashboardApi.getStats().then(setStats).catch(console.error); }, []);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      {[
        { label: 'Reservations', value: stats.totalReservations, color: 'bg-blue-500' },
        { label: 'Messages', value: stats.unreadMessages, color: 'bg-orange-500' },
        { label: 'Menu Items', value: stats.menuItemsCount, color: 'bg-green-500' },
        { label: 'Gallery', value: stats.galleryImagesCount, color: 'bg-purple-500' },
      ].map(stat => (
        <div key={stat.label} className="bg-white rounded-xl p-4 md:p-6 border-2 border-[#D7CCC8]">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${stat.color} mb-3 md:mb-4`} />
          <h3 className="text-2xl md:text-3xl font-bold">{stat.value}</h3>
          <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

const MessagesSection = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const loadMessages = () => contactApi.getAll().then(setMessages).catch(e => toast.error('Failed to load messages'));
  useEffect(() => { loadMessages(); }, []);

  const handleStatusUpdate = async (id: string, status: ContactMessage['status']) => {
    try {
      await contactApi.updateStatus(id, status);
      toast.success(`Message marked as ${status}`);
      loadMessages();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await contactApi.delete(deleteConfirm.id);
      toast.success('Message deleted');
      loadMessages();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleSendReply = async (msg: ContactMessage) => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setSending(true);
    try {
      // Send email via API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: msg.email,
          subject: `Re: Your message to Ernemako Restaurant`,
          message: replyMessage,
          replyTo: 'hello@ernemakorestaurant.com',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      // Mark as replied and save the reply message to database
      await contactApi.updateStatus(msg.id, 'replied', replyMessage);
      
      // Update local state to show the reply immediately
      setMessages(prevMessages => 
        prevMessages.map(m => 
          m.id === msg.id 
            ? { ...m, status: 'replied' as const, reply_message: replyMessage, reply_sent_at: new Date().toISOString() }
            : m
        )
      );
      
      toast.success('Email sent successfully!');
      setReplyingTo(null);
      setReplyMessage('');
    } catch (error: any) {
      console.error('Send reply error:', error);
      toast.error(error.message || 'Failed to send reply');
    }
    setSending(false);
  };

  const filteredMessages = filter === 'all' ? messages : messages.filter(m => m.status === filter);

  return (
    <div className="space-y-4 md:space-y-6">
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
      
      <div className="flex flex-wrap gap-2">
        {['all', 'unread', 'read'].map(f => (
          <button key={f} onClick={() => setFilter(f as any)} className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base ${filter === f ? 'bg-[#8D6E63] text-white' : 'bg-white border'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? messages.length : messages.filter(m => m.status === f).length})
          </button>
        ))}
      </div>

      {filteredMessages.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center text-gray-500">
          No {filter !== 'all' ? filter : ''} messages found
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {filteredMessages.map(msg => (
            <div key={msg.id} className={`bg-white p-4 md:p-6 rounded-xl border-2 ${msg.status === 'unread' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                    <h4 className="font-bold text-base md:text-lg truncate">{msg.name}</h4>
                    {msg.status === 'unread' && <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full flex items-center gap-1 flex-shrink-0"><Bell size={12} /> NEW</span>}
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1 break-all">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                  <p className="mt-2 md:mt-3 text-sm md:text-base text-gray-800 break-words">{msg.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(msg.created_at).toLocaleString()}</p>
                  
                  {/* Show sent reply */}
                  {msg.status === 'replied' && msg.reply_message && (
                    <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
                      <p className="text-xs font-medium text-green-800 mb-1">Your Reply:</p>
                      <p className="text-sm text-gray-700">{msg.reply_message}</p>
                      {msg.reply_sent_at && (
                        <p className="text-xs text-gray-500 mt-1">Sent: {new Date(msg.reply_sent_at).toLocaleString()}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Reply Form */}
                  {replyingTo === msg.id && (
                    <div className="mt-4 p-3 md:p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium mb-2">Reply to {msg.name}</label>
                      <textarea
                        value={replyMessage}
                        onChange={e => setReplyMessage(e.target.value)}
                        className="w-full p-2 md:p-3 border rounded-lg mb-3 text-sm md:text-base"
                        rows={4}
                        placeholder="Type your reply here..."
                      />
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button size="sm" onClick={() => handleSendReply(msg)} disabled={sending} className="w-full sm:w-auto">
                          <Send size={16} /> {sending ? 'Sending...' : 'Send Reply'}
                        </Button>
                        <Button size="sm" onClick={() => { setReplyingTo(null); setReplyMessage(''); }} className="bg-gray-500 w-full sm:w-auto">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex md:flex-col gap-2 ml-0 md:ml-4 flex-wrap md:flex-nowrap">
                  {msg.status === 'unread' && (
                    <Button size="sm" onClick={() => handleStatusUpdate(msg.id, 'read')} className="bg-blue-500 flex-1 md:flex-none">
                      <Check size={16} /> <span className="hidden sm:inline">Mark Read</span><span className="sm:hidden">Read</span>
                    </Button>
                  )}
                  {msg.status !== 'replied' && (
                    <Button size="sm" onClick={() => setReplyingTo(msg.id)} className="bg-green-500 flex-1 md:flex-none">
                      <Send size={16} /> Reply
                    </Button>
                  )}
                  {msg.status === 'replied' && (
                    <span className="text-xs text-green-600 font-medium whitespace-nowrap">✓ Replied</span>
                  )}
                  <button onClick={() => setDeleteConfirm({ isOpen: true, id: msg.id })} className="p-2 hover:bg-red-100 text-red-600 rounded flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ReservationsSection = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const loadReservations = () => reservationApi.getAll().then(setReservations).catch(e => toast.error('Failed to load reservations'));
  useEffect(() => { loadReservations(); }, []);

  const handleStatusUpdate = async (id: string, status: Reservation['status']) => {
    try {
      await reservationApi.updateStatus(id, status);
      toast.success(`Reservation ${status}`);
      loadReservations();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await reservationApi.delete(deleteConfirm.id);
      toast.success('Reservation deleted');
      loadReservations();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredReservations = filter === 'all' ? reservations : reservations.filter(r => r.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Reservation"
        message="Are you sure you want to delete this reservation? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
      
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f as any)} className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base ${filter === f ? 'bg-[#8D6E63] text-white' : 'bg-white border'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? reservations.length : reservations.filter(r => r.status === f).length})
          </button>
        ))}
      </div>

      {filteredReservations.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center text-gray-500">
          No {filter !== 'all' ? filter : ''} reservations found
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {filteredReservations.map(res => (
            <div key={res.id} className={`bg-white p-4 md:p-6 rounded-xl border-2 ${getStatusColor(res.status)}`}>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                    <h4 className="font-bold text-base md:text-lg truncate">{res.customer_name}</h4>
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(res.status)} flex-shrink-0`}>
                      {res.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs md:text-sm">
                    <p><Calendar size={14} className="md:w-4 md:h-4 inline mr-2" />{res.date} at {res.time}</p>
                    <p><UtensilsCrossed size={14} className="md:w-4 md:h-4 inline mr-2" />{res.guests} guests</p>
                    <p className="break-all"><MessageSquare size={14} className="md:w-4 md:h-4 inline mr-2" />{res.phone}</p>
                    {res.special_requests && <p className="text-gray-600 italic break-words">Note: {res.special_requests}</p>}
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 flex-wrap md:flex-nowrap">
                  {res.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => handleStatusUpdate(res.id, 'confirmed')} className="bg-blue-500 flex-1 md:flex-none">
                        <Check size={16} /> <span className="hidden sm:inline">Confirm</span>
                      </Button>
                      <Button size="sm" onClick={() => handleStatusUpdate(res.id, 'cancelled')} className="bg-red-500 flex-1 md:flex-none">
                        <X size={16} /> <span className="hidden sm:inline">Cancel</span>
                      </Button>
                    </>
                  )}
                  {res.status === 'confirmed' && (
                    <Button size="sm" onClick={() => handleStatusUpdate(res.id, 'completed')} className="bg-green-500 w-full md:w-auto">
                      <Check size={16} /> Complete
                    </Button>
                  )}
                  <button onClick={() => setDeleteConfirm({ isOpen: true, id: res.id })} className="p-2 hover:bg-red-100 text-red-600 rounded text-sm flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MenuSection = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, category: 'Appetizers', image_url: '', status: 'active', featured: false });
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const loadItems = () => menuApi.getAll().then(setItems).catch(e => toast.error('Failed to load menu items'));
  useEffect(() => { loadItems(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await menuApi.update(editingItem.id, formData);
        toast.success('Menu item updated');
      } else {
        await menuApi.create(formData);
        toast.success('Menu item added');
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', price: 0, category: 'Appetizers', image_url: '', status: 'active', featured: false });
      loadItems();
    } catch (error) {
      toast.error('Failed to save menu item');
      console.error(error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await menuApi.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: url }));
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    }
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await menuApi.delete(deleteConfirm.id);
      toast.success('Menu item deleted');
      loadItems();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description, price: item.price, category: item.category, image_url: item.image_url, status: item.status, featured: item.featured });
    setShowForm(true);
  };

  const toggleFeatured = async (item: MenuItem) => {
    try {
      await menuApi.update(item.id, { featured: !item.featured });
      toast.success(item.featured ? 'Removed from featured' : 'Added to featured');
      loadItems();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Menu Item"
        message="Are you sure you want to delete this menu item? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg md:text-xl font-bold">Menu Items ({items.length})</h3>
        <Button onClick={() => { setShowForm(true); setEditingItem(null); setFormData({ name: '', description: '', price: 0, category: 'Appetizers', image_url: '', status: 'active', featured: false }); }} className="w-full sm:w-auto">
          <Plus size={18} className="md:w-5 md:h-5" /> Add Menu Item
        </Button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border-2 border-[#8D6E63]">
          <h4 className="font-bold mb-4">{editingItem ? 'Edit' : 'Add'} Menu Item</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full p-3 border rounded-lg" required />
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full p-3 border rounded-lg" rows={3} required />
            <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))} className="w-full p-3 border rounded-lg" step="0.01" required />
            <select value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} className="w-full p-3 border rounded-lg">
              <option>Appetizers</option>
              <option>Main Course</option>
              <option>Desserts</option>
              <option>Beverages</option>
            </select>
            <div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full p-3 border rounded-lg" disabled={uploading} />
              {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-2 h-32 object-cover rounded" />}
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.status === 'active'} onChange={e => setFormData(prev => ({ ...prev, status: e.target.checked ? 'active' : 'inactive' }))} />
                Available
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.featured} onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))} />
                <span className="flex items-center gap-1">
                  Featured <span className="text-yellow-500">⭐</span>
                </span>
              </label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={uploading}>{editingItem ? 'Update' : 'Add'}</Button>
              <Button type="button" onClick={() => setShowForm(false)} className="bg-gray-500">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className={`bg-white p-4 rounded-xl border-2 ${item.featured ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'} flex gap-4`}>
            {item.image_url && <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded" />}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold">{item.name}</h4>
                {item.featured && <span className="text-yellow-500">⭐</span>}
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="font-bold text-[#8D6E63]">GH₵{item.price}</p>
              <p className="text-xs text-gray-500">{item.category} • {item.status === 'active' ? 'Available' : 'Unavailable'}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => toggleFeatured(item)} className="p-2 hover:bg-yellow-100 rounded" title={item.featured ? 'Remove from featured' : 'Add to featured'}>
                <span className={item.featured ? 'text-yellow-500' : 'text-gray-400'}>⭐</span>
              </button>
              <button onClick={() => handleEdit(item)} className="p-2 hover:bg-gray-100 rounded"><Edit size={16} /></button>
              <button onClick={() => setDeleteConfirm({ isOpen: true, id: item.id })} className="p-2 hover:bg-red-100 text-red-600 rounded"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GallerySection = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null; path: string | null }>({ isOpen: false, id: null, path: null });

  const loadImages = () => galleryApi.getAll().then(setImages).catch(e => toast.error('Failed to load gallery'));
  useEffect(() => { loadImages(); }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title) {
      toast.error('Please enter a title and select an image');
      return;
    }
    setUploading(true);
    try {
      await galleryApi.upload(selectedFile, title);
      toast.success('Image uploaded');
      setTitle('');
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('gallery-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      loadImages();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id || !deleteConfirm.path) return;
    try {
      await galleryApi.delete(deleteConfirm.id, deleteConfirm.path);
      toast.success('Image deleted');
      loadImages();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, path: null })}
        onConfirm={handleDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
      
      <div className="bg-white p-4 md:p-6 rounded-xl border-2 border-[#8D6E63]">
        <h4 className="font-bold mb-4 text-base md:text-lg">Upload New Image</h4>
        <div className="space-y-3 md:space-y-4">
          <input 
            type="text" 
            placeholder="Image title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="w-full p-2 md:p-3 border rounded-lg text-sm md:text-base" 
          />
          <input 
            id="gallery-file-input"
            type="file" 
            accept="image/*" 
            onChange={handleFileSelect} 
            className="w-full p-2 md:p-3 border rounded-lg text-sm md:text-base" 
            disabled={uploading} 
          />
          {selectedFile && (
            <p className="text-xs md:text-sm text-gray-600 break-all">Selected: {selectedFile.name}</p>
          )}
          <Button 
            onClick={handleUpload} 
            disabled={uploading || !title || !selectedFile}
            fullWidth
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {images.map(img => (
          <div key={img.id} className="relative group">
            <img src={img.image_url} alt={img.title} className="w-full h-32 md:h-48 object-cover rounded-xl" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <button onClick={() => setDeleteConfirm({ isOpen: true, id: img.id, path: img.storage_path || '' })} className="p-2 md:p-3 bg-red-500 text-white rounded-lg hover:bg-red-600">
                <Trash2 size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
            <p className="mt-2 text-xs md:text-sm font-medium truncate">{img.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutSection = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [formData, setFormData] = useState({ content: '', years_experience: 0, menu_items_count: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    aboutApi.get().then(data => {
      if (data) {
        setContent(data);
        setFormData({ content: data.content, years_experience: data.years_experience, menu_items_count: data.menu_items_count });
      }
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await aboutApi.update(formData);
      toast.success('About page updated');
      const updated = await aboutApi.get();
      if (updated) setContent(updated);
    } catch (error) {
      toast.error('Failed to update');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-6">About Page Content</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">About Content</label>
          <textarea value={formData.content} onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))} className="w-full p-3 border rounded-lg" rows={8} placeholder="Tell your restaurant's story..." required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Years of Experience</label>
            <input type="number" value={formData.years_experience} onChange={e => setFormData(prev => ({ ...prev, years_experience: parseInt(e.target.value) }))} className="w-full p-3 border rounded-lg" required />
          </div>
          <div>
            <label className="block font-medium mb-2">Menu Items Count</label>
            <input type="number" value={formData.menu_items_count} onChange={e => setFormData(prev => ({ ...prev, menu_items_count: parseInt(e.target.value) }))} className="w-full p-3 border rounded-lg" required />
          </div>
        </div>
        <Button type="submit" disabled={loading}>Save Changes</Button>
      </form>
    </div>
  );
};

const HeroBannerSection = () => {
  const [heroBanner, setHeroBanner] = useState<any>(null);
  const [formData, setFormData] = useState({ image_url: '', title: '', subtitle: '' });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load hero banner settings
    import('../../lib/supabase').then(({ supabase }) => {
      supabase
        .from('settings')
        .select('*')
        .eq('key', 'hero_banner')
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Failed to load hero banner:', error);
          } else if (data) {
            const banner = data.value;
            setHeroBanner(banner);
            setFormData({
              image_url: banner.image_url || '',
              title: banner.title || '',
              subtitle: banner.subtitle || ''
            });
          }
          setLoading(false);
        });
    });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { menuApi } = await import('../../lib/adminApi');
      const url = await menuApi.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: url }));
      toast.success('Image uploaded');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update hero_banner setting in settings table
      const { supabase } = await import('../../lib/supabase');
      
      // First check if the setting exists
      const { data: existing } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'hero_banner')
        .maybeSingle();

      let error;
      if (existing) {
        // Update existing
        const result = await supabase
          .from('settings')
          .update({ value: formData, updated_at: new Date().toISOString() })
          .eq('key', 'hero_banner');
        error = result.error;
      } else {
        // Insert new
        const result = await supabase
          .from('settings')
          .insert([{ key: 'hero_banner', value: formData }]);
        error = result.error;
      }

      if (error) throw error;
      toast.success('Hero banner updated! Refresh the main page to see changes.');
      setHeroBanner(formData);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update hero banner');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8D6E63]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-6">Hero Banner Settings</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Banner Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="w-full p-3 border rounded-lg mb-4" 
              disabled={uploading} 
            />
            {formData.image_url && (
              <img src={formData.image_url} alt="Hero banner preview" className="w-full h-64 object-cover rounded-lg" />
            )}
          </div>
          <div>
            <label className="block font-medium mb-2">Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} 
              className="w-full p-3 border rounded-lg" 
              placeholder="Welcome to Ernemako Restaurant"
              required 
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Subtitle</label>
            <input 
              type="text" 
              value={formData.subtitle} 
              onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value }))} 
              className="w-full p-3 border rounded-lg" 
              placeholder="Authentic Ghanaian Cuisine"
              required 
            />
          </div>
          <Button type="submit" disabled={uploading || loading}>
            {uploading ? 'Uploading...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};


const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState<'password' | 'admins'>('password');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; admin: any | null }>({ isOpen: false, admin: null });

  useEffect(() => {
    adminApi.getCurrentUser().then(user => {
      if (user?.email) {
        setCurrentUserEmail(user.email);
        // Check if this is the super admin (first admin created)
        setIsSuperAdmin(user.email === 'yeboahmichael977@gmail.com');
      }
    });
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const adminsList = await adminApi.getAllAdmins();
      setAdmins(adminsList);
    } catch (error) {
      console.error('Failed to load admins:', error);
      toast.error('Failed to load admin list');
    }
    setLoadingAdmins(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      await adminApi.updatePassword(newPassword);
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    }
    setChangingPassword(false);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSuperAdmin) {
      toast.error('Only the super admin can create new admins');
      return;
    }

    if (newAdminPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setCreatingAdmin(true);
    try {
      await adminApi.createAdmin(newAdminEmail, newAdminPassword);
      toast.success('Admin user created successfully. They can log in immediately.');
      setNewAdminEmail('');
      setNewAdminPassword('');
      loadAdmins(); // Refresh admin list
    } catch (error: any) {
      toast.error(error.message || 'Failed to create admin');
    }
    setCreatingAdmin(false);
  };

  const handleDeleteAdmin = async () => {
    if (!deleteConfirm.admin) return;
    
    try {
      await adminApi.deleteAdmin(deleteConfirm.admin.user_id, deleteConfirm.admin.email);
      toast.success('Admin removed successfully');
      loadAdmins();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove admin');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('password')}
          className={`px-6 py-3 font-medium ${activeTab === 'password' ? 'border-b-2 border-[#8D6E63] text-[#8D6E63]' : 'text-gray-600'}`}
        >
          Change Password
        </button>
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-6 py-3 font-medium ${activeTab === 'admins' ? 'border-b-2 border-[#8D6E63] text-[#8D6E63]' : 'text-gray-600'}`}
        >
          Manage Admins {!isSuperAdmin && '🔒'}
        </button>
      </div>

      {activeTab === 'password' && (
        <div className="bg-white p-6 rounded-xl max-w-md">
          <h3 className="text-xl font-bold mb-6">Change Your Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" disabled={changingPassword} fullWidth>
              {changingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>
      )}

      {activeTab === 'admins' && (
        <div className="space-y-6">
          <ConfirmDialog
            isOpen={deleteConfirm.isOpen}
            onClose={() => setDeleteConfirm({ isOpen: false, admin: null })}
            onConfirm={handleDeleteAdmin}
            title="Remove Admin"
            message={`Are you sure you want to remove ${deleteConfirm.admin?.email} from admin access? They will no longer be able to access the admin panel.`}
            confirmText="Remove"
            variant="danger"
          />
          
          {!isSuperAdmin && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <p className="text-yellow-800 font-medium">
                🔒 Only the super admin (yeboahmichael977@gmail.com) can manage admin accounts.
              </p>
            </div>
          )}

          {isSuperAdmin && (
            <div className="bg-white p-6 rounded-xl max-w-md">
              <h3 className="text-xl font-bold mb-6">Create New Admin</h3>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={e => setNewAdminEmail(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={newAdminPassword}
                    onChange={e => setNewAdminPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Minimum 6 characters"
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" disabled={creatingAdmin} fullWidth>
                  {creatingAdmin ? 'Creating...' : 'Create Admin'}
                </Button>
              </form>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> New admins need to be manually confirmed. After creating, go to Supabase → SQL Editor and run:
                  <code className="block mt-2 p-2 bg-white rounded text-xs">
                    UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'new-admin@example.com';
                  </code>
                </p>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Admin Users</h3>
            {loadingAdmins ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8D6E63]"></div>
              </div>
            ) : admins.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No admins found</p>
            ) : (
              <div className="space-y-3">
                {admins.map(admin => (
                  <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#8D6E63] text-white flex items-center justify-center font-bold">
                        {admin.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{admin.email}</p>
                        <p className="text-sm text-gray-600">
                          {admin.role === 'super_admin' ? '👑 Super Admin' : 'Admin'}
                          {admin.email === currentUserEmail && ' (You)'}
                        </p>
                      </div>
                    </div>
                    {isSuperAdmin && admin.role !== 'super_admin' && admin.email !== currentUserEmail && (
                      <button
                        onClick={() => setDeleteConfirm({ isOpen: true, admin })}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Remove admin"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
