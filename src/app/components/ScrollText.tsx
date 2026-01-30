import React from 'react';
import { motion } from 'motion/react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ScrollTextProps {
  children: string;
  className?: string;
  delay?: number;
}

export const ScrollText = ({ children, className = '', delay = 0 }: ScrollTextProps) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  
  const words = children.split(' ');

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={isVisible ? { 
            opacity: 1, 
            y: 0, 
            rotateX: 0 
          } : { 
            opacity: 0, 
            y: 20, 
            rotateX: -90 
          }}
          transition={{
            delay: isVisible ? delay + (index * 0.1) : 0,
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};