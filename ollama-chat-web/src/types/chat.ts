export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isError?: boolean;
}

export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  details: {
    family: string;
    format: string;
    parameter_size: string;
    quantization_level: string;
  };
  modified_at: string;
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface ConnectionStatus {
  isConnected: boolean;
  error?: string;
  lastChecked: Date;
}

export interface ChatSettings {
  ollamaUrl: string;
  selectedModel: string;
  enableQuitDetection: boolean;
  theme: 'light' | 'dark';
}
