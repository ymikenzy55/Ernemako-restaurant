import React, { useEffect, useState } from 'react';
import { ActionCard } from '../components/Card';
import { CalendarCheck, Clock, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { ScreenType } from '../types';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  
  // Preload hero image
  useEffect(() => {
    const img = new Image();
    img.src = 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=60&auto=format&fit=crop';
    img.onload = () => setHeroImageLoaded(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      // Only track mouse on desktop for performance
      if (window.innerWidth >= 768) {
        setMousePosition({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1
        });
      }
    };

    // Time-based color temperature
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) setTimeOfDay('morning');
      else if (hour >= 12 && hour < 18) setTimeOfDay('day');
      else if (hour >= 18 && hour < 21) setTimeOfDay('evening');
      else setTimeOfDay('night');
    };

    updateTimeOfDay();
    const timeInterval = setInterval(updateTimeOfDay, 60000); // Update every minute

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timeInterval);
    };
  }, []);

  // Calculate opacity and parallax based on scroll
  const heroOpacity = Math.max(0.3, 1 - scrollY / 400);
  const parallaxOffset = scrollY * 0.5;

  // Time-based color overlays
  const timeOverlays = {
    morning: 'bg-gradient-to-br from-orange-200/20 to-yellow-100/20',
    day: 'bg-gradient-to-br from-blue-100/10 to-white/10',
    evening: 'bg-gradient-to-br from-orange-300/30 to-red-200/20',
    night: 'bg-gradient-to-br from-purple-900/40 to-blue-900/30'
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Full Screen Hero Section with Parallax */}
      <div className="relative w-full h-screen -mt-32 overflow-visible md:overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0" 
          style={{ 
            opacity: heroOpacity,
            transform: `translateY(${parallaxOffset}px)`,
            willChange: 'transform'
          }}
        >
          {/* Blur placeholder */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1RDQwMzciLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMzRTI3MjMiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==')`,
              filter: 'blur(20px)',
              opacity: heroImageLoaded ? 0 : 1,
              transition: 'opacity 0.3s'
            }}
          />
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=60&auto=format&fit=crop"
            alt="Esbak Kitchen Atmosphere"
            className={`w-full h-full object-cover transition-opacity duration-500 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              willChange: 'opacity',
              objectPosition: 'center 60%' // Shift image down on mobile, center on desktop
            }}
          />
          <div className="absolute inset-0 bg-[#3E2723]/40" />
          {/* Time-based color temperature overlay */}
          <div className={`absolute inset-0 ${timeOverlays[timeOfDay]} transition-all duration-1000`} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col h-full px-4 text-center">
          {/* Welcome Text - Centered on mobile */}
          <div className="flex-1 flex items-center justify-center md:justify-center pt-56 md:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ opacity: heroOpacity }}
            >
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-sm sm:text-base text-[#D7CCC8] font-medium mb-3 md:mb-4 tracking-wide uppercase"
              >
                Experience Ghana's Finest
              </motion.p>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight drop-shadow-lg">
                Welcome to <span className="text-[#D7CCC8]">Esbak</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md mb-4">
                Authentic flavors, unforgettable moments.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-wrap items-center justify-center gap-3 text-white/80 text-sm md:text-base"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#D7CCC8] rounded-full animate-pulse"></span>
                  Open Now
                </span>
                <span className="hidden sm:inline">•</span>
                <span>11:00 AM - 10:00 PM</span>
                <span className="hidden sm:inline">•</span>
                <span>Dine-in • Takeout • Delivery</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Action Cards - Mobile Only (outside hero container) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="md:hidden w-full max-w-2xl pb-6 mx-auto -mb-32"
          >
            <div className="grid grid-cols-2 gap-3">
              <ActionCard
                title="Order Now"
                subtitle="Start your order"
                icon={<ShoppingBag size={24} />}
                image="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=75&auto=format&fit=crop"
                onClick={() => onNavigate('MENU')}
                delay={0.1}
                animationDirection="left"
              />
              <ActionCard
                title="View Menu"
                subtitle="Browse our dishes"
                icon={<UtensilsCrossed size={24} />}
                image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=75&auto=format&fit=crop"
                onClick={() => onNavigate('MENU')}
                delay={0.2}
                animationDirection="right"
              />
              <ActionCard
                title="Make Reservation"
                subtitle="Book a table"
                icon={<CalendarCheck size={24} />}
                onClick={() => onNavigate('RESERVATION')}
                delay={0.3}
                animationDirection="left"
              />
              <ActionCard
                title="Help & Info"
                subtitle="Get assistance"
                icon={<Clock size={24} />}
                onClick={() => onNavigate('HELP')}
                delay={0.4}
                animationDirection="right"
              />
            </div>
          </motion.div>
            
          {/* Scroll Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-3 bg-white/80 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Action Cards Grid - Desktop Only (overlapping) */}
      <div className="hidden md:block relative z-20 -mt-40 px-4 py-20 bg-gradient-to-b from-transparent via-[#FDFBF7]/80 to-[#FDFBF7]">
        <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto w-full relative z-10">
          <ActionCard
            title="Order Now"
            subtitle="Start your order"
            icon={<ShoppingBag size={28} />}
            image="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=75&auto=format&fit=crop"
            onClick={() => onNavigate('MENU')}
            delay={0.1}
            animationDirection="left"
          />
          <ActionCard
            title="View Menu"
            subtitle="Browse our dishes"
            icon={<UtensilsCrossed size={28} />}
            image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=75&auto=format&fit=crop"
            onClick={() => onNavigate('MENU')}
            delay={0.2}
            animationDirection="right"
          />
          <ActionCard
            title="Make Reservation"
            subtitle="Book a table"
            icon={<CalendarCheck size={28} />}
            onClick={() => onNavigate('RESERVATION')}
            delay={0.3}
            animationDirection="left"
          />
          <ActionCard
            title="Help & Info"
            subtitle="Get assistance"
            icon={<Clock size={28} />}
            onClick={() => onNavigate('HELP')}
            delay={0.4}
            animationDirection="right"
          />
        </div>
      </div>

      {/* Additional Content Section */}
      <div className="relative z-20 px-4 py-12 md:py-20 bg-[#FDFBF7] mt-32 md:mt-0">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3E2723] mb-6 md:mb-8">
              Experience Authentic
              <span className="block text-[#8D6E63]">Ghanaian Cuisine</span>
            </h2>
            <p className="text-base md:text-lg text-[#5D4037]/80 max-w-2xl mx-auto leading-relaxed px-4">
              From traditional jollof rice to spicy kelewele, every dish tells a story of rich heritage and bold flavors that will transport you to the heart of Ghana.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};