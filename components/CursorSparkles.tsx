import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  color: string;
}

const CursorSparkles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const isMoving = useRef(false);
  const lastTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#d4af37', '#ffffff', '#fceabb', '#ffeb3b']; // Gold/White shades

    const createParticle = (x: number, y: number) => {
      const size = Math.random() * 3;
      const speedX = Math.random() * 2 - 1;
      const speedY = Math.random() * 2 - 1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.current.push({ x, y, size, speedX, speedY, life: 1, color });
    };

    const animate = (timeStamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add particles if mouse is moving
      if (isMoving.current) {
        for(let i=0; i<3; i++) { // Add a few per frame
            createParticle(mouse.current.x, mouse.current.y);
        }
        isMoving.current = false; // Reset until next move event
      }

      // Update and draw particles
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.life -= 0.02; // Fade out speed
        p.size -= 0.05;

        if (p.life <= 0 || p.size <= 0) {
          particles.current.splice(i, 1);
          i--;
          continue;
        }

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size > 0 ? p.size : 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      isMoving.current = true;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-50" />;
};

export default CursorSparkles;