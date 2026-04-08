import { useState, useRef, useCallback, useEffect } from 'react';
import './Gallery.css';

/* Background emojis — alternating 📸 and 🎥 */
const BG_EMOJIS = Array.from({ length: 24 }, (_, i) =>
    i % 2 === 0 ? '📸' : '🎥'
);

/* Videos from public/bestie-videos/ */
const GALLERY_VIDEOS = [
    { id: 1, src: '/bestie-videos/WhatsApp Video 2026-04-05 at 3.24.41 AM.mp4' },
    { id: 2, src: '/bestie-videos/WhatsApp Video 2026-04-05 at 3.24.42 AM.mp4' },
    { id: 3, src: '/bestie-videos/WhatsApp Video 2026-04-05 at 3.24.42 AM (1).mp4' },
    { id: 4, src: '/bestie-videos/WhatsApp Video 2026-04-05 at 3.24.42 AM (2).mp4' },
    { id: 5, src: '/bestie-videos/WhatsApp Video 2026-04-05 at 3.24.42 AM (3).mp4' },
    { id: 6, src: '/bestie-videos/WhatsApp Video 2026-04-05 at 3.24.42 AM (4).mp4' },
    { id: 7, src: '/bestie-videos/WhatsApp Video 2026-04-05 at 3.24.42 AM (5).mp4' },
];

/* Curtains for videos */
const CURTAIN_THEMES = [
    { className: 'gcurtain--rose', emoji: '🌹', label: 'Descubre' },
    { className: 'gcurtain--lavender', emoji: '🦋', label: 'Descubre' },
    { className: 'gcurtain--sakura', emoji: '🌸', label: 'Descubre' },
    { className: 'gcurtain--sunset', emoji: '🌅', label: 'Descubre' },
    { className: 'gcurtain--golden', emoji: '✨', label: 'Descubre' },
    { className: 'gcurtain--ocean', emoji: '💎', label: 'Descubre' },
    { className: 'gcurtain--berry', emoji: '🩷', label: 'Descubre' },
];

/* Custom Photo Selection mapping styles for uniform Masonry */
const GALLERY_PHOTOS = [
    { id: 1, src: '/WhatsApp Image 2026-04-01 at 3.55.25 PM.jpeg', rotate: '-2deg', tape: true },
    { id: 2, src: '/belen1.jpeg', rotate: '1deg' },
    { id: 3, src: '/belen2.jpeg', rotate: '3deg' },
    { id: 4, src: '/WhatsApp Image 2026-04-01 at 3.55.26 PM (1).jpeg', rotate: '-1deg' },
    { id: 5, src: '/belen3.jpeg', rotate: '0deg', tape: true },
    { id: 6, src: '/WhatsApp Image 2026-04-01 at 3.55.26 PM (5).jpeg', rotate: '-2deg' },
    { id: 7, src: '/belen5.jpeg', rotate: '1deg', sticker: '✨' },
    { id: 8, src: '/newimagebestie.jpeg', rotate: '0deg' },
    { id: 9, src: '/belen6.jpeg', rotate: '4deg', tape: true },
    { id: 10, src: '/WhatsApp Image 2026-04-01 at 3.55.27 PM (11).jpeg', rotate: '-3deg' },
    { id: 11, src: '/belen7.jpeg', rotate: '1deg' },
    { id: 12, src: '/WhatsApp Image 2026-04-01 at 3.55.27 PM (9).jpeg', rotate: '0deg', sticker: '🦋' },
    { id: 13, src: '/belen8.jpeg', rotate: '2deg' },
    { id: 14, src: '/WhatsApp Image 2026-04-01 at 3.55.27 PM (13).jpeg', rotate: '-1deg', tape: true },
    { id: 15, src: '/belen9.jpeg', rotate: '3deg', sticker: '🩷' },
];

const BABY_PHOTOS = [
    { id: 1, src: '/baby-bestie/WhatsApp Image 2026-04-03 at 12.35.08 AM (1).jpeg', rotate: '-2deg', tape: true },
    { id: 2, src: '/baby-bestie/WhatsApp Image 2026-04-03 at 12.35.08 AM (2).jpeg', rotate: '1deg' },
    { id: 3, src: '/baby-bestie/WhatsApp Image 2026-04-03 at 12.35.08 AM (3).jpeg', rotate: '3deg', sticker: '🧸' },
    { id: 4, src: '/baby-bestie/WhatsApp Image 2026-04-03 at 12.35.08 AM.jpeg', rotate: '-1deg' },
    { id: 5, src: '/baby-bestie/WhatsApp Image 2026-04-03 at 12.35.09 AM (1).jpeg', rotate: '0deg', tape: true },
    { id: 6, src: '/baby-bestie/WhatsApp Image 2026-04-03 at 12.35.09 AM (2).jpeg', rotate: '-2deg' },
    { id: 7, src: '/baby-bestie/WhatsApp Image 2026-04-03 at 12.35.09 AM (3).jpeg', rotate: '1deg', sticker: '🍼' },
    { id: 8, src: '/baby-bestie/WhatsApp Image 2026-04-03 at 12.35.09 AM (4).jpeg', rotate: '0deg' },
    { id: 9, src: '/baby-bestie/WhatsApp Image 2026-04-03 at 12.35.09 AM.jpeg', rotate: '4deg', tape: true },
    { id: 10, src: '/baby-bestie/WhatsApp Image 2026-04-03 at 12.35.10 AM.jpeg', rotate: '-3deg', sticker: '🤍' },
];

export function Gallery() {
    const [tab, setTab] = useState('photos');
    const activePhotos = tab === 'baby' ? BABY_PHOTOS : GALLERY_PHOTOS;
    const [showFact, setShowFact] = useState(false);

    /* Video State */
    const [modalIndex, setModalIndex] = useState(null);
    const [openCurtains, setOpenCurtains] = useState({});
    const modalVideoRef = useRef(null);

    /* Photo State */
    const [photoModalIndex, setPhotoModalIndex] = useState(null);

    /* Video curtain controls */
    const handleCurtainClick = useCallback((id) => setOpenCurtains((prev) => ({ ...prev, [id]: true })), []);

    /* Video Modal controls */
    const openModal = useCallback((index) => setModalIndex(index), []);
    const closeModal = useCallback(() => setModalIndex(null), []);
    const goPrev = useCallback(() => setModalIndex((i) => (i > 0 ? i - 1 : GALLERY_VIDEOS.length - 1)), []);
    const goNext = useCallback(() => setModalIndex((i) => (i < GALLERY_VIDEOS.length - 1 ? i + 1 : 0)), []);

    /* Photo Modal controls */
    const openPhotoModal = useCallback((index) => setPhotoModalIndex(index), []);
    const closePhotoModal = useCallback(() => setPhotoModalIndex(null), []);
    const goPrevPhoto = useCallback(() => setPhotoModalIndex((i) => (i > 0 ? i - 1 : activePhotos.length - 1)), [activePhotos]);
    const goNextPhoto = useCallback(() => setPhotoModalIndex((i) => (i < activePhotos.length - 1 ? i + 1 : 0)), [activePhotos]);

    /* Unified Keyboard controls */
    useEffect(() => {
        if (modalIndex === null && photoModalIndex === null) return;
        const handler = (e) => {
            if (e.key === 'Escape') {
                if (modalIndex !== null) closeModal();
                if (photoModalIndex !== null) closePhotoModal();
            }
            if (e.key === 'ArrowLeft') {
                if (modalIndex !== null) goPrev();
                if (photoModalIndex !== null) goPrevPhoto();
            }
            if (e.key === 'ArrowRight') {
                if (modalIndex !== null) goNext();
                if (photoModalIndex !== null) goNextPhoto();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [modalIndex, photoModalIndex, closeModal, closePhotoModal, goPrev, goNext, goPrevPhoto, goNextPhoto]);

    /* Auto-play modal video */
    useEffect(() => {
        if (modalIndex !== null && modalVideoRef.current) {
            modalVideoRef.current.currentTime = 0;
            modalVideoRef.current.play().catch(() => { });
        }
    }, [modalIndex]);

    return (
        <>
            {/* ─── Floating 📸🎥 background ─── */}
            <div className="gallery-bg-emojis" aria-hidden="true">
                {BG_EMOJIS.map((emoji, i) => (
                    <span key={i} className={`gallery-emoji gallery-emoji--${i + 1}`}>
                        {emoji}
                    </span>
                ))}
            </div>

            <div className="gallery-page">
                {/* Header */}
                <div className="gallery-header">
                    <div className="gallery-badge">📷 Tus Recuerdos 📷</div>
                    <h1>
                        Tu <span className="highlight">Galería</span> 💕
                    </h1>
                    <p className="gallery-subtitle">
                        Las fotos, una obra de arte. Los vídeos, donde te ves más bonita.
                    </p>
                    <button
                        className="gallery-fact-btn"
                        onClick={() => setShowFact(!showFact)}
                    >
                        Dato Curioso 💡
                    </button>
                    {showFact && (
                        <div className="gallery-fact-overlay" onClick={() => setShowFact(false)}>
                            <div className="gallery-fact-modal" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="gallery-fact-close"
                                    onClick={() => setShowFact(false)}
                                    aria-label="Cerrar"
                                >
                                    ✕
                                </button>
                                <h2 className="gallery-fact-text">
                                    Siempre te voy a querer con la edad que tengas, y sin importar cómo te veas, siempre te voy a amar bestie 💕
                                </h2>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tab switcher */}
                <div className="gallery-tabs" role="tablist">
                    <button
                        className={`gallery-tab ${tab === 'photos' ? 'gallery-tab--active' : ''}`}
                        onClick={() => setTab('photos')}
                        role="tab"
                    >
                        <span className="gallery-tab__icon">📸</span>
                        Ahora
                    </button>
                    <button
                        className={`gallery-tab ${tab === 'baby' ? 'gallery-tab--active' : ''}`}
                        onClick={() => setTab('baby')}
                        role="tab"
                    >
                        <span className="gallery-tab__icon">🧸</span>
                        Pequeñita
                    </button>
                    <button
                        className={`gallery-tab ${tab === 'videos' ? 'gallery-tab--active' : ''}`}
                        onClick={() => setTab('videos')}
                        role="tab"
                        aria-selected={tab === 'videos'}
                        id="tab-videos"
                    >
                        <span className="gallery-tab__icon">🎬</span>
                        Videos
                    </button>
                </div>

                {/* Content area */}
                <div className="gallery-content" key={tab}>
                    {(tab === 'photos' || tab === 'baby') ? (
                        /* ─── MASONRY GRID ─── */
                        <div className="art-masonry-grid">
                            {activePhotos.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    className="art-card"
                                    style={{ '--card-rotate': photo.rotate, animationDelay: `${index * 0.08}s` }}
                                    onClick={() => openPhotoModal(index)}
                                >
                                    {/* Stickers and tape outside inner container so they are not clipped */}
                                    {photo.tape && <div className="art-tape"></div>}
                                    {photo.sticker && <div className="art-sticker">{photo.sticker}</div>}

                                    <div className="art-card-inner">
                                        <img src={photo.src} alt={`Bestie ${index + 1}`} loading="lazy" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* ─── Videos grid ─── */
                        <div className="gallery-video-grid">
                            {GALLERY_VIDEOS.map((video, index) => {
                                const theme = CURTAIN_THEMES[index % CURTAIN_THEMES.length];
                                const isOpen = openCurtains[video.id];

                                return (
                                    <div className="gallery-video-card" key={video.id}>
                                        <div className="gallery-video-wrap">
                                            <video
                                                src={video.src}
                                                preload="metadata"
                                                muted
                                                playsInline
                                            />

                                            {/* Click to open in modal (visible after curtain opens) */}
                                            {isOpen && (
                                                <div
                                                    className="gallery-video-play-overlay gallery-video-play-overlay--post"
                                                    onClick={() => openModal(index)}
                                                >
                                                    <span className="gallery-video-play-btn">▶</span>
                                                </div>
                                            )}

                                            {/* ─── Curtain ─── */}
                                            <div
                                                className={`gcurtain ${theme.className} ${isOpen ? 'gcurtain--open' : ''}`}
                                                onClick={() => !isOpen && handleCurtainClick(video.id)}
                                            >
                                                <div className="gcurtain__half gcurtain__left">
                                                    <div className="gcurtain__fabric"></div>
                                                </div>
                                                <div className="gcurtain__half gcurtain__right">
                                                    <div className="gcurtain__fabric"></div>
                                                </div>
                                                {!isOpen && (
                                                    <div className="gcurtain__cta">
                                                        <span className="gcurtain__cta-icon">{theme.emoji}</span>
                                                        <span className="gcurtain__cta-text">{theme.label}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="gallery-video-card-footer">
                                            <span className="gallery-video-number">{video.id}</span>
                                            <span className="gallery-video-label">Video #{video.id}</span>
                                            <span className="gallery-video-emoji">💕</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Fullscreen Photo Modal (Lightbox) ─── */}
            {photoModalIndex !== null && (
                <div
                    className="gallery-modal-backdrop gallery-modal-backdrop--photo"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closePhotoModal();
                    }}
                >
                    <div className="gallery-photo-content">
                        <img
                            key={photoModalIndex}
                            src={activePhotos[photoModalIndex].src}
                            alt={`Memories ${photoModalIndex + 1}`}
                            className="gallery-photo-full"
                        />
                        <button
                            className="gallery-modal-close"
                            onClick={closePhotoModal}
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                        <button
                            className="gallery-modal-nav gallery-modal-prev"
                            onClick={goPrevPhoto}
                            aria-label="Anterior"
                        >
                            ‹
                        </button>
                        <button
                            className="gallery-modal-nav gallery-modal-next"
                            onClick={goNextPhoto}
                            aria-label="Siguiente"
                        >
                            ›
                        </button>
                        <span className="gallery-modal-counter">
                            {photoModalIndex + 1} / {activePhotos.length}
                        </span>
                    </div>
                </div>
            )}

            {/* ─── Fullscreen Video Modal ─── */}
            {modalIndex !== null && (
                <div
                    className="gallery-modal-backdrop"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="gallery-modal-content">
                        <video
                            ref={modalVideoRef}
                            key={GALLERY_VIDEOS[modalIndex].src}
                            src={GALLERY_VIDEOS[modalIndex].src}
                            controls
                            autoPlay
                            playsInline
                        />
                        <button
                            className="gallery-modal-close"
                            onClick={closeModal}
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                        <button
                            className="gallery-modal-nav gallery-modal-prev"
                            onClick={goPrev}
                            aria-label="Anterior"
                        >
                            ‹
                        </button>
                        <button
                            className="gallery-modal-nav gallery-modal-next"
                            onClick={goNext}
                            aria-label="Siguiente"
                        >
                            ›
                        </button>
                        <span className="gallery-modal-counter">
                            {modalIndex + 1} / {GALLERY_VIDEOS.length}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
}

export default Gallery;