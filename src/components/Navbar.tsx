import { AppState } from '../types';

interface NavbarProps {
  activeView: AppState['activeView'];
  onChangeView: (view: AppState['activeView']) => void;
}

const navItems = [
  { id: 'goals' as const, label: 'Objectifs', icon: '🎯' },
  { id: 'habits' as const, label: 'Habitudes', icon: '🔄' },
  { id: 'stats' as const, label: 'Stats', icon: '📊' },
  { id: 'profile' as const, label: 'Profil', icon: '👤' },
];

export default function Navbar({ activeView, onChangeView }: NavbarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-4xl px-4 pb-2">
        <div className="glass-card flex items-center justify-around py-3 px-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                activeView === item.id
                  ? 'bg-violet-600/30 text-violet-300'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs font-medium transition-all ${
                activeView === item.id ? 'text-violet-300' : 'text-white/40'
              }`}>{item.label}</span>
              {activeView === item.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
