import React, { useMemo } from 'react';
import './GlobalBackground.css';

const GlobalBackground = () => {
  const emojis = ['🩷', '✨', '🦋', '🎵', '🌸', '💐', '🌈', '💎'];
  
  // Generate 40 random emojis with random positions and animation properties
  const floatingElements = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * (32 - 14) + 14}px`,
      duration: `${Math.random() * (25 - 12) + 12}s`,
      delay: `${Math.random() * 10}s`,
      opacity: Math.random() * (0.3 - 0.1) + 0.1
    }));
  }, []);

  return (
    <div className="global-background">
      <div className="mesh-gradient"></div>
      <div className="emoji-layer">
        {floatingElements.map((el) => (
          <span
            key={el.id}
            className="floating-emoji"
            style={{
              left: el.left,
              top: el.top,
              fontSize: el.size,
              animationDuration: el.duration,
              animationDelay: el.delay,
              opacity: el.opacity
            }}
          >
            {el.emoji}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GlobalBackground;
