import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Terminal } from 'lucide-react';

interface CommandInterfaceProps {
  onCommand: (command: string) => void;
  isProcessing?: boolean;
}

export const CommandInterface: React.FC<CommandInterfaceProps> = ({ onCommand, isProcessing = false }) => {
  const [command, setCommand] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onCommand(command.trim());
      setCommand('');
    }
  };

  const suggestedCommands = [
    "turn off gravity",
    "make it rain",
    "change colors to purple",
    "spin everything",
    "explode",
    "reset"
  ];

  return (
    <div className="glass-panel p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Terminal className="w-5 h-5 text-neon-cyan" />
        <h2 className="text-lg font-semibold text-foreground">Reality Controller</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type your command... (e.g., 'turn off gravity')"
          className="flex-1 bg-black/20 border-white/20 text-foreground placeholder:text-muted-foreground focus:border-neon-cyan transition-colors"
          disabled={isProcessing}
        />
        <Button 
          type="submit" 
          variant="outline"
          className="bg-gradient-neon border-0 text-black hover:scale-105 transition-transform neon-glow"
          disabled={isProcessing || !command.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Try these commands:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedCommands.map((cmd, index) => (
            <button
              key={index}
              onClick={() => setCommand(cmd)}
              className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-neon-cyan/50 transition-all"
              disabled={isProcessing}
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};