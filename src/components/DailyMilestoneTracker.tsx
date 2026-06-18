import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Zap } from 'lucide-react';

interface DailyMilestoneProps {
  likesCount: number;
}

export default function DailyMilestoneTracker({ likesCount }: DailyMilestoneProps) {
  const goal = 50;
  const progress = Math.min((likesCount / goal) * 100, 100);
  const achieved = likesCount >= goal;

  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (achieved) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [achieved]);

  return (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-indigo-500/10 mt-3 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Award className={`w-4 h-4 ${achieved ? 'text-amber-400' : 'text-indigo-400'}`} />
          <h4 className="text-[10px] font-black uppercase text-indigo-300 tracking-widest font-mono">
            DAILY MILESTONE {achieved ? 'ACHIEVED!' : `(${likesCount}/${goal})`}
          </h4>
        </div>
      </div>

      <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-700">
        <motion.div
          className={`h-full ${achieved ? 'bg-amber-500' : 'bg-indigo-600'}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-indigo-950/80 backdrop-blur-sm z-20"
          >
            <div className="text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
              <p className="text-white font-black uppercase tracking-widest mt-2">Extra Points Earned!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
