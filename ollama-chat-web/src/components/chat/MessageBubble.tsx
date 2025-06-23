import React from 'react';
import { format } from 'date-fns';
import { Copy, User, Bot, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success('Message copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  return (
    <div
      className={cn(
        'flex w-full gap-3 p-4 transition-all duration-200 hover:bg-muted/30',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-primary text-primary-foreground'
            : isError
            ? 'bg-destructive text-destructive-foreground'
            : 'bg-secondary text-secondary-foreground'
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : isError ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn('flex-1 space-y-2', isUser ? 'text-right' : 'text-left')}>
        {/* Message Bubble */}
        <div
          className={cn(
            'relative inline-block max-w-[80%] rounded-2xl px-4 py-2 text-sm',
            isUser
              ? 'bg-primary text-primary-foreground'
              : isError
              ? 'bg-destructive/10 text-destructive border border-destructive/20'
              : 'bg-muted text-muted-foreground'
          )}
        >
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
          
          {/* Copy Button */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'absolute -top-2 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100',
              isUser ? '-left-2' : '-right-2'
            )}
            onClick={copyToClipboard}
          >
            <Copy className="h-3 w-3" />
            <span className="sr-only">Copy message</span>
          </Button>
        </div>

        {/* Timestamp */}
        <div
          className={cn(
            'text-xs text-muted-foreground/60',
            isUser ? 'text-right' : 'text-left'
          )}
        >
          {format(message.timestamp, 'HH:mm:ss')}
        </div>
      </div>
    </div>
  );
}
