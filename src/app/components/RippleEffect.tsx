import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Ripple {
  x: number;
  y: number;
  id: number;
  size: number;
}

interface RippleEffectProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({ 
  children, 
  className = '', 
  color = 'rgba(141, 110, 99, 0.4)'
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const createRipple = (clientX: number, clientY: number, currentTarget: HTMLElement) => {
    const rippleContainer = currentTarget.getBoundingClientRect();
    const size = Math.max(rippleContainer.width, rippleContainer.height) * 2;
    const x = clientX - rippleContainer.left;
    const y = clientY - rippleContainer.top;
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now() + Math.random(), // Ensure unique ID
    };

    setRipples((prevRipples) => [...prevRipples, newRipple]);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    createRipple(event.clientX, event.clientY, event.currentTarget);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      createRipple(touch.clientX, touch.clientY, event.currentTarget);
    }
  };

  useEffect(() => {
    if (ripples.length > 0) {
      const timeout = setTimeout(() => {
        setRipples((prevRipples) => prevRipples.slice(1));
      }, 2000); // Increased from 1000ms to 2000ms
      return () => clearTimeout(timeout);
    }
  }, [ripples]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <React.Fragment key={ripple.id}>
            {/* Main ripple */}
            <motion.span
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: ripple.x - ripple.size / 2,
                top: ripple.y - ripple.size / 2,
                width: ripple.size,
                height: ripple.size,
                borderRadius: '50%',
                border: `3px solid ${color}`,
                pointerEvents: 'none',
                zIndex: 100,
              }}
            />
            {/* Second wave */}
            <motion.span
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeOut', delay: 0.15 }}
              style={{
                position: 'absolute',
                left: ripple.x - ripple.size / 2,
                top: ripple.y - ripple.size / 2,
                width: ripple.size,
                height: ripple.size,
                borderRadius: '50%',
                border: `2px solid ${color}`,
                pointerEvents: 'none',
                zIndex: 99,
              }}
            />
            {/* Third wave */}
            <motion.span
              initial={{ scale: 0, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
              style={{
                position: 'absolute',
                left: ripple.x - ripple.size / 2,
                top: ripple.y - ripple.size / 2,
                width: ripple.size,
                height: ripple.size,
                borderRadius: '50%',
                border: `1px solid ${color}`,
                pointerEvents: 'none',
                zIndex: 98,
              }}
            />
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
};



