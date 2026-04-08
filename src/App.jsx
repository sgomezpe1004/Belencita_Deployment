import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import BelencitaAI from './components/BelencitaAI';
import { OurHistory } from './OurHistory';
import { Bloopers } from './Bloopers';
import { Gallery } from './Gallery';
import { Wishes } from './Wishes';
import Playlist from './Playlist';
import RouteTransition from './RouteTransition';
import { MusicProvider } from './context/MusicContext';
import { ChatProvider } from './context/ChatContext';
import GlobalMusicPlayer from './components/GlobalMusicPlayer';
import GlobalBackground from './components/GlobalBackground';
import FloatingMusicToggle from './components/FloatingMusicToggle';

import './App.css';

function HomePage() {
  const [curtainOpen, setCurtainOpen] = useState(false);

  return (
    <>
      <div className="page-container">
        <div className="welcome-badge">✨ Feliz Cumpleaños Bestie ✨</div>
        <h1>
          Para ti, <span className="highlight">Beléncita</span> 🩷
        </h1>
        <p className="subtitle">
          Este es un rinconcito especial hecho con mucho amor para celebrar
          el día más bonito del año — ¡tu cumpleaños!
        </p>

        <div className="hero-cards">
          <div className="hero-card">
            <span className="hero-card__emoji">💐</span>
            <h3>Nuestra Historia</h3>
            <p>La historia de esta amistad tan bonita, la mejor amistad que he tenido en toda mi vida</p>
          </div>
          <div className="hero-card">
            <span className="hero-card__emoji">🥰</span>
            <h3>Beléncita AI</h3>
            <p>La inteligencia artificial que te dirá todo lo que significas para mi</p>
          </div>
          <div className="hero-card">
            <span className="hero-card__emoji">🎵</span>
            <h3>Playlist</h3>
            <p>Lo que nos volvió a unir</p>
          </div>
          <div className="hero-card">
            <span className="hero-card__emoji">📸</span>
            <h3>Galería</h3>
            <p>Tus fotos y vídeos donde te ves más bonita</p>
          </div>
          <div className="hero-card">
            <span className="hero-card__emoji">⭐</span>
            <h3>Deseos</h3>
            <p>Mis deseos más bonitos para ti en este día tan especial</p>
          </div>
          <div className="hero-card">
            <span className="hero-card__emoji">🤣</span>
            <h3>Bloopers</h3>
            <p>Mis bloopers haciendo el vídeo, para que te rías un rato</p>
          </div>
          <div className={`hero-card hero-card--video ${curtainOpen ? 'curtain-opened' : ''}`}>
            <div className="video-stage">
              {/* The iframe lives behind the curtains */}
              <div className="video-frame">
                {curtainOpen && (
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/BuQSv57wOiE"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                )}
              </div>

              {/* Curtain overlay */}
              <div
                className={`curtain-overlay ${curtainOpen ? 'curtain-overlay--open' : ''}`}
                onClick={() => setCurtainOpen(true)}
              >
                <div className="curtain-half curtain-left">
                  <div className="curtain-fabric"></div>
                </div>
                <div className="curtain-half curtain-right">
                  <div className="curtain-fabric"></div>
                </div>
                {!curtainOpen && (
                  <div className="curtain-cta">
                    <span className="curtain-cta__icon">▶</span>
                    <span className="curtain-cta__text">Toca para ver</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SignedOut>
        <div className="auth-page">
          <GlobalBackground />
          <div className="auth-container">
            <h1 className="auth-title">Beléncita 🩷</h1>
            <p className="auth-subtitle">Un rinconcito especial hecho con amor</p>
            <SignIn
              appearance={{
                elements: {
                  rootBox: { width: '100%' },
                  card: {
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 200, 220, 0.3)',
                    borderRadius: '24px',
                    boxShadow: '0 8px 32px rgba(200, 120, 170, 0.12)',
                  },
                  headerTitle: { color: '#4a2040' },
                  headerSubtitle: { color: '#8c6585' },
                  formButtonPrimary: {
                    background: 'linear-gradient(135deg, #e879a8, #b06cc2)',
                    borderRadius: '12px',
                  },
                },
              }}
            />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <MusicProvider>
          <ChatProvider>
          <GlobalBackground />
          <RouteTransition />
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/our-history"
                element={<OurHistory />}
              />
              <Route
                path="/gallery"
                element={<Gallery />}
              />
              <Route
                path="/belencita-ai"
                element={<BelencitaAI />}
              />
              <Route
                path="/playlist"
                element={<Playlist />}
              />
              <Route
                path="/wishes"
                element={<Wishes />}
              />
              <Route
                path="/bloopers"
                element={<Bloopers />}
              />
            </Routes>
          </main>
          <GlobalMusicPlayer />
          <FloatingMusicToggle />
          </ChatProvider>
        </MusicProvider>
      </SignedIn>
    </BrowserRouter>
  );
}

export default App;
