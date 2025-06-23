import React, { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function ChatInput() {
  const { state, sendMessage } = useChat();
  const { connectionStatus, isLoading, isTyping } = state;
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDisabled = !connectionStatus.isConnected || isLoading;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isDisabled) {
      return;
    }

    const message = input.trim();
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleStop = () => {
    // TODO: Implement message cancellation if needed
    console.log('Stop generation requested');
  };

  return (
    <div className="border-t bg-background p-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                !connectionStatus.isConnected
                  ? 'Please connect to Ollama first...'
                  : isLoading
                  ? 'Generating response...'
                  : 'Type your message... (Enter to send, Shift+Enter for new line)'
              }
              disabled={isDisabled}
              className={cn(
                'min-h-[44px] max-h-[120px] resize-none pr-12',
                'transition-all duration-200',
                isDisabled && 'opacity-60'
              )}
              rows={1}
            />
            
            {/* Character count indicator */}
            {input.length > 0 && (
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {input.length}
              </div>
            )}
          </div>

          {/* Send/Stop Button */}
          <Button
            type={isLoading ? 'button' : 'submit'}
            size="sm"
            disabled={(!input.trim() && !isLoading) || !connectionStatus.isConnected}
            onClick={isLoading ? handleStop : undefined}
            className={cn(
              'h-11 w-11 p-0 transition-all duration-200',
              isLoading && 'bg-destructive hover:bg-destructive/90'
            )}
          >
            {isLoading ? (
              <Square className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isLoading ? 'Stop generation' : 'Send message'}
            </span>
          </Button>
        </div>

        {/* Status indicators */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {isTyping && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>AI is typing...</span>
              </div>
            )}
            {!connectionStatus.isConnected && (
              <span className="text-destructive">
                Not connected to Ollama
              </span>
            )}
          </div>
          
          <div className="text-right">
            Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Enter</kbd> to send,{' '}
            <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Shift+Enter</kbd> for new line
          </div>
        </div>
      </form>
    </div>
  );
}
