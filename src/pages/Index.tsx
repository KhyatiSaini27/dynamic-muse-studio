import React, { useState } from 'react';
import { CommandInterface } from '@/components/CommandInterface';
import { VisualPlayground } from '@/components/VisualPlayground';
import { FeedbackDisplay } from '@/components/FeedbackDisplay';
import { Sparkles, Code2 } from 'lucide-react';

const Index = () => {
  const [currentCommand, setCurrentCommand] = useState('');
  const [feedback, setFeedback] = useState({
    message: '',
    type: 'success' as 'success' | 'processing' | 'error',
    visible: false
  });

  const handleCommand = (command: string) => {
    setFeedback({
      message: `Processing: "${command}"`,
      type: 'processing',
      visible: true
    });

    setTimeout(() => {
      setCurrentCommand(command);
      setFeedback({
        message: `Command executed: "${command}"`,
        type: 'success',
        visible: true
      });
      
      setTimeout(() => {
        setFeedback(prev => ({ ...prev, visible: false }));
      }, 3000);
    }, 500);
  };

  const handleCommandProcessed = () => {
    setCurrentCommand('');
  };

  return (
    <div className="min-h-screen p-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 pt-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="relative">
            <Code2 className="w-8 h-8 text-neon-cyan neon-glow" />
            <Sparkles className="w-4 h-4 text-neon-purple absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-neon bg-clip-text text-transparent">
          Reality Controller
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform this digital space with natural language commands. 
          Watch as physics, colors, and animations respond to your words in real-time.
        </p>
      </div>

      {/* Command Interface */}
      <CommandInterface 
        onCommand={handleCommand} 
        isProcessing={currentCommand !== ''}
      />

      {/* Visual Playground */}
      <div className="max-w-4xl mx-auto">
        <VisualPlayground 
          command={currentCommand}
          onCommandProcessed={handleCommandProcessed}
        />
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-8">
        <p>Try commands like "turn off gravity", "make it rain", or "change colors to purple"</p>
      </div>

      {/* Feedback Display */}
      <FeedbackDisplay
        message={feedback.message}
        type={feedback.type}
        visible={feedback.visible}
      />
    </div>
  );
};

export default Index;
