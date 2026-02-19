// ============================================================
// GOAL-V2 - Full Type System
// ============================================================

// --- Base Enums ---
export type GoalCategory = 'health' | 'career' | 'education' | 'personal' | 'finance' | 'sport' | 'other' | 'learning' | 'social' | 'creativity' | 'productivity';
export type GoalPriority = 'low' | 'medium' | 'high';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'archived';
export type GoalDifficulty = 'easy' | 'medium' | 'hard' | 'epic';
export type HabitFrequency = 'daily' | 'weekly';

// --- Arena System ---
export type ArenaId = 'goblin_stadium' | 'bone_pit' | 'barbarian_bowl' | 'pekkas_playhouse' | 'spell_valley' | 'royal_arena' | 'frozen_peak' | 'legendary_arena';

export interface Arena {
  id: ArenaId;
  name: string;
  minLevel: number;
  minXP: number;
  color: string;
  gradient: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

// --- XP & Leveling ---
export interface LevelInfo {
  level: number;
  currentXP: number;
  requiredXP: number;
  arena: ArenaId;
  title: string;
}

// --- Currency ---
export interface Currency {
  gold: number;
  gems: number;
  xp: number;
}

// --- Loot System ---
export type ChestRarity = 'wood' | 'steel' | 'gold' | 'amethyst' | 'obsidian';

export interface Chest {
  id: string;
  rarity: ChestRarity;
  goldMin: number;
  goldMax: number;
  xpMin: number;
  xpMax: number;
  gemChance: number;
  gemsMax: number;
  icon: string;
  color: string;
  animationClass: string;
}

export interface LootReward {
  gold: number;
  xp: number;
  gems: number;
  chestRarity: ChestRarity;
}

// --- Daily Chest ---
export interface DailyChestState {
  lastOpenedDate: string | null;
  streak: number;
  isAvailable: boolean;
}

// --- Potions ---
export type PotionType = 'xp_double' | 'gold_boost' | 'shield' | 'speed';

export interface Potion {
  id: string;
  type: PotionType;
  name: string;
  description: string;
  icon: string;
  duration: number; // minutes
  multiplier: number;
  color: string;
  quantity: number;
}

export interface ActivePotion {
  type: PotionType;
  expiresAt: string; // ISO date
}

// --- Avatar & Banner ---
export interface Avatar {
  id: string;
  emoji: string;
  name: string;
  unlockLevel: number;
  unlockArena?: ArenaId;
  unlocked: boolean;
}

export interface Banner {
  id: string;
  name: string;
  gradient: string;
  unlockLevel: number;
  unlocked: boolean;
}

// --- Badge ---
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
}

// --- Quest / Objective Hierarchy ---
export interface SubSubQuest {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface SubQuest {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  progress: number;
  subSubQuests: SubSubQuest[];
  createdAt: string;
}

// --- Milestone ---
export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  xpReward: number;
}

// --- Goal ---
export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  difficulty: GoalDifficulty;
  progress: number; // 0-100
  target: number;
  unit: string;
  targetDate: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  completedAt?: string;
  xpReward: number;
  goldReward: number;
  milestones: Milestone[];
  subQuests: SubQuest[];
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  templateId?: string;
  viewMode?: 'list' | 'grid' | 'calendar';
  illustration?: string;
  googleCalendarEventId?: string;
}

// --- Habit ---
export interface Habit {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  frequency: HabitFrequency;
  targetDays: number[];
  completedDates: string[];
  streak: number;
  longestStreak: number;
  xpReward: number;
  goldReward: number;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  isFavorite: boolean;
  color: string;
  icon: string;
}

// --- Combat / Focus Timer ---
export type CombatStatus = 'idle' | 'active' | 'paused' | 'completed' | 'failed';

export interface CombatSession {
  id: string;
  goalId?: string;
  habitId?: string;
  title: string;
  duration: number; // minutes
  elapsed: number; // seconds
  status: CombatStatus;
  xpReward: number;
  goldReward: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

// --- Goal Template ---
export interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  category: GoalCategory;
  difficulty: GoalDifficulty;
  defaultDuration: number; // days
  icon: string;
  tags: string[];
  milestones: Omit<Milestone, 'id' | 'completed' | 'completedAt'>[];
  subQuests: Omit<SubQuest, 'id' | 'completed' | 'progress' | 'createdAt' | 'subSubQuests'>[];
}

// --- Stats ---
export interface DailyStats {
  date: string;
  xpEarned: number;
  goldEarned: number;
  goalsCompleted: number;
  habitsCompleted: number;
  combatMinutes: number;
  chestsOpened: number;
}

export interface GlobalStats {
  totalXP: number;
  totalGold: number;
  totalGems: number;
  totalGoalsCompleted: number;
  totalHabitsCompleted: number;
  totalCombatMinutes: number;
  totalChestsOpened: number;
  currentStreak: number;
  longestStreak: number;
  averageProgress: number;
  dailyStats: DailyStats[];
}

// --- Notification ---
export interface GameNotification {
  id: string;
  type: 'xp' | 'gold' | 'gems' | 'badge' | 'levelup' | 'chest' | 'arena' | 'quest';
  message: string;
  value?: number;
  icon: string;
  createdAt: string;
  read: boolean;
}

// --- Music ---
export interface MusicTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
}

export interface MusicState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrackIndex: number;
}

// --- View ---
export type ViewType = 'arena' | 'quests' | 'habits' | 'stats' | 'profile' | 'combat' | 'loot';

// --- Google Calendar ---
export interface CalendarSync {
  enabled: boolean;
  lastSync?: string;
  accessToken?: string;
}

// --- Master GameState ---
export interface GameState {
  // Identity
  playerId: string;
  playerName: string;
  avatarId: string;
  bannerId: string;
  memberSince: string;

  // Economy
  xp: number;
  gold: number;
  gems: number;
  level: number;
  currentArena: ArenaId;

  // Content
  goals: Goal[];
  habits: Habit[];
  combatSessions: CombatSession[];

  // Unlockables
  avatars: Avatar[];
  banners: Banner[];
  badges: Badge[];
  potions: Potion[];
  activePotions: ActivePotion[];

  // Daily
  dailyChest: DailyChestState;
  notifications: GameNotification[];

  // Stats
  stats: GlobalStats;

  // Music
  music: MusicState;

  // Calendar
  calendarSync: CalendarSync;

  // UI
  currentView: ViewType;
  activeFilter: string;
  viewMode: 'list' | 'grid' | 'calendar';

  // Meta
  createdAt: string;
  updatedAt: string;
  version: string;
}
