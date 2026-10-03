import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Play, Pause, Upload, Volume2, 
  Sparkles, Zap, Disc3, Music 
} from 'lucide-react';
import { getAudioAnalyser, playSynthesizedRingtone, stopAudio, isAudioPlaying } from '../services/audioEngine';

type VisualizerStyle = 'equalizer' | 'wave' | 'circular' | 'pulse' | 'neon' | 'spectrum';

const SAMPLE_TRACKS = [
  { id: 'track-cyber', title: 'Cyberpunk Drive (Synthwave)', synth: 'cyberpunk', duration: 15 },
  { id: 'track-aurora', title: 'Boreal Aurora (Ambient Chime)', synth: 'aurora', duration: 12 },
  { id: 'track-lofi', title: 'Tokyo Midnight Rain (Lofi)', synth: 'lofi', duration: 14 },
  { id: 'track-neon', title: 'High Voltage Pulse (Electro)', synth: 'neon_pulse', duration: 12 },
];

export const VisualizerView: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState(SAMPLE_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [style, setStyle] = useState<VisualizerStyle>('equalizer');
  const [volume, setVolume] = useState(0.8);
  const [edgeSync, setEdgeSync] = useState(true);
  const [audioFileUploaded, setAudioFileUploaded] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const stylesList: { id: VisualizerStyle; label: string }[] = [
    { id: 'equalizer', label: 'Equalizer' },
    { id: 'wave', label: 'Waveform' },
    { id: 'circular', label: 'Circular Radial' },
    { id: 'pulse', label: 'Bass Pulse' },
    { id: 'neon', label: 'Neon Beams' },
    { id: 'spectrum', label: 'Spectrum Flow' },
  ];

  const handlePlayToggle = () => {
    if (isPlaying) {
      if (audioElementRef.current && audioFileUploaded) {
        audioElementRef.current.pause();
      } else {
        stopAudio();
      }
      setIsPlaying(false);
    } else {
      if (audioElementRef.current && audioFileUploaded) {
        audioElementRef.current.play();
        setIsPlaying(true);
      } else {
        playSynthesizedRingtone(selectedTrack.id, selectedTrack.synth, selectedTrack.duration, () => {
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioFileUploaded(url);
      setSelectedTrack({
        id: 'local-file',
        title: file.name.replace(/\.[^/.]+$/, ''),
        synth: 'local',
        duration: 180,
      });
      stopAudio();
      setIsPlaying(false);
    }
  };

  // Render loop using Web Audio AnalyserNode frequency data
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let analyser: AnalyserNode | null = null;
    try {
      analyser = getAudioAnalyser();
    } catch {
      // not yet interacted
    }

    const dataArray = new Uint8Array(64);

    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Ambient idle animation
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = Math.max(10, Math.sin(Date.now() * 0.003 + i * 0.2) * 25 + 25);
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Background fade
      ctx.fillStyle = '#060714';
      ctx.fillRect(0, 0, width, height);

      if (style === 'equalizer') {
        const barWidth = (width / 32) - 4;
        for (let i = 0; i < 32; i++) {
          const val = dataArray[i * 2] || 0;
          const barHeight = (val / 255) * (height * 0.75);
          const x = i * (barWidth + 4) + 6;
          const y = height - barHeight - 20;

          const grad = ctx.createLinearGradient(0, height, 0, 0);
          grad.addColorStop(0, '#00F0FF');
          grad.addColorStop(0.5, '#7000FF');
          grad.addColorStop(1, '#FF007A');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
          ctx.fill();

          // Peak cap
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x, y - 4, barWidth, 2);
        }
      } else if (style === 'wave') {
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#00F0FF';
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 15;

        const sliceWidth = width / 32;
        let x = 0;
        for (let i = 0; i < 32; i++) {
          const v = dataArray[i * 2] / 255.0;
          const y = (v * height) / 2 + height / 4;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (style === 'circular') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.22;

        ctx.strokeStyle = '#FF007A';
        ctx.lineWidth = 3;

        for (let i = 0; i < 36; i++) {
          const angle = (i * Math.PI * 2) / 36;
          const val = dataArray[i] || 0;
          const lineLen = (val / 255) * 60 + 10;

          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * (radius + lineLen);
          const y2 = centerY + Math.sin(angle) * (radius + lineLen);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0f1130';
        ctx.fill();
        ctx.stroke();
      } else if (style === 'pulse') {
        const centerX = width / 2;
        const centerY = height / 2;
        const avg = dataArray.reduce((acc, v) => acc + v, 0) / dataArray.length;
        const radius = 40 + (avg / 255) * 80;

        const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius * 1.5);
        grad.addColorStop(0, '#00F0FF');
        grad.addColorStop(0.5, '#7000FF');
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      } else if (style === 'neon' || style === 'spectrum') {
        const barWidth = width / 40;
        for (let i = 0; i < 40; i++) {
          const val = dataArray[i] || 0;
          const h = (val / 255) * height;
          ctx.fillStyle = `hsl(${i * 8}, 100%, 55%)`;
          ctx.fillRect(i * barWidth, height - h, barWidth - 1, h);
        }
      }
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, style]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-cyan-400" />
            <span>Real-time Music Visualizer</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Listen to built-in tracks or upload your own audio to experience synchronized edge lighting and dynamic spectrum waves.
          </p>
        </div>

        {/* Local Audio Upload */}
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold cursor-pointer transition self-start sm:self-auto">
          <Upload className="w-4 h-4 text-cyan-400" />
          <span>Upload Audio (MP3/WAV)</span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Main Visualizer Stage */}
      <div className="relative rounded-3xl overflow-hidden bg-black border border-cyan-500/30 shadow-[0_0_80px_rgba(0,240,255,0.15)] flex flex-col items-center justify-center p-4">
        
        {/* Animated Synchronized Edge Glow around the Canvas */}
        {edgeSync && (
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl border-2 transition-all duration-100"
            style={{
              borderColor: isPlaying ? '#00F0FF' : 'rgba(255,255,255,0.1)',
              boxShadow: isPlaying ? '0 0 35px rgba(0,240,255,0.5), inset 0 0 35px rgba(255,0,122,0.3)' : 'none',
            }}
          />
        )}

        {/* HTML5 Audio Player if local file is uploaded */}
        {audioFileUploaded && (
          <audio
            ref={audioElementRef}
            src={audioFileUploaded}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Canvas Display */}
        <canvas
          ref={canvasRef}
          width={800}
          height={380}
          className="w-full max-w-3xl h-[280px] sm:h-[360px] rounded-2xl"
        />

        {/* Floating Now Playing Pill */}
        <div className="absolute top-6 left-6 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white">
          <Disc3 className={`w-4 h-4 text-cyan-400 ${isPlaying ? 'animate-spin' : ''}`} />
          <span className="font-semibold truncate max-w-[200px]">{selectedTrack.title}</span>
          {isPlaying && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
          )}
        </div>

        {/* Bottom Playback Control Bar */}
        <div className="w-full max-w-xl flex items-center justify-between gap-4 mt-4 p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayToggle}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition active:scale-95 shadow-lg ${
                isPlaying
                  ? 'bg-rose-500 text-white shadow-rose-500/30'
                  : 'bg-cyan-500 text-slate-950 shadow-cyan-500/30 hover:bg-cyan-400'
              }`}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <div>
              <span className="text-xs font-bold text-white block">{selectedTrack.title}</span>
              <span className="text-[10px] text-cyan-400">{isPlaying ? 'Playing via Web Audio API' : 'Paused'}</span>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={edgeSync}
              onChange={(e) => setEdgeSync(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 rounded"
            />
            <span className="hidden sm:inline">Sync Edge Glow</span>
          </label>
        </div>
      </div>

      {/* Style & Preset Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Style Selector */}
        <div className="md:col-span-6 p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Visualizer Display Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {stylesList.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`p-3 rounded-2xl border text-center transition ${
                  style === s.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-white/[0.03] border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-xs block">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Demo Synth Tracks */}
        <div className="md:col-span-6 p-5 rounded-3xl bg-[#0b0e26] border border-white/[0.08] space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Built-in Melodic Demo Tracks
          </label>
          <div className="space-y-2">
            {SAMPLE_TRACKS.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTrack(t);
                  setAudioFileUploaded(null);
                  stopAudio();
                  setIsPlaying(false);
                }}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  selectedTrack.id === t.id
                    ? 'bg-purple-500/20 border-purple-400 text-white font-bold'
                    : 'bg-white/[0.03] border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Music className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs">{t.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">0:{t.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
