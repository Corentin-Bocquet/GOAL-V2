export type GoalCategory = 'health' | 'career' | 'education' | 'personal' | 'finance' | 'sport' | 'other';
export type GoalPriority = 'low' | 'medium' | 'high';
export type GoalStatus = 'active' | 'completed' | 'paused';
export type HabitFrequency = 'daily' | 'weekly';

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number; // 0-100
  targetDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  xpReward: number;
  milestones: Milestone[];
  tags: string[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  frequency: HabitFrequency;
  targetDays: number[]; // 0=Sunday, 1=Monday, ...
  completedDates: string[]; // ISO date strings
  currentStreak: number;
  longestStreak: number;
  xpPerCompletion: number;
  createdAt: string;
  color: string;
  icon: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalGoalsCompleted: number;
  totalHabitsCompleted: number;
  joinedAt: string;
  badges: Badge[];
  weeklyXP: number;
  monthlyXP: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AppState {
  goals: Goal[];
  habits: Habit[];
  profile: UserProfile;
  activeView: 'goals' | 'habits' | 'stats' | 'profile';
  darkMode: boolean;
}

export interface Stats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalHabits: number;
  activeHabits: number;
  weeklyProgress: WeeklyProgress[];
  categoryBreakdown: CategoryBreakdown[];
  longestStreak: number;
  currentStreak: number;
}

export interface WeeklyProgress {
  day: string;
  goalsProgress: number;
  habitsCompleted: number;
  xpEarned: number;
}

export interface CategoryBreakdown {
  category: GoalCategory;
  count: number;
  completed: number;
}
