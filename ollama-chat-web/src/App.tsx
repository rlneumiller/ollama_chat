import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { ChatProvider } from '@/contexts/ChatContext';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <ChatProvider>
          <div className="min-h-screen bg-background text-foreground">
            <ChatInterface />
          </div>
          <Toaster richColors position="top-right" />
        </ChatProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
