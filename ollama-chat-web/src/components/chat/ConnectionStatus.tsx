import React from 'react';
import { format } from 'date-fns';
import { Wifi, WifiOff, RefreshCw, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ConnectionStatus() {
  const { state, checkConnection } = useChat();
  const { connectionStatus, settings, isLoading } = state;

  const handleRefreshConnection = () => {
    checkConnection();
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Connection Status Badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant={connectionStatus.isConnected ? 'default' : 'destructive'}
              className="flex items-center gap-1 cursor-pointer"
            >
              {connectionStatus.isConnected ? (
                <Wifi className="h-3 w-3" />
              ) : (
                <WifiOff className="h-3 w-3" />
              )}
              {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">
                {connectionStatus.isConnected ? 'Connected to Ollama' : 'Connection Failed'}
              </p>
              <p className="text-xs text-muted-foreground">
                URL: {settings.ollamaUrl}
              </p>
              <p className="text-xs text-muted-foreground">
                Last checked: {format(connectionStatus.lastChecked, 'HH:mm:ss')}
              </p>
              {connectionStatus.error && (
                <p className="text-xs text-destructive mt-1">
                  Error: {connectionStatus.error}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshConnection}
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={cn('h-3 w-3', isLoading && 'animate-spin')} />
          <span className="sr-only">Refresh connection</span>
        </Button>
      </div>
    </TooltipProvider>
  );
}
