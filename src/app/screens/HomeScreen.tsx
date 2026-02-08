import React, { useEffect, useState } from 'react';
import { ActionCard } from '../components/Card';
import { CalendarCheck, Clock, UtensilsCrossed, ShoppingBag, Plus, Instagram, Phone, X, MapPin, Mail } from 'lucide-react';
import { ScreenType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/Button';
import { ContactForm } from '../components/ContactForm';
import { heroBannerApi, type HeroBanner } from '../../lib/adminApi';

interface HomeScreenProps {
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

// Get next opening time message
const getOpeningMessage = () => {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  
  if (day === 0) {
    return 'Closed Sundays • Opens Mon 8:00 AM';
  }
  
  if (hours < 8) {
    return 'Opens Today at 8:00 AM';
  }
  
  if (hours >= 22) {
    return day === 6 ? 'Closed • Opens Mon 8:00 AM' : 'Opens Tomorrow at 8:00 AM';
  }
  
  return 'Mon-Sat • 8:00 AM - 10:00 PM';
};

export const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(isRestaurantOpen());
  const [openingMessage, setOpeningMessage] = useState(getOpeningMessage());
  const [heroBanner, setHeroBanner] = useState<HeroBanner | null>(null);
  
  // Load hero banner from database
  useEffect(() => {
    const loadHeroBanner = async () => {
      try {
        const banner = await heroBannerApi.get();
        console.log('Loaded hero banner:', banner);
        
        if (banner && banner.image_url) {
          setHeroBanner(banner);
          // Preload custom hero image with cache busting
          const img = new Image();
          img.src = `${banner.image_url}?t=${Date.now()}`;
          img.onload = () => setHeroImageLoaded(true);
          img.onerror = () => {
            console.error('Failed to load custom hero image, using default');
            setHeroBanner(null);
            const defaultImg = new Image();
            defaultImg.src = 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=60&auto=format&fit=crop';
            defaultImg.onload = () => setHeroImageLoaded(true);
          };
        } else {
          console.log('No custom banner, using default');
          // Fallback to default image
          const img = new Image();
          img.src = 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=60&auto=format&fit=crop';
          img.onload = () => setHeroImageLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load hero banner:', error);
        // Fallback to default image
        const img = new Image();
        img.src = 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=60&auto=format&fit=crop';
        img.onload = () => setHeroImageLoaded(true);
      }
    };
    
    loadHeroBanner();
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
    const timeInterval = setInterval(() => {
      updateTimeOfDay();
      setIsOpen(isRestaurantOpen());
      setOpeningMessage(getOpeningMessage());
    }, 60000); // Update every minute

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
      <div className="relative w-full min-h-screen h-screen overflow-visible md:overflow-hidden">
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
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="w-full h-full"
          >
            <ImageWithFallback 
              src={heroBanner?.image_url || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=60&auto=format&fit=crop'}
              alt="Ernemako Restaurant Atmosphere"
              className={`w-full h-full object-cover transition-opacity duration-500 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ 
                willChange: 'opacity',
                objectPosition: 'center 60%'
              }}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#3E2723]/50 via-[#3E2723]/30 to-[#3E2723]/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col h-full px-4 text-center">
          {/* Welcome Text - Centered */}
          <div className="flex-1 flex items-center justify-center pt-32 md:pt-32 pb-32 md:pb-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ opacity: heroOpacity }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
                <span className="text-sm font-medium text-white">{openingMessage}</span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="block"
                >
                  {heroBanner?.title || 'Welcome to'}
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="block text-[#D7CCC8] mt-2"
                  style={{
                    textShadow: '0 0 40px rgba(215, 204, 200, 0.3)'
                  }}
                >
                  {!heroBanner?.title && 'Ernemako Restaurant'}
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                {heroBanner?.subtitle || 'Authentic Ghanaian cuisine crafted with tradition and passion'}
              </motion.p>
            </motion.div>
          </div>
            
          {/* Scroll Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
          >
            <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center p-2"
            >
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-2 bg-white/80 rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Action Cards - Mobile Only (OUTSIDE hero container) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="md:hidden w-full max-w-2xl px-4 py-6 mx-auto relative z-30 -mt-32"
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
            title="Help & Info"
            subtitle="Get assistance"
            icon={<Clock size={24} />}
            onClick={() => onNavigate('HELP')}
            delay={0.3}
            animationDirection="left"
          />
        </div>
      </motion.div>

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
            title="Help & Info"
            subtitle="Get assistance"
            icon={<Clock size={28} />}
            onClick={() => onNavigate('HELP')}
            delay={0.3}
            animationDirection="left"
          />
        </div>
      </div>

      {/* Additional Content Section */}
      <div className="relative z-20 px-4 py-12 md:py-20 bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative inline-block mb-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3E2723] mb-2">
                Experience Authentic
                <span className="block text-[#8D6E63]">Ghanaian Cuisine</span>
              </h2>
              <div className="h-1 w-32 bg-[#8D6E63] rounded-full"></div>
            </div>
            <p className="text-base md:text-lg text-[#5D4037]/80 max-w-2xl leading-relaxed">
              From traditional jollof rice to spicy kelewele, every dish tells a story of rich heritage and bold flavors that will transport you to the heart of Ghana.
            </p>
          </motion.div>
        </div>
      </div>

      {/* About Section - Moved up for better flow */}
      <div data-section="about">
        <AboutSection />
      </div>

      {/* Featured Menu Section */}
      <div data-section="menu">
        <FeaturedMenuSection onNavigate={onNavigate} />
      </div>

      {/* Instagram Gallery Section */}
      <div data-section="gallery">
        <InstagramGallerySection />
      </div>

      {/* Contact Section */}
      <div data-section="contact">
        <ContactSection />
      </div>
    </div>
  );
};

// About Section Component
const AboutSection = () => {
  const [aboutContent, setAboutContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../../lib/adminApi').then(({ aboutApi }) => {
      aboutApi.get()
        .then(content => {
          setAboutContent(content);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to load about content:', error);
          setLoading(false);
        });
    });
  }, []);

  if (loading) {
    return (
      <div className="relative z-20 px-4 py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8D6E63]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-20 px-4 py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3E2723] mb-2">
              About Us
            </h2>
            <div className="h-1 w-24 bg-[#8D6E63] rounded-full mb-4"></div>
          </div>
          <p className="text-base md:text-lg text-[#5D4037]/70 max-w-2xl">
            Our story of authentic Ghanaian hospitality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center section-border p-8 md:p-12 bg-gradient-to-br from-[#FDFBF7] to-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-[#3E2723] mb-4">Authentic Ghanaian Hospitality</h3>
            {aboutContent?.content ? (
              <div className="text-[#5D4037]/90 leading-relaxed mb-4 whitespace-pre-line">
                {aboutContent.content}
              </div>
            ) : (
              <>
                <p className="text-[#5D4037]/90 leading-relaxed mb-4">
                  Founded in the heart of Sunyani, Ernemako Restaurant began with a simple mission: to serve authentic, soul-warming Ghanaian dishes in a modern, welcoming environment.
                </p>
                <p className="text-[#5D4037]/90 leading-relaxed mb-4">
                  We believe that great food brings people together. That's why we source our ingredients locally from farmers in the Bono Region, ensuring every bite bursts with freshness and flavor.
                </p>
              </>
            )}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-white rounded-xl border-2 border-[#8D6E63]/20 shadow-sm">
                <div className="text-3xl font-bold text-[#8D6E63]">{aboutContent?.years_experience || 10}+</div>
                <div className="text-sm text-[#5D4037]/70">Years Experience</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border-2 border-[#8D6E63]/20 shadow-sm">
                <div className="text-3xl font-bold text-[#8D6E63]">{aboutContent?.menu_items_count || 50}+</div>
                <div className="text-sm text-[#5D4037]/70">Menu Items</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <motion.img
              whileHover={{ scale: 1.05, rotate: 0 }}
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=75&auto=format&fit=crop"
              className="rounded-xl shadow-md rotate-2 transition-transform duration-500 w-full h-64 object-cover border-4 border-white"
              alt="Food preparation"
            />
            <motion.img
              whileHover={{ scale: 1.05, rotate: 0 }}
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=75&auto=format&fit=crop"
              className="rounded-xl shadow-md -rotate-2 transition-transform duration-500 mt-8 w-full h-64 object-cover border-4 border-white"
              alt="Delicious dish"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Contact Section Component
const ContactSection = () => {
  return (
    <div className="relative z-20 px-4 py-16 md:py-24 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3E2723] mb-2">
              Get In Touch
            </h2>
            <div className="h-1 w-24 bg-[#8D6E63] rounded-full mb-4"></div>
          </div>
          <p className="text-base md:text-lg text-[#5D4037]/70 max-w-2xl">
            We'd love to hear from you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <ContactForm />
          </motion.div>

          {/* Contact Info Cards */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-md border-2 border-[#8D6E63]/20 hover:shadow-xl hover:border-[#8D6E63]/40 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#8D6E63]/10 flex items-center justify-center text-[#8D6E63] mb-4 border-2 border-[#8D6E63]/20">
                <MapPin size={24} />
              </div>
              <h4 className="font-bold text-[#3E2723] mb-2">Visit Us</h4>
              <p className="text-[#5D4037] text-sm mb-3">
                Ernemako Restaurant<br />
                Opposite Fiapre Park<br />
                Sunyani, Bono Region<br />
                Ghana
              </p>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=7.34,-2.33&destination_place_id=ChIJYTN9FjhS2w8RQS4Hk0kJl-Q"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8D6E63] text-xs font-bold uppercase hover:underline inline-flex items-center gap-1"
                title="Get directions to Ernemako Restaurant"
              >
                Get Directions →
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-md border-2 border-[#8D6E63]/20 hover:shadow-xl hover:border-[#8D6E63]/40 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#8D6E63]/10 flex items-center justify-center text-[#8D6E63] mb-4 border-2 border-[#8D6E63]/20">
                <Phone size={24} />
              </div>
              <h4 className="font-bold text-[#3E2723] mb-2">Call Us</h4>
              <p className="text-[#5D4037] text-sm mb-3">For reservations and support</p>
              <a
                href="tel:+233244567890"
                className="text-lg font-bold text-[#8D6E63] hover:underline"
              >
                +233 24 456 7890
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-md border-2 border-[#8D6E63]/20 hover:shadow-xl hover:border-[#8D6E63]/40 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#8D6E63]/10 flex items-center justify-center text-[#8D6E63] mb-4 border-2 border-[#8D6E63]/20">
                <Mail size={24} />
              </div>
              <h4 className="font-bold text-[#3E2723] mb-2">Email Us</h4>
              <p className="text-[#5D4037] text-sm mb-3">General inquiries</p>
              <a
                href="mailto:hello@ernemakorestaurant.com"
                className="text-[#8D6E63] font-medium hover:underline break-all"
              >
                hello@ernemakorestaurant.com
              </a>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-2xl shadow-md border-2 border-[#8D6E63]/20 hover:shadow-xl hover:border-[#8D6E63]/40 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#8D6E63]/10 flex items-center justify-center text-[#8D6E63] mb-4 border-2 border-[#8D6E63]/20">
              <MapPin size={24} />
            </div>
            <h4 className="font-bold text-[#3E2723] mb-2">Visit Us</h4>
            <p className="text-[#5D4037] text-sm mb-3">
              Ernemako Restaurant<br />
              Opposite Fiapre Park<br />
              Sunyani, Bono Region<br />
              Ghana
            </p>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=7.34,-2.33&destination_place_id=ChIJYTN9FjhS2w8RQS4Hk0kJl-Q"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8D6E63] text-xs font-bold uppercase hover:underline inline-flex items-center gap-1"
              title="Get directions to Ernemako Restaurant"
            >
              Get Directions →
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-2xl shadow-md border-2 border-[#8D6E63]/20 hover:shadow-xl hover:border-[#8D6E63]/40 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#8D6E63]/10 flex items-center justify-center text-[#8D6E63] mb-4 border-2 border-[#8D6E63]/20">
              <Phone size={24} />
            </div>
            <h4 className="font-bold text-[#3E2723] mb-2">Call Us</h4>
            <p className="text-[#5D4037] text-sm mb-3">For reservations and support</p>
            <a
              href="tel:+233244567890"
              className="text-lg font-bold text-[#8D6E63] hover:underline"
            >
              +233 24 456 7890
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-2xl shadow-md border-2 border-[#8D6E63]/20 hover:shadow-xl hover:border-[#8D6E63]/40 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#8D6E63]/10 flex items-center justify-center text-[#8D6E63] mb-4 border-2 border-[#8D6E63]/20">
              <Mail size={24} />
            </div>
            <h4 className="font-bold text-[#3E2723] mb-2">Email Us</h4>
            <p className="text-[#5D4037] text-sm mb-3">General inquiries</p>
            <a
              href="mailto:hello@ernemakorestaurant.com"
              className="text-[#8D6E63] font-medium hover:underline break-all"
            >
              hello@ernemakorestaurant.com
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-br from-[#8D6E63] to-[#5D4037] p-8 md:p-12 rounded-2xl text-white text-center border-4 border-[#5D4037]/30 shadow-xl"
        >
          <Clock size={48} className="mx-auto mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Opening Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div>
              <p className="font-bold mb-1">Monday - Saturday</p>
              <p className="text-white/90">8:00 AM - 10:00 PM</p>
            </div>
            <div>
              <p className="font-bold mb-1">Sunday</p>
              <p className="text-white/90">Closed</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Featured Menu Component
const FeaturedMenuSection = ({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) => {
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [showCallModal, setShowCallModal] = useState(false);
  const [featuredDishes, setFeaturedDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Import menuApi dynamically to avoid circular dependencies
    import('../../lib/adminApi').then(({ menuApi }) => {
      menuApi.getAll()
        .then(items => {
          // Filter for featured and active items
          const featured = items.filter(item => item.featured && item.status === 'active').slice(0, 4);
          setFeaturedDishes(featured);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to load featured items:', error);
          setLoading(false);
        });
    });
  }, []);

  if (loading) {
    return (
      <div className="relative z-20 px-4 py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8D6E63]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (featuredDishes.length === 0) {
    return null; // Don't show section if no featured items
  }

  return (
    <>
    <div className="relative z-20 px-4 py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3E2723] mb-2">
              Featured Dishes
            </h2>
            <div className="h-1 w-24 bg-[#8D6E63] rounded-full mb-4"></div>
          </div>
          <p className="text-base md:text-lg text-[#5D4037]/70 max-w-2xl">
            Discover our most loved traditional Ghanaian specialties
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border-2 border-[#8D6E63]/20 hover:shadow-2xl hover:border-[#8D6E63]/40 transition-all duration-300">
                {/* Image with Loading Skeleton */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                  {!loadingStates[dish.id] && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                  )}
                  <ImageWithFallback
                    src={dish.image_url}
                    alt={dish.name}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${loadingStates[dish.id] ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setLoadingStates(prev => ({ ...prev, [dish.id]: true }))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Featured Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    ⭐ Featured
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#3E2723] mb-1 group-hover:text-[#8D6E63] transition-colors">
                    {dish.name}
                  </h3>
                  <p className="text-sm text-[#5D4037]/70 mb-3 line-clamp-2">
                    {dish.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#8D6E63]">
                      GH₵{dish.price.toFixed(2)}
                    </span>
                    <motion.button
                      onClick={() => setShowCallModal(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 rounded-full bg-[#8D6E63] text-white text-xs font-medium flex items-center gap-1 hover:bg-[#795548] transition-colors"
                    >
                      <Phone size={14} />
                      <span>Call to Order</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Button
            size="lg"
            onClick={() => onNavigate('MENU')}
            className="group"
          >
            View Full Menu
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </div>

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
    </>
  );
};

// Instagram Gallery Component
const InstagramGallerySection = () => {
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load gallery images from database
    import('../../lib/adminApi').then(({ galleryApi }) => {
      galleryApi.getAll()
        .then(images => {
          setGalleryImages(images);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to load gallery:', error);
          setLoading(false);
        });
    });
  }, []);

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setSelectedImage(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  if (loading) {
    return (
      <div className="relative z-20 py-16 md:py-24 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8D6E63]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (galleryImages.length === 0) {
    return null; // Don't show section if no images
  }

  return (
    <>
    <div className="relative z-20 py-16 md:py-24 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3E2723] mb-2">
              Gallery
            </h2>
            <div className="h-1 w-24 bg-[#8D6E63] rounded-full mb-4"></div>
          </div>
          <p className="text-base md:text-lg text-[#5D4037]/70 max-w-2xl mb-6">
            A visual journey through Ernemako Restaurant
          </p>
          <a
            href="https://instagram.com/ernemakorestaurant"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#8D6E63] hover:text-[#795548] font-medium transition-colors"
          >
            <Instagram size={20} />
            <span>Follow us @ernemakorestaurant</span>
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group border-2 border-[#8D6E63]/20 hover:border-[#8D6E63]/50 transition-all shadow-md hover:shadow-xl"
              onClick={() => setSelectedImage(index)}
            >
              {/* Loading Skeleton */}
              {!loadingStates[image.id] && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" />
              )}
              
              <ImageWithFallback
                src={image.image_url}
                alt={image.title}
                className={`w-full h-full object-cover transition-all duration-500 ${loadingStates[image.id] ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setLoadingStates(prev => ({ ...prev, [image.id]: true }))}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/80 via-[#3E2723]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">View</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    {/* Lightbox Modal */}
    {selectedImage !== null && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setSelectedImage(null)}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors flex items-center justify-center z-10"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium">
          {selectedImage + 1} / {galleryImages.length}
        </div>

        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors flex items-center justify-center"
          aria-label="Previous"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors flex items-center justify-center"
          aria-label="Next"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Main Image */}
        <motion.div
          key={selectedImage}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-5xl max-h-[85vh] w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={galleryImages[selectedImage]?.image_url}
            alt={galleryImages[selectedImage]?.title || `Gallery image ${selectedImage + 1}`}
            className="w-full h-full object-contain rounded-lg"
          />
        </motion.div>

        {/* Keyboard Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
            <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd>
            Close
          </span>
        </div>
      </motion.div>
    )}
    </>
  );
};