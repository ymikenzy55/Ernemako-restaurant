import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HomeScreen } from './screens/HomeScreen';
import { ReservationScreen } from './screens/ReservationScreen';
import { WaitlistScreen } from './screens/WaitlistScreen';
import { MenuScreen } from './screens/MenuScreen';
import { CartScreen } from './screens/CartScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { UserDashboardScreen } from './screens/UserDashboardScreen';
import { SignInScreen, RegisterScreen } from './screens/AuthScreens';
import { HelpScreen, ContactScreen, AboutScreen } from './screens/InfoScreens';
import { ScreenType, MenuItem, CartItem } from './types';
import { Button } from './components/Button';
import { CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast, Toaster } from 'sonner';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('HOME');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastOrderNumber, setLastOrderNumber] = useState<string>('');
  
  // User State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>({ name: 'Kwame Mensah', email: 'kwame@example.com' });
  const [orders, setOrders] = useState<any[]>([
    { id: '4829', date: '2024-02-01', items: 3, total: 85.00 },
    { id: '4102', date: '2024-01-25', items: 2, total: 60.00 }
  ]);
  const [reservations, setReservations] = useState<any[]>([
    { id: 'RES-101', date: '2024-02-14', time: '19:00', partySize: 2 }
  ]);

  const navigate = (screen: ScreenType) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentScreen(screen);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('HOME');
    toast.success("Welcome back, Kwame!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('HOME');
    toast.success("Logged out successfully");
  };

  const addToCart = (item: MenuItem, quantity: number, instructions?: string) => {
    setCart(prev => {
      // Check if same item with same instructions exists
      const existingIndex = prev.findIndex(i => i.id === item.id && i.instructions === instructions);
      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }
      return [...prev, { ...item, quantity, instructions }];
    });
    toast.success(`${quantity} ${item.name} added to cart`);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const newCart = [...prev];
      const item = newCart[index];
      const newQuantity = item.quantity + delta;
      
      if (newQuantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      
      item.quantity = newQuantity;
      return newCart;
    });
  };

  const handleReservationSubmit = (data: any) => {
    console.log('Reservation:', data);
    const newRes = { ...data, id: 'RES-' + Math.floor(Math.random() * 10000) };
    setReservations(prev => [newRes, ...prev]);
    setLastOrderNumber(newRes.id);
    navigate('CONFIRMATION_RESERVATION');
  };

  const handleWaitlistSubmit = (data: any) => {
    console.log('Waitlist:', data);
    setLastOrderNumber('WL-' + Math.floor(Math.random() * 100));
    navigate('CONFIRMATION_WAITLIST');
  };

  const handlePaymentComplete = () => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 1.10;
    const newOrder = {
      id: Math.floor(Math.random() * 10000).toString(),
      date: new Date().toLocaleDateString(),
      items: cart.reduce((acc, item) => acc + item.quantity, 0),
      total: total
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    navigate('HOME');
    toast.success("Order completed successfully!");
  };

  // Render content based on current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen onNavigate={navigate} />;
      case 'RESERVATION':
        return <ReservationScreen onNavigate={navigate} onSubmit={handleReservationSubmit} />;
      case 'WAITLIST':
        return <WaitlistScreen onNavigate={navigate} onSubmit={handleWaitlistSubmit} />;
      case 'MENU':
        return <MenuScreen onNavigate={navigate} cart={cart} addToCart={addToCart} />;
      case 'CART':
        return <CartScreen onNavigate={navigate} cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />;
      case 'PAYMENT':
        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 1.10;
        return <PaymentScreen onNavigate={navigate} onComplete={handlePaymentComplete} total={total} />;
      
      // User & Auth
      case 'DASHBOARD':
        return <UserDashboardScreen onNavigate={navigate} user={user} orders={orders} reservations={reservations} onLogout={handleLogout} />;
      case 'SIGN_IN':
        return <SignInScreen onNavigate={navigate} onLogin={handleLogin} />;
      case 'REGISTER':
        return <RegisterScreen onNavigate={navigate} onLogin={handleLogin} />;
      
      // Info
      case 'HELP':
        return <HelpScreen onNavigate={navigate} />;
      case 'CONTACT':
        return <ContactScreen onNavigate={navigate} />;
      case 'ABOUT':
        return <AboutScreen onNavigate={navigate} />;

      // Confirmation
      case 'CONFIRMATION_RESERVATION':
        return (
           <SuccessScreen 
             title="Reservation Confirmed!" 
             message="We have sent a confirmation email to you. We look forward to seeing you."
             code={lastOrderNumber}
             onHome={() => navigate('HOME')}
           />
        );
      case 'CONFIRMATION_WAITLIST':
        return (
           <SuccessScreen 
             title="You're on the list!" 
             message="We'll text you when your table is almost ready."
             code={`#${lastOrderNumber.split('-')[1]}`}
             subMessage="Estimated wait: 15-20 mins"
             onHome={() => navigate('HOME')}
           />
        );
      default:
        return <HomeScreen onNavigate={navigate} />;
    }
  };

  return (
    <Layout onNavigate={navigate} isLoggedIn={isLoggedIn} onLogout={handleLogout}>
      <Toaster position="top-center" />
      {renderScreen()}
    </Layout>
  );
}

const SuccessScreen = ({ title, message, code, subMessage, onHome }: { title: string, message: string, code: string, subMessage?: string, onHome: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto py-20 px-4">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="w-24 h-24 bg-[#8D6E63]/20 text-[#8D6E63] rounded-full flex items-center justify-center mb-6"
    >
      <CheckCircle size={48} />
    </motion.div>
    <h2 className="text-3xl font-bold text-[#3E2723] mb-4">{title}</h2>
    <div className="bg-white p-6 rounded-xl border border-[#D7CCC8] mb-8 w-full shadow-sm">
      <p className="text-sm text-[#8D6E63] uppercase font-bold mb-1">Confirmation Code</p>
      <p className="text-4xl font-mono font-bold text-[#3E2723]">{code}</p>
    </div>
    <p className="text-[#5D4037] mb-2 text-lg">{message}</p>
    {subMessage && <p className="text-[#5D4037]/70 mb-8">{subMessage}</p>}
    <Button fullWidth size="lg" onClick={onHome} className="mt-8">Back to Home</Button>
  </div>
);
