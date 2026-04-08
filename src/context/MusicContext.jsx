import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

const PLAYLIST = [
  // Blessd
  { id: 1, title: 'BUENOS DIAS', artist: 'Blessd', cover: '/music-covers/buenos-dias.png', url: '/music/BUENOS DIAS BLESSD ❌ ANUEL AA ❌ KRIS R ❌ GEEZYDEE ❌ YOUNG FATTY ❌\u2003CARABIN3 ❌TURY - SIEMPRE BLESSD 💙 (128k).mp3', duration: '4:56' },
  { id: 2, title: 'YOGURCITO REMIX', artist: 'Blessd', cover: '/music-covers/yogurcito.jpg', url: '/music/💕🧃 YOGURCITO REMIX BLESSD ❌ ANUEL AA ❌ YAN BLOCK ❌ LUAR LA L ❌ ROA ❌ KRIS R ( VIDEO OFICIAL ) - SIEMPRE BLESSD 💙 (128k).mp3', duration: '6:15' },
  { id: 3, title: 'CONDENADO AL EXITO III', artist: 'Blessd', cover: '/music-covers/trinidadbendita.jpg', url: '/music/CONDENADO AL EXITO III - SIEMPRE BLESSD 💙 (128k).mp3', duration: '3:08' },
  { id: 4, title: 'CUANDO', artist: 'Blessd', cover: '/music-covers/trinidadbendita.jpg', url: '/music/CUANDO - Blessd (Audio Oficial) - The Johan Music (128k).mp3', duration: '3:11' },
  { id: 5, title: 'PALABRAS SOBRAN - REMIX', artist: 'Blessd', cover: '/music-covers/palabrasobran.jpg', url: '/music/Palabras Sobran Remix - Blessd, Ryan Castro, Bryant Myers, Hades 66 - LatinHype (128k).mp3', duration: '4:48' },
  { id: 6, title: 'Que Duro', artist: 'Blessd', cover: '/music-covers/queduro.jpg', url: '/music/Blessd - Que Duro (Audio Oficial) - Temazos de Reggaeton & Trap (128k).mp3', duration: '3:24' },

  // Anuel AA
  { id: 7, title: 'Leyenda', artist: 'Anuel AA', cover: '/music-covers/llnm.png', url: '/music/Anuel AA - Leyenda LETRA - Status Music (128k).mp3', duration: '3:40' },
  { id: 8, title: 'Súbelo', artist: 'Anuel AA', cover: '/music-covers/llnm.png', url: '/music/Anuel AA Ft Jhay Cortez & Myke Towers - Súbelo [Audio Oficial] - Temazos de Reggaeton & Trap (128k).mp3', duration: '3:59' },
  { id: 9, title: 'Mercedes Tintia', artist: 'Anuel AA', cover: '/music-covers/mercedestintia.jpg', url: '/music/Anuel AA - Mercedes Tintia (Audio Oficial) - Temazos de Reggaeton & Trap (128k).mp3', duration: '3:15' },
  { id: 10, title: 'Bandolera', artist: 'Anuel AA', cover: '/music-covers/rhlm.jpg', url: '/music/Anuel AA - Bandolera - Anuel AA (128k).mp3', duration: '3:10' },
  { id: 11, title: 'Tú no lo amas', artist: 'Anuel AA', cover: '/music-covers/rhlm.jpg', url: '/music/Anuel AA - Tu No Lo Amas - Anuel AA (128k).mp3', duration: '3:34' },
  { id: 12, title: 'Amanece', artist: 'Anuel AA', cover: '/music-covers/amanece.jpg', url: '/music/Anuel AA & Haze AMANECE - Anuel AA (128k).mp3', duration: '3:11' },

  // Kris R
  { id: 13, title: 'MIL D AURA', artist: 'Kris R', cover: '/music-covers/trapdekolombia.jpg', url: '/music/Kris R - MIL D AURA (Cover Audio) - Warner Música (128k).mp3', duration: '3:23' },
  { id: 14, title: 'PASIÓN Y SEXO', artist: 'Kris R', cover: '/music-covers/trapdekolombia.jpg', url: '/music/KRIS R, ROA - PASIÓN Y SEXO (lyricsletra) - Música UP! (128k).mp3', duration: '3:34' },

  // Silvestre Dangond
  { id: 15, title: 'Cásate Conmigo', artist: 'Silvestre Dangond', cover: '/music-covers/intruso.jpg', url: '/music/Silvestre Dangond, Nicky Jam - Cásate Conmigo (Letra Lyrics) - Musica Milagrosa (128k).mp3', duration: '3:29' },
  { id: 16, title: 'Despierto', artist: 'Silvestre Dangond', cover: '/music-covers/despierto.jpg', url: '/music/Despierto, Silvestre Dangond & Juancho De La Espriella - Audio - Silvestre Dangond (128k).mp3', duration: '4:07' },
  { id: 17, title: 'Materialista', artist: 'Silvestre Dangond', cover: '/music-covers/materialista.jpg', url: '/music/Materialista - Silvestre Dangond & Nicky Jam Cover Audio - NickyJamTV (128k).mp3', duration: '3:10' },
  { id: 18, title: 'Muchachita Bonita', artist: 'Silvestre Dangond', cover: '/music-covers/muchachabonita.jpg', url: '/music/Muchachita Bonita - Silvestre Dangond Y Juancho De La Espriella - tvvallenatos (128k).mp3', duration: '4:30' },
  { id: 19, title: 'Justicia', artist: 'Silvestre Dangond', cover: '/music-covers/intruso.jpg', url: '/music/Silvestre Dangond, NATTI NATASHA - Justicia (Official Lyric Video) - Silvestre Dangond (128k).mp3', duration: '3:29' },
];

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7); // 70% default volume
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const onEnded = () => {
      nextSong();
    };

    const onLoadMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onLoadMetadata);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onLoadMetadata);
    };
  }, [currentSong, volume]);

  const playSong = (song) => {
    setIsPlayerVisible(true);
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      setCurrentSong(song);
      audioRef.current.src = song.url;
      audioRef.current.play().catch(err => console.log("Audio play error (likely missing file):", err));
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (audioRef.current.paused) {
      setIsPlayerVisible(true);
      audioRef.current.play().catch(err => console.log("Audio play error:", err));
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const nextSong = () => {
    if (!currentSong) return;
    const currentIndex = PLAYLIST.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % PLAYLIST.length;
    playSong(PLAYLIST[nextIndex]);
  };

  const prevSong = () => {
    if (!currentSong) return;
    const currentIndex = PLAYLIST.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    playSong(PLAYLIST[prevIndex]);
  };

  const seek = (percent) => {
    const newTime = (percent / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(percent);
  };

  const setVolume = (value) => {
    setVolumeState(value);
    audioRef.current.volume = value;
  };

  return (
    <MusicContext.Provider value={{
      currentSong,
      isPlaying,
      progress,
      currentTime,
      duration,
      volume,
      playSong,
      togglePlay,
      nextSong,
      prevSong,
      seek,
      setVolume,
      isPlayerVisible,
      setIsPlayerVisible,
      playlist: PLAYLIST
    }}>
      {children}
    </MusicContext.Provider>
  );
};
