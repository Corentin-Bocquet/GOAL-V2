import { UserProfile } from '../types';

interface XPBarProps {
  profile: UserProfile;
  xpAnimation: boolean;
}

export default function XPBar({ profile, xpAnimation }: XPBarProps) {
  const progress = profile.xpToNextLevel > 0
    ? Math.round((profile.xp / profile.xpToNextLevel) * 100)
    : 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-4xl px-4 pt-3 pb-2">
        <div className="glass-card px-4 py-3 flex items-center gap-4">
          {/* Level Badge */}
          <div className="level-badge flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">{profile.level}</span>
          </div>

          {/* XP Bar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/60 font-medium">Niveau {profile.level}</span>
              <span className={`text-xs font-semibold text-violet-300 transition-all ${
                xpAnimation ? 'xp-pop' : ''
              }`}>
                {profile.xp} / {profile.xpToNextLevel} XP
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill bg-gradient-to-r from-violet-500 to-indigo-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Avatar */}
          <div className="flex-shrink-0 text-2xl">
            {profile.avatar}
          </div>
        </div>
      </div>
    </header>
  );
}
