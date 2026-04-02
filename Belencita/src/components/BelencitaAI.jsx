import { useState, useEffect } from 'react';
import { Sparkles, Send } from 'lucide-react';
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
  const [message, setMessage] = useState('');

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

  return (
    <div className="belencita-ai">
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
          ✨ Tu asistente personal que sabe lo especial que eres ✨
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

      {/* Chat Section */}
      <div className="ai-chat">
        {/* Background butterflies */}
        <div className="ai-chat__butterflies" aria-hidden="true">
          <span className="ai-chat__fly ai-chat__fly--1">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--2">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--3">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--4">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--5">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--6">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--7">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--8">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--9">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--10">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--11">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--12">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--13">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--14">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--15">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--16">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--17">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--18">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--19">🦋</span>
          <span className="ai-chat__fly ai-chat__fly--20">🦋</span>
        </div>

        <div className="ai-chat__messages">
          <div className="ai-message ai-message--bot">
            <div className="ai-message__avatar">
              <img src={avatarPhotos[currentPhoto]} alt="" />
            </div>
            <div className="ai-message__bubble">
              <p>¡Hola Bestie linda! 🩷 Soy Beléncita AI, y estoy aquí para recordarte lo increíble que eres. ¿Qué te gustaría saber?</p>
            </div>
          </div>
        </div>

        <div className="ai-chat__input-area">
          <div className="ai-chat__input-wrapper">
            <input
              type="text"
              className="ai-chat__input"
              placeholder="Escríbele algo bonito a Belén..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && message.trim()) {
                  // Backend not connected yet
                  setMessage('');
                }
              }}
            />
            <button
              className="ai-chat__send"
              disabled={!message.trim()}
              aria-label="Enviar mensaje"
            >
              <Send size={18} strokeWidth={2} />
            </button>
          </div>
          <p className="ai-chat__hint">
            El backend de Beléncita AI se conectará pronto 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
