import React, { useEffect, useState } from 'react';
import { CheckCircle, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackDisplayProps {
  message: string;
  type: 'success' | 'processing' | 'error';
  visible: boolean;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ message, type, visible }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Zap className="w-4 h-4 animate-pulse" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/50 text-green-300';
      case 'processing':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
      default:
        return 'bg-purple-500/20 border-purple-500/50 text-purple-300';
    }
  };

  if (!show) return null;

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 glass-panel border p-4 min-w-64 transition-all duration-500',
      getStyles(),
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    )}>
      <div className="flex items-center gap-3">
        {getIcon()}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};