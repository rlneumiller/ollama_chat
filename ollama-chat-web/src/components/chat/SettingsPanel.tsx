import React, { useState } from 'react';
import { Settings, X, RefreshCw, Trash2, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useChat } from '@/contexts/ChatContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const { state, updateSettings, clearChat, checkConnection, loadModels } = useChat();
  const { settings, connectionStatus, models } = state;
  const [isOpen, setIsOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(settings.ollamaUrl);

  const handleUrlChange = () => {
    if (tempUrl !== settings.ollamaUrl) {
      updateSettings({ ollamaUrl: tempUrl });
      toast.success('Ollama URL updated');
      // Check connection with new URL
      setTimeout(() => {
        checkConnection();
        loadModels();
      }, 500);
    }
  };

  const handleClearChat = () => {
    clearChat();
    setIsOpen(false);
  };

  const resetToDefaults = () => {
    setTempUrl('http://localhost:11434');
    updateSettings({
      ollamaUrl: 'http://localhost:11434',
      selectedModel: 'llama3.2',
      enableQuitDetection: true,
    });
    toast.success('Settings reset to defaults');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 w-10 p-0">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your Ollama chat experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Connection Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Connection</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Ollama URL"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleUrlChange}
                  disabled={tempUrl === settings.ollamaUrl}
                  size="sm"
                >
                  Update
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={connectionStatus.isConnected ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
                {connectionStatus.error && (
                  <span className="text-xs text-muted-foreground">
                    {connectionStatus.error}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Model Information */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Models</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Available models: {models.length}
                </span>
                <Button variant="outline" size="sm" onClick={loadModels}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </div>
              {models.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Current: <Badge variant="secondary">{settings.selectedModel}</Badge>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Chat Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Chat Behavior</Label>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Intelligent Quit Detection</Label>
                <p className="text-xs text-muted-foreground">
                  AI will detect when you want to end the conversation
                </p>
              </div>
              <Switch
                checked={settings.enableQuitDetection}
                onCheckedChange={(checked) =>
                  updateSettings({ enableQuitDetection: checked })
                }
              />
            </div>
          </div>

          <Separator />

          {/* Appearance Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Appearance</Label>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Theme</Label>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9 p-0"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Actions</Label>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClearChat} className="flex-1">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Chat
              </Button>
              <Button variant="outline" onClick={resetToDefaults} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Settings
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
