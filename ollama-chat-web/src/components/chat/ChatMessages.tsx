import React, { useEffect, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { MessageBubble } from './MessageBubble';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, MessageCircle } from 'lucide-react';

export function ChatMessages() {
  const { state } = useChat();
  const { messages, isTyping } = state;
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Welcome to Ollama Chat
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Start a conversation with your local AI assistant. Make sure Ollama is running
              on your system and you have models installed.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            <span>Type a message below to get started</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 h-full">
      <div className="space-y-0">
        {messages.map((message) => (
          <div key={message.id} className="group">
            <MessageBubble message={message} />
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex w-full gap-3 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="inline-block bg-muted text-muted-foreground rounded-2xl px-4 py-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="ml-2 text-xs">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
