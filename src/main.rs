use ollama_rs::Ollama;
use ollama_rs::generation::completion::request::GenerationRequest;
use std::io::{self, Write};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let ollama = Ollama::default();
    let model = String::from("llama3.2");

    println!("Chat with {} (type 'exit' to quit)", model);
    
    loop {
        print!("You: ");
        io::stdout().flush()?;
        
        let mut input = String::new();
        io::stdin().read_line(&mut input)?;
        
        let trimmed = input.trim().to_ascii_lowercase();
        
        if matches!(trimmed.as_str(), "exit" | "quit" | "bye" | "goodbye") {
            break;
        }

        // Send message to Ollama
        let request = GenerationRequest::new(model.clone(), input.trim().to_string());
        let response = ollama.generate(request).await?;
        
        println!("AI: {}", response.response);
    }
    
    Ok(())
}