import { Habit } from '../types';
import { categoryBgColors, isHabitCompletedToday, weekDays } from '../utils';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const completedToday = isHabitCompletedToday(habit);

  // Get last 7 days for the calendar view
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="glass-card-hover p-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${habit.color} flex items-center justify-center flex-shrink-0 text-lg`}>
          {habit.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-white text-base truncate">{habit.title}</h3>
            <button
              onClick={() => onDelete(habit.id)}
              className="text-white/20 hover:text-red-400 transition-colors p-1 flex-shrink-0"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryBgColors[habit.category]}`}>
              {habit.category}
            </span>
            <span className="text-xs text-white/40">{habit.frequency}</span>
            <span className="text-xs text-violet-400 font-medium">+{habit.xpPerCompletion} XP</span>
          </div>
        </div>
      </div>

      {/* Streak Info */}
      <div className="mt-3 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🔥</span>
          <div>
            <p className="text-xs text-white/40">Série actuelle</p>
            <p className="text-sm font-bold text-orange-400">{habit.currentStreak} jours</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🏆</span>
          <div>
            <p className="text-xs text-white/40">Record</p>
            <p className="text-sm font-bold text-yellow-400">{habit.longestStreak} jours</p>
          </div>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => onToggle(habit.id)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
              completedToday
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'btn-primary'
            }`}
          >
            {completedToday ? '✓ Fait !' : 'Marquer fait'}
          </button>
        </div>
      </div>

      {/* 7-day calendar */}
      <div className="mt-3">
        <div className="flex gap-1">
          {last7Days.map((date, idx) => {
            const done = habit.completedDates.includes(date);
            const isToday = idx === 6;
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <span className={`text-[10px] ${isToday ? 'text-white/70' : 'text-white/30'}`}>
                  {weekDays[new Date(date + 'T00:00:00').getDay()]}
                </span>
                <div className={`w-full aspect-square rounded-md flex items-center justify-center ${
                  done
                    ? `bg-gradient-to-br ${habit.color} opacity-90`
                    : isToday ? 'bg-white/10 border border-white/20' : 'bg-white/5'
                }`}>
                  {done && <span className="text-[10px] text-white">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
