import { useState } from 'react';
import { Goal, GoalCategory, GoalStatus } from '../types';
import GoalCard from './GoalCard';

interface GoalsViewProps {
  goals: Goal[];
  onUpdateProgress: (goalId: string, progress: number) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onDeleteGoal: (goalId: string) => void;
  onAddGoal: () => void;
}

const filterOptions: { label: string; value: GoalStatus | 'all' }[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Actifs', value: 'active' },
  { label: 'Terminés', value: 'completed' },
  { label: 'En pause', value: 'paused' },
];

export default function GoalsView({ goals, onUpdateProgress, onToggleMilestone, onDeleteGoal, onAddGoal }: GoalsViewProps) {
  const [filter, setFilter] = useState<GoalStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<GoalCategory | 'all'>('all');

  const filteredGoals = goals.filter(g => {
    const statusMatch = filter === 'all' || g.status === filter;
    const catMatch = categoryFilter === 'all' || g.category === categoryFilter;
    return statusMatch && catMatch;
  });

  const activeCount = goals.filter(g => g.status === 'active').length;
  const completedCount = goals.filter(g => g.status === 'completed').length;
  const avgProgress = goals.length > 0
    ? Math.round(goals.filter(g => g.status === 'active').reduce((acc, g) => acc + g.progress, 0) / Math.max(activeCount, 1))
    : 0;

  return (
    <div className="space-y-4 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">🎯 Objectifs</h1>
          <p className="text-white/40 text-sm mt-0.5">{activeCount} actifs • {completedCount} terminés</p>
        </div>
        <button onClick={onAddGoal} className="btn-primary flex items-center gap-2">
          <span className="text-lg">+</span>
          <span className="hidden sm:block">Ajouter</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-violet-400">{goals.length}</p>
          <p className="text-xs text-white/40 mt-0.5">Total</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">{activeCount}</p>
          <p className="text-xs text-white/40 mt-0.5">En cours</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{avgProgress}%</p>
          <p className="text-xs text-white/40 mt-0.5">Moy. progression</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              filter === opt.value
                ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
                : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Goal List */}
      {filteredGoals.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-white/60 font-medium">Aucun objectif trouvé</p>
          <p className="text-white/30 text-sm mt-1">Créez votre premier objectif !</p>
          <button onClick={onAddGoal} className="btn-primary mt-4">
            Ajouter un objectif
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdateProgress={onUpdateProgress}
              onToggleMilestone={onToggleMilestone}
              onDelete={onDeleteGoal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
