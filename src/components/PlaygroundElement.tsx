import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PlaygroundElementProps {
  id: string;
  type: 'circle' | 'square' | 'triangle';
  color: string;
  size: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  physics: {
    gravity: boolean;
    spinning: boolean;
    exploded: boolean;
    floating: boolean;
  };
}

export const PlaygroundElement: React.FC<PlaygroundElementProps> = ({
  id,
  type,
  color,
  size,
  className,
  style,
  physics
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg',
    triangle: 'rounded-lg transform rotate-45'
  };

  const physicsClasses = cn({
    'floating-element': physics.floating && !physics.exploded,
    'physics-disabled': !physics.gravity && !physics.floating,
    'gravity-off': !physics.gravity && physics.floating,
    'spinning': physics.spinning,
    'exploded': physics.exploded,
  });

  useEffect(() => {
    if (physics.exploded && elementRef.current) {
      // Add random explosion direction
      const randomX = (Math.random() - 0.5) * 400;
      const randomY = (Math.random() - 0.5) * 400;
      elementRef.current.style.setProperty('--random-x', `${randomX}px`);
      elementRef.current.style.setProperty('--random-y', `${randomY}px`);
    }
  }, [physics.exploded]);

  return (
    <div
      ref={elementRef}
      className={cn(
        'absolute neon-glow transition-all duration-500',
        sizeClasses[size],
        shapeClasses[type],
        physicsClasses,
        className
      )}
      style={{
        backgroundColor: color,
        boxShadow: `0 0 20px ${color}`,
        ...style
      }}
      data-element-id={id}
    />
  );
};