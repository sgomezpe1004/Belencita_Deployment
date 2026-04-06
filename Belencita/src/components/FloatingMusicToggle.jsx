import React from 'react';
import { useMusic } from '../context/MusicContext';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Music } from 'lucide-react';
import './FloatingMusicToggle.css';

const FloatingMusicToggle = () => {
    const { isPlaying, isPlayerVisible, setIsPlayerVisible, currentSong } = useMusic();
    const location = useLocation();

    // List of paths where the toggle should appear
    const allowedPaths = ['/', '/our-history', '/gallery', '/belencita-ai', '/wishes'];
    
    // Logic: Only show if music is playing, player is hidden, and we're on a requested page
    const shouldShow = isPlaying && !isPlayerVisible && allowedPaths.includes(location.pathname) && currentSong;

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.button
                    className="floating-music-toggle"
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                    whileHover={{ 
                        scale: 1.05, 
                        background: "rgba(232, 121, 168, 0.25)",
                        borderColor: "rgba(232, 121, 168, 0.5)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlayerVisible(true)}
                >
                    <div className="toggle-content">
                        <div className="music-icon-wrapper">
                            <Music size={18} className="rotating-music-icon" />
                        </div>
                        <span>Abrir Reproductor</span>
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default FloatingMusicToggle;
