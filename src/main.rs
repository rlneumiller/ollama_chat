use ollama_rs::Ollama;
use ollama_rs::generation::completion::request::GenerationRequest;
use std::io::{self, Write};
use ollama_rs::error::OllamaError;

/// Our custom error type
#[derive(Debug)]
enum ChatError {
    /// Represents an underlying I/O error.
    Io(io::Error),
    /// Represents an error returned by the Ollama API.
    Ollama(OllamaError), // Corrected: Use OllamaError
}

impl From<io::Error> for ChatError {
    fn from(err: io::Error) -> Self {
        ChatError::Io(err)
    }
}

impl From<OllamaError> for ChatError { 
    fn from(err: OllamaError) -> Self {
        ChatError::Ollama(err)
    }
}

impl std::fmt::Display for ChatError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ChatError::Io(err) => write!(f, "An emergency is going on. I/O error: {}", err),
            ChatError::Ollama(err) => write!(f, "Uh-oh... Ollama API error: {}", err),
        }
    }
}

impl std::error::Error for ChatError {}

#[tokio::main]
async fn main() -> Result<(), ChatError> {
    let ollama = Ollama::default();
    const MODEL_NAME: &str = "llama3.2"; // ~2GB on-disk
    //const MODEL_NAME: &str = "qwen2.5-coder:14b"; // ~9GB on-disk
    //const MODEL_NAME: &str = "deepseek-r1:70b"; // ~42GB on-disk

    println!("Chatting with {}: (When you want to stop, just say so!)", MODEL_NAME);

    loop {
        print!("You: ");
        io::stdout().flush()?;

        let mut input = String::new();
        io::stdin().read_line(&mut input)?;
        let user_message = input.trim();

        if user_message.is_empty() {
            continue;
        }

        // Use the model to check if the user wants to exit - inefficient, but way more user friendly.
        let quit_check_prompt = format!(
            "System: Does the user want to end this conversation? Respond with ONLY 'QUIT' if yes, otherwise respond with ONLY 'CONTINUE'.\nUser: {}",
            user_message
        );
        let quit_check_request = GenerationRequest::new(MODEL_NAME.to_string(), quit_check_prompt);
        let quit_response = ollama.generate(quit_check_request).await?;
        let quit_reply = quit_response.response.trim();

        if quit_reply.eq_ignore_ascii_case("QUIT") {
            println!("\n{}: Exiting chat. Goodbye!", MODEL_NAME);
            break;
        }

        // Since the user doesnt seem to want to quit, continue with the chat
        let chat_prompt = format!(
            "System: You are a friendly and helpful assistant. Respond naturally and concisely to the user's message.\nUser: {}",
            user_message
        );
        let chat_request = GenerationRequest::new(MODEL_NAME.to_string(), chat_prompt);
        let chat_response = ollama.generate(chat_request).await?;
        println!("{}: {}", MODEL_NAME, chat_response.response.trim());
    }

    Ok(())
}