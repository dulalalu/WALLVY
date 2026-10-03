import React, { useRef, useEffect } from 'react';
import { LiveAnimationType } from '../types';

interface LiveWallpaperCanvasProps {
  animationType: LiveAnimationType;
  speed?: number; // 1 - 10
  brightness?: number; // 30 - 100
  intensity?: number; // 1 - 10
  className?: string;
  interactive?: boolean;
}

export const LiveWallpaperCanvas: React.FC<LiveWallpaperCanvasProps> = ({
  animationType,
  speed = 5,
  brightness = 85,
  intensity = 7,
  className = 'w-full h-full',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchPosRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 400;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener('resize', handleResize);

    // Particle system state
    const particleCount = Math.floor(60 + intensity * 15);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (speed * 0.4),
      vy: (Math.random() - 0.5) * (speed * 0.4),
      size: Math.random() * 2.5 + 1,
      color: `hsl(${Math.random() * 60 + 170}, 90%, ${brightness * 0.7}%)`,
      alpha: Math.random() * 0.8 + 0.2
    }));

    // Raindrops state
    const raindrops = Array.from({ length: Math.floor(40 + intensity * 10) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 25 + 15,
      vy: Math.random() * speed * 2 + 8,
      alpha: Math.random() * 0.5 + 0.3
    }));

    // Ripple state for water
    const ripples: Array<{ x: number; y: number; radius: number; alpha: number }> = [];

    // Aurora wave phase
    let phase = 0;

    const render = () => {
      phase += speed * 0.015;
      const bRatio = brightness / 100;

      // 1. PARTICLES / STARLIGHT FIELD
      if (animationType === 'particles') {
        ctx.fillStyle = `rgba(6, 7, 24, ${0.25})`;
        ctx.fillRect(0, 0, width, height);

        const touch = touchPosRef.current;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Gravity pull toward touch/mouse if active
          if (touch.active) {
            const dx = touch.x - p.x;
            const dy = touch.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200 && dist > 10) {
              p.vx += (dx / dist) * 0.3;
              p.vy += (dy / dist) * 0.3;
            }
          }

          p.x += p.vx;
          p.y += p.vy;

          // Drag / friction
          p.vx *= 0.98;
          p.vy *= 0.98;

          // Wrap edges
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (intensity / 5), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12 * bRatio;
          ctx.shadowColor = p.color;
          ctx.fill();

          // Connect adjacent particles
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 65) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - dist / 65) * 0.25 * bRatio})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }

      // 2. AURORA BOREALIS
      else if (animationType === 'aurora') {
        ctx.fillStyle = 'rgba(4, 9, 20, 0.2)';
        ctx.fillRect(0, 0, width, height);

        for (let layer = 0; layer < 4; layer++) {
          ctx.beginPath();
          ctx.moveTo(0, height * 0.4);

          const grad = ctx.createLinearGradient(0, 0, 0, height);
          if (layer % 2 === 0) {
            grad.addColorStop(0, `rgba(16, 185, 129, 0)`);
            grad.addColorStop(0.4, `rgba(16, 185, 129, ${0.4 * bRatio})`);
            grad.addColorStop(0.7, `rgba(6, 182, 212, ${0.5 * bRatio})`);
            grad.addColorStop(1, `rgba(4, 9, 20, 0.9)`);
          } else {
            grad.addColorStop(0, `rgba(168, 85, 247, 0)`);
            grad.addColorStop(0.5, `rgba(147, 51, 234, ${0.35 * bRatio})`);
            grad.addColorStop(0.8, `rgba(59, 130, 246, ${0.4 * bRatio})`);
            grad.addColorStop(1, `rgba(4, 9, 20, 0.9)`);
          }

          for (let x = 0; x <= width; x += 15) {
            const y = height * 0.45 + 
              Math.sin(x * 0.006 + phase * (layer + 1) * 0.6) * (30 + intensity * 6) +
              Math.cos(x * 0.012 - phase * 0.4) * 20;
            ctx.lineTo(x, y);
          }

          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.shadowBlur = 20 * bRatio;
          ctx.shadowColor = layer % 2 === 0 ? '#10b981' : '#a855f7';
          ctx.fill();
        }
      }

      // 3. TOKYO RAINDROPS ON GLASS
      else if (animationType === 'rain') {
        ctx.fillStyle = 'rgba(7, 10, 25, 0.3)';
        ctx.fillRect(0, 0, width, height);

        // Ambient city neon glow in background
        const bgGlow = ctx.createRadialGradient(width * 0.5, height * 0.7, 20, width * 0.5, height * 0.7, width * 0.8);
        bgGlow.addColorStop(0, `rgba(236, 72, 153, ${0.15 * bRatio})`);
        bgGlow.addColorStop(0.5, `rgba(6, 182, 212, ${0.12 * bRatio})`);
        bgGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = bgGlow;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = `rgba(180, 220, 255, ${0.6 * bRatio})`;
        ctx.lineWidth = 1.2;

        raindrops.forEach(drop => {
          drop.y += drop.vy;
          if (drop.y > height) {
            drop.y = -drop.length;
            drop.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 2, drop.y + drop.length);
          ctx.stroke();
        });
      }

      // 4. NEON WAVES / AUDIO REACTIVE
      else if (animationType === 'neon_waves') {
        ctx.fillStyle = 'rgba(6, 7, 20, 0.25)';
        ctx.fillRect(0, 0, width, height);

        const waveCount = 5;
        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          const hue = (w * 40 + phase * 20) % 360;
          ctx.strokeStyle = `hsl(${hue}, 100%, ${brightness * 0.7}%)`;
          ctx.lineWidth = 2 + (intensity * 0.4);
          ctx.shadowBlur = 18 * bRatio;
          ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;

          for (let x = 0; x <= width; x += 10) {
            const y = height * 0.5 + 
              Math.sin(x * 0.01 + phase + w * 0.8) * (40 + intensity * 8) * Math.sin(phase * 0.5 + w);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // 5. GALAXY / COSMIC NEBULA
      else {
        ctx.fillStyle = 'rgba(5, 5, 20, 0.2)';
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const arms = 3;

        for (let i = 0; i < 90; i++) {
          const arm = i % arms;
          const dist = (i / 90) * (Math.min(width, height) * 0.45);
          const angle = dist * 0.03 + phase * 0.5 + (arm * ((Math.PI * 2) / arms));
          const px = cx + Math.cos(angle) * dist;
          const py = cy + Math.sin(angle) * dist;

          ctx.beginPath();
          ctx.arc(px, py, (Math.sin(i + phase) * 1.5 + 2) * (intensity / 6), 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${i * 4 + 180}, 90%, ${brightness * 0.8}%)`;
          ctx.shadowBlur = 15 * bRatio;
          ctx.shadowColor = '#00F0FF';
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    // Touch/Mouse event handlers
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      touchPosRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        active: true
      };
    };

    const onEnd = () => {
      touchPosRef.current.active = false;
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchmove', onMove, { passive: true });
    canvas.addEventListener('mouseleave', onEnd);
    canvas.addEventListener('touchend', onEnd);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('touchmove', onMove);
      canvas.removeEventListener('mouseleave', onEnd);
      canvas.removeEventListener('touchend', onEnd);
    };
  }, [animationType, speed, brightness, intensity, interactive]);

  return <canvas ref={canvasRef} className={className} />;
};
