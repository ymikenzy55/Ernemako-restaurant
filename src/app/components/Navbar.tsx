import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, HelpCircle, LogIn, User, Phone, X } from 'lucide-react';
import { format } from 'date-fns';
import { ScreenType } from '../types';
import { Button } from './Button';

interface NavbarProps {
  onNavigate?: (screen: ScreenType) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Navbar = ({ onNavigate, isLoggedIn, onLogout }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
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
          ${isScrolled 
            ? 'mt-2 md:mt-4 w-[96%] md:w-auto md:min-w-[700px] max-w-5xl rounded-2xl md:rounded-full bg-white/70 backdrop-blur-xl shadow-lg border border-white/20 py-2 md:py-3 px-4 md:px-6' 
            : 'mt-0 w-full px-4 md:px-6 py-4 md:py-6 bg-transparent'
          }
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-2 md:gap-4 cursor-pointer" onClick={() => onNavigate?.('HOME')}>
          <motion.div 
            className={`font-bold tracking-tight flex flex-col ${isScrolled ? 'text-[#5D4037]' : 'text-white'}`}
            layout
          >
            <h1 className={`${isScrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'} leading-none transition-all`}>ESBAK</h1>
            <span className={`text-xs md:text-sm font-medium tracking-widest uppercase ${isScrolled ? 'text-[#8D6E63]' : 'text-white/80'}`}>Kitchen</span>
          </motion.div>
          
          <a 
            href="https://www.google.com/maps/search/Sunyani" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`
              hidden md:flex items-center gap-2 border-l pl-4 transition-all duration-500 ease-in-out hover:underline
              ${isScrolled ? 'border-[#8D6E63]/30 text-[#5D4037]' : 'border-white/30 text-white drop-shadow-md'}
              ${isScrolled ? 'opacity-0 w-0 overflow-hidden pl-0' : 'opacity-100 w-auto'}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <MapPin size={18} className={isScrolled ? 'text-[#8D6E63]' : 'text-white/90'} />
            <span className="text-sm font-medium">Sunyani</span>
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className={`hidden lg:flex flex-col items-end transition-all duration-300 ${isScrolled ? 'text-[#5D4037] text-xs' : 'text-white text-sm drop-shadow-md'}`}>
            <span className="font-bold">{format(currentTime, 'h:mm a')}</span>
            <span className={`opacity-70 ${isScrolled ? 'hidden' : 'block'}`}>{format(currentTime, 'EEE, MMM d')}</span>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <button 
              onClick={() => setShowCallModal(true)}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-[#8D6E63]/10 text-[#5D4037]' : 'hover:bg-white/10 text-white'}`}
              title="Call to Order"
            >
              <Phone size={18} className="md:w-5 md:h-5" />
              <span className={`hidden lg:inline font-medium text-xs md:text-sm`}>Call to Order</span>
            </button>
            
            <button 
              onClick={() => onNavigate?.('HELP')}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-[#8D6E63]/10 text-[#5D4037]' : 'hover:bg-white/10 text-white'}`}
            >
              <HelpCircle size={18} className="md:w-5 md:h-5" />
              <span className={`hidden sm:inline font-medium text-xs md:text-sm`}>Help</span>
            </button>

            {isLoggedIn ? (
              <button 
                onClick={() => onNavigate?.('DASHBOARD')}
                className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-[#8D6E63]/10 text-[#5D4037]' : 'hover:bg-white/10 text-white'}`}
              >
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border ${isScrolled ? 'bg-[#8D6E63]/20 border-[#8D6E63]/30' : 'bg-white/20 border-white/30'}`}>
                   <User size={14} className="md:w-4 md:h-4" />
                </div>
                <span className={`hidden sm:inline font-medium text-xs md:text-sm`}>Kwame</span>
              </button>
            ) : (
               <div className="flex items-center gap-1 md:gap-2">
                 <button 
                  onClick={() => onNavigate?.('SIGN_IN')}
                  className={`flex items-center gap-1 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium transition-colors text-xs md:text-sm ${isScrolled ? 'text-[#5D4037] hover:bg-[#8D6E63]/10' : 'text-white hover:bg-white/10'}`}
                 >
                   Sign In
                 </button>
                 <button 
                  onClick={() => onNavigate?.('REGISTER')}
                  className={`hidden sm:flex items-center gap-1 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium transition-colors text-xs md:text-sm ${isScrolled ? 'bg-[#8D6E63] text-white hover:bg-[#795548]' : 'bg-white text-[#5D4037] hover:bg-[#FDFBF7]'}`}
                 >
                   Register
                 </button>
               </div>
            )}
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
                    <span className="font-bold">Hours:</span> Mon-Sun, 11:00 AM - 10:00 PM
                  </p>
                  <p className="text-xs text-[#8D6E63]/70">
                    Average response time: 2-5 minutes
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
    </>
  );
};
