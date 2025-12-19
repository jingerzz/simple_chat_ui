# Memory Chat UI

A simple Chat UI that uses OpenAI and Ollama for inferencing, with MemMachine for long-term memory.

## Features

- **Long-term Memory**: Uses MemMachine to store and retrieve past interactions.
- **Model Selection**: Choose between OpenAI (GPT-4o) and local Ollama models.
- **Memory Management**: Toggle memory on/off per chat, and delete all memories.
- **Chat History**: Persists sessions locally in the browser.

## Prerequisites

- Node.js (v18+)
- [Ollama](https://ollama.com/) (running locally)
- MemMachine (running locally)

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Configure Environment:
    Copy `.env.example` to `.env.local` and fill in your keys.
    ```bash
    cp .env.example .env.local
    ```
    
    - `OPENAI_API_KEY`: Your OpenAI API Key.
    - `MEM_MACHINE_URL`: URL where MemMachine is running (default: `http://localhost:8000`).

3.  Run the Development Server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

- **Frontend**: Next.js (App Router), Tailwind CSS, Lucide Icons.
- **Backend**: Next.js API Routes.
- **AI Integration**: Vercel AI SDK (`ai`).
- **Storage**: `localStorage` for chat history, MemMachine for semantic memory.

## Notes

- Ensure Ollama is running (`ollama serve`).
- Ensure MemMachine is running and accessible at the configured URL.
