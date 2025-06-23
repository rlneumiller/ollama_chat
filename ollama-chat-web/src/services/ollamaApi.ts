import {
  OllamaModel,
  OllamaGenerateRequest,
  OllamaGenerateResponse,
  ConnectionStatus,
} from '@/types/chat';

export class OllamaApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  async checkConnection(): Promise<ConnectionStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        return {
          isConnected: true,
          lastChecked: new Date(),
        };
      } else {
        return {
          isConnected: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          lastChecked: new Date(),
        };
      }
    } catch (error) {
      return {
        isConnected: false,
        error: error instanceof Error ? error.message : 'Unknown connection error',
        lastChecked: new Date(),
      };
    }
  }

  async getModels(): Promise<OllamaModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Failed to fetch models:', error);
      throw error;
    }
  }

  async generate(request: OllamaGenerateRequest): Promise<OllamaGenerateResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          stream: false, // We'll use non-streaming for simplicity
        }),
        signal: AbortSignal.timeout(120000), // 2 minute timeout for generation
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to generate response:', error);
      throw error;
    }
  }

  async checkQuitIntent(userMessage: string, model: string): Promise<boolean> {
    try {
      const quitCheckPrompt = `System: Does the user want to end this conversation? Respond with ONLY 'QUIT' if yes, otherwise respond with ONLY 'CONTINUE'.\nUser: ${userMessage}`;
      
      const response = await this.generate({
        model,
        prompt: quitCheckPrompt,
      });

      return response.response.trim().toUpperCase() === 'QUIT';
    } catch (error) {
      console.error('Failed to check quit intent:', error);
      // If quit detection fails, assume user wants to continue
      return false;
    }
  }

  async chatGenerate(userMessage: string, model: string): Promise<string> {
    try {
      const chatPrompt = `System: You are a friendly and helpful assistant. Respond naturally and concisely to the user's message.\nUser: ${userMessage}`;
      
      const response = await this.generate({
        model,
        prompt: chatPrompt,
      });

      return response.response.trim();
    } catch (error) {
      console.error('Failed to generate chat response:', error);
      throw error;
    }
  }

  updateBaseUrl(newUrl: string): void {
    this.baseUrl = newUrl;
  }
}

// Export a default instance
export const ollamaApi = new OllamaApiService();
