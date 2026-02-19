import { 
  GameState, Goal, Habit, Arena, ArenaId, LevelInfo, Chest, ChestRarity, LootReward, 
  Avatar, Banner, Badge, Potion, GoalCategory, Milestone, SubQuest, CombatSession,
  ViewType, MusicState, CalendarSync, GlobalStats
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
  const required = calcXPForLevel(level);
  const arenas = getArenas();
  const currentArena = [...arenas].reverse().find(a => level >= a.minLevel) || arenas[0];
  return {
    level,
    currentXP: remaining,
    requiredXP: required,
    arena: currentArena.id,
    title: getLevelTitle(level)
  };
};

const getLevelTitle = (level: number): string => {
  if (level < 5) return 'Apprenti';
  if (level < 10) return 'Guerrier';
  if (level < 20) return 'Chevalier';
  if (level < 35) return 'Maître';
  if (level < 50) return 'Seigneur';
  return 'Légende';
};

// --- Arena Data ---
export const getArenas = (): Arena[] => [
  { id: 'goblin_stadium', name: 'Goblin Stadium', minLevel: 1, minXP: 0, color: '#4ade80', gradient: 'from-green-500 to-emerald-700', icon: '🎋', description: 'Le début de votre aventure.', unlocked: true },
  { id: 'bone_pit', name: 'Bone Pit', minLevel: 5, minXP: calcTotalXPForLevel(5), color: '#9ca3af', gradient: 'from-gray-400 to-slate-600', icon: '🦴', description: 'Un terrain rocailleux rempli de défis.', unlocked: false },
  { id: 'barbarian_bowl', name: 'Barbarian Bowl', minLevel: 10, minXP: calcTotalXPForLevel(10), color: '#fbbf24', gradient: 'from-yellow-400 to-amber-700', icon: '⚔️', description: 'La force brute est nécessaire ici.', unlocked: false },
  { id: 'pekkas_playhouse', name: "P.E.K.K.A's Playhouse", minLevel: 15, minXP: calcTotalXPForLevel(15), color: '#c084fc', gradient: 'from-purple-400 to-fuchsia-800', icon: '🤖', description: 'Technologie et magie se rencontrent.', unlocked: false },
  { id: 'spell_valley', name: 'Spell Valley', minLevel: 20, minXP: calcTotalXPForLevel(20), color: '#60a5fa', gradient: 'from-blue-400 to-indigo-800', icon: '🔮', description: 'Le royaume des arcanes.', unlocked: false }
];

// --- Loot Logic ---
export const getChestData = (rarity: ChestRarity): Chest => {
  const chestMap: Record<ChestRarity, Partial<Chest>> = {
    wood: { goldMin: 10, goldMax: 30, xpMin: 20, xpMax: 50, gemChance: 0.05, gemsMax: 2, icon: '📦', color: '#92400e' },
    steel: { goldMin: 40, goldMax: 80, xpMin: 60, xpMax: 120, gemChance: 0.15, gemsMax: 5, icon: '⚙️', color: '#64748b' },
    gold: { goldMin: 100, goldMax: 250, xpMin: 150, xpMax: 300, gemChance: 0.40, gemsMax: 15, icon: '💰', color: '#fbbf24' },
    amethyst: { goldMin: 500, goldMax: 1000, xpMin: 600, xpMax: 1200, gemChance: 0.80, gemsMax: 50, icon: '💎', color: '#c084fc' },
    obsidian: { goldMin: 2000, goldMax: 5000, xpMin: 2500, xpMax: 5000, gemChance: 1.0, gemsMax: 200, icon: '🔥', color: '#1e293b' }
  };
  const data = chestMap[rarity];
  return { id: rarity, rarity, goldMin: data.goldMin!, goldMax: data.goldMax!, xpMin: data.xpMin!, xpMax: data.xpMax!, gemChance: data.gemChance!, gemsMax: data.gemsMax!, icon: data.icon!, color: data.color!, animationClass: `animate-chest-${rarity}` } as Chest;
};

export const openChest = (rarity: ChestRarity): LootReward => {
  const data = getChestData(rarity);
  const gold = Math.floor(Math.random() * (data.goldMax - data.goldMin + 1)) + data.goldMin;
  const xp = Math.floor(Math.random() * (data.xpMax - data.xpMin + 1)) + data.xpMin;
  let gems = 0;
  if (Math.random() < data.gemChance) { gems = Math.floor(Math.random() * data.gemsMax) + 1; }
  return { gold, xp, gems, chestRarity: rarity };
};

export const formatCurrency = (value: number): string => new Intl.NumberFormat('fr-FR').format(value);

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getDaysRemaining = (targetDate: string): number => {
  const diffTime = new Date(targetDate).getTime() - new Date().getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const STORAGE_KEY = 'goal_v2_gamestate';
export const saveGameState = (state: GameState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
};
export const loadGameState = (): GameState | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try { return JSON.parse(saved); } catch (e) { return null; }
};

const getDefaultAvatars = (): Avatar[] => [
  { id: '1', emoji: '🧙‍♂️', name: 'Mage', unlockLevel: 1, unlocked: true },
  { id: '2', emoji: '🥷', name: 'Ninja', unlockLevel: 5, unlocked: false },
  { id: '3', emoji: '🧛', name: 'Vampire', unlockLevel: 10, unlocked: false },
  { id: '4', emoji: '🤖', name: 'Robot', unlockLevel: 15, unlocked: false }
];
const getDefaultBanners = (): Banner[] => [
  { id: '1', name: 'Classique', gradient: 'from-blue-600 to-indigo-900', unlockLevel: 1, unlocked: true },
  { id: '2', name: 'Forêt', gradient: 'from-green-600 to-emerald-900', unlockLevel: 5, unlocked: false }
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
  { id: 'other', label: 'Autre', icon: '✨', color: '#64748b' }
];
export const getCategoryInfo = (id: GoalCategory): CategoryInfo => CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
