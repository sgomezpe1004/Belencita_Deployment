let audioCtx;

/** Retorna o inicializa el AudioContext usando la API nativa de Audio de JS */
export function getCtx() {
  if (!window.AudioContext && !window.webkitAudioContext) return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Un bloqueador de "desbloqueo" automático al primer clic/tecla
    const unlock = () => {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
          console.log('AudioContext desbloqueado por interacción del usuario 🚀');
          // Si el audio se desbloqueó, removemos los listeners
          window.removeEventListener('click', unlock);
          window.removeEventListener('keydown', unlock);
          window.removeEventListener('touchstart', unlock);
        });
      }
    };
    
    window.addEventListener('click', unlock);
    window.addEventListener('keydown', unlock);
    window.addEventListener('touchstart', unlock);
  }
  return audioCtx;
}

/** Toca un oscilador básico para armar sintetizadores */
function playOsc(ctx, freq, type, time, duration, vol = 0.1, freqEnd = null) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);
  if (freqEnd) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, time + duration);
  }
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(vol, time + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + duration);
}

/** Reproduce un golpe de ruido blanco (para sonidos crujientes como fotos/claquetas) */
function playNoise(ctx, time, duration, vol = 0.1) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  
  noise.connect(gain);
  gain.connect(ctx.destination);
  noise.start(time);
}


let firstCall = true;

export function playTransitionSound(type) {
  const ctx = getCtx();
  if (!ctx) return;

  // Si el audio está suspendido, siempre intentamos resumirlo.
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  // SOLO saltamos el sonido si:
  // 1. Es la primera vez que se llama a esta función (al cargar el sitio).
  // 2. El audio todavía está suspendido (el navegador bloqueó el autoplay).
  // 3. Es el tipo 'home' (para evitar que el cañón de confeti suene tarde).
  if (firstCall && ctx.state === 'suspended' && type === 'home') {
    firstCall = false;
    return;
  }
  
  firstCall = false;

  const t = ctx.currentTime;

  switch (type) {
    case 'gallery':
      // 📸 Camera shutter: "Click-clack" using quick noises and squares
      playOsc(ctx, 4000, 'square', t, 0.05, 0.1);
      playNoise(ctx, t, 0.1, 0.3); // Shutter open
      playNoise(ctx, t + 0.15, 0.08, 0.2); // Shutter close
      playOsc(ctx, 300, 'square', t + 0.15, 0.05, 0.1);
      break;

    case 'history':
      // ❤️ Heartbeat: Two deep bass drum thumps, resting, two more
      playOsc(ctx, 80, 'sine', t, 0.3, 0.8, 30); // Latiendo
      playOsc(ctx, 80, 'sine', t + 0.35, 0.3, 0.6, 30); // Segundo golpe
      playOsc(ctx, 80, 'sine', t + 1.0, 0.3, 0.8, 30);
      playOsc(ctx, 80, 'sine', t + 1.35, 0.3, 0.6, 30);
      break;

    case 'playlist':
      // 🎶 Acordes mágicos (Arpegio C mayor en Synth)
      playOsc(ctx, 523.25, 'triangle', t, 1.0, 0.2);       // C5
      playOsc(ctx, 659.25, 'triangle', t + 0.15, 1.0, 0.2); // E5
      playOsc(ctx, 783.99, 'triangle', t + 0.3, 1.0, 0.2);  // G5
      playOsc(ctx, 1046.50, 'triangle', t + 0.45, 1.5, 0.2);// C6
      // Un eco suave
      playOsc(ctx, 1046.50, 'sine', t + 0.5, 1.5, 0.1);
      break;

    case 'wishes':
      // ⭐ Estrella fugaz: Ascenso de frecuencia continuo muy suave
      playOsc(ctx, 200, 'sine', t, 1.6, 0.4, 2500); 
      playOsc(ctx, 200, 'triangle', t, 1.6, 0.2, 2500); 
      break;

    case 'bloopers':
      // 🎬 Claqueta: Golpe metálico de madera seco
      playNoise(ctx, t, 0.05, 0.5); 
      playOsc(ctx, 150, 'square', t, 0.1, 0.4, 50); // Maderazo
      break;

    case 'ai':
      // 🤖 Robot Scanning: Sonidos digitales tipo sci-fi cortados
      for (let i = 0; i < 18; i++) {
        const rndFreq = 1500 + Math.random() * 2000;
        playOsc(ctx, rndFreq, 'square', t + (i * 0.1), 0.05, 0.04);
      }
      playOsc(ctx, 400, 'sawtooth', t, 1.8, 0.05, 600); // Fondo de drone
      break;

    case 'home':
      // 🎉 Party Cannon Pop & Confetti Spread
      playNoise(ctx, t, 0.15, 0.8); // Pop fuerte!
      playOsc(ctx, 200, 'square', t, 0.1, 0.5, 50); // Low thump
      
      // Trompeta/Matasuegras de fiesta que sube el tono (simula celebración rápida)
      playOsc(ctx, 350, 'sawtooth', t, 0.6, 0.2, 500);
      playOsc(ctx, 450, 'sawtooth', t, 0.6, 0.1, 600);

      // Campanitas de confetti lloviendo
      for (let i = 0; i < 30; i++) {
        const rndFreq = 1500 + Math.random() * 3000;
        playOsc(ctx, rndFreq, 'sine', t + (Math.random() * 1.6), 0.1, 0.05);
      }
      break;
  }
}
