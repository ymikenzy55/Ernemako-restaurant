import React from 'react';
import { ScreenType } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface InfoScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const HelpScreen = ({ onNavigate }: InfoScreenProps) => (
  <div className="max-w-3xl mx-auto pt-24">
    <div className="flex items-center gap-4 mb-8">
      <Button variant="ghost" size="sm" onClick={() => onNavigate('HOME')}>
        <ArrowLeft size={20} className="mr-2" /> Back
      </Button>
      <h2 className="text-3xl font-bold text-[#3E2723]">Help & Support</h2>
    </div>

    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-[#D7CCC8]/30">
        <h3 className="text-xl font-bold text-[#5D4037] mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <details className="group">
            <summary className="font-medium text-[#3E2723] cursor-pointer list-none flex justify-between items-center">
              <span>How do I modify my reservation?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-[#5D4037]/80 mt-2 text-sm leading-relaxed">
              You can modify your reservation by logging into your account and visiting the "Reservations" section in your dashboard. Alternatively, call us directly.
            </p>
          </details>
          <div className="h-px bg-[#D7CCC8]/30" />
          <details className="group">
            <summary className="font-medium text-[#3E2723] cursor-pointer list-none flex justify-between items-center">
              <span>Do you offer gluten-free options?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-[#5D4037]/80 mt-2 text-sm leading-relaxed">
              Yes! We have a variety of gluten-free dishes. Look for the "Gluten-Free" badge on our menu items.
            </p>
          </details>
           <div className="h-px bg-[#D7CCC8]/30" />
          <details className="group">
            <summary className="font-medium text-[#3E2723] cursor-pointer list-none flex justify-between items-center">
              <span>Is there parking available?</span>
              <span className="transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-[#5D4037]/80 mt-2 text-sm leading-relaxed">
              Yes, we have a dedicated parking lot for our customers located right behind the restaurant building.
            </p>
          </details>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#8D6E63] text-white p-8 rounded-2xl shadow-md text-center">
        <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
        <p className="mb-6 text-white/90">Our team is available 24/7 to assist you.</p>
        <Button onClick={() => onNavigate('CONTACT')} className="bg-white text-[#8D6E63] hover:bg-[#FDFBF7]">
          Contact Support
        </Button>
      </motion.div>
    </div>
  </div>
);

export const ContactScreen = ({ onNavigate }: InfoScreenProps) => (
  <div className="max-w-4xl mx-auto pt-24">
    <div className="flex items-center gap-4 mb-8">
      <Button variant="ghost" size="sm" onClick={() => onNavigate('HOME')}>
        <ArrowLeft size={20} className="mr-2" /> Back
      </Button>
      <h2 className="text-3xl font-bold text-[#3E2723]">Contact Us</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-2xl shadow-lg border border-[#D7CCC8]/30 h-fit">
        <h3 className="text-xl font-bold text-[#5D4037] mb-6">Send us a message</h3>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
          <div>
            <label className="block text-sm font-medium text-[#5D4037] mb-1">Name</label>
            <input className="w-full px-4 py-2 rounded-lg bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5D4037] mb-1">Email</label>
            <input type="email" className="w-full px-4 py-2 rounded-lg bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5D4037] mb-1">Message</label>
            <textarea rows={4} className="w-full px-4 py-2 rounded-lg bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] outline-none" required />
          </div>
          <Button type="submit" fullWidth>Send Message</Button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#D7CCC8]/30 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#8D6E63]/10 flex items-center justify-center text-[#8D6E63] shrink-0">
            <MapPin size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#3E2723]">Visit Us</h4>
            <p className="text-[#5D4037] text-sm mt-1">Ernemako Restaurant<br/>Sunyani, Bono Region<br/>Ghana</p>
            <a href="https://www.google.com/maps/search/Sunyani" target="_blank" rel="noopener noreferrer" className="text-[#8D6E63] text-xs font-bold uppercase mt-2 inline-block hover:underline">Get Directions</a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#D7CCC8]/30 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#8D6E63]/10 flex items-center justify-center text-[#8D6E63] shrink-0">
            <Phone size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#3E2723]">Call Us</h4>
            <p className="text-[#5D4037] text-sm mt-1">For reservations and support</p>
            <a href="tel:+233244567890" className="text-lg font-bold text-[#8D6E63] block mt-1 hover:underline">+233 24 456 7890</a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#D7CCC8]/30 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#8D6E63]/10 flex items-center justify-center text-[#8D6E63] shrink-0">
            <Mail size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#3E2723]">Email Us</h4>
            <p className="text-[#5D4037] text-sm mt-1">General inquiries</p>
            <a href="mailto:hello@ernemakorestaurant.com" className="text-[#8D6E63] font-medium block mt-1 hover:underline">hello@ernemakorestaurant.com</a>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

export const AboutScreen = ({ onNavigate }: InfoScreenProps) => (
  <div className="max-w-4xl mx-auto pt-24">
    <div className="flex items-center gap-4 mb-8">
      <Button variant="ghost" size="sm" onClick={() => onNavigate('HOME')}>
        <ArrowLeft size={20} className="mr-2" /> Back
      </Button>
      <h2 className="text-3xl font-bold text-[#3E2723]">About Us</h2>
    </div>

    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
        <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070" alt="Restaurant Interior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">Our Story</h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-2xl font-bold text-[#3E2723] mb-4">Authentic Ghanaian Hospitality</h3>
          <p className="text-[#5D4037]/90 leading-relaxed mb-4">
            Founded in the heart of Sunyani, Ernemako Restaurant began with a simple mission: to serve authentic, soul-warming Ghanaian dishes in a modern, welcoming environment.
          </p>
          <p className="text-[#5D4037]/90 leading-relaxed">
            We believe that great food brings people together. That's why we source our ingredients locally from farmers in the Bono Region, ensuring every bite bursts with freshness and flavor.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c" className="rounded-xl shadow-md rotate-2 hover:rotate-0 transition-transform duration-500" alt="Food 1" />
            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1" className="rounded-xl shadow-md -rotate-2 hover:rotate-0 transition-transform duration-500 mt-8" alt="Food 2" />
        </motion.div>
      </div>
    </div>
  </div>
);
