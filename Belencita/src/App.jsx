import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import BelencitaAI from './components/BelencitaAI';

import './App.css';

function HomePage() {
  const [curtainOpen, setCurtainOpen] = useState(false);

  return (
    <>
      {/* Full-page background butterflies */}
      <div className="home-butterflies" aria-hidden="true">
        {Array.from({ length: 50 }, (_, i) => (
          <span key={i} className={`home-fly home-fly--${i + 1}`}>🦋</span>
        ))}
      </div>

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
            <p>Revive los momentos que cambiaron todo en nuestras vidas</p>
          </div>
          <div className="hero-card">
            <span className="hero-card__emoji">🥰</span>
            <h3>Beléncita AI</h3>
            <p>La inteligencia artificial que te dirá todo lo que significas para mi</p>
          </div>
          <div className="hero-card">
            <span className="hero-card__emoji">🎵</span>
            <h3>Playlist</h3>
            <p>Lo que nos volvió a unir, y lo que te voy a agradecer por toda la vida</p>
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

function PlaceholderPage({ title, emoji, description }) {
  return (
    <div className="page-container">
      <span className="page-emoji">{emoji}</span>
      <h1>{title}</h1>
      <p className="subtitle">{description}</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SignedOut>
        <div className="auth-page">
          <div className="home-butterflies" aria-hidden="true">
            {Array.from({ length: 30 }, (_, i) => (
              <span key={i} className={`home-fly home-fly--${i + 1}`}>🦋</span>
            ))}
          </div>
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

        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/nosotras"
              element={
                <PlaceholderPage
                  title="Nuestra historia"
                  emoji="💕"
                  description="Nuestra historia de amistad"
                />
              }
            />
            <Route
              path="/galeria"
              element={
                <PlaceholderPage
                  title="Galería"
                  emoji="📸"
                  description="Una obra de arte para ti"
                />
              }
            />
            <Route
              path="/mensajes"
              element={<BelencitaAI />}
            />
            <Route
              path="/playlist"
              element={
                <PlaceholderPage
                  title="Playlist"
                  emoji="🎶"
                  description="Lo que nos volvió a unir, y lo que te voy a agradecer por toda la vida"
                />
              }
            />
            <Route
              path="/deseos"
              element={
                <PlaceholderPage
                  title="Deseos"
                  emoji="⭐"
                  description="Mis deseos para ti"
                />
              }
            />
          </Routes>
        </main>
      </SignedIn>
    </BrowserRouter>
  );
}

export default App;
