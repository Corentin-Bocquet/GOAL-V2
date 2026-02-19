import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Goal, Habit, ViewType } from './types';
import { getInitialGameState, loadGameState, saveGameState, calcLevelFromXP, openChest } from './utils';
import ArenaMap from './components/ArenaMap';
import QuestsView from './components/QuestsView';
import HabitsView from './components/HabitsView';
import StatsView from './components/StatsView';
import ProfileView from './components/ProfileView';
import { CombatTimer } from './components/CombatTimer';
import DailyChest from './components/DailyChest';
import Navbar from './components/Navbar';

export default function App() {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadGameState();
    return saved || getInitialGameState();
  });
  const [showDailyChest, setShowDailyChest] = useState(false);
  const [notification, setNotification] = useState<{msg: string; icon: string} | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => { saveGameState(state); }, 500);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [state]);

  // Daily Chest
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (state.dailyChest.lastOpenedDate !== today) {
      setState(prev => ({ ...prev, dailyChest: { ...prev.dailyChest, isAvailable: true } }));
      const t = setTimeout(() => setShowDailyChest(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  // Music
  useEffect(() => {
    if (!audioRef.current) return;
    if (state.music.isPlaying && !state.music.isMuted) {
      audioRef.current.volume = state.music.volume;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [state.music.isPlaying, state.music.isMuted, state.music.volume]);

  const showNotif = (msg: string, icon: string) => {
    setNotification({ msg, icon });
    setTimeout(() => setNotification(null), 2500);
  };

  const earnXP = useCallback((amount: number, source?: string) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      const lvl = calcLevelFromXP(newXP);
      return { ...prev, xp: newXP, level: lvl.level, currentArena: lvl.arena };
    });
    showNotif(`+${amount} XP${source ? ` (${source})` : ''}`, '⚡');
  }, []);

  const earnGold = useCallback((amount: number) => {
    setState(prev => ({ ...prev, gold: prev.gold + amount }));
    showNotif(`+${amount} Or`, '💰');
  }, []);

  const addGoal = useCallback((goal: Goal) => {
    setState(prev => ({ ...prev, goals: [...prev.goals, goal] }));
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id !== id) return g;
        const updated = { ...g, ...updates };
        if (updates.progress === 100 && !g.completed) {
          earnXP(g.xpReward, g.title);
          earnGold(g.goldReward || 50);
          return { ...updated, completed: true, status: 'completed' as const };
        }
        return updated;
      })
    }));
  }, [earnXP, earnGold]);

  const deleteGoal = useCallback((id: string) => {
    setState(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  }, []);

  const addHabit = useCallback((habit: Habit) => {
    setState(prev => ({ ...prev, habits: [...prev.habits, habit] }));
  }, []);

  const completeHabit = useCallback((id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id !== id || h.completedDates.includes(today)) return h;
        earnXP(h.xpReward, h.title);
        earnGold(h.goldReward || 20);
        return { ...h, completedDates: [...h.completedDates, today], streak: h.streak + 1 };
      })
    }));
  }, [earnXP, earnGold]);

  const deleteHabit = useCallback((id: string) => {
    setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }));
  }, []);

  const handleDailyChest = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const reward = openChest('wood');
    earnXP(reward.xp, 'Coffre du jour');
    earnGold(reward.gold);
    if (reward.gems > 0) setState(prev => ({ ...prev, gems: prev.gems + reward.gems }));
    setState(prev => ({ ...prev, dailyChest: { lastOpenedDate: today, streak: prev.dailyChest.streak + 1, isAvailable: false } }));
    setShowDailyChest(false);
  }, [earnXP, earnGold]);

  const toggleMusic = useCallback(() => {
    setState(prev => ({ ...prev, music: { ...prev.music, isPlaying: !prev.music.isPlaying } }));
  }, []);

  const navigateTo = useCallback((view: ViewType) => {
    setState(prev => ({ ...prev, currentView: view }));
  }, []);

  const levelInfo = calcLevelFromXP(state.xp);
  const progressPct = Math.round((levelInfo.currentXP / levelInfo.requiredXP) * 100);

  const renderView = () => {
    switch (state.currentView) {
      case 'arena': return <ArenaMap state={state} onNavigate={navigateTo} />;
      case 'quests': return <QuestsView goals={state.goals} onAdd={addGoal} onUpdate={updateGoal} onDelete={deleteGoal} />;
      case 'habits': return <HabitsView habits={state.habits} onToggleHabit={completeHabit} onDeleteHabit={deleteHabit} onAddHabit={addHabit} />;
      case 'stats': return <StatsView state={state} />;
      case 'profile': return <ProfileView state={state} onUpdate={(u) => setState(prev => ({ ...prev, ...u }))} />;
      case 'combat': return <CombatTimer />;
      default: return <ArenaMap state={state} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 overflow-x-hidden">
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3" loop preload="none" />

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-blue-400 uppercase tracking-tighter">⚔️ GOAL</span>
            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-black uppercase">
              {state.currentArena.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-yellow-400">💰 {state.gold.toLocaleString()}</span>
            <span className="text-xs font-black text-purple-400">💎 {state.gems}</span>
            {state.dailyChest.isAvailable && (
              <button onClick={() => setShowDailyChest(true)} className="text-lg animate-bounce" title="Coffre du jour !">🎁</button>
            )}
            <button
              onClick={toggleMusic}
              className={`p-1.5 rounded-lg text-sm transition-all ${
                state.music.isPlaying ? 'bg-blue-600/30 text-blue-400' : 'text-slate-500'
              }`}
            >
              {state.music.isPlaying ? '🔊' : '🎵'}
            </button>
          </div>
        </div>

        {/* XP Bar */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-slate-400 uppercase">NIV. {levelInfo.level}</span>
            <span className="text-[10px] font-bold text-blue-400">{levelInfo.title}</span>
            <span className="ml-auto text-[10px] text-slate-500">{levelInfo.currentXP}/{levelInfo.requiredXP} XP</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700 shadow-[0_0_6px_rgba(99,102,241,0.5)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-24 px-4 max-w-lg mx-auto">
        {renderView()}
      </main>

      {/* Navbar */}
      <Navbar
        activeView={state.currentView}
        onChangeView={navigateTo}
        isMusicPlaying={state.music.isPlaying}
        onToggleMusic={toggleMusic}
      />

      {/* Daily Chest */}
      {showDailyChest && (
        <DailyChest
          streak={state.dailyChest.streak}
          onOpen={handleDailyChest}
          onClose={() => setShowDailyChest(false)}
        />
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-xl animate-in fade-in">
          <span className="text-lg">{notification.icon}</span>
          <span className="text-sm font-black text-white">{notification.msg}</span>
        </div>
      )}
    </div>
  );
}
