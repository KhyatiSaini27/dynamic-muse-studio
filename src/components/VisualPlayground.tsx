import React, { useState, useEffect } from 'react';
import { PlaygroundElement } from './PlaygroundElement';
import { cn } from '@/lib/utils';

interface PlaygroundState {
  gravity: boolean;
  spinning: boolean;
  exploded: boolean;
  floating: boolean;
  colorScheme: string;
  raining: boolean;
}

interface VisualPlaygroundProps {
  command: string;
  onCommandProcessed: () => void;
}

export const VisualPlayground: React.FC<VisualPlaygroundProps> = ({ command, onCommandProcessed }) => {
  const [state, setState] = useState<PlaygroundState>({
    gravity: false,
    spinning: false,
    exploded: false,
    floating: true,
    colorScheme: 'default',
    raining: false
  });

  const [rainDrops, setRainDrops] = useState<Array<{ id: string; x: number; delay: number }>>([]);

  const elements = [
    { id: '1', type: 'circle' as const, size: 'md' as const, x: 20, y: 30 },
    { id: '2', type: 'square' as const, size: 'lg' as const, x: 70, y: 20 },
    { id: '3', type: 'triangle' as const, size: 'sm' as const, x: 40, y: 60 },
    { id: '4', type: 'circle' as const, size: 'sm' as const, x: 80, y: 70 },
    { id: '5', type: 'square' as const, size: 'md' as const, x: 10, y: 80 },
    { id: '6', type: 'triangle' as const, size: 'lg' as const, x: 60, y: 40 },
  ];

  const getElementColor = (elementId: string) => {
    const colorSchemes = {
      default: ['hsl(180, 100%, 50%)', 'hsl(270, 100%, 50%)', 'hsl(120, 100%, 50%)'],
      purple: ['hsl(270, 100%, 50%)', 'hsl(300, 100%, 50%)', 'hsl(240, 100%, 50%)'],
      red: ['hsl(0, 100%, 50%)', 'hsl(330, 100%, 50%)', 'hsl(15, 100%, 50%)'],
      blue: ['hsl(200, 100%, 50%)', 'hsl(240, 100%, 50%)', 'hsl(180, 100%, 50%)'],
      green: ['hsl(120, 100%, 50%)', 'hsl(150, 100%, 50%)', 'hsl(90, 100%, 50%)']
    };
    
    const colors = colorSchemes[state.colorScheme as keyof typeof colorSchemes] || colorSchemes.default;
    const index = parseInt(elementId) % colors.length;
    return colors[index];
  };

  const processCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase();
    
    if (lowerCmd.includes('turn off gravity') || lowerCmd.includes('no gravity')) {
      setState(prev => ({ ...prev, gravity: false, floating: true }));
    } else if (lowerCmd.includes('turn on gravity') || lowerCmd.includes('gravity on')) {
      setState(prev => ({ ...prev, gravity: true, floating: false }));
    } else if (lowerCmd.includes('spin') || lowerCmd.includes('rotate')) {
      setState(prev => ({ ...prev, spinning: !prev.spinning }));
    } else if (lowerCmd.includes('explode') || lowerCmd.includes('scatter')) {
      setState(prev => ({ ...prev, exploded: true }));
      setTimeout(() => setState(prev => ({ ...prev, exploded: false })), 2000);
    } else if (lowerCmd.includes('make it rain') || lowerCmd.includes('rain')) {
      createRain();
    } else if (lowerCmd.includes('reset') || lowerCmd.includes('clear')) {
      setState({
        gravity: false,
        spinning: false,
        exploded: false,
        floating: true,
        colorScheme: 'default',
        raining: false
      });
      setRainDrops([]);
    } else if (lowerCmd.includes('change colors to') || lowerCmd.includes('color')) {
      if (lowerCmd.includes('purple')) setState(prev => ({ ...prev, colorScheme: 'purple' }));
      else if (lowerCmd.includes('red')) setState(prev => ({ ...prev, colorScheme: 'red' }));
      else if (lowerCmd.includes('blue')) setState(prev => ({ ...prev, colorScheme: 'blue' }));
      else if (lowerCmd.includes('green')) setState(prev => ({ ...prev, colorScheme: 'green' }));
    }
  };

  const createRain = () => {
    const drops = Array.from({ length: 20 }, (_, i) => ({
      id: `rain-${i}`,
      x: Math.random() * 100,
      delay: Math.random() * 2000
    }));
    setRainDrops(drops);
    setState(prev => ({ ...prev, raining: true }));
    
    setTimeout(() => {
      setRainDrops([]);
      setState(prev => ({ ...prev, raining: false }));
    }, 5000);
  };

  useEffect(() => {
    if (command) {
      processCommand(command);
      onCommandProcessed();
    }
  }, [command, onCommandProcessed]);

  return (
    <div className="relative w-full h-96 glass-panel overflow-hidden">
      {/* Main elements */}
      {elements.map((element) => (
        <PlaygroundElement
          key={element.id}
          id={element.id}
          type={element.type}
          color={getElementColor(element.id)}
          size={element.size}
          physics={state}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`
          }}
        />
      ))}

      {/* Rain effect */}
      {rainDrops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-1 h-4 bg-neon-cyan rounded-full raining opacity-70"
          style={{
            left: `${drop.x}%`,
            top: '-20px',
            animationDelay: `${drop.delay}ms`
          }}
        />
      ))}

      {/* Status indicator */}
      <div className="absolute top-4 left-4 space-y-1">
        <div className={cn("text-xs px-2 py-1 rounded-full", 
          state.gravity ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
        )}>
          Gravity: {state.gravity ? 'ON' : 'OFF'}
        </div>
        {state.spinning && (
          <div className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
            Spinning: ON
          </div>
        )}
        {state.raining && (
          <div className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
            Raining: ON
          </div>
        )}
      </div>
    </div>
  );
};