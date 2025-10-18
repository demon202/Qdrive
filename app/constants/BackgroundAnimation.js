'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function GlowingSpheres() {
  const canvasRef = useRef(null);
  const spheresRef = useRef([]);
  const animationRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if device is desktop
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    
    // Set canvas to viewport size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeSpheres();
    };

    // Helper functions
    const random = (min, max) => Math.random() * (max - min) + min;
    
    const map = (value, start1, stop1, start2, stop2) => {
      return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    };

    // Initialize spheres based on canvas size
    const initializeSpheres = () => {
      const width = canvas.width;
      const height = canvas.height;

      spheresRef.current = [
        {
          x: width * 0.75,
          y: height * 0.55,
          r: 220,
          mass: 220 * 220, // mass proportional to area
          gradient: {
          type: 'radial',
          colorStart: { r: 0x86, g: 0x06, b: 0x06 }, // 860606
          colorEnd: { r: 0x36, g: 0x1F, b: 0x20 },   // 361F20
        },
          vx: random(-0.3, 0.3),
          vy: random(-0.3, 0.3),
        },
        {
          x: width * 0.65,
          y: height * 0.65,
          r: 120,
          mass: 200 * 200,
           gradient: {
          type: 'radial',
          colorStart: { r: 0x2C, g: 0x21, b: 0x22 },   // 2C2122
          colorEnd: { r: 0x16, g: 0x16, b: 0x16 }, // 161616
        },
          vx: random(-0.25, 0.25),
          vy: random(-0.25, 0.25),
        },
        {
          x: width * 0.7,
          y: height * 0.3,
          r: 80,
          mass: 100 * 100,
          gradient: {
          type: 'radial',
          colorStart: { r: 0x5B, g: 0x1F, b: 0x21 },// #5B1F21
          colorEnd: { r: 0x3A, g: 0x1D, b: 0x1E }, // #3A1D1E
        },
          vx: random(-0.3, 0.3),
          vy: random(-0.3, 0.3),
        },
      ];
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const drawGlowSphere = (x, y, r, baseColor, gradient = null) => {
  // Draw sharp outer edge with gradient or solid color
  if (gradient && gradient.type === 'radial') {
    const radialGradient = ctx.createRadialGradient(
      x, y, 0,           // inner circle (center)
      x, y, r            // outer circle (edge)
    );
    
    const { colorStart, colorEnd } = gradient;
    radialGradient.addColorStop(0, `rgb(${colorStart.r}, ${colorStart.g}, ${colorStart.b})`);
    radialGradient.addColorStop(1, `rgb(${colorEnd.r}, ${colorEnd.g}, ${colorEnd.b})`);
    
    ctx.fillStyle = radialGradient;
  } else {
    ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
  }
  
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  
  // Add subtle glow (only 3 layers) - use the outer gradient color or baseColor
  const glowColor = (gradient && gradient.colorEnd) ? gradient.colorEnd : baseColor;
  for (let i = 0; i < 3; i++) {
    const glowRadius = r + (i * 8);
    const alpha = (3 - i) / 15; // Very subtle glow
    ctx.fillStyle = `rgba(${glowColor.r}, ${glowColor.g}, ${glowColor.b}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    ctx.fill();
  }
};

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear background
      ctx.fillStyle = 'rgb(18, 18, 18)';
      ctx.fillRect(0, 0, width, height);

      const spheres = spheresRef.current;

      // Physics update
      for (let i = 0; i < spheres.length; i++) {
        const s = spheres[i];

        s.x += s.vx;
        s.y += s.vy;

        // Boundary bounce - constrain to right half
        const leftBoundary = width / 4;
        if (s.x - s.r < leftBoundary || s.x + s.r > width) s.vx *= -1;
        if (s.y - s.r < 0 || s.y + s.r > height) s.vy *= -1;

        // Gravity-like drift
        s.vy += random(-0.01, 0.01);

        // Inter-sphere collisions
        for (let j = i + 1; j < spheres.length; j++) {
          const o = spheres[j];
          const dx = o.x - s.x;
          const dy = o.y - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = s.r + o.r - 4;

          if (dist < minDist) {
            const angle = Math.atan2(dy, dx);
            const overlap = (minDist - dist) * 0.5;

            s.x -= Math.cos(angle) * overlap;
            s.y -= Math.sin(angle) * overlap;
            o.x += Math.cos(angle) * overlap;
            o.y += Math.sin(angle) * overlap;

            // Velocity exchange
            const tempVx = s.vx;
            const tempVy = s.vy;
            s.vx = o.vx * 0.8;
            s.vy = o.vy * 0.8;
            o.vx = tempVx * 0.8;
            o.vy = tempVy * 0.8;
          }
        }
      }

      // Draw spheres
      for (const s of spheres) {
  drawGlowSphere(s.x, s.y, s.r, s.color, s.gradient);
}

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isDesktop]);

  // Don't render on mobile
  if (!isDesktop) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ 
        width: '100vw', 
        height: '100vh',
        willChange: 'contents'
      }}
    />
  );
}