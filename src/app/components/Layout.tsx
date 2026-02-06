import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { motion } from 'motion/react';
import { ScreenType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (screen: ScreenType) => void;
}

export const Layout = ({ children, onNavigate }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#3E2723] flex flex-col relative">
      {/* Decorative Border Frame */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <div className="absolute inset-0 border-4 border-[#8D6E63]/15 m-2 rounded-lg"></div>
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-[#8D6E63]/30"></div>
        <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-[#8D6E63]/30"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-[#8D6E63]/30"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-[#8D6E63]/30"></div>
      </div>
      
      {/* Gradient overlay for navbar visibility on light backgrounds */}
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 via-black/10 to-transparent pointer-events-none z-40" />
      
      <Navbar onNavigate={onNavigate} />
      {/* Removed max-w constraints and padding from main to allow full width hero */}
      <main className="flex-grow w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
