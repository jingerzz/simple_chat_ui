import { openai } from '@ai-sdk/openai';
import { streamText, CoreMessage } from 'ai';

// Simple Ollama wrapper that mimics the interface we need or uses the openai provider with base URL
// Since Ollama is OpenAI compatible, we can use the openai provider!
import { createOpenAI } from '@ai-sdk/openai';

const ollamaProvider = createOpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama', // required but unused
});

export const runtime = 'edge';

import { memMachine } from '@/lib/mem-machine';

export async function POST(req: Request) {
  const { messages, model, useMemory } = await req.json();

  const lastMessage = messages[messages.length - 1];
  let context = '';

  if (useMemory && lastMessage.role === 'user') {
    // Retrieve context
    const memories = await memMachine.retrieveContext(lastMessage.content);
    if (memories.length > 0) {
      context = `\n\nRetrieved Memories:\n${memories.join('\n')}\n\n`;
    }
    
    // Save memory (fire and forget-ish, but await to ensure it happens)
    // In a real app, use a queue or background job.
    await memMachine.addMemory(lastMessage.content);
  }

  // Augment the last message with context if present
  const augmentedMessages = [...messages];
  if (context) {
    // We can prepend context to the last user message
    const lastMsgIndex = augmentedMessages.length - 1;
    augmentedMessages[lastMsgIndex] = {
      ...augmentedMessages[lastMsgIndex],
      content: augmentedMessages[lastMsgIndex].content + context,
    };
  }

  try {
    const modelId = model === 'ollama' ? 'llama3' : 'gpt-4o'; // Default models
    // Allow user to pass specific model string if needed, but UI will send 'ollama' or 'openai' or specific names
    
    let selectedModel;
    if (model.startsWith('ollama')) {
        // Assume model might be 'ollama:llama3'
        const modelName = model.split(':')[1] || 'llama3';
        selectedModel = ollamaProvider(modelName);
    } else {
        selectedModel = openai(model || 'gpt-4o');
    }

    const result = streamText({
      model: selectedModel as any,
      messages: augmentedMessages as CoreMessage[],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat error:', error);
    return new Response('Error processing request', { status: 500 });
  }
}
