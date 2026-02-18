import { useState } from 'react';
import { Habit } from '../types';

interface AddHabitModalProps {
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completedToday' | 'completedDates'>) => void;
}

const categoryOptions = [
  { value: 'health', label: '💪 Santé' },
  { value: 'learning', label: '📚 Apprentissage' },
  { value: 'finance', label: '💰 Finance' },
  { value: 'social', label: '👥 Social' },
  { value: 'creativity', label: '🎨 Créativité' },
  { value: 'productivity', label: '⚡ Productivité' },
];

const frequencyOptions = [
  { value: 'daily', label: 'Quotidienne', desc: 'Chaque jour' },
  { value: 'weekly', label: 'Hebdomadaire', desc: 'Chaque semaine' },
];

const iconOptions = ['🏋️', '📚', '💰', '🧘', '🎨', '💧', '🎵', '💻', '🚴', '🛕', '✍️', '📱', '🤷', '💪', '🎯'];

export default function AddHabitModal({ onClose, onAdd }: AddHabitModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Habit['category']>('health');
  const [frequency, setFrequency] = useState<Habit['frequency']>('daily');
  const [xpReward, setXpReward] = useState('10');
  const [selectedIcon, setSelectedIcon] = useState('🏋️');
  const [color, setColor] = useState('#8b5cf6');

  const colorOptions = [
    '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      category,
      frequency,
      xpReward: parseInt(xpReward) || 10,
      icon: selectedIcon,
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">🔄 Nouvelle Habitude</h2>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Icon & Title */}
            <div className="flex gap-3">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Icône</label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-14 h-12 bg-white/5 border border-white/10 rounded-xl text-2xl flex items-center justify-center hover:border-white/20 transition-colors"
                  >
                    {selectedIcon}
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-white/70 mb-1">Titre *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Méditation matinale"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Choisir une icône</label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedIcon(icon)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      selectedIcon === icon
                        ? 'bg-purple-500/30 border-2 border-purple-500'
                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Décrivez cette habitude..."
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
                    onClick={() => setCategory(cat.value as Habit['category'])}
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

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Fréquence</label>
              <div className="grid grid-cols-2 gap-2">
                {frequencyOptions.map(freq => (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() => setFrequency(freq.value as Habit['frequency'])}
                    className={`p-3 rounded-xl border text-sm transition-all ${
                      frequency === freq.value
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                    }`}
                  >
                    <div className="font-medium">{freq.label}</div>
                    <div className="text-xs text-white/40">{freq.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color & XP */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Couleur</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-all ${
                        color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">XP par completion</label>
                <input
                  type="number"
                  value={xpReward}
                  onChange={e => setXpReward(e.target.value)}
                  min="1"
                  max="100"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: color + '33' }}
                >
                  {selectedIcon}
                </div>
                <div>
                  <p className="font-medium text-white">{title || 'Titre de l\'habitude'}</p>
                  <p className="text-xs text-white/40">{frequency === 'daily' ? 'Quotidien' : 'Hebdomadaire'} • +{xpReward} XP</p>
                </div>
              </div>
            </div>

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
                Créer l'habitude
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
