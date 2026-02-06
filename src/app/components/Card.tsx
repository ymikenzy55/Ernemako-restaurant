import React, { useState } from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { RippleEffect } from './RippleEffect';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ActionCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  image?: string;
  onClick?: () => void;
  className?: string;
  delay?: number;
  animationDirection?: 'left' | 'right';
}

export const ActionCard = ({ 
  title, 
  subtitle, 
  icon, 
  image, 
  onClick, 
  className, 
  delay = 0,
  animationDirection = 'left'
}: ActionCardProps) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const slideDistance = 100;
  const initialX = animationDirection === 'left' ? -slideDistance : slideDistance;

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    onClick?.();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: initialX }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: initialX }}
      transition={{ 
        delay: isVisible ? delay : 0, 
        duration: 0.6,
        ease: "easeOut"
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "h-full",
        className
      )}
    >
      <RippleEffect 
        color={image ? "rgba(255, 255, 255, 0.6)" : "rgba(141, 110, 99, 0.6)"}
        className="h-full rounded-xl sm:rounded-2xl"
      >
        <div
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onClick?.();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={title}
          className={cn(
            "relative overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-lg cursor-pointer group border-2 transition-all duration-300",
            image 
              ? "min-h-[180px] sm:min-h-[200px] border-white/30 hover:border-white/60 hover:shadow-2xl" 
              : "min-h-[140px] sm:min-h-[160px] border-[#8D6E63]/30 hover:border-[#8D6E63]/60 hover:shadow-xl"
          )}
          style={image ? {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(10px)',
          } : {}}
        >
          {image && (
            <div className="absolute inset-0 z-0">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
              )}
              <ImageWithFallback 
                src={image} 
                alt={title} 
                className={cn(
                  "w-full h-full object-cover transition-all duration-700 group-hover:scale-110",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
          )}
          
          <div className={cn("relative z-10 flex flex-col h-full p-4 sm:p-6 pointer-events-none", image ? "justify-end text-white" : "justify-between text-[#3E2723]")}>
            {icon && (
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110",
                image ? "bg-white/20 backdrop-blur-md text-white" : "bg-[#8D6E63] text-white shadow-lg"
              )}>
                {icon}
              </div>
            )}
            
            <div>
              <h3 className={cn("text-base sm:text-xl font-bold mb-1", image ? "text-white" : "text-[#3E2723]")}>{title}</h3>
              {subtitle && <p className={cn("text-xs sm:text-sm mb-2", image ? "text-white/80" : "text-[#5D4037]")}>{subtitle}</p>}
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold transition-transform group-hover:translate-x-1",
                image ? "text-white/90" : "text-[#8D6E63]"
              )}>
                <span>Click here</span>
                <svg 
                  className="w-3 h-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </RippleEffect>
    </motion.div>
  );
};
