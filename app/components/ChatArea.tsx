import React, { useRef, useEffect } from 'react';
import { useChat, Message } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { Send, User, Bot, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatAreaProps {
  initialMessages?: Message[];
  sessionId: string;
  onMessagesChange?: (messages: Message[]) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  useMemory: boolean;
  onUseMemoryChange: (use: boolean) => void;
}

export function ChatArea({
  initialMessages = [],
  sessionId,
  onMessagesChange,
  selectedModel,
  onModelChange,
  useMemory,
  onUseMemoryChange,
}: ChatAreaProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages,
    body: {
      model: selectedModel,
      useMemory,
    },
    onFinish: (message) => {
        // We can't easily get the full array here in the exact moment, but `messages` will update.
        // However, onFinish gives the assistant message.
        // We rely on the effect below to sync messages up.
    },
    id: sessionId, // helps useChat manage SWR cache
  });

  // Sync messages back to parent for persistence
  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col h-screen max-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header / Settings */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="font-semibold">Chat Session</div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <label className="text-gray-500">Model:</label>
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              className="rounded border border-gray-300 dark:border-gray-700 bg-transparent px-2 py-1"
            >
              <option value="openai:gpt-4o">OpenAI (GPT-4o)</option>
              <option value="ollama:llama3">Ollama (Llama 3)</option>
              <option value="ollama:mistral">Ollama (Mistral)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useMemory}
                onChange={(e) => onUseMemoryChange(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Use Memory</span>
            </label>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-gray-400">
            Start a conversation...
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'flex gap-4 p-4 rounded-lg',
              m.role === 'user'
                ? 'bg-gray-100 dark:bg-gray-900'
                : 'bg-white dark:bg-gray-950'
            )}
          >
            <div className="mt-1 flex-shrink-0">
              {m.role === 'user' ? (
                <div className="bg-blue-500 p-1 rounded-full text-white">
                    <User size={16} />
                </div>
              ) : (
                <div className="bg-green-500 p-1 rounded-full text-white">
                    <Bot size={16} />
                </div>
              )}
            </div>
            <div className="flex-1 prose dark:prose-invert max-w-none">
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex gap-4 p-4">
                <div className="mt-1 flex-shrink-0">
                   <div className="bg-green-500 p-1 rounded-full text-white">
                        <Bot size={16} />
                   </div>
                </div>
                <div className="flex-1">
                    <span className="animate-pulse">Thinking...</span>
                </div>
            </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl flex gap-2"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
