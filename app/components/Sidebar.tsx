import React from 'react';
import { Plus, MessageSquare, Trash2, Database } from 'lucide-react';
import { cn } from '@/lib/utils'; // I need to create this

interface SidebarProps {
  sessions: { id: string; title: string; date: string }[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteMemory: () => void;
}

export function Sidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteMemory,
}: SidebarProps) {
  return (
    <div className="flex h-full w-[260px] flex-col bg-gray-900 text-white p-4">
      <button
        onClick={onNewChat}
        className="mb-4 flex w-full items-center gap-2 rounded-md border border-white/20 p-3 text-sm transition-colors hover:bg-gray-800"
      >
        <Plus className="h-4 w-4" />
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto">
        <div className="mb-2 text-xs font-medium text-gray-500">History</div>
        <div className="flex flex-col gap-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={cn(
                'flex items-center gap-2 rounded-md p-3 text-sm transition-colors',
                session.id === currentSessionId
                  ? 'bg-gray-800'
                  : 'hover:bg-gray-800'
              )}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="truncate">{session.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-white/20 pt-4">
        <button
          onClick={onDeleteMemory}
          className="flex w-full items-center gap-2 rounded-md p-3 text-sm text-red-400 hover:bg-gray-800"
        >
          <Database className="h-4 w-4" />
          Delete All Memories
        </button>
      </div>
    </div>
  );
}
