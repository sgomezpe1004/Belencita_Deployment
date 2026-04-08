import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { playTransitionSound, getCtx } from './SoundEffects';
import './RouteTransition.css';

export default function RouteTransition() {
  const location = useLocation();
  const [anim, setAnim] = useState({ active: false, type: '' });
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  // Usamos un ref para ignorar el primer render si es en la raíz (evitar el backlog de sonido)
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const path = location.pathname;

    let type = '';
    if (path === '/') type = 'home';
    else if (path === '/our-history') type = 'history';
    else if (path === '/gallery') type = 'gallery';
    else if (path === '/belencita-ai') type = 'ai';
    else if (path === '/playlist') type = 'playlist';
    else if (path === '/wishes') type = 'wishes';
    else if (path === '/bloopers') type = 'bloopers';

    if (type) {
      setAnim({ active: false, type: '' });
      setShowConfetti(false);
      setIsClosing(false);

      const triggerTimeout = setTimeout(() => {
        setAnim({ active: true, type });
        // Solo sonar auto si no es home o si ya está desbloqueado
        if (type !== 'home' || getCtx()?.state === 'running') {
          playTransitionSound(type);
          // Si estamos en home y ya hay audio (vuelta atrás), tiramos confeti auto
          if (type === 'home') setShowConfetti(true);
        }
      }, 10);

      // Si es 'home', MANDATORIO QUE NO SE QUITE SÓLO.
      if (type !== 'home') {
        const endTimeout = setTimeout(() => {
          setAnim({ active: false, type: '' });
        }, 2100);

        return () => {
          clearTimeout(triggerTimeout);
          clearTimeout(endTimeout);
        };
      }

      return () => clearTimeout(triggerTimeout);
    }
  }, [location.pathname]);

  const handleFinishHome = () => {
    setIsClosing(true);
    // 0.8s es lo que dura la animación 'rt-fade-out' en CSS
    setTimeout(() => {
      setAnim({ active: false, type: '' });
      setIsClosing(false);
    }, 800);
  };

  if (!anim.active) return null;

  return (
    <div className={`rt-overlay rt-${anim.type} ${isClosing ? 'rt-exit-active' : ''}`}>

      {/* INICIO: Animación super bonita "Feliz Cumpleaños" con Confetti */}
      {anim.type === 'home' && (
        <div className="rt-home-stage">
          {showConfetti && (
            <div className="rt-confetti-container">
              {Array.from({ length: 30 }).map((_, i) => {
                const bgColors = ['#ff8da1', '#ffc0cb', '#feca57', '#48dbfb', '#1dd1a1', '#fff'];
                const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
                return (
                  <div
                    key={i}
                    className="rt-confetti-piece"
                    style={{
                      '--bg': randomBg,
                      '--rand-x': `${(Math.random() - 0.5) * 100}vw`,
                      '--rand-y': `${(Math.random() - 0.5) * 100}vh`,
                      '--rand-r': `${Math.random() * 720}deg`,
                      '--delay': `${Math.random() * 0.2}s`
                    }}
                  />
                );
              })}
            </div>
          )}

          <div className="rt-happy-bday-card">
            <h2 className="rt-hb-title">
              <span className="rt-hb-word hb-highlight">¡Feliz Cumpleaños Bestie!</span>
            </h2>

            {/* Si ya estamos cerrando, no mostramos botones para evitar parpadeos */}
            {!isClosing && (
              <>
                {getCtx()?.state === 'suspended' ? (
                  <button
                    className="rt-unlock-btn"
                    onClick={() => {
                      getCtx().resume().then(() => {
                        playTransitionSound('home');
                        setShowConfetti(true);
                        handleFinishHome();
                      });
                    }}
                  >
                    Abrir Regalo 🎁
                  </button>
                ) : (
                  <div className="rt-home-actions">
                    <p className="rt-hb-subtitle">✨ Que hoy sea el mejor día de todos ✨</p>
                    <button
                      className="rt-unlock-btn"
                      onClick={() => {
                        playTransitionSound('home');
                        setShowConfetti(true);
                        handleFinishHome();
                      }}
                    >
                      Entrar ✨
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Si estamos cerrando, mostramos un mensajito final en lugar de botones */}
            {isClosing && <p className="rt-hb-subtitle">🌟 ¡Aquí vamos! 🌟</p>}
          </div>
        </div>
      )}

      {/* NUESTRA HISTORIA: Corazón latiendo */}
      {anim.type === 'history' && (
        <div className="rt-history-stage">
          <div className="rt-heart-glow"></div>
          <div className="rt-heart">❤️</div>
        </div>
      )}

      {/* BELENCITA AI: Avatar que cambia caras mágicamente */}
      {anim.type === 'ai' && (
        <div className="rt-ai-stage">
          <div className="rt-ai-avatar-container">
            <div className="rt-ai-ring"></div>
            <div className="rt-ai-avatar"></div>
          </div>
          <div className="rt-ai-scan">Escaneando memorias...</div>
        </div>
      )}

      {/* GALERÍA: Efecto visual de lente y gran flashazo blanco */}
      {anim.type === 'gallery' && (
        <>
          <div className="rt-lens-top"></div>
          <div className="rt-lens-bottom"></div>
          <div className="rt-flash"></div>
        </>
      )}

      {/* PLAYLIST: Un fondo difuminado y la nota musical gigante resonando */}
      {anim.type === 'playlist' && (
        <div className="rt-music-stage">
          <div className="rt-soundwave x1"></div>
          <div className="rt-soundwave x2"></div>
          <div className="rt-note">🎵</div>
        </div>
      )}

      {/* DESEOS: Una enorme estrella fugaz atravesando en diagonal */}
      {anim.type === 'wishes' && (
        <div className="rt-star-stage">
          <div className="rt-star">⭐</div>
          <div className="rt-trail"></div>
        </div>
      )}

      {/* BLOOPERS: Una gran claqueta cayendo en el centro "¡Acción!" */}
      {anim.type === 'bloopers' && (
        <div className="rt-bloopers-stage">
          <div className="rt-clapperboard">🎬</div>
        </div>
      )}
    </div>
  );
}
