import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Image as ImageIcon, UtensilsCrossed, Calendar, 
  FileText, LogOut, MessageSquare, Plus, Trash2, Edit, X, Check
} from 'lucide-react';
import { Button } from '../components/Button';
import { 
  galleryApi, menuApi, reservationApi, contactApi, dashboardApi, adminApi, aboutApi,
  type GalleryImage, type MenuItem, type Reservation, type ContactMessage, type AboutContent
} from '../../lib/adminApi';
import { toast } from 'sonner';

type AdminSection = 'dashboard' | 'gallery' | 'menu' | 'reservations' | 'messages' | 'about';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  const menuItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'messages' as AdminSection, label: 'Messages', icon: MessageSquare },
    { id: 'reservations' as AdminSection, label: 'Reservations', icon: Calendar },
    { id: 'menu' as AdminSection, label: 'Menu', icon: UtensilsCrossed },
    { id: 'gallery' as AdminSection, label: 'Gallery', icon: ImageIcon },
    { id: 'about' as AdminSection, label: 'About Page', icon: FileText },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#FDFBF7]">
      <aside className="w-full md:w-64 bg-gradient-to-b from-[#3E2723] to-[#2C1810] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-bold text-lg">ERNEMAKO</h1>
          <p className="text-xs text-[#D7CCC8]">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
                <span className="text-sm md:text-base">{item.label}</span>
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
        <header className="bg-white border-b px-4 md:px-8 py-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#3E2723]">
            {menuItems.find(i => i.id === activeSection)?.label}
          </h2>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeSection === 'dashboard' && <DashboardSection />}
          {activeSection === 'messages' && <MessagesSection />}
          {activeSection === 'reservations' && <ReservationsSection />}
          {activeSection === 'menu' && <MenuSection />}
          {activeSection === 'gallery' && <GallerySection />}
          {activeSection === 'about' && <AboutSection />}
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
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await contactApi.delete(id);
      toast.success('Message deleted');
      loadMessages();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredMessages = filter === 'all' ? messages : messages.filter(m => m.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {['all', 'unread', 'read'].map(f => (
          <button key={f} onClick={() => setFilter(f as any)} className={`px-4 py-2 rounded-lg font-medium ${filter === f ? 'bg-[#8D6E63] text-white' : 'bg-white border'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? messages.length : messages.filter(m => m.status === f).length})
          </button>
        ))}
      </div>

      {filteredMessages.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center text-gray-500">
          No {filter !== 'all' ? filter : ''} messages found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map(msg => (
            <div key={msg.id} className={`bg-white p-6 rounded-xl border-2 ${msg.status === 'unread' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-lg">{msg.name}</h4>
                    {msg.status === 'unread' && <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">NEW</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                  <p className="mt-3 text-gray-800">{msg.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(msg.created_at).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {msg.status === 'unread' && (
                    <Button size="sm" onClick={() => handleStatusUpdate(msg.id, 'read')} className="bg-blue-500">
                      <Check size={16} /> Mark Read
                    </Button>
                  )}
                  {msg.status === 'read' && (
                    <Button size="sm" onClick={() => handleStatusUpdate(msg.id, 'replied')} className="bg-green-500">
                      <Check size={16} /> Replied
                    </Button>
                  )}
                  <button onClick={() => handleDelete(msg.id)} className="p-2 hover:bg-red-100 text-red-600 rounded">
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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reservation?')) return;
    try {
      await reservationApi.delete(id);
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
    <div className="space-y-6">
      <div className="flex gap-2">
        {['all', 'pending', 'confirmed', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f as any)} className={`px-4 py-2 rounded-lg font-medium ${filter === f ? 'bg-[#8D6E63] text-white' : 'bg-white border'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? reservations.length : reservations.filter(r => r.status === f).length})
          </button>
        ))}
      </div>

      {filteredReservations.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center text-gray-500">
          No {filter !== 'all' ? filter : ''} reservations found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map(res => (
            <div key={res.id} className={`bg-white p-6 rounded-xl border-2 ${getStatusColor(res.status)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-lg">{res.customer_name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(res.status)}`}>
                      {res.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p><Calendar size={16} className="inline mr-2" />{res.date} at {res.time}</p>
                    <p><UtensilsCrossed size={16} className="inline mr-2" />{res.guests} guests</p>
                    <p><MessageSquare size={16} className="inline mr-2" />{res.phone}</p>
                    {res.special_requests && <p className="text-gray-600 italic">Note: {res.special_requests}</p>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {res.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => handleStatusUpdate(res.id, 'confirmed')} className="bg-blue-500">
                        <Check size={16} /> Confirm
                      </Button>
                      <Button size="sm" onClick={() => handleStatusUpdate(res.id, 'cancelled')} className="bg-red-500">
                        <X size={16} /> Cancel
                      </Button>
                    </>
                  )}
                  {res.status === 'confirmed' && (
                    <Button size="sm" onClick={() => handleStatusUpdate(res.id, 'completed')} className="bg-green-500">
                      <Check size={16} /> Complete
                    </Button>
                  )}
                  <button onClick={() => handleDelete(res.id)} className="p-2 hover:bg-red-100 text-red-600 rounded text-sm">
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
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, category: 'Appetizers', image_url: '', status: 'active' });
  const [uploading, setUploading] = useState(false);

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
      setFormData({ name: '', description: '', price: 0, category: 'Appetizers', image_url: '', status: 'active' });
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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    try {
      await menuApi.delete(id);
      toast.success('Menu item deleted');
      loadItems();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description, price: item.price, category: item.category, image_url: item.image_url, status: item.status });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Menu Items ({items.length})</h3>
        <Button onClick={() => { setShowForm(true); setEditingItem(null); setFormData({ name: '', description: '', price: 0, category: 'Appetizers', image_url: '', status: 'active' }); }}>
          <Plus size={20} /> Add Menu Item
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
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.status === 'active'} onChange={e => setFormData(prev => ({ ...prev, status: e.target.checked ? 'active' : 'inactive' }))} />
              Available
            </label>
            <div className="flex gap-2">
              <Button type="submit" disabled={uploading}>{editingItem ? 'Update' : 'Add'}</Button>
              <Button type="button" onClick={() => setShowForm(false)} className="bg-gray-500">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border-2 border-gray-200 flex gap-4">
            {item.image_url && <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded" />}
            <div className="flex-1">
              <h4 className="font-bold">{item.name}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="font-bold text-[#8D6E63]">GH₵{item.price}</p>
              <p className="text-xs text-gray-500">{item.category} • {item.status === 'active' ? 'Available' : 'Unavailable'}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleEdit(item)} className="p-2 hover:bg-gray-100 rounded"><Edit size={16} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-100 text-red-600 rounded"><Trash2 size={16} /></button>
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

  const handleDelete = async (id: string, storagePath: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await galleryApi.delete(id, storagePath);
      toast.success('Image deleted');
      loadImages();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border-2 border-[#8D6E63]">
        <h4 className="font-bold mb-4">Upload New Image</h4>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Image title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="w-full p-3 border rounded-lg" 
          />
          <input 
            id="gallery-file-input"
            type="file" 
            accept="image/*" 
            onChange={handleFileSelect} 
            className="w-full p-3 border rounded-lg" 
            disabled={uploading} 
          />
          {selectedFile && (
            <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map(img => (
          <div key={img.id} className="relative group">
            <img src={img.image_url} alt={img.title} className="w-full h-48 object-cover rounded-xl" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <button onClick={() => handleDelete(img.id, img.storage_path || '')} className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600">
                <Trash2 size={20} />
              </button>
            </div>
            <p className="mt-2 text-sm font-medium">{img.title}</p>
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
