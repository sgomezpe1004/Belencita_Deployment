import { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Plus, Clock, Trash2, ArrowLeft, MessageCircle } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import './BelencitaAI.css';

const avatarPhotos = [
  '/belen1.jpeg',
  '/belen2.jpeg',
  '/belen3.jpeg',
  '/belen5.jpeg',
  '/belen6.jpeg',
  '/belen7.jpeg',
  '/belen8.jpeg',
  '/belen9.jpeg',
];

export default function BelencitaAI() {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    sessions,
    activeSession,
    activeSessionId,
    messages,
    setMessages,
    createNewSession,
    switchSession,
    deleteSession
  } = useChat();

  // Mantener los emojis estables generándolos una sola vez al cargar la página
  const [bgEmojis] = useState(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const emojis = ['🌸', '🎀', '💖', '✨', '🌷', '💕', '🥰', '💅'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      return {
        id: i,
        emoji: randomEmoji,
        style: {
          '--x': `${Math.random() * 100}vw`,
          '--duration': `${15 + Math.random() * 20}s`,
          '--delay': `-${Math.random() * 20}s`,
          '--scale': `${0.5 + Math.random() * 0.8}`
        }
      };
    });
  });

  // Rotate avatar photos every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPhoto((prev) => (prev + 1) % avatarPhotos.length);
        setIsTransitioning(false);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    
    // Añadir mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = [...messages, { role: 'user', content: userText }]
        .map(m => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          content: m.content
        }));

      const apiUrl = import.meta.env.VITE_API_URL || 'https://belencita-deployment.onrender.com';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userText,
          history: conversationHistory
        }),
      });

      const data = await response.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
      } else {
        throw new Error('Sin respuesta');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: '¡Ay, bestie! 💖 Algo se desconectó un momento, pero recuerda que te quiero muchísimo. ¿Me lo vuelves a decir? ✨' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    createNewSession();
    setShowSessions(false);
  };

  const handleSelectSession = (sessionId) => {
    switchSession(sessionId);
    setShowSessions(false);
  };

  return (
    <div className="belencita-ai">
      {/* Background feminine decorations */}
      <div className="ai-bg-decorations" aria-hidden="true">
        {bgEmojis.map((item) => (
          <span
            key={item.id}
            className="ai-bg-emoji"
            style={item.style}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Avatar Section — Centered at top */}
      <div className="ai-avatar-section">
        <div className="ai-avatar-ring">
          <div className="ai-avatar-ring__glow" />
          <div className="ai-avatar-ring__sparkle ai-avatar-ring__sparkle--1">✦</div>
          <div className="ai-avatar-ring__sparkle ai-avatar-ring__sparkle--2">♡</div>
          <div className="ai-avatar-ring__sparkle ai-avatar-ring__sparkle--3">✧</div>
          <div className="ai-avatar-ring__sparkle ai-avatar-ring__sparkle--4">✦</div>

          <div className={`ai-avatar ${isTransitioning ? 'ai-avatar--fade' : ''}`}>
            <img
              src={avatarPhotos[currentPhoto]}
              alt="Beléncita"
              className="ai-avatar__img"
            />
          </div>

          {/* Online indicator */}
          <div className="ai-avatar-ring__status">
            <Sparkles size={12} strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="ai-title">Beléncita AI</h1>
        <p className="ai-subtitle">
          ✨ Sé lo hermosa y preciosa que eres ✨
        </p>

        {/* Photo dots indicator */}
        <div className="ai-dots">
          {avatarPhotos.map((_, i) => (
            <button
              key={i}
              className={`ai-dot ${i === currentPhoto ? 'ai-dot--active' : ''}`}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentPhoto(i);
                  setIsTransitioning(false);
                }, 400);
              }}
              aria-label={`Ver foto ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Session Action Buttons */}
      <div className="ai-session-actions">
        <button className="ai-session-btn ai-session-btn--new" onClick={handleNewChat}>
          <Plus size={16} strokeWidth={2.5} />
          <span>Nuevo Chat</span>
        </button>
        <button 
          className={`ai-session-btn ai-session-btn--history ${showSessions ? 'ai-session-btn--active' : ''}`} 
          onClick={() => setShowSessions(!showSessions)}
        >
          <Clock size={16} strokeWidth={2.5} />
          <span>Sesiones</span>
          {sessions.length > 1 && (
            <span className="ai-session-btn__badge">{sessions.length}</span>
          )}
        </button>
      </div>

      {/* Sessions Panel (Slide-in overlay) */}
      <div className={`ai-sessions-panel ${showSessions ? 'ai-sessions-panel--open' : ''}`}>
        <div className="ai-sessions-panel__header">
          <button className="ai-sessions-panel__back" onClick={() => setShowSessions(false)}>
            <ArrowLeft size={18} />
          </button>
          <h2>Tus Sesiones</h2>
          <button className="ai-sessions-panel__new" onClick={handleNewChat}>
            <Plus size={18} />
          </button>
        </div>
        <div className="ai-sessions-panel__list">
          {sessions.map(session => (
            <div 
              key={session.id}
              className={`ai-session-item ${session.id === activeSessionId ? 'ai-session-item--active' : ''}`}
              onClick={() => handleSelectSession(session.id)}
            >
              <div className="ai-session-item__icon">
                <MessageCircle size={16} />
              </div>
              <div className="ai-session-item__info">
                <span className="ai-session-item__title">{session.title}</span>
                <span className="ai-session-item__meta">
                  {session.messages.length - 1} mensajes · {session.updatedAt}
                </span>
              </div>
              {sessions.length > 1 && (
                <button 
                  className="ai-session-item__delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  aria-label="Eliminar sesión"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="ai-chat">
        {/* Background butterflies */}
        <div className="ai-chat__butterflies" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className={`ai-chat__fly ai-chat__fly--${i + 1}`}>🦋</span>
          ))}
        </div>

        <div className="ai-chat__messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`ai-message ai-message--${msg.role}`}>
              {msg.role === 'bot' && (
                <div className="ai-message__avatar">
                  <img src={avatarPhotos[currentPhoto]} alt="" />
                </div>
              )}
              <div className="ai-message__bubble">
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message ai-message--bot">
              <div className="ai-message__avatar">
                <img src={avatarPhotos[currentPhoto]} alt="" />
              </div>
              <div className="ai-message__bubble ai-message__bubble--loading">
                <div className="ai-typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat__input-area">
          <div className="ai-chat__input-wrapper">
            <input
              type="text"
              className="ai-chat__input"
              placeholder="Escríbele algo bonito a Belén..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              disabled={isLoading}
            />
            <button
              className="ai-chat__send"
              disabled={!inputMessage.trim() || isLoading}
              onClick={handleSendMessage}
              aria-label="Enviar mensaje"
            >
              <Send size={18} strokeWidth={2} />
            </button>
          </div>
          <p className="ai-chat__hint">
            Beléncita AI está lista para escucharte 💖
          </p>
        </div>
      </div>
    </div>
  );
}
