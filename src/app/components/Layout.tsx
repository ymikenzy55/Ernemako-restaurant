import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { motion } from 'motion/react';
import { ScreenType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (screen: ScreenType) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Layout = ({ children, onNavigate, isLoggedIn = true, onLogout }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#3E2723] flex flex-col relative">
      {/* Gradient overlay for navbar visibility on light backgrounds */}
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 via-black/10 to-transparent pointer-events-none z-40" />
      
      <Navbar onNavigate={onNavigate} isLoggedIn={isLoggedIn} onLogout={onLogout} />
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
