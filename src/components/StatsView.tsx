import { Goal, Habit, UserProfile } from '../types';
import { categoryColors, categoryIcons, weekDays } from '../utils';

interface StatsViewProps {
  goals: Goal[];
  habits: Habit[];
  profile: UserProfile;
}

export default function StatsView({ goals, habits, profile }: StatsViewProps) {
  // Calculate stats
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const goalsCompletionRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.longestStreak)) : 0;
  const totalHabitsCompleted = habits.reduce((acc, h) => acc + h.completedDates.length, 0);

  // Category breakdown
  const categories = ['health', 'career', 'education', 'personal', 'finance', 'sport', 'other'] as const;
  const categoryData = categories.map(cat => ({
    cat,
    total: goals.filter(g => g.category === cat).length,
    completed: goals.filter(g => g.category === cat && g.status === 'completed').length,
  })).filter(d => d.total > 0);

  // Last 7 days habits activity
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString().split('T')[0],
      day: weekDays[d.getDay()],
    };
  });

  const habitsActivityByDay = last7Days.map(({ date, day }) => ({
    day,
    count: habits.reduce((acc, h) => acc + (h.completedDates.includes(date) ? 1 : 0), 0),
    total: habits.length,
  }));

  const maxDayCount = Math.max(...habitsActivityByDay.map(d => d.count), 1);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">📊 Statistiques</h1>
        <p className="text-white/40 text-sm mt-0.5">Vue d’ensemble de votre progression</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4">
          <p className="text-3xl font-bold text-violet-400">{profile.level}</p>
          <p className="text-sm text-white/60 mt-1">Niveau actuel</p>
          <p className="text-xs text-white/30 mt-0.5">{profile.xp}/{profile.xpToNextLevel} XP</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-3xl font-bold text-yellow-400">{profile.weeklyXP}</p>
          <p className="text-sm text-white/60 mt-1">XP cette semaine</p>
          <p className="text-xs text-white/30 mt-0.5">{profile.monthlyXP} XP ce mois</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-3xl font-bold text-green-400">{completedGoals}</p>
          <p className="text-sm text-white/60 mt-1">Objectifs terminés</p>
          <p className="text-xs text-white/30 mt-0.5">{goalsCompletionRate}% de succès</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-3xl font-bold text-orange-400">{maxStreak}</p>
          <p className="text-sm text-white/60 mt-1">Record de série</p>
          <p className="text-xs text-white/30 mt-0.5">{totalHabitsCompleted} complétions</p>
        </div>
      </div>

      {/* Goals Progress Overview */}
      <div className="glass-card p-4">
        <h2 className="text-base font-semibold text-white mb-3">Objectifs en cours</h2>
        {activeGoals === 0 ? (
          <p className="text-white/30 text-sm text-center py-4">Aucun objectif actif</p>
        ) : (
          <div className="space-y-3">
            {goals.filter(g => g.status === 'active').map(goal => (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white/70 truncate flex-1">{goal.title}</span>
                  <span className="text-xs text-white/40 ml-2">{goal.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-bar-fill bg-gradient-to-r ${categoryColors[goal.category]}`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Habits Activity */}
      <div className="glass-card p-4">
        <h2 className="text-base font-semibold text-white mb-3">Activité des 7 derniers jours</h2>
        <div className="flex items-end gap-2 h-20">
          {habitsActivityByDay.map(({ day, count, total }) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{ height: '60px' }}>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-violet-600 to-indigo-500 transition-all duration-500"
                  style={{ height: total > 0 ? `${(count / maxDayCount) * 60}px` : '4px', minHeight: '4px' }}
                />
              </div>
              <span className="text-[10px] text-white/40">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="glass-card p-4">
          <h2 className="text-base font-semibold text-white mb-3">Par catégorie</h2>
          <div className="space-y-3">
            {categoryData.map(({ cat, total, completed }) => (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white/70 flex items-center gap-2">
                    <span>{categoryIcons[cat]}</span>
                    <span className="capitalize">{cat}</span>
                  </span>
                  <span className="text-xs text-white/40">{completed}/{total}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-bar-fill bg-gradient-to-r ${categoryColors[cat]}`}
                    style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
