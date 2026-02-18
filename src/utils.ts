import { Goal, Habit, UserProfile, Badge, GoalCategory } from './types';

// Generate a unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Calculate XP needed for next level (exponential curve)
export const calcXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Calculate total XP accumulated to reach a specific level
export const calcTotalXPForLevel = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += calcXPForLevel(i);
  }
  return total;
};

// Calculate level from total XP
export const calcLevelFromXP = (totalXP: number): { level: number; currentXP: number; xpToNext: number } => {
  let level = 1;
  let remaining = totalXP;
  while (remaining >= calcXPForLevel(level)) {
    remaining -= calcXPForLevel(level);
    level++;
  }
  return {
    level,
    currentXP: remaining,
    xpToNext: calcXPForLevel(level),
  };
};

// Format date for display
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Get days remaining until target date
export const getDaysRemaining = (targetDate: string): number => {
  const target = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Check if a habit was completed today
export const isHabitCompletedToday = (habit: Habit): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return habit.completedDates.includes(today);
};

// Calculate habit streak
export const calcHabitStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  const sorted = [...completedDates].sort((a, b) => b.localeCompare(a));
  const today = new Date();
  let streak = 0;
  let checkDate = new Date(today);
  for (const dateStr of sorted) {
    const date = new Date(dateStr);
    const diffDays = Math.floor((checkDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) {
      streak++;
      checkDate = date;
    } else {
      break;
    }
  }
  return streak;
};

// Category colors
export const categoryColors: Record<GoalCategory, string> = {
  health: 'from-green-500 to-emerald-600',
  career: 'from-blue-500 to-indigo-600',
  education: 'from-purple-500 to-violet-600',
  personal: 'from-pink-500 to-rose-600',
  finance: 'from-yellow-500 to-amber-600',
  sport: 'from-orange-500 to-red-600',
  other: 'from-gray-500 to-slate-600',
};

export const categoryBgColors: Record<GoalCategory, string> = {
  health: 'bg-green-500/20 text-green-400',
  career: 'bg-blue-500/20 text-blue-400',
  education: 'bg-purple-500/20 text-purple-400',
  personal: 'bg-pink-500/20 text-pink-400',
  finance: 'bg-yellow-500/20 text-yellow-400',
  sport: 'bg-orange-500/20 text-orange-400',
  other: 'bg-gray-500/20 text-gray-400',
};

export const categoryIcons: Record<GoalCategory, string> = {
  health: '💚',
  career: '💼',
  education: '📚',
  personal: '🌟',
  finance: '💰',
  sport: '🏃',
  other: '🎯',
};

export const priorityColors = {
  low: 'text-green-400 bg-green-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  high: 'text-red-400 bg-red-400/10',
};

// Default badges
export const getEarnedBadges = (profile: UserProfile, goals: Goal[], habits: Habit[]): Badge[] => {
  const badges: Badge[] = [];
  const now = new Date().toISOString();

  if (goals.filter(g => g.status === 'completed').length >= 1) {
    badges.push({ id: 'first-goal', name: 'Premier Objectif', description: 'Compléter votre premier objectif', icon: '🏆', unlockedAt: now, rarity: 'common' });
  }
  if (profile.level >= 5) {
    badges.push({ id: 'level-5', name: 'Niveau 5', description: 'Atteindre le niveau 5', icon: '⭐', unlockedAt: now, rarity: 'common' });
  }
  if (profile.level >= 10) {
    badges.push({ id: 'level-10', name: 'Niveau 10', description: 'Atteindre le niveau 10', icon: '🌟', unlockedAt: now, rarity: 'rare' });
  }
  const maxStreak = Math.max(...habits.map(h => h.longestStreak), 0);
  if (maxStreak >= 7) {
    badges.push({ id: 'week-streak', name: 'Semaine Parfaite', description: '7 jours de suite', icon: '🔥', unlockedAt: now, rarity: 'rare' });
  }
  if (maxStreak >= 30) {
    badges.push({ id: 'month-streak', name: 'Mois Légendaire', description: '30 jours de suite', icon: '👑', unlockedAt: now, rarity: 'legendary' });
  }
  return badges;
};

// Save/load state from localStorage
export const saveState = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
};

export const loadState = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved) as T;
    return defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// XP reward based on priority
export const xpRewardByPriority = { low: 50, medium: 100, high: 200 };

// Get week days labels
export const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
export const weekDaysFull = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
