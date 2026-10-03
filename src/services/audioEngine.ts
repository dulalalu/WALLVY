// Web Audio API Engine for Ringtones, Notifications, and Music Visualizer

let audioCtx: AudioContext | null = null;
let currentSource: AudioNode | null = null;
let analyserNode: AnalyserNode | null = null;
let isPlaying = false;
let currentTrackId: string | null = null;
let currentTimer: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function getAudioAnalyser(): AnalyserNode {
  const ctx = getAudioContext();
  if (!analyserNode) {
    analyserNode = ctx.createAnalyser();
    analyserNode.fftSize = 128;
    analyserNode.smoothingTimeConstant = 0.8;
  }
  return analyserNode;
}

export function stopAudio() {
  if (currentTimer) {
    window.clearTimeout(currentTimer);
    currentTimer = null;
  }
  if (currentSource) {
    try {
      (currentSource as AudioBufferSourceNode).stop();
    } catch {
      // ignore if already stopped
    }
    currentSource = null;
  }
  isPlaying = false;
  currentTrackId = null;
}

export function isAudioPlaying(id?: string): boolean {
  if (id) {
    return isPlaying && currentTrackId === id;
  }
  return isPlaying;
}

export interface SoundStyleOptions {
  bpm?: number;
  scale?: number[];
  waveform?: OscillatorType;
  duration?: number;
}

// Preset melodies for synthesized ringtones
const MELODIES: Record<string, { notes: number[]; waveform: OscillatorType; tempo: number }> = {
  cyberpunk: {
    notes: [220, 220, 330, 220, 440, 392, 330, 293, 220, 261, 330, 392, 440, 523],
    waveform: 'sawtooth',
    tempo: 140,
  },
  aurora: {
    notes: [329.63, 392.00, 493.88, 587.33, 659.25, 587.33, 493.88, 392.00],
    waveform: 'sine',
    tempo: 90,
  },
  marimba: {
    notes: [523.25, 659.25, 783.99, 1046.50, 783.99, 659.25, 880.00, 1046.50],
    waveform: 'triangle',
    tempo: 130,
  },
  lofi: {
    notes: [261.63, 329.63, 392.00, 493.88, 392.00, 329.63, 261.63],
    waveform: 'triangle',
    tempo: 80,
  },
  neon_pulse: {
    notes: [440, 554.37, 659.25, 880, 659.25, 554.37, 440, 329.63],
    waveform: 'square',
    tempo: 125,
  },
  zen_bell: {
    notes: [432, 540, 648, 864],
    waveform: 'sine',
    tempo: 60,
  },
  tech_radar: {
    notes: [800, 1200, 1600, 2400, 1600, 1200],
    waveform: 'sawtooth',
    tempo: 160,
  },
  soft_chime: {
    notes: [587.33, 739.99, 880.00, 1174.66],
    waveform: 'sine',
    tempo: 110,
  },
};

export function playSynthesizedRingtone(
  id: string,
  styleName: string = 'cyberpunk',
  durationSec: number = 8,
  onEnd?: () => void
) {
  stopAudio();
  const ctx = getAudioContext();
  const analyser = getAudioAnalyser();

  const melodyConfig = MELODIES[styleName] || MELODIES.cyberpunk;
  const notes = melodyConfig.notes;
  const noteDuration = 60 / melodyConfig.tempo / 2;
  const sampleRate = ctx.sampleRate;
  const totalLength = Math.min(durationSec, 15) * sampleRate;

  // Create an offline buffer to synthesize smooth polyphony
  const buffer = ctx.createBuffer(2, totalLength, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  let noteIndex = 0;
  let cursor = 0;

  while (cursor < totalLength) {
    const freq = notes[noteIndex % notes.length];
    const noteLen = Math.floor(noteDuration * sampleRate);
    for (let i = 0; i < noteLen && cursor + i < totalLength; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t * (melodyConfig.waveform === 'sine' ? 2 : 4));
      // Base wave
      let sample = Math.sin(2 * Math.PI * freq * t);
      if (melodyConfig.waveform === 'sawtooth') {
        sample = (2 * ((freq * t) % 1)) - 1;
      } else if (melodyConfig.waveform === 'square') {
        sample = Math.sin(2 * Math.PI * freq * t) > 0 ? 0.7 : -0.7;
      } else if (melodyConfig.waveform === 'triangle') {
        sample = 2 * Math.abs(2 * ((freq * t) % 1) - 1) - 1;
      }

      // Add harmonic sparkle
      const harmonic = Math.sin(2 * Math.PI * freq * 2 * t) * 0.3;
      const val = (sample + harmonic) * decay * 0.25;

      left[cursor + i] += val;
      right[cursor + i] += val * 0.95;
    }
    cursor += noteLen;
    noteIndex++;
  }

  // Play through master analyser & speakers
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = 0.8;

  source.connect(analyser);
  analyser.connect(gain);
  gain.connect(ctx.destination);

  source.start();
  currentSource = source;
  isPlaying = true;
  currentTrackId = id;

  source.onended = () => {
    isPlaying = false;
    currentTrackId = null;
    if (onEnd) onEnd();
  };
}

// Notification chime preview (quick 1-2 sec ping)
export function playNotificationChime(effectType: string = 'soft') {
  const ctx = getAudioContext();
  const analyser = getAudioAnalyser();

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  if (effectType === 'galaxy' || effectType === 'neon') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.35);
  } else if (effectType === 'rainbow' || effectType === 'wave') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(880, now + 0.2);
  } else {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
  }

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  osc.connect(analyser);
  analyser.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.55);
}

// Export downloadable WAV file so user gets real audio on download
export function generateWavFileBlob(styleName: string = 'cyberpunk', durationSec = 10): Blob {
  const sampleRate = 44100;
  const numChannels = 2;
  const numFrames = sampleRate * durationSec;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // 16-bit
  // data chunk identifier
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const melodyConfig = MELODIES[styleName] || MELODIES.cyberpunk;
  const notes = melodyConfig.notes;
  const noteDuration = 60 / melodyConfig.tempo / 2;
  let offset = 44;
  let noteIndex = 0;
  let frame = 0;

  while (frame < numFrames) {
    const freq = notes[noteIndex % notes.length];
    const noteFrames = Math.floor(noteDuration * sampleRate);
    for (let i = 0; i < noteFrames && frame < numFrames; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t * 3);
      const val = Math.sin(2 * Math.PI * freq * t) * decay * 0.3;
      const sample = Math.max(-1, Math.min(1, val));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;

      view.setInt16(offset, intSample, true);
      view.setInt16(offset + 2, intSample, true);
      offset += 4;
      frame++;
    }
    noteIndex++;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
