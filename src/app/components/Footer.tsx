import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { ScreenType } from '../types';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
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

export const Footer = ({ onNavigate }: FooterProps) => {
  const [isOpen, setIsOpen] = useState(isRestaurantOpen());

  useEffect(() => {
    const timer = setInterval(() => {
      setIsOpen(isRestaurantOpen());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <footer 
      className="relative overflow-visible bg-[#FDFBF7]"
      style={{
        clipPath: 'polygon(0 5%, 10% 3%, 20% 4%, 30% 2%, 40% 3%, 50% 1%, 60% 2%, 70% 3%, 80% 2%, 90% 4%, 100% 3%, 100% 100%, 0 100%)'
      }}
    >
      {/* Main footer background */}
      <div className="relative bg-[#2C2C2C] pt-16 md:pt-32 pb-6 md:pb-8">
        {/* Elegant ERNEMAKO Background Design */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large subtle ERNEMAKO text as background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.03]">
            <div className="text-[18rem] md:text-[22rem] font-bold text-white whitespace-nowrap tracking-wider">
              ERNEMAKO
            </div>
          </div>
          
          {/* Decorative corner accents */}
          <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-[#8D6E63]/30"></div>
          <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-[#8D6E63]/30"></div>
          <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-[#8D6E63]/30"></div>
          <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-[#8D6E63]/30"></div>
          
          {/* Subtle decorative dots pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#8D6E63" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
          
          {/* Elegant curved accent lines */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(141, 110, 99, 0)" />
                <stop offset="50%" stopColor="rgba(141, 110, 99, 0.3)" />
                <stop offset="100%" stopColor="rgba(141, 110, 99, 0)" />
              </linearGradient>
            </defs>
            
            {/* Flowing curves */}
            <path 
              d="M 0,200 Q 400,150 800,200 T 1600,200" 
              stroke="url(#lineGradient)" 
              strokeWidth="1.5" 
              fill="none"
            />
            <path 
              d="M 0,400 Q 400,350 800,400 T 1600,400" 
              stroke="url(#lineGradient)" 
              strokeWidth="1.5" 
              fill="none"
            />
          </svg>
          
          {/* Small "RESTAURANT" text accent */}
          <div className="absolute bottom-16 right-16 select-none opacity-[0.08] rotate-[-5deg]">
            <div className="text-6xl font-bold text-white tracking-widest">
              RESTAURANT
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[#E0E0E0] pt-4 md:pt-8 pb-4 md:pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-16">
          
          {/* Brand Column */}
          <div className="space-y-4 md:space-y-6 lg:col-span-1">
            <div onClick={() => onNavigate('HOME')} className="cursor-pointer">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2 tracking-tight">ERNEMAKO</h2>
              <p className="text-[#8D6E63] text-xs md:text-sm font-medium uppercase tracking-widest">Restaurant</p>
            </div>
            <p className="text-xs md:text-sm italic text-[#E0E0E0]/80">
              "Authentic flavors, modern convenience"
            </p>
            <p className="text-xs md:text-sm leading-relaxed">
              Experience the best of Ghanaian cuisine with our self-service kiosk. Fresh ingredients, traditional recipes, served your way.
            </p>
            <div className="flex gap-3 md:gap-4 pt-1 md:pt-2">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-[#8D6E63]/30 flex items-center justify-center hover:bg-[#8D6E63] hover:border-[#8D6E63] hover:text-white transition-all duration-300 group"
                >
                  <Icon size={16} className="md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-6 border-b border-[#8D6E63]/30 pb-1 md:pb-2 inline-block">Explore</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <button onClick={() => onNavigate('HOME')} className="text-xs md:text-sm hover:text-[#8D6E63] hover:translate-x-1 transition-all inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8D6E63]"></span>
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('MENU')} className="text-xs md:text-sm hover:text-[#8D6E63] hover:translate-x-1 transition-all inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8D6E63]"></span>
                  Browse Menu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('HELP')} className="text-xs md:text-sm hover:text-[#8D6E63] hover:translate-x-1 transition-all inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8D6E63]"></span>
                  Help & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-6 border-b border-[#8D6E63]/30 pb-1 md:pb-2 inline-block">Visit Us</h3>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-2 md:gap-3">
                <MapPin size={14} className="md:w-[18px] md:h-[18px] text-[#8D6E63] mt-0.5 shrink-0" />
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=7.34,-2.33&destination_place_id=ChIJYTN9FjhS2w8RQS4Hk0kJl-Q"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-xs md:text-sm hover:text-[#8D6E63] transition-colors"
                  title="Get directions to Ernemako Restaurant"
                >
                  Opposite Fiapre Park<br />
                  Sunyani, Bono Region<br />
                  Ghana
                </a>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Phone size={14} className="md:w-[18px] md:h-[18px] text-[#8D6E63] shrink-0" />
                <a href="tel:+233244567890" className="text-xs md:text-sm hover:text-[#8D6E63] transition-colors">
                  +233 24 456 7890
                </a>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Mail size={14} className="md:w-[18px] md:h-[18px] text-[#8D6E63] shrink-0" />
                <a href="mailto:hello@ernemakorestaurant.com" className="text-xs md:text-sm hover:text-[#8D6E63] transition-colors break-all">
                  hello@ernemakorestaurant.com
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours Column */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-6 border-b border-[#8D6E63]/30 pb-1 md:pb-2 inline-block">Opening Hours</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 md:gap-3">
                <Clock size={14} className="md:w-[18px] md:h-[18px] text-[#8D6E63] shrink-0" />
                <div className="text-xs md:text-sm">
                  <p className="font-semibold text-white mb-1">Monday - Saturday</p>
                  <p className="text-[#E0E0E0]/80">8:00 AM - 10:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Clock size={14} className="md:w-[18px] md:h-[18px] text-[#8D6E63] shrink-0" />
                <div className="text-xs md:text-sm">
                  <p className="font-semibold text-white mb-1">Sunday</p>
                  <p className="text-[#E0E0E0]/80">Closed</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#8D6E63]/20">
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${isOpen ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'} border`}>
                  <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                  <span className={`text-xs font-bold ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
                    {isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Popular Dishes Quick Links */}
        <div className="mb-8 md:mb-12 pb-8 border-b border-[#8D6E63]/20">
          <h3 className="text-sm md:text-base font-bold text-white mb-4">Popular Dishes</h3>
          <div className="flex flex-wrap gap-2">
            {['Jollof Rice', 'Banku with Tilapia', 'Waakye', 'Kelewele', 'Red Red', 'Fufu', 'Groundnut Soup', 'Grilled Tilapia'].map((dish) => (
              <button
                key={dish}
                onClick={() => onNavigate('MENU')}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-[#8D6E63]/30 text-xs hover:bg-[#8D6E63] hover:border-[#8D6E63] transition-all"
              >
                {dish}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-4 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-[10px] md:text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} Ernemako Restaurant. All rights reserved.</p>
          
          <div className="flex gap-4 md:gap-6">
            <button onClick={() => onNavigate('HOME')} className="hover:text-white transition-colors">Home</button>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <button onClick={() => onNavigate('ADMIN_LOGIN')} className="hover:text-[#8D6E63] transition-colors">Admin</button>
          </div>
        </div>
        
          </div>
        </div>
      </div>
    </footer>
  );
};
