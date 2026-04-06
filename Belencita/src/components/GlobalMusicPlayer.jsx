import React, { useState, useEffect } from 'react';
import { useMusic } from '../context/MusicContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Maximize2, 
  Minimize2, 
  Music,
  Share,
  Volume2,
  X,
  Heart
} from 'lucide-react';
import './GlobalMusicPlayer.css';

const GlobalMusicPlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    nextSong, 
    prevSong, 
    progress, 
    currentTime, 
    duration, 
    volume, 
    setVolume, 
    seek,
    isPlayerVisible,
    setIsPlayerVisible
  } = useMusic();
  
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  if (!currentSong || !isPlayerVisible) return null;

  return (
    <motion.div 
      className={`ios-player-container ${isExpanded ? 'expanded' : 'minimized'}`}
      drag
      dragMomentum={false}
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: 1,
        x: '-50%',
        left: '50%',
        bottom: isExpanded ? '150px' : '60px',
        width: 'auto',
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
    >
      <div className="ios-player-glass">
        {/* Dynamic Blurred Background based on song art */}
        <div 
          className="dynamic-bg" 
          style={{ backgroundImage: `url(${currentSong.cover})` }}
        ></div>
        
        <div className="player-body">
          <div className="main-info">
            <motion.div 
              className="album-art-wrapper"
              layout
            >
              <img src={currentSong.cover} alt="Album Art" className="album-art" />
            </motion.div>

            <div className="text-info">
              <motion.h3 className="song-name" layout>{currentSong.title}</motion.h3>
              <motion.p className="artist-name" layout>{currentSong.artist}</motion.p>
            </div>

            {!isExpanded && (
              <div className="mini-controls">
                <button onClick={(e) => { e.stopPropagation(); prevSong(); }}><SkipBack size={18} fill="currentColor" /></button>
                <button className="play-btn-mini" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextSong(); }}><SkipForward size={18} fill="currentColor" /></button>
              </div>
            )}
          </div>

          <div className="player-top-actions">
            <button 
              className="action-btn" 
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Contraer" : "Expandir"}
            >
              {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button 
              className="action-btn close-btn" 
              onClick={() => setIsPlayerVisible(false)}
              title="Cerrar reproductor"
            >
              <X size={18} />
            </button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                className="expanded-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="expanded-left">
                  <div className="scrubber-container" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = ((e.clientX - rect.left) / rect.width) * 100;
                    seek(percent);
                  }}>
                    <div className="scrubber-track">
                      <div className="scrubber-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="time-info">
                      <span>{formatTime(currentTime)}</span>
                      <span>-{formatTime(duration - currentTime)}</span>
                    </div>
                  </div>

                  <div className="main-controls">
                    <div className="secondary-placeholder"></div>
                    <div className="center-controls">
                      <button onClick={prevSong}><SkipBack size={32} fill="currentColor" /></button>
                      <button className="play-btn-large" onClick={togglePlay}>
                        {isPlaying ? <Pause size={44} fill="currentColor" /> : <Play size={44} fill="currentColor" />}
                      </button>
                      <button onClick={nextSong}><SkipForward size={32} fill="currentColor" /></button>
                    </div>
                    <div className="secondary-placeholder"></div>
                  </div>

                  <div className="volume-slider-container">
                    <Volume2 size={16} />
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={volume} 
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="volume-range"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default GlobalMusicPlayer;
