import { useState, useEffect, useCallback } from 'react';
import { Goal, Habit, UserProfile, AppState } from './types';
import { generateId, calcLevelFromXP, saveState, loadState, xpRewardByPriority, calcHabitStreak } from './utils';
import Navbar from './components/Navbar';
import XPBar from './components/XPBar';
import GoalsView from './components/GoalsView';
import HabitsView from './components/HabitsView';
import StatsView from './components/StatsView';
import ProfileView from './components/ProfileView';
import AddGoalModal from './components/AddGoalModal';
import AddHabitModal from './components/AddHabitModal';

const defaultProfile: UserProfile = {
  id: '1',
  name: 'Joueur',
  avatar: '🧙',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
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
    description: 'Maîtriser React avec TypeScript pour créer des applications web modernes',
    category: 'education',
    priority: 'high',
    status: 'active',
    progress: 45,
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    description: 'Preparer et courir un 10km sous 1h',
    category: 'sport',
    priority: 'medium',
    status: 'active',
    progress: 30,
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    xpReward: 100,
    milestones: [
      { id: generateId(), title: 'Courir 3km sans s’arrêter', completed: true, completedAt: new Date().toISOString() },
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
    targetDays: [1, 2, 3, 4, 5, 6, 0],
    completedDates: [],
    currentStreak: 0,
    longestStreak: 0,
    xpPerCompletion: 10,
    createdAt: new Date().toISOString(),
    color: 'from-green-500 to-emerald-600',
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
    currentStreak: 0,
    longestStreak: 0,
    xpPerCompletion: 15,
    createdAt: new Date().toISOString(),
    color: 'from-purple-500 to-violet-600',
    icon: '📚',
  },
];

function App() {
  const [goals, setGoals] = useState<Goal[]>(() => loadState('goals', sampleGoals));
  const [habits, setHabits] = useState<Habit[]>(() => loadState('habits', sampleHabits));
  const [profile, setProfile] = useState<UserProfile>(() => loadState('profile', defaultProfile));
  const [activeView, setActiveView] = useState<AppState['activeView']>('goals');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [xpAnimation, setXpAnimation] = useState(false);

  // Save state to localStorage on change
  useEffect(() => { saveState('goals', goals); }, [goals]);
  useEffect(() => { saveState('habits', habits); }, [habits]);
  useEffect(() => { saveState('profile', profile); }, [profile]);

  const addXP = useCallback((amount: number) => {
    setProfile(prev => {
      const newTotalXP = (prev.xp + amount) + calcLevelFromXP(0).currentXP;
      const { level, currentXP, xpToNext } = calcLevelFromXP(prev.xp + amount);
      return {
        ...prev,
        xp: currentXP,
        level,
        xpToNextLevel: xpToNext,
        weeklyXP: prev.weeklyXP + amount,
        monthlyXP: prev.monthlyXP + amount,
      };
    });
    setXpAnimation(true);
    setTimeout(() => setXpAnimation(false), 1000);
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goal,
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
      const newProgress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : g.progress;
      return { ...g, milestones, progress: newProgress, updatedAt: new Date().toISOString() };
    }));
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  }, []);

  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'currentStreak' | 'longestStreak'>) => {
    const newHabit: Habit = {
      ...habit,
      id: generateId(),
      createdAt: new Date().toISOString(),
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
    };
    setHabits(prev => [newHabit, ...prev]);
    setShowAddHabit(false);
  }, []);

  const toggleHabitToday = useCallback((habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const alreadyDone = h.completedDates.includes(today);
      const newDates = alreadyDone
        ? h.completedDates.filter(d => d !== today)
        : [...h.completedDates, today];
      const newStreak = calcHabitStreak(newDates);
      if (!alreadyDone) {
        addXP(h.xpPerCompletion);
        setProfile(p => ({ ...p, totalHabitsCompleted: p.totalHabitsCompleted + 1 }));
      }
      return {
        ...h,
        completedDates: newDates,
        currentStreak: newStreak,
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
    <div className="app-background min-h-screen">
      {/* Top XP Bar */}
      <XPBar profile={profile} xpAnimation={xpAnimation} />
      
      {/* Main Content */}
      <main className="pb-24 pt-20 px-4 max-w-4xl mx-auto">
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
          <ProfileView
            profile={profile}
            goals={goals}
            habits={habits}
            onUpdateProfile={updateProfile}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <Navbar activeView={activeView} onChangeView={setActiveView} />

      {/* Modals */}
      {showAddGoal && (
        <AddGoalModal onAdd={addGoal} onClose={() => setShowAddGoal(false)} />
      )}
      {showAddHabit && (
        <AddHabitModal onAdd={addHabit} onClose={() => setShowAddHabit(false)} />
      )}
    </div>
  );
}

export default App;
