import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  initialSeconds?: number;
  onComplete?: () => void;
  autoStart?: boolean;
  variant?: 'default' | 'large';
}

export const Timer: React.FC<TimerProps> = ({ initialSeconds = 0, onComplete, autoStart = false, variant = 'default' }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(autoStart);
  const [mode] = useState<'countdown' | 'stopwatch'>(initialSeconds > 0 ? 'countdown' : 'stopwatch');

  useEffect(() => {
    let interval: number | undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds((prev) => {
          if (mode === 'countdown') {
            if (prev <= 1) {
              setIsActive(false);
              if (onComplete) onComplete();
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, mode, onComplete]);

  const toggle = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setSeconds(initialSeconds);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (variant === 'large') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
         <div className={`font-mono text-7xl font-bold mb-10 tracking-tighter tabular-nums ${isActive ? 'text-jelly-900' : 'text-stone-300'}`}>
            {formatTime(seconds)}
         </div>
         <div className="flex gap-6">
            <button onClick={toggle} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 ${isActive ? 'bg-stone-100 text-stone-800' : 'bg-jelly-600 text-white'}`}>
                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={reset} className="w-20 h-20 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center hover:bg-stone-200 transition-all">
                <RotateCcw size={28} />
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 bg-stone-50 p-1.5 pr-3 rounded-lg border border-stone-200 shadow-sm">
      <div className={`font-mono text-lg font-bold w-16 text-center ${seconds === 0 && mode === 'countdown' ? 'text-green-600' : 'text-stone-700'}`}>
        {formatTime(seconds)}
      </div>
      <div className="flex space-x-1">
        <button onClick={toggle} className="p-1.5 rounded-full hover:bg-stone-200 text-jelly-700">
            {isActive ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        </button>
        <button onClick={reset} className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400">
            <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};