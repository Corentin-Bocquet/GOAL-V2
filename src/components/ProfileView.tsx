import { useState } from 'react';
import { Goal, Habit, UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  goals: Goal[];
  habits: Habit[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const avatarOptions = ['🧙', '🦸', '🦹', '👨‍💻', '👩‍💻', '🧐', '🧝', '🚀', '🌟', '👽'];

const rarityLabels: Record<string, string> = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
};

function getEarnedBadgesLocal(profile: UserProfile, goals: Goal[], habits: Habit[]) {
  const badges = [];
  const completedGoals = goals.filter((g: any) => g.status === 'completed' || g.completed);
  const maxStreak = habits.length > 0 ? Math.max(...habits.map((h: any) => h.currentStreak || h.streak || 0)) : 0;

  if (goals.length >= 1) badges.push({ id: 'first_goal', name: 'Premier Pas', icon: '🎯', rarity: 'common' });
  if (completedGoals.length >= 1) badges.push({ id: 'first_complete', name: 'Accomplissement', icon: '✅', rarity: 'common' });
  if (maxStreak >= 7) badges.push({ id: 'habit_week', name: 'Semaine Parfaite', icon: '🔥', rarity: 'rare' });
  if (profile.level >= 5) badges.push({ id: 'level_5', name: 'Expert', icon: '⭐', rarity: 'rare' });
  if (profile.level >= 10) badges.push({ id: 'level_10', name: 'Légende', icon: '👑', rarity: 'legendary' });
  if (completedGoals.length >= 5) badges.push({ id: 'goals_5', name: 'Ambitieux', icon: '🔝', rarity: 'rare' });
  if (habits.length >= 5) badges.push({ id: 'habit_5', name: 'Routinier', icon: '🔄', rarity: 'common' });
  if (profile.xp >= 1000) badges.push({ id: 'xp_1000', name: 'Guerrier XP', icon: '⚡', rarity: 'rare' });
  return badges;
}

export default function ProfileView({ profile, goals, habits, onUpdateProfile }: ProfileViewProps) {
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const badges = getEarnedBadgesLocal(profile, goals, habits);

  const handleSave = () => {
    onUpdateProfile({ name: nameInput.trim() || profile.name });
    setEditing(false);
  };

  const xpProgress = profile.xpToNextLevel > 0
    ? Math.round((profile.xp / profile.xpToNextLevel) * 100)
    : 0;

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
                  className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-base font-bold flex-1 focus:outline-none focus:border-purple-500"
                  placeholder="Votre nom"
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                  autoFocus
                />
                <button onClick={handleSave} className="btn-primary py-2 px-4">✓</button>
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
            <p className="text-white/50 text-sm">
              Niveau {profile.level} &nbsp;•&nbsp; Membre depuis {new Date(profile.joinedAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-white/60 mb-1">
            <span>XP vers niveau {profile.level + 1}</span>
            <span>{profile.xp}/{profile.xpToNextLevel}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Avatar Selector */}
      <div className="glass-card p-4">
        <h2 className="text-base font-semibold text-white mb-3">Choisir un avatar</h2>
        <div className="flex flex-wrap gap-2">
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
          <p className="text-3xl font-black text-purple-400">{profile.totalGoalsCompleted}</p>
          <p className="text-xs text-white/50 mt-1">Objectifs complétés</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-black text-pink-400">{profile.totalHabitsCompleted}</p>
          <p className="text-xs text-white/50 mt-1">Habitudes complétées</p>
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
              <div
                key={badge.id}
                className={`p-3 rounded-xl border ${
                  badge.rarity === 'legendary' ? 'badge-legendary' :
                  badge.rarity === 'epic' ? 'badge-epic' :
                  badge.rarity === 'rare' ? 'badge-rare' : 'badge-common'
                }`}
              >
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
