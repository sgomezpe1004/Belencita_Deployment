import React, { useState } from 'react';
import { useMusic } from './context/MusicContext';
import { Play, Pause, Search, Clock, Filter, Sparkles, User, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Playlist.css';

const Playlist = () => {
    const { playlist, playSong, currentSong, isPlaying, togglePlay, setIsPlayerVisible } = useMusic();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArtist, setSelectedArtist] = useState('Todos');

    const artists = ['Todos', 'Blessd', 'Anuel AA', 'Kris R', 'Silvestre Dangond'];

    const filteredPlaylist = playlist.filter(song => {
        const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesArtist = selectedArtist === 'Todos' || song.artist === selectedArtist;
        return matchesSearch && matchesArtist;
    });

    return (
        <motion.div
            className="page-container playlist-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="playlist-header-modern">
                <motion.div
                    className="playlist-header-content"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="playlist-cover-art">
                        <img src="/beautifulbestie.jpeg" alt="Playlist Cover" />
                    </div>
                    <div className="playlist-text">
                        <h4><Sparkles size={14} style={{ marginRight: 6 }} /> PLAYLIST</h4>
                        <h1>Los 19 De <span className="highlight">Beléncita</span></h1>
                        <p>
                            <strong>Belencita Hernández</strong> • {playlist.length} canciones
                        </p>
                    </div>
                </motion.div>
            </div>

            <div className="playlist-controls-bar">
                <div className="main-play-actions">
                    <motion.button
                        className="play-all-btn"
                        onClick={() => {
                            if (currentSong) {
                                togglePlay();
                            } else {
                                playSong(playlist[0]);
                            }
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isPlaying ? <Pause fill="black" size={24} /> : <Play fill="black" size={24} />}
                    </motion.button>

                    <motion.button
                        className="open-mini-player-btn"
                        onClick={() => setIsPlayerVisible(true)}
                        whileHover={{ scale: 1.05, background: "rgba(232, 121, 168, 0.2)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Layout size={18} /> Mini Reproductor
                    </motion.button>
                </div>

                <div className="playlist-filters">
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar canciones..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="artist-pills">
                        {artists.map(artist => (
                            <button
                                key={artist}
                                className={`artist-pill ${selectedArtist === artist ? 'active' : ''}`}
                                onClick={() => setSelectedArtist(artist)}
                            >
                                {artist}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <motion.div
                className="glass-widget-container ultra-blur"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="song-list-container">
                    <div className="song-list-header">
                        <span className="col-index">#</span>
                        <span className="col-title">Título</span>
                        <span className="col-artist-header"><User size={16} /> Artista</span>
                        <span className="col-time"><Clock size={16} /></span>
                    </div>

                    <div className="song-list-body">
                        <AnimatePresence mode='popLayout'>
                            {filteredPlaylist.length > 0 ? (
                                filteredPlaylist.map((song, index) => (
                                    <motion.div
                                        key={song.id}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className={`song-row ${currentSong?.id === song.id ? 'active' : ''}`}
                                        onClick={() => playSong(song)}
                                    >
                                        <div className="col-index">
                                            {currentSong?.id === song.id && isPlaying ? (
                                                <div className="playing-bars">
                                                    <span></span><span></span><span></span>
                                                </div>
                                            ) : (
                                                index + 1
                                            )}
                                        </div>

                                        <div className="col-title">
                                            <img src={song.cover} alt={song.title} className="small-cover" />
                                            <div className="song-meta">
                                                <span className={`row-title ${currentSong?.id === song.id ? 'highlight-text' : ''}`}>
                                                    {song.title}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="col-artist">
                                            {song.artist}
                                        </div>

                                        <div className="col-time">
                                            {song.duration}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="no-results"
                                >
                                    No se encontraron canciones
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Playlist;