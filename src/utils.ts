import {
  GameState,
  Goal,
  Habit,
  Arena,
  ArenaId,
  LevelInfo,
  Chest,
  ChestRarity,
  LootReward,
  Avatar,
  Banner,
  Badge,
  Potion,
  GoalCategory,
  GoalPriority,
  Milestone,
  SubQuest,
  CombatSession,
  ViewType,
  MusicState,
  CalendarSync,
  GlobalStats,
} from './types';

// --- ID Generation ---
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// --- Leveling System (Exponential Curve) ---
export const calcXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const calcTotalXPForLevel = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += calcXPForLevel(i);
  }
  return total;
};

export const calcLevelFromXP = (totalXP: number): LevelInfo => {
  let level = 1;
  let remaining = totalXP;
  while (remaining >= calcXPForLevel(level)) {
    remaining -= calcXPForLevel(level);
    level++;
  }
  const xpForNext = calcXPForLevel(level);
  const titles = [
    'Recrue', 'Aventurier', 'Guerrier', 'Champion', 'Maître',
    'Grand Maître', 'Légendaire', 'Mythique', 'Divin', 'Immortel',
  ];
  const title = titles[Math.min(Math.floor((level - 1) / 5), titles.length - 1)];
  return { level, xp: remaining, xpForNext, title };
};

// --- Date Utilities ---
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const getDaysRemaining = (targetDate: string | null): number => {
  if (!targetDate) return 0;
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// --- Habit Utilities ---
export const isHabitCompletedToday = (habit: Habit): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return habit.completedDates.includes(today);
};

export const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// --- Color Maps ---
export const categoryBgColors: Record<string, string> = {
  health: 'bg-emerald-500/20 text-emerald-400',
  career: 'bg-blue-500/20 text-blue-400',
  education: 'bg-violet-500/20 text-violet-400',
  personal: 'bg-pink-500/20 text-pink-400',
  finance: 'bg-amber-500/20 text-amber-400',
  sport: 'bg-red-500/20 text-red-400',
  learning: 'bg-cyan-500/20 text-cyan-400',
  social: 'bg-orange-500/20 text-orange-400',
  creativity: 'bg-fuchsia-500/20 text-fuchsia-400',
  productivity: 'bg-indigo-500/20 text-indigo-400',
  other: 'bg-slate-500/20 text-slate-400',
};

export const categoryIcons: Record<string, string> = {
  health: '🥗',
  career: '💼',
  education: '📚',
  personal: '🌱',
  finance: '💰',
  sport: '🏃',
  learning: '🧠',
  social: '🤝',
  creativity: '🎨',
  productivity: '⚡',
  other: '✨',
};

export const priorityColors: Record<string, string> = {
  low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

// --- Arena System ---
export const getArenas = (): Arena[] => [
  {
    id: 'goblin_stadium' as ArenaId,
    name: 'Goblin Stadium',
    minLevel: 1,
    minXP: 0,
    color: 'from-green-600 to-emerald-800',
    gradient: 'from-green-600 to-emerald-800',
    icon: '🏟️',
    description: 'Arène de départ - affrontez les Gobelins !',
    unlocked: true,
  },
  {
    id: 'bone_pit' as ArenaId,
    name: 'Bone Pit',
    minLevel: 5,
    minXP: 500,
    color: 'from-yellow-600 to-orange-800',
    gradient: 'from-yellow-600 to-orange-800',
    icon: '💀',
    description: 'Les squelettes vous attendent dans la fosse !',
    unlocked: false,
  },
  {
    id: 'barbarian_bowl' as ArenaId,
    name: 'Barbarian Bowl',
    minLevel: 10,
    minXP: 2000,
    color: 'from-red-600 to-rose-800',
    gradient: 'from-red-600 to-rose-800',
    icon: '⚔️',
    description: 'Les Barbares dominent cette arène !',
    unlocked: false,
  },
  {
    id: 'pekkas_playhouse' as ArenaId,
    name: "P.E.K.K.A's Playhouse",
    minLevel: 15,
    minXP: 5000,
    color: 'from-purple-600 to-violet-800',
    gradient: 'from-purple-600 to-violet-800',
    icon: '🤖',
    description: 'P.E.K.K.A règne en maître ici.',
    unlocked: false,
  },
  {
    id: 'spell_valley' as ArenaId,
    name: 'Spell Valley',
    minLevel: 20,
    minXP: 10000,
    color: 'from-blue-600 to-indigo-800',
    gradient: 'from-blue-600 to-indigo-800',
    icon: '🔮',
    description: 'La magie coule à flots dans cette vallée.',
    unlocked: false,
  },
  {
    id: 'royal_arena' as ArenaId,
    name: 'Royal Arena',
    minLevel: 30,
    minXP: 25000,
    color: 'from-amber-500 to-yellow-700',
    gradient: 'from-amber-500 to-yellow-700',
    icon: '👑',
    description: 'Seuls les meilleurs atteignent l\'arène royale.',
    unlocked: false,
  },
];

// --- Persistence ---
const STORAGE_KEY = 'goal_v2_gamestate';

export const saveGameState = (state: GameState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
};

export const loadGameState = (): GameState | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return null;
  }
};

const getDefaultAvatars = (): Avatar[] => [
  { id: '1', emoji: '🧙\u200d♂️', name: 'Mage', unlockLevel: 1, unlocked: true },
  { id: '2', emoji: '🥷', name: 'Ninja', unlockLevel: 5, unlocked: false },
  { id: '3', emoji: '🧛', name: 'Vampire', unlockLevel: 10, unlocked: false },
  { id: '4', emoji: '🤖', name: 'Robot', unlockLevel: 15, unlocked: false },
];

const getDefaultBanners = (): Banner[] => [
  { id: '1', name: 'Classique', gradient: 'from-blue-600 to-indigo-900', unlockLevel: 1, unlocked: true },
  { id: '2', name: 'Forêt', gradient: 'from-green-600 to-emerald-900', unlockLevel: 5, unlocked: false },
];

export const getInitialGameState = (): GameState => {
  const now = new Date().toISOString();
  return {
    playerId: generateId(), playerName: 'Nouveau Joueur', avatarId: '1', bannerId: '1', memberSince: now,
    xp: 0, gold: 0, gems: 0, level: 1, currentArena: 'goblin_stadium',
    goals: [], habits: [], combatSessions: [],
    avatars: getDefaultAvatars(), banners: getDefaultBanners(),
    badges: [], potions: [], activePotions: [],
    dailyChest: { lastOpenedDate: null, streak: 0, isAvailable: true },
    notifications: [],
    stats: { totalXP: 0, totalGold: 0, totalGems: 0, totalGoalsCompleted: 0, totalHabitsCompleted: 0, totalCombatMinutes: 0, totalChestsOpened: 0, currentStreak: 0, longestStreak: 0, averageProgress: 0, dailyStats: [] },
    music: { isPlaying: false, isMuted: false, volume: 0.5, currentTrackIndex: 0 },
    calendarSync: { enabled: false },
    currentView: 'arena', activeFilter: 'all', viewMode: 'list',
    createdAt: now, updatedAt: now, version: '2.0.0'
  };
};

export interface CategoryInfo { id: GoalCategory; label: string; icon: string; color: string; }
export const CATEGORIES: CategoryInfo[] = [
  { id: 'health', label: 'Santé', icon: '🥗', color: '#10b981' },
  { id: 'career', label: 'Carrière', icon: '💼', color: '#3b82f6' },
  { id: 'education', label: 'Éducation', icon: '📚', color: '#8b5cf6' },
  { id: 'personal', label: 'Personnel', icon: '🌱', color: '#ec4899' },
  { id: 'finance', label: 'Finance', icon: '💰', color: '#f59e0b' },
  { id: 'sport', label: 'Sport', icon: '🏃', color: '#ef4444' },
  { id: 'learning', label: 'Apprentissage', icon: '🧠', color: '#06b6d4' },
  { id: 'social', label: 'Social', icon: '🤝', color: '#f97316' },
  { id: 'creativity', label: 'Créativité', icon: '🎨', color: '#d946ef' },
  { id: 'productivity', label: 'Productivité', icon: '⚡', color: '#6366f1' },
  { id: 'other', label: 'Autre', icon: '✨', color: '#64748b' },
];

export const getCategoryInfo = (id: GoalCategory): CategoryInfo =>
  CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
