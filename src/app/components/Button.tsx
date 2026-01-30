import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RippleEffect } from './RippleEffect';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#8D6E63] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-[#5D4037] text-white hover:bg-[#4E342E] shadow-lg shadow-[#5D4037]/20",
      secondary: "bg-[#D7CCC8] text-[#3E2723] hover:bg-[#BCAAA4]",
      outline: "border-2 border-[#5D4037] text-[#5D4037] hover:bg-[#5D4037]/5",
      ghost: "hover:bg-[#5D4037]/10 text-[#5D4037]",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
    };

    return (
      <RippleEffect 
        color="rgba(255, 255, 255, 0.6)"
        className={cn("rounded-xl", fullWidth ? "w-full" : "inline-block")}
      >
        <motion.button
          ref={ref}
          whileTap={{ scale: 0.96 }}
          className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            fullWidth ? "w-full" : "",
            className
          )}
          {...props}
        >
          {children}
        </motion.button>
      </RippleEffect>
    );
  }
);

Button.displayName = "Button";
