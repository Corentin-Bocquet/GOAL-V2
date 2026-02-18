import { useState } from 'react';
import { Goal, Habit, UserProfile } from '../types';
import { getEarnedBadges, formatDate } from '../utils';

interface ProfileViewProps {
  profile: UserProfile;
  goals: Goal[];
  habits: Habit[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const avatarOptions = ['🧙', '🦸', '🦹', '👨‍💻', '👩‍💻', '🧐', '🧝', '🚀', '🌟', '👽'];

const rarityLabels = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
};

export default function ProfileView({ profile, goals, habits, onUpdateProfile }: ProfileViewProps) {
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const badges = getEarnedBadges(profile, goals, habits);

  const handleSave = () => {
    onUpdateProfile({ name: nameInput.trim() || profile.name });
    setEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{profile.avatar}</div>
          <div className="flex-1">
            {editing ? (
              <div className="flex gap-2">
                <input
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="input-field text-base font-bold py-2"
                  placeholder="Votre nom"
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                  autoFocus
                />
                <button onClick={handleSave} className="btn-primary py-2">✓</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                <button
                  onClick={() => setEditing(true)}
                  className="text-white/30 hover:text-white/60 transition-colors text-sm"
                >
                  ✏️
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="level-badge px-2 py-0.5 rounded-lg text-white text-xs font-bold">
                Niveau {profile.level}
              </span>
              <span className="text-white/40 text-sm">Membre depuis {formatDate(profile.joinedAt)}</span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-white/50">XP vers niveau {profile.level + 1}</span>
            <span className="text-xs font-semibold text-violet-300">{profile.xp}/{profile.xpToNextLevel}</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill bg-gradient-to-r from-violet-500 to-indigo-500"
              style={{ width: `${Math.round((profile.xp / profile.xpToNextLevel) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Avatar Selector */}
      <div className="glass-card p-4">
        <h2 className="text-base font-semibold text-white mb-3">Choisir un avatar</h2>
        <div className="grid grid-cols-5 gap-2">
          {avatarOptions.map(avatar => (
            <button
              key={avatar}
              onClick={() => onUpdateProfile({ avatar })}
              className={`text-3xl p-2 rounded-xl transition-all ${
                profile.avatar === avatar
                  ? 'bg-violet-600/30 border border-violet-500/50'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{profile.totalGoalsCompleted}</p>
          <p className="text-sm text-white/50 mt-1">Objectifs complétés</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold text-blue-400">{profile.totalHabitsCompleted}</p>
          <p className="text-sm text-white/50 mt-1">Habitudes complétées</p>
        </div>
      </div>

      {/* Badges */}
      <div className="glass-card p-4">
        <h2 className="text-base font-semibold text-white mb-3">
          🏅 Badges ({badges.length})
        </h2>
        {badges.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-4xl mb-2">🔐</p>
            <p className="text-white/40 text-sm">Complétez des objectifs pour gagner des badges !</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {badges.map(badge => (
              <div key={badge.id} className={`p-3 rounded-xl border ${
                badge.rarity === 'legendary' ? 'badge-legendary' :
                badge.rarity === 'epic' ? 'badge-epic' :
                badge.rarity === 'rare' ? 'badge-rare' : 'badge-common'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="text-xs font-semibold">{badge.name}</p>
                    <p className="text-[10px] opacity-70">{rarityLabels[badge.rarity]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  }

}
