import { GameState, ViewType } from '../types';
import { getArenas, calcLevelFromXP } from '../utils';

interface Props {
  state: GameState;
  onNavigate: (view: ViewType) => void;
}

export default function ArenaMap({ state, onNavigate }: Props) {
  const arenas = getArenas();
  const levelInfo = calcLevelFromXP(state.xp);

  return (
    <div className="arena-map">
      <div className="arena-header">
        <h1 className="arena-title">🗺️ Carte des Arènes</h1>
        <p className="arena-subtitle">Niveau {levelInfo.level} - {levelInfo.title}</p>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card xp-card">
          <span className="stat-icon">⚡</span>
          <div>
            <div className="stat-value">{state.xp.toLocaleString()}</div>
            <div className="stat-label">XP Total</div>
          </div>
        </div>
        <div className="stat-card gold-card">
          <span className="stat-icon">💰</span>
          <div>
            <div className="stat-value">{state.gold.toLocaleString()}</div>
            <div className="stat-label">Or</div>
          </div>
        </div>
        <div className="stat-card gems-card">
          <span className="stat-icon">💎</span>
          <div>
            <div className="stat-value">{state.gems}</div>
            <div className="stat-label">Gemmes</div>
          </div>
        </div>
      </div>

      {/* Arena Path */}
      <div className="arena-path">
        {arenas.map((arena, index) => {
          const isUnlocked = levelInfo.level >= arena.minLevel;
          const isCurrent = state.currentArena === arena.id;

          return (
            <div key={arena.id} className={`arena-node ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}>
              {index < arenas.length - 1 && (
                <div className={`arena-path-line ${isUnlocked ? 'active' : ''}`} />
              )}
              <div className="arena-icon-wrapper">
                <span className="arena-icon-big">{arena.icon}</span>
                {isCurrent && <div className="current-indicator pulse" />}
                {!isUnlocked && <div className="lock-overlay">🔒</div>}
              </div>
              <div className="arena-info">
                <span className="arena-name">{arena.name}</span>
                <span className="arena-level">Niveau {arena.minLevel}+</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Cards */}
      <div className="action-grid">
        <button className="action-card quest-card" onClick={() => onNavigate('quests')}>
          <span className="action-icon">🎯</span>
          <div className="action-info">
            <span className="action-title">Objectifs</span>
            <span className="action-count">{state.goals.filter(g => !g.completed).length} actifs</span>
          </div>
          <span className="action-arrow">›</span>
        </button>

        <button className="action-card habit-card" onClick={() => onNavigate('habits')}>
          <span className="action-icon">🔄</span>
          <div className="action-info">
            <span className="action-title">Habitudes</span>
            <span className="action-count">{state.habits.length} au total</span>
          </div>
          <span className="action-arrow">›</span>
        </button>

        <button className="action-card combat-card" onClick={() => onNavigate('combat')}>
          <span className="action-icon">⚔️</span>
          <div className="action-info">
            <span className="action-title">Combat Focus</span>
            <span className="action-count">Timer Pomodoro</span>
          </div>
          <span className="action-arrow">›</span>
        </button>

        <button className="action-card loot-card" onClick={() => onNavigate('loot')}>
          <span className="action-icon">📦</span>
          <div className="action-info">
            <span className="action-title">Coffres</span>
            <span className="action-count">Loot & Récompenses</span>
          </div>
          <span className="action-arrow">›</span>
        </button>
      </div>

      {/* Progress to next arena */}
      {(() => {
        const nextArena = arenas.find(a => a.minLevel > levelInfo.level);
        if (!nextArena) return (
          <div className="max-arena-badge">🏆 Arène Max Atteinte !</div>
        );
        const progress = Math.min(100, Math.floor((levelInfo.level / nextArena.minLevel) * 100));
        return (
          <div className="next-arena-progress">
            <div className="progress-header">
              <span>Prochaine Arène : {nextArena.icon} {nextArena.name}</span>
              <span>Niv. {nextArena.minLevel}</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-text">Niveau {levelInfo.level} / {nextArena.minLevel}</span>
          </div>
        );
      })()}
    </div>
  );
}
