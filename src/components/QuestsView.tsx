import { useState } from 'react';
import { Goal } from '../types';
import { Plus, Target, CheckCircle, Circle, Trash2 } from 'lucide-react';

interface QuestsViewProps {
  goals: Goal[];
  onAdd: (goal: Goal) => void;
  onUpdate: (id: string, updates: Partial<Goal>) => void;
  onDelete: (id: string) => void;
}

export default function QuestsView({ goals, onAdd, onUpdate, onDelete }: QuestsViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Goal['category']>('personal');
  const [newDifficulty, setNewDifficulty] = useState<Goal['difficulty']>('medium');

  const xpByDifficulty = { easy: 50, medium: 100, hard: 200, epic: 500 };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const goal: Goal = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      priority: 'medium',
      status: 'active',
      difficulty: newDifficulty,
      progress: 0,
      target: 100,
      unit: '%',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
      xpReward: xpByDifficulty[newDifficulty],
      goldReward: xpByDifficulty[newDifficulty] / 2,
      milestones: [],
      subQuests: [],
      tags: [],
      isFavorite: false,
      isArchived: false,
    };
    onAdd(goal);
    setNewTitle('');
    setNewDesc('');
    setShowForm(false);
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  const difficultyColors: Record<string, string> = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-orange-400',
    epic: 'text-purple-400',
  };

  const difficultyEmoji: Record<string, string> = {
    easy: '🟢',
    medium: '🟡',
    hard: '🟠',
    epic: '🔴',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">🎯 Quêtes</h1>
          <p className="text-xs text-slate-500 mt-0.5">{activeGoals.length} active{activeGoals.length !== 1 ? 's' : ''} · {completedGoals.length} terminée{completedGoals.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-3">
          <h3 className="font-bold text-white">Nouvelle quête</h3>
          <input
            type="text"
            placeholder="Titre de la quête..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Description (optionnel)..."
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value as Goal['category'])}
              className="bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
            >
              <option value="personal">Personnel</option>
              <option value="health">🏃 Santé</option>
              <option value="career">💼 Carrière</option>
              <option value="education">📚 Éducation</option>
              <option value="finance">💰 Finance</option>
              <option value="sport">🏆 Sport</option>
              <option value="other">📦 Autre</option>
            </select>
            <select
              value={newDifficulty}
              onChange={e => setNewDifficulty(e.target.value as Goal['difficulty'])}
              className="bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
            >
              <option value="easy">🟢 Facile (+50 XP)</option>
              <option value="medium">🟡 Moyen (+100 XP)</option>
              <option value="hard">🟠 Difficile (+200 XP)</option>
              <option value="epic">🔴 Épique (+500 XP)</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm"
            >
              Ajouter
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl transition-all text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length === 0 && !showForm && (
        <div className="text-center py-12">
          <Target size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Aucune quête active</p>
          <p className="text-slate-600 text-xs mt-1">Ajoute ta première quête !</p>
        </div>
      )}

      <div className="space-y-3">
        {activeGoals.map(goal => (
          <div key={goal.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{difficultyEmoji[goal.difficulty] || '🟡'}</span>
                  <h3 className="font-bold text-white text-sm truncate">{goal.title}</h3>
                </div>
                {goal.description && (
                  <p className="text-xs text-slate-400 mb-2 truncate">{goal.description}</p>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{goal.progress}%</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs font-bold ${difficultyColors[goal.difficulty]}`}>
                    +{xpByDifficulty[goal.difficulty]} XP
                  </span>
                  <span className="text-xs text-slate-500 capitalize">{goal.category}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onUpdate(goal.id, { progress: Math.min(100, goal.progress + 25) })}
                  className="p-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 rounded-lg transition-all"
                  title="+25%"
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  onClick={() => onDelete(goal.id)}
                  className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">✅ Terminées ({completedGoals.length})</h3>
          <div className="space-y-2">
            {completedGoals.slice(0, 3).map(goal => (
              <div key={goal.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 flex items-center gap-3">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                <span className="text-sm text-slate-400 truncate flex-1">{goal.title}</span>
                <button onClick={() => onDelete(goal.id)} className="text-slate-600 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
