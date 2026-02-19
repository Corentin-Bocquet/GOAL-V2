import { useState, useEffect, useCallback } from 'react';
import { Goal, Habit, UserProfile } from './types';
import {
  generateId,
  calculateLevel,
  calculateStreak,
  isCompletedToday,
} from './utils';
import Navbar from './components/Navbar';
import XPBar from './components/XPBar';
import GoalsView from './components/GoalsView';
import HabitsView from './components/HabitsView';
import StatsView from './components/StatsView';
import ProfileView from './components/ProfileView';
import AddGoalModal from './components/AddGoalModal';
import AddHabitModal from './components/AddHabitModal';

const XP_PER_LEVEL = 500;

function saveState<T>(key: string, value: T): void {
  try { localStorage.setItem(`goal-v2-${key}`, JSON.stringify(value)); } catch {}
}

function loadState<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(`goal-v2-${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch { return defaultValue; }
}

const defaultProfile: UserProfile = {
  id: '1',
  name: 'Joueur',
  avatar: '🧙',
  level: 1,
  xp: 0,
  xpToNextLevel: XP_PER_LEVEL,
  totalGoalsCompleted: 0,
  totalHabitsCompleted: 0,
  joinedAt: new Date().toISOString(),
  badges: [],
  weeklyXP: 0,
  monthlyXP: 0,
};

const sampleGoals: Goal[] = [
  {
    id: generateId(),
    title: 'Apprendre React TypeScript',
    description: 'Maîtniser React avec TypeScript pour créer des applications web modernes',
    category: 'education',
    priority: 'high',
    status: 'active',
    difficulty: 'hard',
    progress: 45,
    target: 100,
    unit: '%',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
    xpReward: 200,
    milestones: [
      { id: generateId(), title: 'Bases de React', completed: true, completedAt: new Date().toISOString() },
      { id: generateId(), title: 'Hooks avancés', completed: false },
      { id: generateId(), title: 'TypeScript avec React', completed: false },
    ],
    tags: ['code', 'web', 'typescript'],
  },
  {
    id: generateId(),
    title: 'Courir un 10km',
    description: 'Préparer et courir un 10km sous 1h',
    category: 'sport',
    priority: 'medium',
    status: 'active',
    difficulty: 'medium',
    progress: 30,
    target: 100,
    unit: '%',
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completed: false,
    xpReward: 100,
    milestones: [
      { id: generateId(), title: 'Courir 3km sans arrêt', completed: true, completedAt: new Date().toISOString() },
      { id: generateId(), title: 'Courir 5km', completed: false },
      { id: generateId(), title: 'Courir 10km', completed: false },
    ],
    tags: ['sport', 'santé', 'endurance'],
  },
];

const sampleHabits: Habit[] = [
  {
    id: generateId(),
    title: 'Méditation matinale',
    description: '10 minutes de méditation chaque matin',
    category: 'health',
    frequency: 'daily',
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    completedDates: [],
    completedToday: false,
    currentStreak: 0,
    longestStreak: 0,
    streak: 0,
    xpPerCompletion: 10,
    xpReward: 10,
    createdAt: new Date().toISOString(),
    color: '#10b981',
    icon: '🧘',
  },
  {
    id: generateId(),
    title: 'Lecture 30min',
    description: 'Lire au moins 30 minutes par jour',
    category: 'education',
    frequency: 'daily',
    targetDays: [1, 2, 3, 4, 5],
    completedDates: [],
    completedToday: false,
    currentStreak: 0,
    longestStreak: 0,
    streak: 0,
    xpPerCompletion: 15,
    xpReward: 15,
    createdAt: new Date().toISOString(),
    color: '#8b5cf6',
    icon: '📚',
  },
];

function App() {
  const [goals, setGoals] = useState<Goal[]>(() => loadState('goals', sampleGoals));
  const [habits, setHabits] = useState<Habit[]>(() => loadState('habits', sampleHabits));
  const [profile, setProfile] = useState<UserProfile>(() => loadState('profile', defaultProfile));
  const [activeView, setActiveView] = useState<'goals' | 'habits' | 'stats' | 'profile'>('goals');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);

  useEffect(() => { saveState('goals', goals); }, [goals]);
  useEffect(() => { saveState('habits', habits); }, [habits]);
  useEffect(() => { saveState('profile', profile); }, [profile]);

  const addXP = useCallback((amount: number) => {
    setProfile(prev => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newLevel * XP_PER_LEVEL,
        weeklyXP: prev.weeklyXP + amount,
        monthlyXP: prev.monthlyXP + amount,
      };
    });
  }, []);

  const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGoals(prev => [newGoal, ...prev]);
    setShowAddGoal(false);
  }, []);

  const updateGoalProgress = useCallback((goalId: string, progress: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const wasCompleted = g.status === 'completed';
      const isNowCompleted = progress >= 100;
      if (!wasCompleted && isNowCompleted) {
        addXP(g.xpReward);
        setProfile(p => ({ ...p, totalGoalsCompleted: p.totalGoalsCompleted + 1 }));
      }
      return {
        ...g,
        progress: Math.min(100, Math.max(0, progress)),
        status: isNowCompleted ? 'completed' : 'active',
        completed: isNowCompleted,
        completedAt: isNowCompleted ? new Date().toISOString() : undefined,
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [addXP]);

  const toggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const milestones = g.milestones.map(m =>
        m.id === milestoneId
          ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined }
          : m
      );
      const completedCount = milestones.filter(m => m.completed).length;
      const newProgress = milestones.length > 0
        ? Math.round((completedCount / milestones.length) * 100)
        : g.progress;
      return { ...g, milestones, progress: newProgress, updatedAt: new Date().toISOString() };
    }));
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  }, []);

  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completedToday' | 'completedDates' | 'currentStreak' | 'longestStreak'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      completedDates: [],
      completedToday: false,
      currentStreak: 0,
      longestStreak: 0,
      streak: 0,
    };
    setHabits(prev => [newHabit, ...prev]);
    setShowAddHabit(false);
  }, []);

  const toggleHabitToday = useCallback((habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const alreadyDone = isCompletedToday(h.completedDates);
      const newDates = alreadyDone
        ? h.completedDates.filter(d => !d.startsWith(today))
        : [...h.completedDates, new Date().toISOString()];
      const newStreak = calculateStreak(newDates);
      if (!alreadyDone) {
        addXP(h.xpPerCompletion);
        setProfile(p => ({ ...p, totalHabitsCompleted: p.totalHabitsCompleted + 1 }));
      }
      return {
        ...h,
        completedDates: newDates,
        completedToday: !alreadyDone,
        currentStreak: newStreak,
        streak: newStreak,
        longestStreak: Math.max(h.longestStreak, newStreak),
      };
    }));
  }, [addXP]);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <XPBar profile={profile} />
      <div className="pb-20 pt-16 px-4 max-w-2xl mx-auto">
        {activeView === 'goals' && (
          <GoalsView
            goals={goals}
            onUpdateProgress={updateGoalProgress}
            onToggleMilestone={toggleMilestone}
            onDeleteGoal={deleteGoal}
            onAddGoal={() => setShowAddGoal(true)}
          />
        )}
        {activeView === 'habits' && (
          <HabitsView
            habits={habits}
            onToggleHabit={toggleHabitToday}
            onDeleteHabit={deleteHabit}
            onAddHabit={() => setShowAddHabit(true)}
          />
        )}
        {activeView === 'stats' && (
          <StatsView goals={goals} habits={habits} profile={profile} />
        )}
        {activeView === 'profile' && (
          <ProfileView profile={profile} goals={goals} habits={habits} onUpdateProfile={updateProfile} />
        )}
      </div>
      <Navbar activeView={activeView} onNavigate={setActiveView} />
      {showAddGoal && (
        <AddGoalModal
          onClose={() => setShowAddGoal(false)}
          onAdd={addGoal}
        />
      )}
      {showAddHabit && (
        <AddHabitModal
          onClose={() => setShowAddHabit(false)}
          onAdd={addHabit}
        />
      )}
    </div>
  );
}

export default App;
