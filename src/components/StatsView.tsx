import { GameState } from '../types';
import { calcLevelFromXP } from '../utils';

const categoryIcons: Record<string, string> = {
  health: '🏃',
  career: '💼',
  education: '📚',
  personal: '✨',
  finance: '💰',
  sport: '🏆',
  other: '📦',
  learning: '🧠',
  social: '🤝',
  creativity: '🎨',
  productivity: '⚡',
};

const weekDays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

interface StatsViewProps {
  state: GameState;
}

export default function StatsView({ state }: StatsViewProps) {
  const { goals, habits } = state;
  const levelInfo = calcLevelFromXP(state.xp);

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
    icon: categoryIcons[cat] || '📦',
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
        <h1 className="text-2xl font-black text-white">📊 Statistiques</h1>
        <p className="text-slate-400 text-sm mt-0.5">Vue d’ensemble de ta progression</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <p className="text-3xl font-black text-blue-400">{levelInfo.level}</p>
          <p className="text-sm text-slate-400 mt-1">Niveau actuel</p>
          <p className="text-xs text-slate-500 mt-0.5">{levelInfo.currentXP}/{levelInfo.requiredXP} XP</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <p className="text-3xl font-black text-yellow-400">{state.xp.toLocaleString()}</p>
          <p className="text-sm text-slate-400 mt-1">XP total</p>
          <p className="text-xs text-slate-500 mt-0.5">🥇 {levelInfo.title}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <p className="text-3xl font-black text-green-400">{completedGoals}</p>
          <p className="text-sm text-slate-400 mt-1">Objectifs terminés</p>
          <p className="text-xs text-slate-500 mt-0.5">{goalsCompletionRate}% de succès</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <p className="text-3xl font-black text-orange-400">{maxStreak}</p>
          <p className="text-sm text-slate-400 mt-1">Record de série</p>
          <p className="text-xs text-slate-500 mt-0.5">{totalHabitsCompleted} complétions</p>
        </div>
      </div>

      {/* Economy */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Ressources</h2>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-2xl font-black text-yellow-400">{state.gold.toLocaleString()}</p>
            <p className="text-xs text-slate-500">💰 Or</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-purple-400">{state.gems}</p>
            <p className="text-xs text-slate-500">💎 Gemmes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-blue-400">{activeGoals}</p>
            <p className="text-xs text-slate-500">🎯 Actifs</p>
          </div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Activité 7 derniers jours</h2>
        <div className="flex items-end gap-2 h-20">
          {habitsActivityByDay.map(({ day, count, total }) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{ height: '60px' }}>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-indigo-500 transition-all duration-500"
                  style={{ height: total > 0 ? `${(count / maxDayCount) * 60}px` : '4px', minHeight: '4px' }}
                />
              </div>
              <span className="text-[10px] text-slate-500">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Par catégorie</h2>
          <div className="space-y-3">
            {categoryData.map(({ cat, total, completed, icon }) => (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-300 flex items-center gap-2">
                    <span>{icon}</span>
                    <span className="capitalize">{cat}</span>
                  </span>
                  <span className="text-xs text-slate-500">{completed}/{total}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
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
