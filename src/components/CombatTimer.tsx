import React from 'react';
import { useState, useEffect } from 'react';
import { Swords, Timer, Pause, Play, RefreshCw } from 'lucide-react';

export const CombatTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const progress = mode === 'work'
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-black text-white flex items-center justify-center gap-2">
          <Swords size={20} className="text-red-400" />
          Mode Combat
        </h2>
        <p className="text-xs text-slate-500 mt-1">Focus Pomodoro - Gagne de l'XP en restant concentré</p>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 bg-slate-800 rounded-xl p-1">
        <button
          onClick={() => switchMode('work')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            mode === 'work' ? 'bg-red-600 text-white' : 'text-slate-400'
          }`}
        >
          ⚔️ Combat (25 min)
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            mode === 'break' ? 'bg-green-600 text-white' : 'text-slate-400'
          }`}
        >
          🏥 Repos (5 min)
        </button>
      </div>

      {/* Timer display */}
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center">
        <div className="relative inline-block">
          <div
            className={`text-7xl font-black font-mono ${
              isActive ? (mode === 'work' ? 'text-red-400' : 'text-green-400') : 'text-white'
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              mode === 'work' ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={resetTimer}
            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all"
          >
            <RefreshCw size={20} className="text-slate-300" />
          </button>
          <button
            onClick={toggleTimer}
            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              isActive
                ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            {isActive ? 'Pause' : 'Démarrer'}
          </button>
          <div className="p-3">
            <Timer size={20} className="text-slate-500" />
          </div>
        </div>
      </div>

      {/* XP info */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <p className="text-xs text-slate-400 text-center">
          ⚡ Compléter une session = <span className="text-yellow-400 font-bold">+50 XP</span> + <span className="text-yellow-400 font-bold">+25 Or</span>
        </p>
      </div>
    </div>
  );
};
