import { useEffect, useState } from 'react';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

const levelTitles: Record<number, string> = {
  1: 'Novice',
  2: 'Apprenti',
  3: 'Challenger',
  4: 'Guerrier',
  5: 'Expert',
  6: 'Maître',
  7: 'Grand Maître',
  8: 'Légende',
  9: 'Mythique',
  10: 'Immortel',
};

const levelColors: Record<number, { from: string; to: string; glow: string }> = {
  1: { from: '#6b7280', to: '#9ca3af', glow: '#9ca3af' },
  2: { from: '#10b981', to: '#34d399', glow: '#10b981' },
  3: { from: '#3b82f6', to: '#60a5fa', glow: '#3b82f6' },
  4: { from: '#8b5cf6', to: '#a78bfa', glow: '#8b5cf6' },
  5: { from: '#f59e0b', to: '#fbbf24', glow: '#f59e0b' },
  6: { from: '#ef4444', to: '#f87171', glow: '#ef4444' },
  7: { from: '#ec4899', to: '#f472b6', glow: '#ec4899' },
  8: { from: '#06b6d4', to: '#22d3ee', glow: '#06b6d4' },
  9: { from: '#f97316', to: '#fb923c', glow: '#f97316' },
  10: { from: '#fbbf24', to: '#fde68a', glow: '#fbbf24' },
};

export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; color: string; duration: number }[]>([]);

  const title = levelTitles[level] || `Niveau ${level}`;
  const colors = levelColors[level] || levelColors[5];

  const particleColors = ['#fbbf24', '#8b5cf6', '#ec4899', '#10b981', '#3b82f6', '#f97316'];

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);

    // Generate particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      duration: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);

    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full animate-bounce"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${Math.random() * 0.5}s`,
            opacity: 0.7,
          }}
        />
      ))}

      {/* Modal */}
      <div
        className={`relative glass-card p-8 text-center max-w-sm w-full mx-4 transition-all duration-700 ${
          visible ? 'scale-100 translate-y-0' : 'scale-50 translate-y-20'
        }`}
        onClick={e => e.stopPropagation()}
        style={{
          boxShadow: `0 0 60px ${colors.glow}40, 0 0 120px ${colors.glow}20`,
        }}
      >
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{
            background: `radial-gradient(ellipse at center, ${colors.glow} 0%, transparent 70%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Level badge */}
          <div
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-black"
            style={{
              background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
              boxShadow: `0 0 30px ${colors.glow}60`,
            }}
          >
            {level}
          </div>

          {/* Celebration */}
          <div className="text-5xl mb-2 animate-bounce">🎉</div>

          <h1 className="text-3xl font-black text-white mb-1">
            LEVEL UP !
          </h1>

          <p
            className="text-xl font-bold mb-4"
            style={{ color: colors.to }}
          >
            Niveau {level} • {title}
          </p>

          <p className="text-white/60 text-sm mb-6">
            Félicitations ! Tu as atteint un nouveau palier de progression.
            Continue comme ça ! 💪
          </p>

          {/* Stats unlocked */}
          {level % 2 === 0 && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-4 text-sm">
              <p className="text-white/40 mb-1">Débloqué</p>
              <p className="text-white font-medium">
                {level === 2 && '🏆 Titre : Apprenti + bonus XP x1.1'}
                {level === 4 && '💪 Titre : Guerrier + objectifs épiques'}
                {level === 6 && '✨ Titre : Maître + animations spéciales'}
                {level === 8 && '🔥 Titre : Légende + badges exclusifs'}
                {level === 10 && '👑 Titre : Immortel + thème doré'}
                {![2, 4, 6, 8, 10].includes(level) && `✨ Titre : ${title}`}
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
            }}
          >
            Continuer l'aventure →
          </button>

          <p className="text-white/20 text-xs mt-3">Fermeture automatique dans 5s...</p>
        </div>
      </div>
    </div>
  );
}
