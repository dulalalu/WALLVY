import React, { useMemo } from 'react';
import { EdgePreset } from '../types';

interface EdgeLightingCanvasProps {
  preset: EdgePreset;
  className?: string;
  isNotificationFlash?: boolean;
}

export const EdgeLightingCanvas: React.FC<EdgeLightingCanvasProps> = ({
  preset,
  className = '',
  isNotificationFlash = false,
}) => {
  const {
    colors,
    animation_type,
    speed,
    brightness,
    thickness,
    glow,
    corner_radius,
    direction = 'clockwise',
  } = preset;

  // Compute animation speed in seconds
  // speed 1 (slow) -> 12s, speed 10 (fast) -> 1.5s
  const durationSec = Math.max(0.8, 14 - speed * 1.2);

  // Gradient string
  const gradientColors = colors.length > 1 ? colors.join(', ') : `${colors[0]}, ${colors[0]}`;
  const dynamicBrightness = (brightness / 100) * (isNotificationFlash ? 1.5 : 1);

  // Style generation based on animation type
  const styleConfig = useMemo(() => {
    let animName = 'edgeGradientFlow';
    if (animation_type === 'pulse' || animation_type === 'breathing_glow') {
      animName = 'edgePulseGlow';
    } else if (animation_type === 'fire') {
      animName = 'edgeFireGlow';
    } else if (animation_type === 'electric') {
      animName = 'edgeElectric';
    }

    const glowColor = colors[0] || '#00F0FF';

    return {
      borderRadius: `${corner_radius}px`,
      padding: `${thickness}px`,
      filter: `drop-shadow(0 0 ${glow}px ${glowColor}) drop-shadow(0 0 ${glow * 1.5}px ${colors[1] || glowColor})`,
      opacity: dynamicBrightness,
    };
  }, [animation_type, colors, corner_radius, thickness, glow, dynamicBrightness]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-20 overflow-hidden ${className}`}
      style={{ borderRadius: `${corner_radius}px` }}
    >
      {/* Outer Neon Glowing Edge Stroke */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: `${corner_radius}px`,
          padding: `${thickness}px`,
          background: `conic-gradient(from 0deg at 50% 50%, ${gradientColors}, ${colors[0]})`,
          animation: `${direction === 'counter_clockwise' ? 'reverse ' : ''}spin ${durationSec}s linear infinite`,
          filter: `blur(${Math.max(1, glow * 0.4)}px) brightness(${dynamicBrightness})`,
        }}
      />

      {/* Crisp Inset Sharp Neon Line */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: `${corner_radius}px`,
          padding: `${Math.max(2, thickness * 0.6)}px`,
          background: `conic-gradient(from 180deg at 50% 50%, ${gradientColors}, ${colors[0]})`,
          animation: `${direction === 'counter_clockwise' ? '' : 'reverse '}spin ${durationSec * 1.2}s linear infinite`,
          opacity: 0.9,
        }}
      />

      {/* Mask out center to create the hollow phone border */}
      <div
        className="absolute"
        style={{
          top: `${thickness}px`,
          left: `${thickness}px`,
          right: `${thickness}px`,
          bottom: `${thickness}px`,
          borderRadius: `${Math.max(0, corner_radius - thickness)}px`,
          backgroundColor: 'transparent',
          boxShadow: `inset 0 0 ${glow}px ${colors[0]}44`,
        }}
      />
    </div>
  );
};
