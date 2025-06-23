# Experimental
- Created to flesh out some ideas
- not for production use
- use at your own risk

- Created from my ollama_chat_app repo on github for the most part from one prompt with Minimax agent.
- Required only a minor edit of the package.json to get "pnpm dev" to start up on my machine

Here's the link to the session: https://agent.minimax.io/share/283184427618394

# Ollama Chat Web Frontend

A modern, responsive web interface for chatting with local Ollama AI models. Built with React, TypeScript, and TailwindCSS.

## Features

🤖 **Interactive Chat Interface**
- Real-time conversation with AI models
- Message bubbles with timestamps
- Copy message functionality
- Auto-scroll to latest messages

⚙️ **Model Management**
- Dynamic model selection dropdown
- Real-time model list refresh
- Model information display (size, family)

🔗 **Connection Management**
- Live connection status indicator
- Configurable Ollama URL
- Automatic connection testing
- Error handling and retry mechanisms

🎨 **Modern UI/UX**
- Dark/Light theme toggle
- Responsive design for all screen sizes
- Smooth animations and transitions
- Professional loading states

🧠 **Intelligent Features**
- AI-powered quit detection
- Typing indicators
- Error handling with user feedback
- Settings persistence

## Prerequisites

Before running the web frontend, ensure you have:

1. **Ollama installed and running**
   ```
   # Install Ollama (if not already installed)
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Start Ollama service
   ollama serve
   ```

2. **At least one AI model installed**
   ```
   # Install the default model (llama3.2)
   ollama pull llama3.2
   
   # Or install other models
   ollama pull qwen2.5-coder:14b
   ollama pull deepseek-r1:70b
   ```

3. **Node.js and pnpm**
   ```
   # Install pnpm if not already installed
   npm install -g pnpm
   ```

## Quick Start
- I extracted the "ollama-chat-web" folder from the project zip file that minimax agent created and copied it to the root of my rust project.

1. **Navigate to the web frontend directory**
   ```
   cd ollama-chat-web
   ```

2. **Install dependencies**
   ```
   pnpm install
   ```

3. **Start the development server**
   ```
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to access the chat interface.

## Production Build

To build for production:

```bash
# Build the application
pnpm build

# Preview the production build
pnpm preview
```

The built files will be in the `dist/` directory.

## Configuration

### Ollama Connection

By default, the application connects to Ollama at `http://localhost:11434`. You can change this in the settings panel:

1. Click the ⚙️ settings icon in the top-right corner
2. Update the "Ollama URL" field
3. Click "Update" to apply changes

### Available Settings

- **Ollama URL**: Connection endpoint for your Ollama instance
- **Model Selection**: Choose from available models on your system
- **Quit Detection**: Enable/disable AI-powered conversation ending
- **Theme**: Toggle between dark and light modes

## Usage

### Starting a Conversation

1. Ensure Ollama is running and models are available
2. Check that the connection status shows "Connected"
3. Select your preferred model from the dropdown
4. Type your message in the input field at the bottom
5. Press Enter or click the send button

### Managing Models

- Use the model selector dropdown to switch between available models
- Click the refresh button (🔄) to reload the model list
- Model information shows family type and size

### Settings and Customization

- **Clear Chat**: Remove all conversation history
- **Theme Toggle**: Switch between dark and light modes
- **Connection Settings**: Configure Ollama endpoint
- **Quit Detection**: Control AI-powered conversation ending

## Troubleshooting

### Common Issues

**1. "Not connected to Ollama"**
- Ensure Ollama is running: `ollama serve`
- Check if Ollama is accessible: `curl http://localhost:11434/api/version`
- Verify the Ollama URL in settings

**2. "No models available"**
- Install a model: `ollama pull llama3.2`
- Check installed models: `ollama list`
- Refresh the model list in the app

**3. "Failed to get response"**
- Verify the selected model is downloaded and available
- Check Ollama logs for errors
- Try switching to a different model

**4. CORS errors (development)**
- Ollama typically allows localhost connections
- If needed, start Ollama with CORS headers:
  ```bash
  OLLAMA_ORIGINS=* ollama serve
  ```

### Browser Compatibility

The application supports all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Project Structure

```
src/
├── components/
│   ├── chat/              # Chat-related components
│   │   ├── ChatInterface.tsx
│   │   ├── ChatMessages.tsx
│   │   ├── ChatInput.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ModelSelector.tsx
│   │   ├── ConnectionStatus.tsx
│   │   └── SettingsPanel.tsx
│   ├── ui/               # Reusable UI components
│   └── ErrorBoundary.tsx
├── contexts/
│   └── ChatContext.tsx   # Global state management
├── services/
│   └── ollamaApi.ts     # Ollama API integration
├── types/
│   └── chat.ts          # TypeScript definitions
└── lib/
    └── utils.ts         # Utility functions
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

### Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **next-themes** - Theme management

## API Integration

The application communicates directly with the Ollama API:

### Endpoints Used

- `GET /api/version` - Check connection status
- `GET /api/tags` - List available models
- `POST /api/generate` - Generate AI responses

### Request Flow

1. **Connection Check**: Periodically verify Ollama availability
2. **Model Loading**: Fetch and display available models
3. **Message Processing**: Send user input and receive AI responses
4. **Quit Detection**: Use AI to detect conversation end intent

## License

This project is part of the Ollama Chat application suite. See the main project for licensing information.
