'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from 'ai';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';

interface Session {
  id: string;
  title: string;
  messages: Message[];
  date: string;
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('openai:gpt-4o');
  const [useMemory, setUseMemory] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) {
          setCurrentSessionId(parsed[0].id);
        } else {
            createNewSession();
        }
      } catch (e) {
        console.error("Failed to parse sessions", e);
        createNewSession();
      }
    } else {
      createNewSession();
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('chat_sessions', JSON.stringify(sessions));
    }
  }, [sessions, isLoaded]);

  const createNewSession = () => {
    const newSession: Session = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      date: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
  };

  const handleDeleteMemory = async () => {
    if (confirm('Are you sure you want to clear your long-term memory? This cannot be undone.')) {
      try {
        await fetch('/api/memory', { method: 'DELETE' });
        alert('Memory cleared successfully.');
      } catch (error) {
        alert('Failed to clear memory.');
      }
    }
  };

  const handleMessagesChange = (newMessages: Message[]) => {
    if (!currentSessionId) return;

    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === currentSessionId) {
          // Update title based on first message if it's "New Chat"
          let title = session.title;
          if (session.title === 'New Chat' && newMessages.length > 0) {
            title = newMessages[0].content.slice(0, 30) + (newMessages[0].content.length > 30 ? '...' : '');
          }
          return { ...session, messages: newMessages, title };
        }
        return session;
      })
    );
  };

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  if (!isLoaded) return null; // or loading spinner

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={createNewSession}
        onDeleteMemory={handleDeleteMemory}
      />
      <main className="flex-1">
        {currentSessionId && (
            <ChatArea
                key={currentSessionId} // Force remount on session change to reset useChat
                sessionId={currentSessionId}
                initialMessages={currentSession?.messages || []}
                onMessagesChange={handleMessagesChange}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                useMemory={useMemory}
                onUseMemoryChange={setUseMemory}
            />
        )}
      </main>
    </div>
  );
}
