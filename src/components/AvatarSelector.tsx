import React from 'react';
import { motion } from 'framer-motion';
import { User, Image as ImageIcon, Lock, Check } from 'lucide-react';

interface AvatarItem {
  id: string;
  url: string;
  unlockedAtLevel: number;
}

interface BannerItem {
  id: string;
  className: string;
  unlockedAtArena: number;
}

export const AvatarSelector: React.FC = () => {
  const userLevel = 5; 
  const userArena = 2; 

  const avatars: AvatarItem[] = [
    { id: '1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', unlockedAtLevel: 1 },
    { id: '2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', unlockedAtLevel: 3 },
    { id: '3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo', unlockedAtLevel: 10 },
  ];

  const banners: BannerItem[] = [
    { id: '1', className: 'bg-gradient-to-r from-blue-600 to-indigo-600', unlockedAtArena: 1 },
    { id: '2', className: 'bg-gradient-to-r from-red-600 to-orange-600', unlockedAtArena: 2 },
    { id: '3', className: 'bg-gradient-to-r from-purple-600 to-pink-600', unlockedAtArena: 5 },
  ];

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-3xl font-black text-white flex items-center gap-3 italic uppercase tracking-tighter">
          <User className="text-blue-500" />
          Personnalisation
        </h1>
        <p className="text-slate-400 font-bold">Débloque de nouveaux styles en progressant</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-300 flex items-center gap-2">
          <User size={20} className="text-blue-400" />
          Avatars
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {avatars.map((avatar) => {
            const isLocked = userLevel < avatar.unlockedAtLevel;
            return (
              <motion.div
                key={avatar.id}
                whileHover={!isLocked ? { scale: 1.05 } : {}}
                className={`relative aspect-square rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                  isLocked ? 'bg-slate-900 border-slate-800 opacity-50' : 'bg-slate-800 border-slate-700 hover:border-blue-500'
                }`}
              >
                <img src={avatar.url} alt="Avatar" className="w-full h-full object-cover" />
                {isLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white">
                    <Lock size={20} className="mb-1" />
                    <span className="text-[10px] font-black italic uppercase">Niv. {avatar.unlockedAtLevel}</span>
                  </div>
                )}
                {!isLocked && avatar.id === '1' && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 border-2 border-slate-800">
                    <Check size={12} className="text-white" strokeWidth={4} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-300 flex items-center gap-2">
          <ImageIcon size={20} className="text-purple-400" />
          Bannières
        </h2>
        <div className="grid gap-4">
          {banners.map((banner) => {
            const isLocked = userArena < banner.unlockedAtArena;
            return (
              <motion.div
                key={banner.id}
                whileHover={!isLocked ? { x: 10 } : {}}
                className={`relative h-24 rounded-2xl border-2 transition-all cursor-pointer flex items-center p-6 group ${
                  isLocked ? 'bg-slate-900 border-slate-800' : `${banner.className} border-white/10`
                }`}
              >
                <div className="flex-1">
                  <h3 className={`font-black uppercase italic tracking-wider ${isLocked ? 'text-slate-600' : 'text-white'}`}>
                    {isLocked ? 'Bannière Verrouillée' : `Style Arena ${banner.unlockedAtArena}`}
                  </h3>
                  {isLocked && (
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      Déblocage : Arène {banner.unlockedAtArena}
                    </span>
                  )}
                </div>

                {isLocked ? (
                  <Lock className="text-slate-700" size={32} />
                ) : (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-6 py-2 bg-white text-slate-900 font-black rounded-xl uppercase text-xs tracking-widest shadow-xl">
                      Équiper
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
