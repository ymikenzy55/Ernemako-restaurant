import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, HelpCircle, Phone, X, Menu, Home, Info, UtensilsCrossed, Image as ImageIcon, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { ScreenType } from '../types';
import { Button } from './Button';

interface NavbarProps {
  onNavigate?: (screen: ScreenType) => void;
}

// Helper function to check if restaurant is currently open
const isRestaurantOpen = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hours = now.getHours();
  
  // Closed on Sundays (day === 0)
  if (day === 0) return false;
  
  // Open Monday-Saturday (day 1-6), 8am-10pm
  return hours >= 8 && hours < 22;
};

export const Navbar = ({ onNavigate }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [isOpen, setIsOpen] = useState(isRestaurantOpen());

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / windowHeight) * 100;
      
      setScrollProgress(Math.min(progress, 100));
      
      if (scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setIsOpen(isRestaurantOpen());
    }, 60000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <>
    <motion.header
      className="fixed top-0 left-0 right-0 z-[60] flex justify-center pointer-events-none"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className={`
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          pointer-events-auto
          flex items-center justify-between
          relative overflow-hidden
          ${isScrolled 
            ? 'mt-2 md:mt-4 w-[96%] md:w-auto md:min-w-[700px] max-w-5xl rounded-2xl md:rounded-full py-2 md:py-3 px-4 md:px-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/20' 
            : 'mt-0 w-full px-4 md:px-6 py-4 md:py-6'
          }
        `}
        style={isScrolled ? {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        } : {}}
      >
        {/* Scroll Progress Bar */}
        {isScrolled && (
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-white/40 via-white/60 to-white/40"
            initial={{ width: 0 }}
            animate={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        )}
        
        {/* Shimmer Effect */}
        {isScrolled && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatDelay: 5,
              ease: 'easeInOut' 
            }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            }}
          />
        )}
        {/* Logo Section */}
        <div className="flex items-center gap-2 md:gap-4 cursor-pointer relative z-10" onClick={() => onNavigate?.('HOME')}>
          <motion.div 
            className="font-bold tracking-tight flex flex-col text-white drop-shadow-lg"
            layout
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className={`${isScrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'} leading-none transition-all`}>ERNEMAKO</h1>
            <span className="text-xs md:text-sm font-medium tracking-widest uppercase text-white/90">Restaurant</span>
          </motion.div>
          
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=7.34,-2.33&destination_place_id=ChIJYTN9FjhS2w8RQS4Hk0kJl-Q" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`
              hidden md:flex items-center gap-2 border-l pl-4 transition-all duration-500 ease-in-out hover:underline
              border-white/30 text-white drop-shadow-md
              ${isScrolled ? 'opacity-0 w-0 overflow-hidden pl-0' : 'opacity-100 w-auto'}
            `}
            onClick={(e) => e.stopPropagation()}
            title="Get directions to Ernemako Restaurant, Sunyani"
          >
            <MapPin size={18} className="text-white/90" />
            <span className="text-sm font-medium">Sunyani</span>
          </a>
        </div>

        {/* Navigation Tabs - Desktop Only */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="hidden lg:flex items-center gap-1 relative z-10"
        >
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-full text-sm font-medium text-white hover:bg-white/20 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => {
              const aboutSection = document.querySelector('[data-section="about"]');
              aboutSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="px-3 py-1.5 rounded-full text-sm font-medium text-white hover:bg-white/20 transition-colors"
          >
            About
          </button>
          <button
            onClick={() => {
              const menuSection = document.querySelector('[data-section="menu"]');
              menuSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="px-3 py-1.5 rounded-full text-sm font-medium text-white hover:bg-white/20 transition-colors"
          >
            Menu
          </button>
          <button
            onClick={() => {
              const gallerySection = document.querySelector('[data-section="gallery"]');
              gallerySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="px-3 py-1.5 rounded-full text-sm font-medium text-white hover:bg-white/20 transition-colors"
          >
            Gallery
          </button>
          <button
            onClick={() => {
              const contactSection = document.querySelector('[data-section="contact"]');
              contactSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="px-3 py-1.5 rounded-full text-sm font-medium text-white hover:bg-white/20 transition-colors"
          >
            Contact
          </button>
        </motion.nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4 relative z-10">
          <div className="hidden lg:flex flex-col items-end transition-all duration-300 text-white text-sm drop-shadow-md">
            <span className="font-bold">{format(currentTime, 'h:mm a')}</span>
            <span className={`opacity-70 ${isScrolled ? 'hidden' : 'block'}`}>{format(currentTime, 'EEE, MMM d')}</span>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <motion.button 
              onClick={() => setShowCallModal(true)}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-full transition-colors hover:bg-white/20 text-white"
              title="Call to Order"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={18} className="md:w-5 md:h-5" />
              <span className={`hidden lg:inline font-medium text-xs md:text-sm`}>Call to Order</span>
            </motion.button>
            
            <motion.button 
              onClick={() => onNavigate?.('HELP')}
              className="hidden sm:flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-full transition-colors hover:bg-white/20 text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HelpCircle size={18} className="md:w-5 md:h-5" />
              <span className={`hidden sm:inline font-medium text-xs md:text-sm`}>Help</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden flex items-center gap-1 px-2 py-2 rounded-full transition-colors hover:bg-white/20 text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>

    {/* Call to Order Modal */}
    <AnimatePresence>
      {showCallModal && (
        <div 
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowCallModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-br from-[#8D6E63] to-[#5D4037] p-8 text-white">
              <button
                onClick={() => setShowCallModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Phone size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Call to Order</h2>
                  <p className="text-white/80 text-sm">We're here to help!</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#8D6E63] font-medium mb-2">Main Line</p>
                  <a
                    href="tel:+233123456789"
                    className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-xl hover:bg-[#8D6E63]/10 transition-colors group"
                  >
                    <div>
                      <p className="font-bold text-[#3E2723] text-lg">+233 123 456 789</p>
                      <p className="text-sm text-[#8D6E63]">For orders & reservations</p>
                    </div>
                    <Phone className="text-[#8D6E63] group-hover:scale-110 transition-transform" size={24} />
                  </a>
                </div>

                <div>
                  <p className="text-sm text-[#8D6E63] font-medium mb-2">WhatsApp</p>
                  <a
                    href="https://wa.me/233123456789?text=Hi%2C%20I%27d%20like%20to%20place%20an%20order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-xl hover:bg-[#8D6E63]/10 transition-colors group"
                  >
                    <div>
                      <p className="font-bold text-[#3E2723] text-lg">Message Us</p>
                      <p className="text-sm text-[#8D6E63]">Quick response via WhatsApp</p>
                    </div>
                    <svg className="text-[#8D6E63] group-hover:scale-110 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                </div>

                <div className="pt-4 border-t border-[#D7CCC8]">
                  <p className="text-sm text-[#8D6E63] mb-2">
                    <span className="font-bold">Hours:</span> Mon-Sat, 8:00 AM - 10:00 PM
                  </p>
                  <p className="text-xs text-[#8D6E63]/70">
                    Closed on Sundays
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowCallModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Mobile Navigation Menu */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-gradient-to-br from-[#3E2723] to-[#2C1810] shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">ERNEMAKO</h2>
                <p className="text-xs text-[#D7CCC8] uppercase tracking-widest">Restaurant</p>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Status Badge */}
            <div className="px-6 py-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isOpen ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'} border`}>
                <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                <span className={`text-sm font-medium ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
                  {isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="px-6 py-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                  >
                    <Home size={20} className="text-[#D7CCC8]" />
                    <span className="font-medium">Home</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const aboutSection = document.querySelector('[data-section="about"]');
                      aboutSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                  >
                    <Info size={20} className="text-[#D7CCC8]" />
                    <span className="font-medium">About</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const menuSection = document.querySelector('[data-section="menu"]');
                      menuSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                  >
                    <UtensilsCrossed size={20} className="text-[#D7CCC8]" />
                    <span className="font-medium">Menu</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const gallerySection = document.querySelector('[data-section="gallery"]');
                      gallerySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                  >
                    <ImageIcon size={20} className="text-[#D7CCC8]" />
                    <span className="font-medium">Gallery</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const contactSection = document.querySelector('[data-section="contact"]');
                      contactSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                  >
                    <Mail size={20} className="text-[#D7CCC8]" />
                    <span className="font-medium">Contact</span>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Quick Actions */}
            <div className="px-6 py-4 border-t border-white/10 mt-4">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-3">Quick Actions</p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate?.('MENU');
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-[#8D6E63] text-white font-medium hover:bg-[#795548] transition-colors"
                >
                  Order Now
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate?.('RESERVATION');
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                >
                  Make Reservation
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate?.('HELP');
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                >
                  Help & Support
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="px-6 py-4 border-t border-white/10 mt-auto">
              <p className="text-xs text-white/60 uppercase tracking-wider mb-3">Contact</p>
              <div className="space-y-2 text-sm text-white/80">
                <a href="tel:+233123456789" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone size={16} />
                  <span>+233 123 456 789</span>
                </a>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=7.34,-2.33&destination_place_id=ChIJYTN9FjhS2w8RQS4Hk0kJl-Q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MapPin size={16} />
                  <span>Sunyani, Ghana</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};
