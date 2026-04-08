import { useState, useEffect, useCallback } from 'react';
import './OurHistory.css';

/* ──────────────────────────────────────────────
   Data — Sequences
   ────────────────────────────────────────────── */

const sequences = [
  {
    id: 1,
    title: 'Todo inició aquí',
    image: '/teamspic.png',
    butterflyDirection: 'fly-right',
    paragraphs: [
      'Nosotros nos conocimos en el año 2021, era pandemia, y las clases eran virtuales. Recuerdo que hacíamos llamadas en Microsoft Teams, y también las clases eran por ahí.',
      'Tu eras nueva en el colegio y llegaste al mismo salón en el que estaba yo.',
      'Yo tenía dificultades para biología, en ese entonces el tema principal era genética, y tu lograste que yo entendiera el tema, gracias bestie 🩷.',
    ],
    highlight:
      'Y así fue como todo inició... ya después te cambiaste a 9°A y no nos volvimos a hablar hasta septiembre de 2025.',
    date: '2021 — Pandemia',
  },
  {
    id: 2,
    title: 'Cómo todo volvió a comenzar',
    image: '/notelike.png',
    butterflyDirection: 'fly-up',
    paragraphs: [
      'Todo volvió a iniciar cuando le empezaste a dar like a las notas que yo ponía en Instagram (de canciones).',
      'Eso quería decir que tenemos gustos por la música muy similares. 🎶',
      'Y así fue como empezamos a hablar de nuevo... Porque.',
    ],
    highlight: 'La música fue lo que nos conectó de nuevo.',
    date: 'Septiembre 2025',
  },
  {
    id: 3,
    title: 'El día que lo cambió todo',
    image: '/igchat.png',
    butterflyDirection: 'fly-diagonal',
    paragraphs: [
      'Le diste like a muchas más canciones, y yo después de tanto esperar y de perder el miedo de escribirte, me decidí a escribirte.',
      'Y cuando te escribí fue que empezamos a hablar de verdad.',
    ],
    highlight:
      'Entonces hicimos una promesa: no dejarnos de hablar. 💕',
    date: '18 de septiembre de 2025 — 5:03 PM',
  },
  {
    id: 4,
    title: 'De amigos a besties',
    image: '/currentconversation.png',
    butterflyDirection: 'fly-left-spiral',
    paragraphs: [
      'Y así fue como pasamos de ser solo amigos a ser besties. No nos despegamos, esa fue la clave de todo.',
      'Desde ahí te he acompañado en tus buenos y malos momentos.',
      'Te he ayudado en cada uno de los momentos en los que he podido, y tú a mí.',
      'Actualmente seguimos hablando y tenemos una muy bonita amistad.',
    ],
    highlight: 'Eres mi bestie y te amo. 🩷',
    date: 'Hoy y siempre',
  },
];

/* ──────────────────────────────────────────────
   Sound Effects (Web Audio API)
   ────────────────────────────────────────────── */

function getAudioContext() {
  if (!getAudioContext._ctx) {
    getAudioContext._ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return getAudioContext._ctx;
}

// Magical sparkle chime — for intro
function playIntroSound() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5 E5 G5 C6 E6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.7);
    });
  } catch (e) { /* Audio not supported */ }
}

// Soft ascending whoosh — for next
function playNextSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);

    // Add a subtle high shimmer
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(800, ctx.currentTime + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.3);
    gain2.gain.setValueAtTime(0.06, ctx.currentTime + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.05);
    osc2.stop(ctx.currentTime + 0.45);
  } catch (e) { /* Audio not supported */ }
}

// Gentle descending tone — for previous
function playPrevSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);

    // Soft low undertone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(500, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.25);
    gain2.gain.setValueAtTime(0.05, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.35);
  } catch (e) { /* Audio not supported */ }
}

/* ──────────────────────────────────────────────
   Component
   ────────────────────────────────────────────── */

export function OurHistory() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardVisible, setCardVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeDirection, setActiveDirection] = useState('');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (started) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setOverlayVisible(true), 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setOverlayVisible(false);
    }
  }, [started]);

  // Show card after mounting or navigating
  useEffect(() => {
    if (started && !showIntro) {
      const timer = setTimeout(() => setCardVisible(true), 150);
      return () => clearTimeout(timer);
    }
  }, [started, currentIndex, showIntro]);

  const handleStart = () => {
    playIntroSound();
    setShowIntro(true);
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      setShowIntro(false);
      setStarted(true);
    }, 3000);
  };

  const handleEnd = () => {
    setCardVisible(false);
    setTimeout(() => {
      setShowFinalMessage(true);
      playIntroSound();
    }, 500);
  };

  const closeEverything = () => {
    setShowFinalMessage(false);
    setOverlayVisible(false);
    setTimeout(() => {
      setStarted(false);
      setCurrentIndex(0);
    }, 500);
  };

  const navigateTo = useCallback(
    (newIndex) => {
      if (newIndex < 0 || newIndex >= sequences.length || isTransitioning) return;

      // Play appropriate sound
      if (newIndex > currentIndex) {
        playNextSound();
      } else {
        playPrevSound();
      }

      const direction = sequences[newIndex].butterflyDirection;

      setCardVisible(false);
      setIsTransitioning(true);
      setActiveDirection(direction);

      setTimeout(() => {
        setCurrentIndex(newIndex);
        setTimeout(() => {
          setIsTransitioning(false);
          setActiveDirection('');
          setCardVisible(true);
        }, 600);
      }, 1000);
    },
    [isTransitioning, currentIndex]
  );

  const goNext = () => navigateTo(currentIndex + 1);
  const goPrev = () => navigateTo(currentIndex - 1);

  const current = sequences[currentIndex];
  const isLastSequence = currentIndex === sequences.length - 1;

  return (
    <div className="history-page">
      {/* Decorative background */}
      <div className="history-decor" aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => (
          <span key={`h${i}`} className="decor-heart">
            {['💗', '💖', '💕', '♡', '🩷', '🩵', '🦋', '💗', '🌸', '💖'][i % 10]}
          </span>
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <span key={`s${i}`} className="decor-sparkle">
            {['✨', '🌸', '🦋', '💫', '🌺', '⭐', '🌷', '✨', '🦋', '💫'][i]}
          </span>
        ))}
      </div>

      {/* Header */}
      <div className="history-header">
        <div className="history-badge">💕 Nuestra Historia 💕</div>
        <h1>Cómo todo comenzó</h1>
        <p>
          Cada amistad tiene una historia bonita que contar. Esta es la nuestra
          — y todo empezó con una clase de biología. 🧬
        </p>
      </div>

      {/* Start Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          className="history-start-btn"
          onClick={handleStart}
          id="btn-load-sequence"
        >
          <span className="btn-butterfly">🦋</span>
          <span>Cargar Secuencia</span>
        </button>
      </div>

      {/* ═══ INTRO ANIMATION ═══ */}
      {showIntro && (
        <div className="intro-burst">
          {/* Central glow */}
          <div className="intro-glow" />
          {/* Burst particles */}
          {Array.from({ length: 40 }, (_, i) => {
            const emojis = ['🦋', '💗', '💖', '🌸', '✨', '💕', '🩷', '🌺', '💫', '🦋', '♡', '🌷'];
            return (
              <span
                key={i}
                className={`intro-particle intro-particle--${i + 1}`}
              >
                {emojis[i % emojis.length]}
              </span>
            );
          })}
          {/* Central text */}
          <div className="intro-text">
            <span className="intro-text-line">💕</span>
            <span className="intro-text-main">Nuestra Historia</span>
            <span className="intro-text-line">💕</span>
          </div>
        </div>
      )}

      {/* ═══ FULLSCREEN OVERLAY ═══ */}
      {started && (
        <div className={`sequence-overlay ${overlayVisible ? 'open' : ''}`}>
          {/* Overlay decorative elements — butterflies, hearts, flowers */}
          <div className="overlay-decor" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => {
              const emojis = ['🦋', '🦋', '💗', '🦋', '🌸', '🦋', '💕', '🦋', '✨', '🦋', '🩷', '🦋', '🌺', '🦋'];
              return (
                <span key={i} className={`overlay-fly overlay-fly--${i + 1}`}>
                  {emojis[i]}
                </span>
              );
            })}
          </div>

          {/* Giant Butterfly Transition */}
          <div className={`butterfly-transition ${isTransitioning ? 'active' : ''}`}>
            {isTransitioning && (
              <>
                <span className={`giant-butterfly ${activeDirection}`}>🦋</span>
                <span className="trail-butterfly">🦋</span>
                <span className="trail-butterfly">🦋</span>
                <span className="trail-butterfly">🦋</span>
              </>
            )}
          </div>

          {/* Overlay scrollable content */}
          <div className="overlay-content">
            {/* Close / progress bar */}
            <div className="overlay-top-bar">
              <div className="overlay-progress">
                <div
                  className="overlay-progress-fill"
                  style={{ width: `${((currentIndex + 1) / sequences.length) * 100}%` }}
                />
              </div>
              <span className="overlay-counter">
                {currentIndex + 1} / {sequences.length}
              </span>
            </div>

            {/* Card */}
            <div className={`sequence-card ${cardVisible ? 'visible' : ''}`}>
              <div className="sequence-card-inner">
                <div className="sequence-header">
                  <div className="sequence-number">{current.id}</div>
                  <h2 className="sequence-title">{current.title}</h2>
                </div>

                <div className="sequence-body">
                  <div className="sequence-image-section">
                    <div
                      className="sequence-image-wrapper"
                      onClick={() => setLightboxOpen(true)}
                    >
                      <img
                        className="sequence-image"
                        src={current.image}
                        alt={current.title}
                        loading="eager"
                      />
                    </div>
                    <button
                      className="view-image-btn"
                      onClick={() => setLightboxOpen(true)}
                      id="btn-view-image"
                    >
                      🔍 Ver imagen
                    </button>
                  </div>

                  <div className="sequence-text">
                    {current.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}

                    {current.highlight && (
                      <div className="sequence-highlight">
                        {current.highlight}
                      </div>
                    )}

                    {current.date && (
                      <div className="sequence-date">
                        📅 {current.date}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="sequence-nav">
              <button
                className="nav-btn nav-btn--prev"
                onClick={goPrev}
                disabled={currentIndex === 0 || isTransitioning}
                id="btn-prev-sequence"
              >
                <span className="nav-arrow">←</span>
                <span>Anterior</span>
              </button>

              {!isLastSequence ? (
                <button
                  className="nav-btn nav-btn--next"
                  onClick={goNext}
                  disabled={isTransitioning}
                  id="btn-next-sequence"
                >
                  <span>Siguiente</span>
                  <span className="nav-arrow">→</span>
                </button>
              ) : (
                <button
                  className="nav-btn nav-btn--end"
                  onClick={handleEnd}
                  id="btn-end-sequence"
                >
                  <span>Terminar Secuencia</span>
                  <span className="nav-arrow">🩷</span>
                </button>
              )}
            </div>

            {/* Dot indicators */}
            <div className="sequence-dots">
              {sequences.map((seq, i) => (
                <button
                  key={seq.id}
                  className={`sequence-dot ${i === currentIndex ? 'active' : ''}`}
                  onClick={() => navigateTo(i)}
                  disabled={isTransitioning}
                  aria-label={`Ir a secuencia ${seq.id}`}
                />
              ))}
            </div>
          </div>

          {/* Lightbox */}
          {lightboxOpen && (
            <div
              className="lightbox-overlay"
              onClick={() => setLightboxOpen(false)}
            >
              <button
                className="lightbox-close"
                onClick={() => setLightboxOpen(false)}
                aria-label="Cerrar imagen"
              >
                ✕
              </button>
              <img
                className="lightbox-image"
                src={current.image}
                alt={current.title}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* ═══ MENSAJE FINAL ═══ */}
          {showFinalMessage && (
            <div className="final-message-overlay">
              <div className="final-message-content">
                <div className="fm-glow" />
                <div className="fm-sparkles" aria-hidden="true">
                  {Array.from({ length: 30 }, (_, i) => {
                    const emojis = ['✨', '🌸', '🦋', '💖', '💫', '💕'];
                    return (
                      <span key={i} className={`fm-sparkle fm-sparkle--${i + 1}`}>
                        {emojis[i % emojis.length]}
                      </span>
                    );
                  })}
                </div>
                <div className="fm-card">
                  <h2 className="fm-title">
                    ¡Espera! <span className="fm-title-emoji">💕</span>
                  </h2>
                  <p className="fm-text">
                    Recuerda que eres la mejor bestie del mundo, eres hermosa, preciosa,
                    y tienes un corazón super noble y bonito, mereces todo lo más bonito
                    que existe en el mundo, te amo.
                  </p>
                  <button className="fm-close-btn" onClick={closeEverything}>
                    Te amo más 🩷
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}