import React, { useEffect, useRef } from 'react';

export const CursorRipple: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripples = useRef<Array<{
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    speed: number;
    opacity: number;
  }>>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Add ripple on click
    const handleClick = (e: MouseEvent) => {
      ripples.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 150,
        speed: 3,
        opacity: 0.6,
      });
    };

    // Add ripple on mouse move (throttled)
    let lastMove = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMove > 100) { // Throttle to every 100ms
        ripples.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 0,
          maxRadius: 80,
          speed: 2,
          opacity: 0.3,
        });
        lastMove = now;
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw ripples
      ripples.current = ripples.current.filter((ripple) => {
        ripple.radius += ripple.speed;
        ripple.opacity -= 0.01;

        if (ripple.opacity <= 0 || ripple.radius >= ripple.maxRadius) {
          return false;
        }

        // Draw multiple concentric circles for water effect
        for (let i = 0; i < 3; i++) {
          const offset = i * 15;
          const currentRadius = ripple.radius - offset;
          
          if (currentRadius > 0) {
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, currentRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(141, 110, 99, ${ripple.opacity * (1 - i * 0.3)})`;
            ctx.lineWidth = 2 - i * 0.5;
            ctx.stroke();
          }
        }

        return true;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();
    document.addEventListener('click', handleClick);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};

