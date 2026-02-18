import { Goal, Habit, UserProfile, Badge } from './types';

// XP et niveaux
export const XP_PER_LEVEL = 500;

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function calculateXPForNextLevel(xp: number): number {
  const currentLevel = calculateLevel(xp);
  return currentLevel * XP_PER_LEVEL;
}

export function calculateXPProgress(xp: number): number {
  const xpInCurrentLevel = xp % XP_PER_LEVEL;
  return Math.round((xpInCurrentLevel / XP_PER_LEVEL) * 100);
}

// Formatage des dates
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Aujourd\'hui';
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  return formatDate(date);
}

export function getDaysUntil(date: string): number {
  const target = new Date(date);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// Statistiques
export function calculateGoalStats(goals: Goal[]) {
  const total = goals.length;
  const completed = goals.filter(g => g.completed).length;
  const active = goals.filter(g => !g.completed).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const avgProgress = active > 0
    ? Math.round(goals.filter(g => !g.completed).reduce((acc, g) => acc + (g.progress / g.target) * 100, 0) / active)
    : 0;

  return { total, completed, active, completionRate, avgProgress };
}

export function calculateHabitStats(habits: Habit[]) {
  const total = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const dailyHabits = habits.filter(h => h.frequency === 'daily').length;
  const weeklyHabits = habits.filter(h => h.frequency === 'weekly').length;
  const avgStreak = total > 0
    ? Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / total)
    : 0;
  const maxStreak = total > 0
    ? Math.max(...habits.map(h => h.streak))
    : 0;
  const completionRate = total > 0 ? Math.round((completedToday / total) * 100) : 0;

  return { total, completedToday, dailyHabits, weeklyHabits, avgStreak, maxStreak, completionRate };
}

// Badges
const ALL_BADGES: Badge[] = [
  {
    id: 'first_goal',
    name: 'Premier Pas',
    description: 'Créer votre premier objectif',
    icon: '🎯',
    rarity: 'common',
    earnedAt: undefined,
  },
  {
    id: 'first_complete',
    name: 'Accomplissement',
    description: 'Compléter votre premier objectif',
    icon: '✅',
    rarity: 'common',
    earnedAt: undefined,
  },
  {
    id: 'habit_week',
    name: 'Semaine Parfaite',
    description: 'Maintenir une habitude 7 jours de suite',
    icon: '🔥',
    rarity: 'rare',
    earnedAt: undefined,
  },
  {
    id: 'habit_month',
    name: 'Mois de Fér',
    description: 'Maintenir une habitude 30 jours de suite',
    icon: '🏆',
    rarity: 'epic',
    earnedAt: undefined,
  },
  {
    id: 'level_5',
    name: 'Expert',
    description: 'Atteindre le niveau 5',
    icon: '⭐',
    rarity: 'rare',
    earnedAt: undefined,
  },
  {
    id: 'level_10',
    name: 'Légende',
    description: 'Atteindre le niveau 10',
    icon: '👑',
    rarity: 'legendary',
    earnedAt: undefined,
  },
  {
    id: 'goals_5',
    name: 'Ambitieux',
    description: 'Compléter 5 objectifs',
    icon: '🔝',
    rarity: 'rare',
    earnedAt: undefined,
  },
  {
    id: 'goals_10',
    name: 'Achètement',
    description: 'Compléter 10 objectifs',
    icon: '💯',
    rarity: 'epic',
    earnedAt: undefined,
  },
  {
    id: 'habit_5',
    name: 'Routinier',
    description: 'Avoir 5 habitudes actives',
    icon: '🔄',
    rarity: 'common',
    earnedAt: undefined,
  },
  {
    id: 'xp_1000',
    name: 'Guerrier XP',
    description: 'Accumuler 1000 XP',
    icon: '⚡',
    rarity: 'rare',
    earnedAt: undefined,
  },
];

export function getEarnedBadges(profile: UserProfile, goals: Goal[], habits: Habit[]): Badge[] {
  const earned: Badge[] = [];
  const now = new Date().toISOString();

  const completedGoals = goals.filter(g => g.completed);
  const level = calculateLevel(profile.xp);
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  if (goals.length >= 1) {
    earned.push({ ...ALL_BADGES.find(b => b.id === 'first_goal')!, earnedAt: now });
  }
  if (completedGoals.length >= 1) {
    earned.push({ ...ALL_BADGES.find(b => b.id === 'first_complete')!, earnedAt: now });
  }
  if (maxStreak >= 7) {
    earned.push({ ...ALL_BADGES.find(b => b.id === 'habit_week')!, earnedAt: now });
  }
  if (maxStreak >= 30) {
    earned.push({ ...ALL_BADGES.find(b => b.id === 'habit_month')!, earnedAt: now });
  }
  if (level >= 5) {
    earned.push({ ...ALL_BADGES.find(b => b.id === 'level_5')!, earnedAt: now });
  }
  if (level >= 10) {
    earned.push({ ...ALL_BADGES.find(b => b.id === 'level_10')!, earnedAt: now });
  }
  if (completedGoals.length >= 5) {
    earned.push({ ...ALL_BADGES.find(b => b.id === 'goals_5')!, earnedAt: now });
  }
  if (completedGoals.length >= 10) {
    earned.push({ ...ALL_BADGES.find(b => b.id === 'goals_10')!, earnedAt: now });
  }
  if (habits.length >= 5) {
    earned.push({ ...ALL_BADGES.find(b => b.id === 'habit_5')!, earnedAt: now });
  }
  if (profile.xp >= 1000) {
    earned.push({ ...ALL_BADGES.find(b => b.id === 'xp_1000')!, earnedAt: now });
  }

  return earned;
}

// Couleurs par catégorie
export const categoryColors: Record<string, string> = {
  health: '#10b981',
  learning: '#3b82f6',
  finance: '#f59e0b',
  social: '#8b5cf6',
  creativity: '#ec4899',
  productivity: '#f97316',
};

export const categoryLabels: Record<string, string> = {
  health: 'Santé',
  learning: 'Apprentissage',
  finance: 'Finance',
  social: 'Social',
  creativity: 'Créativité',
  productivity: 'Productivité',
};

export const categoryIcons: Record<string, string> = {
  health: '💪',
  learning: '📚',
  finance: '💰',
  social: '👥',
  creativity: '🎨',
  productivity: '⚡',
};

// Utilitaires ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Streak helpers
export function isCompletedToday(completedDates: string[]): boolean {
  const today = new Date().toDateString();
  return completedDates.some(d => new Date(d).toDateString() === today);
}

export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sortedDates = [...completedDates]
    .map(d => new Date(d).toDateString())
    .filter((d, i, arr) => arr.indexOf(d) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
