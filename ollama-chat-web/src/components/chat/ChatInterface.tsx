import React from 'react';
import { Bot, Trash2 } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { ConnectionStatus } from './ConnectionStatus';
import { SettingsPanel } from './SettingsPanel';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function ChatInterface() {
  const { state, clearChat } = useChat();
  const { messages } = state;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Left side - Logo and title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Ollama Chat</h1>
                <p className="text-xs text-muted-foreground">AI Assistant</p>
              </div>
            </div>
          </div>

          {/* Center - Model selector */}
          <div className="hidden md:flex">
            <ModelSelector />
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center gap-2">
            <ConnectionStatus />
            <Separator orientation="vertical" className="h-6" />
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="h-10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
            <SettingsPanel />
          </div>
        </div>

        {/* Mobile model selector */}
        <div className="border-t px-4 py-3 md:hidden">
          <ModelSelector />
        </div>
      </div>

      {/* Chat messages area */}
      <ChatMessages />

      {/* Input area */}
      <ChatInput />
    </div>
  );
}
