import { useState } from 'react';
import { Goal } from '../types';
import { categoryBgColors, categoryIcons, priorityColors, formatDate, getDaysRemaining } from '../utils';

interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (goalId: string, progress: number) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onDelete: (goalId: string) => void;
}

export default function GoalCard({ goal, onUpdateProgress, onToggleMilestone, onDelete }: GoalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const daysRemaining = getDaysRemaining(goal.targetDate);
  const isOverdue = daysRemaining < 0;

  return (
    <div className={`glass-card-hover p-4 cursor-pointer select-none ${
      goal.status === 'completed' ? 'opacity-70' : ''
    }`}>
      {/* Header */}
      <div onClick={() => setExpanded(!expanded)} className="flex items-start gap-3">
        <div className="text-2xl mt-0.5">{categoryIcons[goal.category]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-semibold text-base truncate ${
              goal.status === 'completed' ? 'line-through text-white/50' : 'text-white'
            }`}>{goal.title}</h3>
            {goal.status === 'completed' && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">Terminé</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryBgColors[goal.category]}`}>
              {goal.category}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[goal.priority]}`}>
              {goal.priority}
            </span>
            <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-white/40'}`}>
              {isOverdue ? `${Math.abs(daysRemaining)}j de retard` : `${daysRemaining}j restants`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-violet-400 font-semibold">+{goal.xpReward} XP</span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(goal.id); }}
            className="text-white/20 hover:text-red-400 transition-colors p-1"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/40">Progression</span>
          <span className="text-xs font-semibold text-white/70">{goal.progress}%</span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-bar-fill bg-gradient-to-r ${
              goal.progress >= 100 ? 'from-green-500 to-emerald-500' :
              goal.progress >= 60 ? 'from-blue-500 to-violet-500' :
              'from-violet-500 to-indigo-500'
            }`}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      {/* Progress Input */}
      {expanded && (
        <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
          <div>
            <label className="text-xs text-white/50 mb-1 block">Mettre à jour la progression</label>
            <input
              type="range"
              min="0"
              max="100"
              value={goal.progress}
              onChange={(e) => onUpdateProgress(goal.id, parseInt(e.target.value))}
              className="w-full accent-violet-500"
            />
          </div>

          {/* Milestones */}
          {goal.milestones.length > 0 && (
            <div>
              <p className="text-xs text-white/50 mb-2">Milestones</p>
              <div className="space-y-1.5">
                {goal.milestones.map(m => (
                  <button
                    key={m.id}
                    onClick={() => onToggleMilestone(goal.id, m.id)}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                      m.completed ? 'bg-green-500/10' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      m.completed ? 'bg-green-500 border-green-500' : 'border-white/30'
                    }`}>
                      {m.completed && <span className="text-[10px] text-white">✓</span>}
                    </span>
                    <span className={`text-sm ${
                      m.completed ? 'line-through text-white/40' : 'text-white/70'
                    }`}>{m.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {goal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {goal.tags.map(tag => (
                <span key={tag} className="text-xs bg-white/5 text-white/40 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-xs text-white/30">Créé le {formatDate(goal.createdAt)}</p>
        </div>
      )}
    </div>
  );
}
