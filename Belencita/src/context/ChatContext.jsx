import { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

const DEFAULT_WELCOME = {
  role: 'bot',
  content: '¡Hola Bestie linda! 🩷 Soy Beléncita AI, y estoy aquí para recordarte lo maravillosa, hermosa y preciosa que eres. ¿Qué te gustaría saber?'
};

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getTimestamp() {
  return new Date().toLocaleString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function ChatProvider({ children }) {
  // All sessions: { id, title, messages[], createdAt, updatedAt }
  const [sessions, setSessions] = useState(() => {
    const id = generateSessionId();
    return [{
      id,
      title: 'Chat nuevo ✨',
      messages: [DEFAULT_WELCOME],
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    }];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => sessions[0]?.id);

  // Get current session
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Update messages for the active session
  const setMessages = useCallback((updater) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;
      const newMessages = typeof updater === 'function' ? updater(s.messages) : updater;
      // Auto-generate title from first user message
      let title = s.title;
      if (title === 'Chat nuevo ✨') {
        const firstUserMsg = newMessages.find(m => m.role === 'user');
        if (firstUserMsg) {
          title = firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '…' : '');
        }
      }
      return {
        ...s,
        messages: newMessages,
        title,
        updatedAt: getTimestamp()
      };
    }));
  }, [activeSessionId]);

  // Create new session
  const createNewSession = useCallback(() => {
    const id = generateSessionId();
    const newSession = {
      id,
      title: 'Chat nuevo ✨',
      messages: [DEFAULT_WELCOME],
      createdAt: getTimestamp(),
      updatedAt: getTimestamp()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(id);
  }, []);

  // Switch to a session
  const switchSession = useCallback((sessionId) => {
    setActiveSessionId(sessionId);
  }, []);

  // Delete a session
  const deleteSession = useCallback((sessionId) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      // If we deleted the active session, switch to the first one
      if (sessionId === activeSessionId) {
        if (filtered.length === 0) {
          // Create a fresh session if all are deleted
          const id = generateSessionId();
          const fresh = {
            id,
            title: 'Chat nuevo ✨',
            messages: [DEFAULT_WELCOME],
            createdAt: getTimestamp(),
            updatedAt: getTimestamp()
          };
          setActiveSessionId(id);
          return [fresh];
        }
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeSessionId]);

  return (
    <ChatContext.Provider value={{
      sessions,
      activeSession,
      activeSessionId,
      messages: activeSession?.messages || [DEFAULT_WELCOME],
      setMessages,
      createNewSession,
      switchSession,
      deleteSession
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
