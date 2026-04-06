import { useEffect, useState } from 'react';
import './Wishes.css';

const WISHES = [
    { id: 1, text: "Quiero que seas inmensamente feliz, cada segundo de tu maravillosa vida.", icon: "🥰" },
    { id: 2, text: "Quiero que cumplas absolutamente todos tus sueños.", icon: "✨" },
    { id: 3, text: "Quiero que seas súper exitosa en todo lo que te propongas lograr.", icon: "🌟" },
    { id: 4, text: "Deseo que la vida te devuelva multiplicado todo el amor tan bonito que das.", icon: "💖" },
    { id: 5, text: "Que nunca te falten motivos para sonreír, celebrar y sentirte orgullosa de quién eres.", icon: "🥂" },
    { id: 6, text: "Que siempre te rodees de personas que valoren la increíble luz que aportas a este mundo.", icon: "🌻" },
    { id: 7, text: "Deseo que nuestra amistad siga creciendo por toda la eternidad, y que estemos juntos para celebrar todos tus triunfos.", icon: "♾️" },
    { id: 8, text: "Deseo que encuentres paz y tranquilidad en tu corazón aún en los momentos difíciles.", icon: "🕊️" },
    { id: 9, text: "Que la salud, la abundancia y la prosperidad nunca te falten.", icon: "🍀" }
];

export function Wishes() {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        // Generar mariposas y corazones aleatorios para el fondo de forma estable (evita hydration errors si hubiera SSR)
        const newElements = Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            emoji: i % 3 === 0 ? "🦋" : (i % 2 === 0 ? "💖" : "✨"),
            left: `${Math.random() * 100}%`,
            animationDuration: `${15 + Math.random() * 20}s`,
            animationDelay: `-${Math.random() * 15}s`,
            scale: 0.6 + Math.random() * 0.8
        }));
        setElements(newElements);
    }, []);

    return (
        <div className="wishes-page">
            <div className="wishes-background">
                {elements.map(el => (
                    <span
                        key={el.id}
                        className="wish-float-item"
                        style={{
                            left: el.left,
                            animationDuration: el.animationDuration,
                            animationDelay: el.animationDelay,
                            transform: `scale(${el.scale})`
                        }}
                    >
                        {el.emoji}
                    </span>
                ))}
            </div>

            <div className="wishes-content">
                <h1 className="wishes-title">✨ Mis Deseos Para Ti ✨</h1>

                <div className="wishes-grid">
                    {WISHES.map((wish, i) => (
                        <div key={wish.id} className="wish-card" style={{ animationDelay: `${i * 0.15}s` }}>
                            <div className="wish-icon">{wish.icon}</div>
                            <p className="wish-text">{wish.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}