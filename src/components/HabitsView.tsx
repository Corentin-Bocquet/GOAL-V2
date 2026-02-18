import { Habit } from '../types';
import HabitCard from './HabitCard';
import { isHabitCompletedToday } from '../utils';

interface HabitsViewProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
  onDeleteHabit: (habitId: string) => void;
  onAddHabit: () => void;
}

export default function HabitsView({ habits, onToggleHabit, onDeleteHabit, onAddHabit }: HabitsViewProps) {
  const completedToday = habits.filter(h => isHabitCompletedToday(h)).length;
  const totalToday = habits.length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  const totalStreak = habits.reduce((acc, h) => acc + h.currentStreak, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">🔄 Habitudes</h1>
          <p className="text-white/40 text-sm mt-0.5">{completedToday}/{totalToday} faites aujourd’hui</p>
        </div>
        <button onClick={onAddHabit} className="btn-primary flex items-center gap-2">
          <span className="text-lg">+</span>
          <span className="hidden sm:block">Ajouter</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{completedToday}</p>
          <p className="text-xs text-white/40 mt-0.5">Faites</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-violet-400">{completionRate}%</p>
          <p className="text-xs text-white/40 mt-0.5">Taux</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-orange-400">{totalStreak}</p>
          <p className="text-xs text-white/40 mt-0.5">Jours cumulés</p>
        </div>
      </div>

      {/* Daily Progress */}
      {totalToday > 0 && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60 font-medium">Progression du jour</span>
            <span className="text-sm font-bold text-white">{completedToday}/{totalToday}</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill bg-gradient-to-r from-green-500 to-emerald-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-4xl mb-3">🔄</p>
          <p className="text-white/60 font-medium">Aucune habitude</p>
          <p className="text-white/30 text-sm mt-1">Créez votre première habitude !</p>
          <button onClick={onAddHabit} className="btn-primary mt-4">
            Ajouter une habitude
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={onToggleHabit}
              onDelete={onDeleteHabit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
