import React from 'react';
import { Check, ChevronDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from '@/contexts/ChatContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ModelSelector() {
  const { state, updateSettings, loadModels } = useChat();
  const { models, settings, isLoading } = state;

  const handleModelChange = (modelName: string) => {
    updateSettings({ selectedModel: modelName });
  };

  const handleRefreshModels = () => {
    loadModels();
  };

  const formatModelSize = (bytes: number): string => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)}GB`;
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={settings.selectedModel} onValueChange={handleModelChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a model" />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectTrigger>
        <SelectContent>
          {models.length === 0 ? (
            <SelectItem value="no-models" disabled>
              No models available
            </SelectItem>
          ) : (
            models.map((model) => (
              <SelectItem key={model.name} value={model.name}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.details.family} • {formatModelSize(model.size)}
                    </span>
                  </div>
                  {settings.selectedModel === model.name && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={handleRefreshModels}
        disabled={isLoading}
        className="h-10 w-10 p-0"
      >
        <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
        <span className="sr-only">Refresh models</span>
      </Button>

      {models.length > 0 && (
        <Badge variant="secondary" className="text-xs">
          {models.length} model{models.length !== 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  );
}
