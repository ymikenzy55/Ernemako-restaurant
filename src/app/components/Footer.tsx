import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { ScreenType } from '../types';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer 
      className="relative overflow-visible bg-[#FDFBF7]"
      style={{
        clipPath: 'polygon(0 5%, 10% 3%, 20% 4%, 30% 2%, 40% 3%, 50% 1%, 60% 2%, 70% 3%, 80% 2%, 90% 4%, 100% 3%, 100% 100%, 0 100%)'
      }}
    >
      {/* Main footer background */}
      <div className="relative bg-[#2C2C2C] pt-16 md:pt-32 pb-6 md:pb-8">
        {/* Elegant ESBAK Background Design */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large subtle ESBAK text as background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.03]">
            <div className="text-[18rem] md:text-[22rem] font-bold text-white whitespace-nowrap tracking-wider">
              ESBAK
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
          
          {/* Small "KITCHEN" text accent */}
          <div className="absolute bottom-16 right-16 select-none opacity-[0.08] rotate-[-5deg]">
            <div className="text-6xl font-bold text-white tracking-widest">
              KITCHEN
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[#E0E0E0] pt-4 md:pt-8 pb-4 md:pb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 mb-8 md:mb-16">
          
          {/* Brand Column */}
          <div className="space-y-4 md:space-y-6">
            <div onClick={() => onNavigate('HOME')} className="cursor-pointer">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2 tracking-tight">ESBAK</h2>
              <p className="text-[#8D6E63] text-xs md:text-sm font-medium uppercase tracking-widest">Kitchen</p>
            </div>
            <p className="text-xs md:text-sm italic text-[#E0E0E0]/80">
              "Authentic flavors, modern convenience"
            </p>
            <p className="text-xs md:text-sm leading-relaxed hidden md:block">
              Experience the best of Ghanaian cuisine with our self-service kiosk. Fresh ingredients, traditional recipes, served your way.
            </p>
            <div className="flex gap-3 md:gap-4 pt-1 md:pt-2">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#8D6E63] hover:text-white transition-all duration-300 group"
                >
                  <Icon size={16} className="md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links & Contact - Side by side on mobile */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 md:col-span-2 lg:col-span-2">
            {/* Quick Links */}
            <div>
              <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-6 border-b border-[#8D6E63]/30 pb-1 md:pb-2 inline-block">Explore</h3>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <button onClick={() => onNavigate('MENU')} className="text-xs md:text-sm hover:text-[#8D6E63] hover:translate-x-1 transition-all inline-block">
                    Browse Menu
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('RESERVATION')} className="text-xs md:text-sm hover:text-[#8D6E63] hover:translate-x-1 transition-all inline-block">
                    Make Reservation
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('WAITLIST')} className="text-xs md:text-sm hover:text-[#8D6E63] hover:translate-x-1 transition-all inline-block">
                    Join Waitlist
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('MENU')} className="text-xs md:text-sm hover:text-[#8D6E63] hover:translate-x-1 transition-all inline-block">
                    Place Order
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('HELP')} className="text-xs md:text-sm hover:text-[#8D6E63] hover:translate-x-1 transition-all inline-block">
                    Help & Support
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-6 border-b border-[#8D6E63]/30 pb-1 md:pb-2 inline-block">Visit Us</h3>
              <ul className="space-y-2 md:space-y-4">
                <li className="flex items-start gap-2 md:gap-3">
                  <MapPin size={14} className="md:w-[18px] md:h-[18px] text-[#8D6E63] mt-0.5 shrink-0" />
                  <a 
                    href="https://www.google.com/maps/search/Sunyani"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-xs md:text-sm hover:text-[#8D6E63] transition-colors"
                  >
                    Sunyani, Bono Region
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
                  <a href="mailto:hello@esbakkitchen.com" className="text-xs md:text-sm hover:text-[#8D6E63] transition-colors break-all">
                    hello@esbakkitchen.com
                  </a>
                </li>
                <li className="flex items-start gap-2 md:gap-3 pt-1 md:pt-2">
                  <Clock size={14} className="md:w-[18px] md:h-[18px] text-[#8D6E63] mt-0.5 shrink-0" />
                  <div className="text-xs md:text-sm space-y-0.5 md:space-y-1">
                    <p><span className="font-semibold text-white">Mon-Fri:</span> 10AM-10PM</p>
                    <p><span className="font-semibold text-white">Sat-Sun:</span> 9AM-11PM</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-6 border-b border-[#8D6E63]/30 pb-1 md:pb-2 inline-block">Stay Updated</h3>
            <p className="text-xs md:text-sm mb-3 md:mb-4">Get special offers and menu updates.</p>
            <form className="space-y-2 md:space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-white placeholder-white/40 focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-colors"
              />
              <Button fullWidth size="md" className="group !py-2 md:!py-3 text-xs md:text-sm">
                <span>Subscribe</span>
                <ArrowRight size={14} className="md:w-4 md:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-[10px] md:text-xs text-white/40 text-center">We respect your privacy</p>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-4 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-[10px] md:text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} Esbak Kitchen. All rights reserved.</p>
          
          <div className="flex gap-4 md:gap-6">
            <button onClick={() => onNavigate('ABOUT')} className="hover:text-white transition-colors">About Us</button>
            <button onClick={() => onNavigate('CONTACT')} className="hover:text-white transition-colors">Contact</button>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
        
          </div>
        </div>
      </div>
    </footer>
  );
};
