import React from 'react';
import { ScreenType, ReservationData, CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/Button';
import { User, CreditCard, History, Star, ArrowLeft, Settings, Bell, ChevronRight, LogOut, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface UserDashboardScreenProps {
  onNavigate: (screen: ScreenType) => void;
  user: any;
  orders: any[];
  reservations: any[];
  onLogout: () => void;
}

export const UserDashboardScreen = ({ onNavigate, user, orders, reservations, onLogout }: UserDashboardScreenProps) => {
  const [activeSection, setActiveSection] = React.useState<'MAIN' | 'PROFILE' | 'NOTIFICATIONS' | 'PREFERENCES' | 'ORDERS'>('MAIN');

  const handleBack = () => {
    if (activeSection === 'MAIN') {
      onNavigate('HOME');
    } else {
      setActiveSection('MAIN');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Sub-screens
  if (activeSection === 'PROFILE') {
    return (
      <SubScreen title="Personal Information" onBack={handleBack}>
        <form className="space-y-6 max-w-lg">
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-sm font-medium text-[#5D4037]">First Name</label>
              <input defaultValue="Kwame" className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8]" />
             </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-[#5D4037]">Last Name</label>
              <input defaultValue="Mensah" className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8]" />
             </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#5D4037]">Email</label>
            <input defaultValue="kwame.mensah@example.com" className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#5D4037]">Phone</label>
            <input defaultValue="+233 24 456 7890" className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8]" />
          </div>
          <Button>Save Changes</Button>
        </form>
      </SubScreen>
    );
  }

  if (activeSection === 'NOTIFICATIONS') {
     return (
      <SubScreen title="Notifications" onBack={handleBack}>
        <div className="space-y-4">
          {['Order Updates', 'Promotions & Offers', 'Reservation Reminders', 'New Menu Items'].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#D7CCC8]/30">
              <span className="font-medium text-[#5D4037]">{item}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8D6E63]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8D6E63]"></div>
              </label>
            </div>
          ))}
        </div>
      </SubScreen>
    );
  }

  if (activeSection === 'PREFERENCES') {
    return (
     <SubScreen title="App Preferences" onBack={handleBack}>
       <div className="space-y-4">
         <div className="p-4 bg-white rounded-xl border border-[#D7CCC8]/30">
            <label className="block text-sm font-medium text-[#5D4037] mb-2">Dietary Preferences</label>
            <div className="flex flex-wrap gap-2">
              {['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Spicy'].map(tag => (
                <button key={tag} className="px-3 py-1 rounded-full border border-[#D7CCC8] text-sm text-[#5D4037] hover:bg-[#8D6E63] hover:text-white transition-colors">
                  {tag}
                </button>
              ))}
            </div>
         </div>
         <div className="p-4 bg-white rounded-xl border border-[#D7CCC8]/30">
           <label className="block text-sm font-medium text-[#5D4037] mb-2">Language</label>
           <select className="w-full px-4 py-2 rounded-lg bg-[#FDFBF7] border border-[#D7CCC8]">
             <option>English</option>
             <option>Twi</option>
             <option>French</option>
           </select>
         </div>
       </div>
     </SubScreen>
   );
 }

 if (activeSection === 'ORDERS') {
  return (
    <SubScreen title="Order History" onBack={handleBack}>
       <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-center text-[#5D4037]/50 py-8">No recent orders found.</p>
        ) : (
          orders.map((order, i) => (
             <div key={i} className="p-4 bg-white rounded-xl border border-[#D7CCC8]/30 flex justify-between items-center">
                <div>
                   <p className="font-bold text-[#3E2723]">Order #{order.id}</p>
                   <p className="text-sm text-[#8D6E63]">{order.date}</p>
                   <p className="text-sm text-[#5D4037] mt-1">{order.items} items</p>
                </div>
                <div className="text-right">
                   <p className="font-bold text-[#3E2723]">GH₵ {order.total.toFixed(2)}</p>
                   <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Completed</span>
                </div>
             </div>
          ))
        )}
       </div>
    </SubScreen>
  );
 }


  return (
    <div className="max-w-4xl mx-auto pb-20 pt-24">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('HOME')}>
          <ArrowLeft size={20} className="mr-2" /> Back
        </Button>
        <h2 className="text-3xl font-bold text-[#3E2723]">My Account</h2>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Profile Card */}
        <motion.div variants={itemVariants} className="md:col-span-3 bg-gradient-to-r from-[#5D4037] to-[#8D6E63] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl border-4 border-white/10 shadow-inner">
              <span role="img" aria-label="user">👤</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-1">Kwame Mensah</h3>
              <p className="text-white/80 mb-4">kwame.mensah@example.com</p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-medium bg-black/20 p-2 rounded-lg inline-flex">
                <span className="flex items-center gap-1 text-[#FFD700]"><Star size={16} fill="currentColor" /> Gold Member</span>
                <span className="w-px h-4 bg-white/20" />
                <span>1,250 Points</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setActiveSection('PROFILE')}
            >
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          variants={itemVariants} 
          className="bg-white p-6 rounded-2xl shadow-sm border border-[#D7CCC8]/30 hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => setActiveSection('ORDERS')}
        >
          <div className="w-12 h-12 rounded-full bg-[#EFEBE9] flex items-center justify-center text-[#5D4037] mb-4 group-hover:scale-110 transition-transform">
            <History size={24} />
          </div>
          <h4 className="font-bold text-[#3E2723] mb-1">Order History</h4>
          <p className="text-sm text-[#8D6E63]">View past orders & reorder</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-[#D7CCC8]/30 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-[#EFEBE9] flex items-center justify-center text-[#5D4037] mb-4 group-hover:scale-110 transition-transform">
            <CreditCard size={24} />
          </div>
          <h4 className="font-bold text-[#3E2723] mb-1">Payment Methods</h4>
          <p className="text-sm text-[#8D6E63]">Manage saved cards</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-[#D7CCC8]/30 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-[#EFEBE9] flex items-center justify-center text-[#5D4037] mb-4 group-hover:scale-110 transition-transform">
            <Star size={24} />
          </div>
          <h4 className="font-bold text-[#3E2723] mb-1">Rewards</h4>
          <p className="text-sm text-[#8D6E63]">Redeem your points</p>
        </motion.div>

        {/* Recent Activity List */}
        <motion.div variants={itemVariants} className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-[#D7CCC8]/30 overflow-hidden">
          <div className="p-6 border-b border-[#D7CCC8]/30 flex justify-between items-center">
            <h4 className="font-bold text-[#3E2723]">Recent Activity</h4>
            <button onClick={() => setActiveSection('ORDERS')} className="text-sm text-[#8D6E63] font-medium hover:underline">View All</button>
          </div>
          <div className="divide-y divide-[#D7CCC8]/30">
            {/* Combine Orders and Reservations for display */}
            {[
              ...reservations.map(r => ({ title: `Reservation (${r.partySize} ppl)`, date: r.date, amount: 'Confirmed', type: 'res' })),
              ...orders.map(o => ({ title: `Order #${o.id}`, date: o.date, amount: `GH₵ ${o.total.toFixed(2)}`, type: 'order' }))
            ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3).map((item, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-[#FDFBF7] transition-colors">
                <div>
                  <p className="font-medium text-[#5D4037]">{item.title}</p>
                  <p className="text-xs text-[#8D6E63]">{item.date instanceof Date ? item.date.toLocaleDateString() : item.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#3E2723]">{item.amount}</p>
                </div>
              </div>
            ))}
            {reservations.length === 0 && orders.length === 0 && (
               <div className="p-8 text-center text-[#5D4037]/50">No recent activity</div>
            )}
          </div>
        </motion.div>

        {/* Settings Menu */}
        <motion.div variants={itemVariants} className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-[#D7CCC8]/30 overflow-hidden">
          <div className="p-6 border-b border-[#D7CCC8]/30">
            <h4 className="font-bold text-[#3E2723]">Settings</h4>
          </div>
          <div className="p-2">
            {[
              { icon: User, label: 'Personal Information', action: () => setActiveSection('PROFILE') },
              { icon: Bell, label: 'Notifications', action: () => setActiveSection('NOTIFICATIONS') },
              { icon: Settings, label: 'App Preferences', action: () => setActiveSection('PREFERENCES') },
              { icon: LogOut, label: 'Log Out', color: 'text-red-500', action: onLogout },
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={item.action}
                className="w-full p-3 flex items-center justify-between hover:bg-[#FDFBF7] rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={`${item.color || 'text-[#8D6E63]'}`} />
                  <span className={`text-sm font-medium ${item.color || 'text-[#5D4037]'}`}>{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-[#D7CCC8] group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const SubScreen = ({ title, onBack, children }: { title: string, onBack: () => void, children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="max-w-2xl mx-auto pt-24"
  >
    <div className="flex items-center gap-4 mb-8">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ChevronLeft size={20} className="mr-2" /> Back
      </Button>
      <h2 className="text-3xl font-bold text-[#3E2723]">{title}</h2>
    </div>
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D7CCC8]/30">
      {children}
    </div>
  </motion.div>
);
