import React from 'react';
import { Target, Calendar, BarChart3, User, ScrollText, Music, Music2 } from 'lucide-react';
import { ViewType } from '../types';

interface NavbarProps {
  activeView: ViewType;
  onChangeView: (view: ViewType) => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeView, 
  onChangeView, 
  isMusicPlaying, 
  onToggleMusic 
}) => {
  const navItems = [
    { id: 'goals', label: 'Objectifs', icon: Target },
    { id: 'habits', label: 'Habitudes', icon: Calendar },
    { id: 'quests', label: 'Quêtes', icon: ScrollText },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 pb-safe">
      <div className="max-w-md mx-auto px-4 h-20 flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewType)}
              className={`flex flex-col items-center justify-center gap-1 transition-all ${
                isActive ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 3 : 2} />
              <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </button>
          );
        })}

        <div className="w-px h-8 bg-slate-800 mx-2" />

        <button
          onClick={onToggleMusic}
          className={`p-3 rounded-2xl transition-all ${
            isMusicPlaying 
              ? 'bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/50' 
              : 'bg-slate-800 text-slate-500'
          }`}
        >
          {isMusicPlaying ? <Music2 size={20} className="animate-bounce" /> : <Music size={20} />}
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
