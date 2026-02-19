import { useState } from 'react';

interface DailyChestProps {
  streak: number;
  onOpen: () => void;
  onClose: () => void;
}

export default function DailyChest({ streak, onOpen, onClose }: DailyChestProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    if (isOpening || opened) return;
    setIsOpening(true);
    setTimeout(() => {
      setOpened(true);
      setIsOpening(false);
      onOpen();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
        >
          ✕
        </button>

        <div className="text-center space-y-6">
          <h2 className="text-2xl font-black text-yellow-400">🎁 Coffre du Jour</h2>

          {streak > 0 && (
            <div className="text-sm text-slate-400">
              🔥 Série: <span className="text-orange-400 font-bold">{streak} jour{streak > 1 ? 's' : ''}</span>
            </div>
          )}

          <div className="flex items-center justify-center h-40">
            {!opened ? (
              <button
                onClick={handleOpen}
                disabled={isOpening}
                className={`text-8xl transition-transform ${
                  isOpening
                    ? 'animate-bounce scale-110'
                    : 'hover:scale-110 cursor-pointer'
                }`}
                style={isOpening ? { animation: 'spin 0.5s linear infinite' } : {}}
              >
                {isOpening ? '✨' : '🎁'}
              </button>
            ) : (
              <div className="text-center animate-pulse">
                <div className="text-6xl mb-2">🌟</div>
                <div className="text-green-400 font-bold text-lg">Coffre ouvert !</div>
              </div>
            )}
          </div>

          {!opened ? (
            <p className="text-slate-400 text-sm">
              {isOpening ? 'Ouverture en cours...' : 'Clique sur le coffre pour l\'ouvrir !'}
            </p>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all"
            >
              Génial ! 🎉
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
