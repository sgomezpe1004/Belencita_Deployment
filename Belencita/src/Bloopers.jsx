import { useState, useRef, useCallback, useEffect } from 'react';
import './Bloopers.css';

/* All blooper videos from public/bloopers-videos/ */
const bloopers = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    src: `/bloopers-videos/blooper${i + 1}.mp4`,
}));

/* Alternating emojis for background */
const BG_EMOJIS = Array.from({ length: 30 }, (_, i) =>
    i % 2 === 0 ? '😂' : '🤡'
);

/* Alternating emojis for card labels */
const CARD_EMOJIS = ['😂', '🤡'];

/* Curtain emojis — scattered 🤡 and 😂 on each curtain */
const CURTAIN_SCATTER = [
    ['🤡', '😂', '🤡', '😂', '🤡', '😂'],
    ['😂', '🤡', '😂', '🤡', '😂', '🤡'],
    ['🤡', '😂', '🤡', '😂', '🤡', '😂'],
    ['😂', '🤡', '😂', '🤡', '😂', '🤡'],
    ['🤡', '😂', '🤡', '😂', '🤡', '😂'],
    ['😂', '🤡', '😂', '🤡', '😂', '🤡'],
];

export function Bloopers() {
    const [modalIndex, setModalIndex] = useState(null);
    const [openCurtains, setOpenCurtains] = useState({});
    const videoRefs = useRef({});
    const modalVideoRef = useRef(null);

    /* Open a curtain */
    const handleCurtainClick = useCallback((id) => {
        setOpenCurtains((prev) => ({ ...prev, [id]: true }));
    }, []);

    /* Open fullscreen modal */
    const openModal = useCallback((index) => {
        Object.values(videoRefs.current).forEach((v) => v && v.pause());
        setModalIndex(index);
    }, []);

    const closeModal = useCallback(() => {
        setModalIndex(null);
    }, []);

    const goPrev = useCallback(() => {
        setModalIndex((i) => (i > 0 ? i - 1 : bloopers.length - 1));
    }, []);

    const goNext = useCallback(() => {
        setModalIndex((i) => (i < bloopers.length - 1 ? i + 1 : 0));
    }, []);

    /* Keyboard controls for modal */
    useEffect(() => {
        if (modalIndex === null) return;
        const handler = (e) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [modalIndex, closeModal, goPrev, goNext]);

    /* Auto-play modal video when index changes */
    useEffect(() => {
        if (modalIndex !== null && modalVideoRef.current) {
            modalVideoRef.current.currentTime = 0;
            modalVideoRef.current.play().catch(() => { });
        }
    }, [modalIndex]);

    return (
        <>
            {/* ─── Floating 😂🤡 background ─── */}
            <div className="bloopers-bg-emojis" aria-hidden="true">
                {BG_EMOJIS.map((emoji, i) => (
                    <span key={i} className={`bloopers-emoji bloopers-emoji--${i + 1}`}>
                        {emoji}
                    </span>
                ))}
            </div>

            <div className="bloopers-page">
                {/* Header */}
                <div className="bloopers-header">
                    <div className="bloopers-badge">🎬 Tras Cámara 🎬</div>
                    <h1>
                        Los <span className="highlight">Bloopers</span> 🤣
                    </h1>
                    <p className="bloopers-subtitle">
                        Todos los momentos graciosos detrás de cámaras mientras hacía tu
                        video — ¡espero que te mueras de la risa!
                    </p>
                </div>

                {/* Video grid */}
                <div className="bloopers-grid">
                    {bloopers.map((blooper, index) => {
                        const isOpen = openCurtains[blooper.id];
                        const emojis = CURTAIN_SCATTER[index % CURTAIN_SCATTER.length];

                        return (
                            <div className="blooper-card" key={blooper.id}>
                                <div className="blooper-video-wrap">
                                    <video
                                        ref={(el) => (videoRefs.current[blooper.id] = el)}
                                        src={blooper.src}
                                        preload="metadata"
                                        loop
                                        muted
                                        playsInline
                                    />

                                    {/* Play button after curtain opens */}
                                    {isOpen && (
                                        <div
                                            className="blooper-play-overlay"
                                            onClick={() => openModal(index)}
                                        >
                                            <span className="blooper-play-btn">▶</span>
                                        </div>
                                    )}

                                    {/* ─── Emoji Curtain ─── */}
                                    <div
                                        className={`bcurtain ${isOpen ? 'bcurtain--open' : ''}`}
                                        onClick={() => !isOpen && handleCurtainClick(blooper.id)}
                                    >
                                        <div className="bcurtain__half bcurtain__left">
                                            <div className="bcurtain__fabric"></div>
                                            <div className="bcurtain__emojis" aria-hidden="true">
                                                {emojis.slice(0, 3).map((e, j) => (
                                                    <span key={j} className={`bcurtain__emoji bcurtain__emoji--${j + 1}`}>{e}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bcurtain__half bcurtain__right">
                                            <div className="bcurtain__fabric"></div>
                                            <div className="bcurtain__emojis" aria-hidden="true">
                                                {emojis.slice(3, 6).map((e, j) => (
                                                    <span key={j} className={`bcurtain__emoji bcurtain__emoji--${j + 4}`}>{e}</span>
                                                ))}
                                            </div>
                                        </div>
                                        {!isOpen && (
                                            <div className="bcurtain__cta">
                                                <span className="bcurtain__cta-icon">🤡</span>
                                                <span className="bcurtain__cta-text">Toca para ver</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="blooper-card-footer">
                                    <span className="blooper-number">{blooper.id}</span>
                                    <span className="blooper-label">Blooper #{blooper.id}</span>
                                    <span className="blooper-emoji-label">
                                        {CARD_EMOJIS[index % 2]}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ─── Fullscreen Modal ─── */}
            {modalIndex !== null && (
                <div
                    className="blooper-modal-backdrop"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="blooper-modal-content">
                        <video
                            ref={modalVideoRef}
                            key={bloopers[modalIndex].src}
                            src={bloopers[modalIndex].src}
                            controls
                            autoPlay
                            playsInline
                            loop
                        />
                        <button
                            className="blooper-modal-close"
                            onClick={closeModal}
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                        <button
                            className="blooper-modal-nav blooper-modal-prev"
                            onClick={goPrev}
                            aria-label="Anterior"
                        >
                            ‹
                        </button>
                        <button
                            className="blooper-modal-nav blooper-modal-next"
                            onClick={goNext}
                            aria-label="Siguiente"
                        >
                            ›
                        </button>
                        <span className="blooper-modal-counter">
                            {modalIndex + 1} / {bloopers.length}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
}

export default Bloopers;