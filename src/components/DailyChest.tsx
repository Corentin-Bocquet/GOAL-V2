import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Trophy } from 'lucide-react';

interface DailyChestProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (reward: any) => void;
  lastClaimed?: string;
}

export const DailyChest: React.FC<DailyChestProps> = ({ isOpen, onClose, onClaim, lastClaimed }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [reward, setReward] = useState<any>(null);

  const handleOpen = () => {
    setIsOpening(true);
    // Simulate 3D animation delay
    setTimeout(() => {
      const rewards = [
        { type: 'XP', amount: 250, icon: <Sparkles className="text-yellow-400" /> },
        { type: 'Gems', amount: 10, icon: <Trophy className="text-blue-400" /> },
        { type: 'Potion', name: 'Focus Potion', icon: <Sparkles className="text-purple-400" /> }
      ];
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
      setReward(randomReward);
      onClaim(randomReward);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 shadow-2xl overflow-hidden"
      >
        {!reward ? (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
              Coffre Journalier
            </h2>
            
            <div className="relative h-48 flex items-center justify-center">
              <motion.div
                animate={isOpening ? {
                  rotateY: [0, 360, 720],
                  scale: [1, 1.2, 0],
                  y: [0, -20, -100],
                  opacity: [1, 1, 0]
                } : {
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: isOpening ? 2 : 3, 
                  repeat: isOpening ? 0 : Infinity,
                  ease: "easeInOut" 
                }}
                className="cursor-pointer"
                onClick={!isOpening ? handleOpen : undefined}
              >
                <Gift size={120} className={`${isOpening ? 'text-yellow-400' : 'text-amber-500'} drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]`} />
              </motion.div>

              {isOpening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sparkles className="text-yellow-400 animate-spin-slow" size={160} />
                </motion.div>
              )}
            </div>

            <p className="text-slate-400">
              {isOpening ? "Ouverture en cours..." : "Clique sur le coffre pour l'ouvrir !"}
            </p>
          </div>
        ) : (feat: Add DailyChest component with 3D-like animation
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center space-y-6"
          >
            <h3 className="text-2xl font-bold text-white">Récompense obtenue !</h3>
            
            <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="mb-4">
                {React.cloneElement(reward.icon as React.ReactElement, { size: 64 })}
              </div>
              <div className="text-4xl font-black text-yellow-400">
                +{reward.amount || ''} {reward.type || reward.name}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
            >
              Génial !
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
