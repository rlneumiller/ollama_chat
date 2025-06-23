import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Message, OllamaModel, ConnectionStatus, ChatSettings } from '@/types/chat';
import { ollamaApi } from '@/services/ollamaApi';
import { toast } from 'sonner';

interface ChatState {
  messages: Message[];
  models: OllamaModel[];
  connectionStatus: ConnectionStatus;
  settings: ChatSettings;
  isLoading: boolean;
  isTyping: boolean;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'SET_MODELS'; payload: OllamaModel[] }
  | { type: 'SET_CONNECTION_STATUS'; payload: ConnectionStatus }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ChatSettings> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'CLEAR_CHAT' };

const initialState: ChatState = {
  messages: [],
  models: [],
  connectionStatus: {
    isConnected: false,
    lastChecked: new Date(),
  },
  settings: {
    ollamaUrl: 'http://localhost:11434',
    selectedModel: 'llama3.2',
    enableQuitDetection: true,
    theme: 'dark',
  },
  isLoading: false,
  isTyping: false,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };
    case 'SET_MODELS':
      return {
        ...state,
        models: action.payload,
      };
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        connectionStatus: action.payload,
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };
    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
}

interface ChatContextType {
  state: ChatState;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  updateSettings: (settings: Partial<ChatSettings>) => void;
  checkConnection: () => Promise<void>;
  loadModels: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Initialize connection and models on mount
  useEffect(() => {
    checkConnection();
    loadModels();
  }, []);

  // Update Ollama API URL when settings change
  useEffect(() => {
    ollamaApi.updateBaseUrl(state.settings.ollamaUrl);
  }, [state.settings.ollamaUrl]);

  const checkConnection = async () => {
    try {
      const status = await ollamaApi.checkConnection();
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: status });
      
      // Only show error toast if user manually triggered the connection check
      // Don't show error on initial load
    } catch (error) {
      console.error('Connection check failed:', error);
    }
  };

  const loadModels = async () => {
    try {
      const models = await ollamaApi.getModels();
      dispatch({ type: 'SET_MODELS', payload: models });
      
      // If the currently selected model is not available, switch to the first available one
      if (models.length > 0 && !models.some(m => m.name === state.settings.selectedModel)) {
        dispatch({ 
          type: 'UPDATE_SETTINGS', 
          payload: { selectedModel: models[0].name } 
        });
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      // Only show error toast if this was a manual refresh, not initial load
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !state.connectionStatus.isConnected) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_TYPING', payload: true });

    try {
      // Check if user wants to quit (if enabled)
      if (state.settings.enableQuitDetection) {
        const wantsToQuit = await ollamaApi.checkQuitIntent(content, state.settings.selectedModel);
        if (wantsToQuit) {
          const goodbyeMessage: Message = {
            id: crypto.randomUUID(),
            content: 'Goodbye! The conversation has ended. Feel free to start a new one anytime.',
            role: 'assistant',
            timestamp: new Date(),
          };
          dispatch({ type: 'ADD_MESSAGE', payload: goodbyeMessage });
          dispatch({ type: 'SET_LOADING', payload: false });
          dispatch({ type: 'SET_TYPING', payload: false });
          toast.info('Conversation ended by user request');
          return;
        }
      }

      // Generate response
      const response = await ollamaApi.chatGenerate(content, state.settings.selectedModel);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        role: 'assistant',
        timestamp: new Date(),
        isError: true,
      };

      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
      toast.error('Failed to get response from Ollama');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
    toast.success('Chat history cleared');
  };

  const updateSettings = (settings: Partial<ChatSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const value: ChatContextType = {
    state,
    sendMessage,
    clearChat,
    updateSettings,
    checkConnection,
    loadModels,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
