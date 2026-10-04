import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX, CheckCircle, Clock } from 'lucide-react';
import { StudySession } from '../types/planner';

interface FocusTimerProps {
  session: StudySession | null;
  onClose: () => void;
  onComplete: (sessionId: string) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ session, onClose, onComplete }) => {
  if (!session) return null;

  const initialMinutes = session.durationMinutes || 25;
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState(false);
  const [completedNotified, setCompletedNotified] = useState(false);

  // Audio Context Ref for ambient sound & completion chime
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Sync when session changes
  useEffect(() => {
    const secs = (session.durationMinutes || 25) * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setIsRunning(false);
    setCompletedNotified(false);
  }, [session.id]);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playCompletionChime();
            setCompletedNotified(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  // Synthesize soft ambient pink noise
  const toggleAmbientSound = () => {
    if (!ambientSound) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.05; // Gentle volume
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();

        noiseNodeRef.current = noise;
        setAmbientSound(true);
      } catch (e) {
        console.warn('Audio synthesis not supported or blocked', e);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setAmbientSound(false);
    }
  };

  // Synthesize pleasing completion chime
  const playCompletionChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Play 3 harmonic chords
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.15, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.85);
      });
    } catch (e) {
      // ignore
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
    setCompletedNotified(false);
  };

  const setPresetMinutes = (mins: number) => {
    setIsRunning(false);
    const secs = mins * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setCompletedNotified(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-blue-50/40">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h3 className="font-semibold text-neutral-800 text-sm tracking-wide">
              FOCUS MODE • โหมดจับเวลาอ่านหนังสือ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-neutral-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* Subject & Topic Info */}
          <div className="mb-6 w-full">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold mb-2">
              {session.subjectName}
            </span>
            <h2 className="text-xl font-bold text-neutral-900 leading-tight">
              {session.topic}
            </h2>
            {session.recommendedTechnique && (
              <p className="text-xs text-neutral-500 mt-1">
                เทคนิคที่แนะนำ: <span className="text-blue-600 font-medium">{session.recommendedTechnique}</span>
              </p>
            )}
          </div>

          {/* Circular Countdown Progress */}
          <div className="relative w-56 h-56 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-blue-50"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-blue-600 transition-all duration-300 ease-linear"
                strokeWidth="6"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold tracking-tight font-mono text-neutral-900">
                {formatTime(remainingSeconds)}
              </span>
              <span className="text-xs text-neutral-400 mt-1">
                {remainingSeconds === 0 ? 'สิ้นสุดเซสชันแล้ว!' : isRunning ? 'กำลังจับเวลา' : 'หยุดชั่วคราว'}
              </span>
            </div>
          </div>

          {/* Quick presets for 50/10 Rule */}
          <div className="flex items-center gap-2 mt-4 mb-6">
            <button
              onClick={() => setPresetMinutes(50)}
              className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer ${
                totalSeconds === 50 * 60
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              📖 อ่าน 50 นาที
            </button>
            <button
              onClick={() => setPresetMinutes(10)}
              className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer ${
                totalSeconds === 10 * 60
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              ☕ พัก 10 นาที
            </button>
            <button
              onClick={() => setPresetMinutes(25)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                totalSeconds === 25 * 60
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              25 นาที
            </button>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              title="รีเซ็ตเวลา"
              className="p-3 text-neutral-500 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>พักเบรก</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                  <span>{remainingSeconds === totalSeconds ? 'เริ่มอ่านเลย' : 'อ่านต่อ'}</span>
                </>
              )}
            </button>

            <button
              onClick={toggleAmbientSound}
              title={ambientSound ? 'ปิดเสียง White Noise' : 'เปิดเสียง Ambient White Noise ช่วยโฟกัส'}
              className={`p-3 rounded-full transition-colors cursor-pointer ${
                ambientSound
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
            >
              {ambientSound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          {/* Mark Complete Action */}
          <div className="mt-6 pt-4 border-t border-neutral-100 w-full flex items-center justify-between text-xs text-neutral-500">
            <span>เมื่ออ่านจบเซสชันนี้:</span>
            <button
              onClick={() => {
                onComplete(session.id);
                onClose();
              }}
              className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>ทำเครื่องหมายว่าอ่านเสร็จแล้ว</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
