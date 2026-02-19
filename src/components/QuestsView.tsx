import React from 'react';
import { motion } from 'framer-motion';
import { ScrollText, Star, Shield, Zap, Target } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  maxProgress: number;
  type: 'daily' | 'weekly' | 'achievement';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const QuestsView: React.FC = () => {
  const quests: Quest[] = [
    {
      id: '1',
      title: 'Maître du Focus',
      description: 'Compléter 3 sessions de focus aujourd\'hui',
      reward: 150,
      progress: 1,
      maxProgress: 3,
      type: 'daily',
      difficulty: 'medium'
    },
    {
      id: '2',
      title: 'Lève-tôt',
      description: 'Valider une habitude avant 8h',
      reward: 100,
      progress: 0,
      maxProgress: 1,
      type: 'daily',
      difficulty: 'easy'
    },
    {
      id: '3',
      title: 'Légende Hebdomadaire',
      description: 'Maintenir un score de 90% toute la semaine',
      reward: 1000,
      progress: 4,
      maxProgress: 7,
      type: 'weekly',
      difficulty: 'hard'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <ScrollText className="text-blue-500" />
            Quêtes
          </h1>
          <p className="text-slate-400">Accomplis tes objectifs pour gagner des récompenses</p>
        </div>
      </header>

      <div className="grid gap-6">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-300 flex items-center gap-2">
            <Zap size={20} className="text-yellow-400" />
            Quêtes Quotidiennes
          </h2>
          <div className="space-y-3">
            {quests.filter(q => q.type === 'daily').map((quest, idx) => (
              <motion.div
                key={quest.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 hover:border-blue-500/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">
                      {quest.title}
                    </h3>
                    <p className="text-sm text-slate-400">{quest.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getDifficultyColor(quest.difficulty)}`}>
                    {quest.difficulty}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">{quest.progress} / {quest.maxProgress}</span>
                    <span className="text-yellow-500 flex items-center gap-1">
                      +{quest.reward} XP <Star size={12} fill="currentColor" />
                    </span>
                  </div>
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-slate-300 flex items-center gap-2">
            <Target size={20} className="text-purple-400" />
            Objectifs Hebdomadaires
          </h2>
          {quests.filter(q => q.type === 'weekly').map((quest) => (
            <motion.div
              key={quest.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4">
                <Shield size={40} className="text-slate-700/30 group-hover:text-blue-500/20 transition-colors" />
              </div>
              
              <div className="relative z-10 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">{quest.title}</h3>
                  <p className="text-slate-400">{quest.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 max-w-[200px]">
                    <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-yellow-500">+{quest.reward}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase">Points de Gloire</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  );
};
