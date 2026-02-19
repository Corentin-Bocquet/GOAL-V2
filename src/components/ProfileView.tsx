import { useState } from 'react';
import { GameState } from '../types';
import { calcLevelFromXP } from '../utils';
import { Edit2, Check, User, Trophy, Star, Zap } from 'lucide-react';

interface ProfileViewProps {
  state: GameState;
  onUpdate: (updates: Partial<GameState>) => void;
}

const avatarOptions = ['🧙', '🧘', '👾', '🥶', '🐉', '🦄', '👑', '🔮'];

const rarityColors: Record<string, string> = {
  common: 'text-slate-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
};

export default function ProfileView({ state, onUpdate }: ProfileViewProps) {
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(state.playerName);
  const levelInfo = calcLevelFromXP(state.xp);
  const xpProgress = Math.round((levelInfo.currentXP / levelInfo.requiredXP) * 100);

  const handleSave = () => {
    onUpdate({ playerName: nameInput.trim() || state.playerName });
    setEditing(false);
  };

  const completedGoals = state.goals.filter(g => g.status === 'completed').length;
  const maxStreak = state.habits.length > 0
    ? Math.max(...state.habits.map(h => h.streak))
    : 0;

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-800/30 rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl">
            {avatarOptions[parseInt(state.avatarId) % avatarOptions.length] || '🧙'}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="flex-1 bg-slate-700 border border-blue-500 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none"
                  autoFocus
                />
                <button onClick={handleSave} className="p-1.5 bg-green-600 rounded-lg">
                  <Check size={16} className="text-white" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white truncate">
                  {state.playerName || 'Héros'}
                </h2>
                <button onClick={() => setEditing(true)} className="text-slate-500 hover:text-slate-300">
                  <Edit2 size={14} />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-blue-600/30 text-blue-400 px-2 py-0.5 rounded font-bold uppercase">
                {state.currentArena.replace('_', ' ')}
              </span>
              <span className="text-xs text-slate-400">📅 Depuis {new Date(state.memberSince).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Level & XP */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-black text-slate-400 uppercase">NIV. {levelInfo.level} • {levelInfo.title}</span>
            <span className="text-xs text-slate-500">{levelInfo.currentXP}/{levelInfo.requiredXP} XP</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-yellow-400">{state.gold.toLocaleString()}</p>
          <p className="text-xs text-slate-500">💰 Or</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-purple-400">{state.gems}</p>
          <p className="text-xs text-slate-500">💎 Gemmes</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-blue-400">{state.xp.toLocaleString()}</p>
          <p className="text-xs text-slate-500">⚡ XP Total</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-green-400">{completedGoals}</p>
          <p className="text-xs text-slate-500">🎯 Quetes</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-orange-400">{maxStreak}</p>
          <p className="text-xs text-slate-500">🔥 Serie max</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-pink-400">{state.dailyChest.streak}</p>
          <p className="text-xs text-slate-500">🎁 Coffres</p>
        </div>
      </div>

      {/* Avatar selector */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Avatar</h3>
        <div className="flex flex-wrap gap-2">
          {avatarOptions.map((emoji, i) => (
            <button
              key={i}
              onClick={() => onUpdate({ avatarId: i.toString() })}
              className={`text-2xl p-2 rounded-xl transition-all ${
                state.avatarId === i.toString()
                  ? 'bg-blue-600/30 ring-2 ring-blue-500'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Badges */}
      {state.badges.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">🏅 Badges ({state.badges.length})</h3>
          <div className="grid grid-cols-2 gap-2">
            {state.badges.map(badge => (
              <div key={badge.id} className="bg-slate-700/50 rounded-xl p-2.5 flex items-center gap-2">
                <span className="text-xl">{badge.icon}</span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${rarityColors[badge.rarity] || 'text-white'}`}>{badge.name}</p>
                  <p className="text-xs text-slate-500 truncate">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
