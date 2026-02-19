import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Goal, Habit, ViewType, GameNotification } from './types';
import { getInitialGameState, loadGameState, saveGameState, calcLevelFromXP, openChest } from './utils';
import ArenaMap from './components/ArenaMap';
import QuestsView from './components/QuestsView';
import HabitsView from './components/HabitsView';
import StatsView from './components/StatsView';
import ProfileView from './components/ProfileView';
import CombatTimer from './components/CombatTimer';
import LootSystem from './components/LootSystem';
import DailyChest from './components/DailyChest';
import Navbar from './components/Navbar';
import XPBar from './components/XPBar';
import NotificationToast from './components/NotificationToast';

export default function App() {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadGameState();
    return saved || getInitialGameState();
  });

  const [showDailyChest, setShowDailyChest] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Auto-save on state change ---
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveGameState(state);
    }, 500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [state]);

  // --- Daily Chest Check ---
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastOpened = state.dailyChest.lastOpenedDate;
    
    if (lastOpened !== today) {
      setState(prev => ({
        ...prev,
        dailyChest: { ...prev.dailyChest, isAvailable: true }
      }));
      
      // Show chest popup after 2s
      const timer = setTimeout(() => setShowDailyChest(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // --- Music ---
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (state.music.isPlaying && !state.music.isMuted) {
      audioRef.current.volume = state.music.volume;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play might be blocked, wait for user interaction
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [state.music.isPlaying, state.music.isMuted, state.music.volume]);

  // --- Level Up Check ---
  const prevLevelRef = useRef(state.level);
  useEffect(() => {
    const levelInfo = calcLevelFromXP(state.xp);
    if (levelInfo.level > prevLevelRef.current) {
      prevLevelRef.current = levelInfo.level;
      addNotification({
        type: 'levelup',
        message: `Niveau ${levelInfo.level} atteint ! ${levelInfo.title}`,
        icon: '⭐'
      });
    }
  }, [state.xp]);

  // --- Helpers ---
  const addNotification = useCallback((notif: Omit<GameNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: GameNotification = {
      ...notif,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    setState(prev => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications.slice(0, 9)]
    }));
  }, []);

  const earnXP = useCallback((amount: number, source?: string) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      const levelInfo = calcLevelFromXP(newXP);
      return {
        ...prev,
        xp: newXP,
        level: levelInfo.level,
        currentArena: levelInfo.arena,
        stats: {
          ...prev.stats,
          totalXP: prev.stats.totalXP + amount
        }
      };
    });
    addNotification({ type: 'xp', message: `+${amount} XP${source ? ` (${source})` : ''}`, icon: '⚡', value: amount });
  }, [addNotification]);

  const earnGold = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      gold: prev.gold + amount,
      stats: { ...prev.stats, totalGold: prev.stats.totalGold + amount }
    }));
    addNotification({ type: 'gold', message: `+${amount} Or`, icon: '💰', value: amount });
  }, [addNotification]);

  const addGoal = useCallback((goal: Goal) => {
    setState(prev => ({ ...prev, goals: [...prev.goals, goal] }));
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id !== id) return g;
        const updated = { ...g, ...updates, updatedAt: new Date().toISOString() };
        
        // Check completion
        if (updates.progress === 100 && !g.completed) {
          earnXP(g.xpReward, g.title);
          earnGold(g.goldReward || 50);
          addNotification({ type: 'quest', message: `Objectif terminé : ${g.title}`, icon: '🎯' });
          setState(s => ({
            ...s,
            stats: { ...s.stats, totalGoalsCompleted: s.stats.totalGoalsCompleted + 1 }
          }));
          return { ...updated, completed: true, completedAt: new Date().toISOString(), status: 'completed' as const };
        }
        return updated;
      })
    }));
  }, [earnXP, earnGold, addNotification]);

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
        if (h.id !== id) return h;
        if (h.completedDates.includes(today)) return h;
        
        earnXP(h.xpReward, h.title);
        earnGold(h.goldReward || 20);
        
        return {
          ...h,
          completedDates: [...h.completedDates, today],
          streak: h.streak + 1,
          longestStreak: Math.max(h.longestStreak, h.streak + 1)
        };
      }),
      stats: { ...prev.stats, totalHabitsCompleted: prev.stats.totalHabitsCompleted + 1 }
    }));
  }, [earnXP, earnGold]);

  const handleDailyChest = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const reward = openChest('wood');
    
    earnXP(reward.xp, 'Coffre du jour');
    earnGold(reward.gold);
    if (reward.gems > 0) {
      setState(prev => ({ ...prev, gems: prev.gems + reward.gems }));
    }

    setState(prev => ({
      ...prev,
      dailyChest: { lastOpenedDate: today, streak: prev.dailyChest.streak + 1, isAvailable: false }
    }));
    setShowDailyChest(false);
  }, [earnXP, earnGold]);

  const toggleMusic = useCallback(() => {
    setState(prev => ({
      ...prev,
      music: { ...prev.music, isPlaying: !prev.music.isPlaying }
    }));
  }, []);

  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, music: { ...prev.music, isMuted: !prev.music.isMuted } }));
  }, []);

  const navigateTo = useCallback((view: ViewType) => {
    setState(prev => ({ ...prev, currentView: view }));
  }, []);

  const levelInfo = calcLevelFromXP(state.xp);

  const renderView = () => {
    switch (state.currentView) {
      case 'arena': return <ArenaMap state={state} onNavigate={navigateTo} />;
      case 'quests': return <QuestsView goals={state.goals} onAdd={addGoal} onUpdate={updateGoal} onDelete={deleteGoal} />;
      case 'habits': return <HabitsView habits={state.habits} onAdd={addHabit} onComplete={completeHabit} />;
      case 'stats': return <StatsView state={state} />;
      case 'profile': return <ProfileView state={state} onUpdate={(updates) => setState(prev => ({ ...prev, ...updates }))} />;
      case 'combat': return <CombatTimer state={state} onEarnXP={earnXP} onEarnGold={earnGold} onUpdate={(sessions) => setState(prev => ({ ...prev, combatSessions: sessions }))} />;
      case 'loot': return <LootSystem state={state} onOpenChest={(rarity) => { const r = openChest(rarity); earnXP(r.xp, 'Coffre'); earnGold(r.gold); }} />;
      default: return <ArenaMap state={state} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 overflow-x-hidden">
      {/* Audio */}
      <audio 
        ref={audioRef}
        src="https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3"
        loop
        preload="auto"
      />

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white shadow-lg shadow-blue-500/20">
            {state.currentArena.replace('_', ' ')}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400">NIVEAU {state.level}</span>
            <span className="text-[10px] text-blue-400 font-black uppercase tracking-tighter leading-none">{levelInfo.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/50 rounded-full px-2 py-1 gap-1.5 border border-slate-700/50">
            <span className="text-sm">💰</span>
            <span className="text-xs font-black tracking-tighter">{state.gold.toLocaleString()}</span>
          </div>
          <div className="flex items-center bg-slate-800/50 rounded-full px-2 py-1 gap-1.5 border border-slate-700/50">
            <span className="text-sm">💎</span>
            <span className="text-xs font-black tracking-tighter">{state.gems}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-20 px-4 max-w-lg mx-auto">
        <XPBar 
          level={levelInfo.level}
          currentXP={levelInfo.currentXP}
          requiredXP={levelInfo.requiredXP}
          title={levelInfo.title}
        />
        
        <div className="mt-6">
          {renderView()}
        </div>
      </main>

      {/* Navbar */}
      <Navbar 
        activeView={state.currentView} 
        onChangeView={navigateTo}
        isMusicPlaying={state.music.isPlaying}
        onToggleMusic={toggleMusic}
      />

      {/* Daily Chest Modal */}
      {showDailyChest && (
        <DailyChest 
          streak={state.dailyChest.streak}
          onOpen={handleDailyChest}
          onClose={() => setShowDailyChest(false)}
        />
      )}

      {/* Notifications */}
      <NotificationToast 
        notifications={state.notifications.filter(n => !n.read)} 
        onDismiss={(id) => {
          setState(prev => ({
            ...prev,
            notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
          }));
        }} 
      />
    </div>
  );
}
