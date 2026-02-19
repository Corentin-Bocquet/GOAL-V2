import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Timer, Pause, Play, RefreshCw, Trophy, Skull } from 'lucide-react';

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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-6 bg-slate-900/50 rounded-3xl border border-slate-700 shadow-xl max-w-sm mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2 uppercase tracking-tighter">
          {mode === 'work' ? (
            <><Swords className="text-red-500 animate-pulse" /> Phase de Combat</>
          ) : (
            <><Timer className="text-blue-400" /> Repos du Guerrier</>
          )}
        </h2>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
          {mode === 'work' ? 'Élimine tes tâches !' : 'Récupère tes forces'}
        </p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-slate-800 fill-none"
            strokeWidth="8"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            className={`fill-none ${mode === 'work' ? 'stroke-red-600' : 'stroke-blue-500'}`}
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 1 }}
            animate={{ pathLength: timeLeft / (mode === 'work' ? 25 * 60 : 5 * 60) }}
            transition={{ duration: 1, ease: "linear" }}
            style={{ filter: mode === 'work' ? 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.5))' : 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
          />
        </svg>

        <div className="text-center z-10">
          <motion.span 
            key={timeLeft}
            initial={{ scale: 1.1, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-black text-white font-mono tabular-nums"
          >
            {formatTime(timeLeft)}
          </motion.span>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full">
        <button
          onClick={resetTimer}
          className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-all"
        >
          <RefreshCw size={24} />
        </button>

        <button
          onClick={toggleTimer}
          className={`flex-1 py-4 rounded-2xl font-black text-xl uppercase tracking-widest transition-all transform active:scale-95 flex items-center justify-center gap-3 shadow-lg ${
            isActive 
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/40'
          }`}
        >
          {isActive ? (
            <><Pause fill="currentColor" /> Pause</>
          ) : (
            <><Play fill="currentColor" /> Combattre !</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 flex flex-col items-center">
          <Trophy size={16} className="text-yellow-500 mb-1" />
          <span className="text-xs font-bold text-slate-500">BUTIN</span>
          <span className="text-sm font-black text-white">+50 XP</span>
        </div>
        <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 flex flex-col items-center">
          <Skull size={16} className="text-red-500 mb-1" />
          <span className="text-xs font-bold text-slate-500">MENACE</span>
          <span className="text-sm font-black text-white">HAUTE</span>
        </div>
      </div>
    </div>
  );
};
