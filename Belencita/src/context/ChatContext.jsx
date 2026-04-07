import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

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

function getTime() {
  return new Date().toLocaleTimeString('es-ES');
}

export function ChatProvider({ children }) {
  const { user } = useUser();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Load sessions from backend when user logs in
  useEffect(() => {
    if (!user) return;
    
    const fetchSessions = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/sessions/${user.id}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const formattedSessions = data.map(dbSession => ({
            id: dbSession.sessionId,
            title: dbSession.sessionName || 'Chat nuevo ✨',
            messages: dbSession.messages && dbSession.messages.length ? dbSession.messages : [DEFAULT_WELCOME],
            createdAt: dbSession.date ? new Date(dbSession.date).toLocaleString('es-ES') : getTimestamp(),
            updatedAt: dbSession.time || getTimestamp()
          }));
          setSessions(formattedSessions);
          setActiveSessionId(formattedSessions[0].id);
        } else {
          // No sessions on backend yet, create a default one
          const newId = generateSessionId();
          const defaultSession = {
            id: newId,
            title: 'Chat nuevo ✨',
            messages: [DEFAULT_WELCOME],
            createdAt: getTimestamp(),
            updatedAt: getTimestamp()
          };
          setSessions([defaultSession]);
          setActiveSessionId(newId);
          // Save this default session to DB
          await saveSessionToDb(defaultSession);
        }
      } catch (err) {
        console.error('Error fetching sessions:', err);
      }
    };
    
    fetchSessions();
  }, [user]);

  const saveSessionToDb = async (sessionData) => {
    if (!user) return;
    try {
      await fetch(`${apiUrl}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          sessionId: sessionData.id,
          sessionName: sessionData.title,
          messages: sessionData.messages,
          time: sessionData.updatedAt
        })
      });
    } catch (err) {
      console.error('Error saving session:', err);
    }
  };

  // Get current session
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Update messages for the active session
  const setMessages = useCallback((updater) => {
    setSessions(prev => {
      const updatedSessions = prev.map(s => {
        if (s.id !== activeSessionId) return s;
        const newMessages = typeof updater === 'function' ? updater(s.messages) : updater;
        
        let title = s.title;
        if (title === 'Chat nuevo ✨') {
          const firstUserMsg = newMessages.find(m => m.role === 'user');
          if (firstUserMsg) {
            title = firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '…' : '');
          }
        }
        
        const updatedSession = {
          ...s,
          messages: newMessages,
          title,
          updatedAt: getTime()
        };
        
        // Save to backend asynchronously
        saveSessionToDb(updatedSession);
        
        return updatedSession;
      });
      return updatedSessions;
    });
  }, [activeSessionId, user]);

  // Create new session
  const createNewSession = useCallback(() => {
    const id = generateSessionId();
    const newSession = {
      id,
      title: 'Chat nuevo ✨',
      messages: [DEFAULT_WELCOME],
      createdAt: getTimestamp(),
      updatedAt: getTime()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(id);
    saveSessionToDb(newSession);
  }, [user]);

  // Switch to a session
  const switchSession = useCallback((sessionId) => {
    setActiveSessionId(sessionId);
  }, []);

  // Delete a session
  const deleteSession = useCallback(async (sessionId) => {
    if (!user) return;
    
    // Optimistic update
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (sessionId === activeSessionId) {
        if (filtered.length === 0) {
          const id = generateSessionId();
          const fresh = {
            id,
            title: 'Chat nuevo ✨',
            messages: [DEFAULT_WELCOME],
            createdAt: getTimestamp(),
            updatedAt: getTime()
          };
          setActiveSessionId(id);
          saveSessionToDb(fresh);
          return [fresh];
        }
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });

    try {
      await fetch(`${apiUrl}/api/sessions/${sessionId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  }, [activeSessionId, user]);

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
