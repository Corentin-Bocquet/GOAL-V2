import { useState } from 'react';
import { Goal } from '../types';

interface AddGoalModalProps {
  onClose: () => void;
  onAdd: (goal: Omit<Goal, 'id' | 'createdAt' | 'completedAt'>) => void;
}

const categoryOptions = [
  { value: 'health', label: '💪 Santé', color: 'text-green-400' },
  { value: 'learning', label: '📚 Apprentissage', color: 'text-blue-400' },
  { value: 'finance', label: '💰 Finance', color: 'text-yellow-400' },
  { value: 'social', label: '👥 Social', color: 'text-purple-400' },
  { value: 'creativity', label: '🎨 Créativité', color: 'text-pink-400' },
  { value: 'productivity', label: '⚡ Productivité', color: 'text-orange-400' },
];

const difficultyOptions = [
  { value: 'easy', label: 'Facile', xp: 50, color: 'text-green-400' },
  { value: 'medium', label: 'Moyen', xp: 100, color: 'text-yellow-400' },
  { value: 'hard', label: 'Difficile', xp: 200, color: 'text-orange-400' },
  { value: 'epic', label: 'Épique', xp: 500, color: 'text-purple-400' },
];

export default function AddGoalModal({ onClose, onAdd }: AddGoalModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Goal['category']>('health');
  const [difficulty, setDifficulty] = useState<Goal['difficulty']>('medium');
  const [deadline, setDeadline] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [unit, setUnit] = useState('');

  const selectedDifficulty = difficultyOptions.find(d => d.value === difficulty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      progress: 0,
      target: targetValue ? parseInt(targetValue) : 100,
      unit: unit.trim() || '%',
      deadline: deadline || undefined,
      completed: false,
      xpReward: selectedDifficulty?.xp || 100,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">🎯 Nouvel Objectif</h2>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Titre *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Courir un marathon"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors"
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Décrivez votre objectif..."
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Catégorie</label>
              <div className="grid grid-cols-3 gap-2">
                {categoryOptions.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value as Goal['category'])}
                    className={`p-2 rounded-xl border text-sm transition-all ${
                      category === cat.value
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Difficulté</label>
              <div className="grid grid-cols-4 gap-2">
                {difficultyOptions.map(diff => (
                  <button
                    key={diff.value}
                    type="button"
                    onClick={() => setDifficulty(diff.value as Goal['difficulty'])}
                    className={`p-2 rounded-xl border text-sm transition-all ${
                      difficulty === diff.value
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                    }`}
                  >
                    <div className={diff.color}>{diff.label}</div>
                    <div className="text-[10px] text-white/40">{diff.xp} XP</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Target */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Objectif chiffré</label>
                <input
                  type="number"
                  value={targetValue}
                  onChange={e => setTargetValue(e.target.value)}
                  placeholder="100"
                  min="1"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Unité</label>
                <input
                  type="text"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  placeholder="km, livres, %..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Date limite</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* XP Preview */}
            {selectedDifficulty && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                <p className="text-sm text-white/60">Récompense</p>
                <p className="text-2xl font-bold text-purple-400">+{selectedDifficulty.xp} XP</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Créer l'objectif
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
