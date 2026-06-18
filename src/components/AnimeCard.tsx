import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Download, Eye, Heart, Star } from 'lucide-react';
import { AnimeWallpaper } from '../types';

interface AnimeCardProps {
  key?: React.Key;
  wallpaper: AnimeWallpaper;
  onView: (wp: AnimeWallpaper) => void;
  onPin: (id: string, e: React.MouseEvent) => void;
  isPinned: boolean;
  onLoadError?: (id: string) => void;
  isDailyLimitReached?: boolean;
}

export default function AnimeCard({
  wallpaper,
  onView,
  onPin,
  isPinned,
  onLoadError,
  isDailyLimitReached = false,
}: AnimeCardProps) {
  const [clickSparks, setClickSparks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [heartPops, setHeartPops] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showCenterHeart, setShowCenterHeart] = useState(false);
  const [sparkCount, setSparkCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handlePinAction = (e: React.MouseEvent) => {
    e.stopPropagation();

    // If daily limit is reached and they try to plus in a new like, call onPin but skip spark creation
    if (isDailyLimitReached && !isPinned) {
      onPin(wallpaper.id, e);
      return;
    }

    const wasPinned = isPinned;
    onPin(wallpaper.id, e);

    // Trigger center large heart explosion if turning ON the like
    if (!wasPinned) {
      setShowCenterHeart(true);
      setTimeout(() => setShowCenterHeart(false), 800);
    }

    // Dynamic floating spark click position (offset relative to visual viewport button click)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setClickSparks((prev) => [...prev, { id: sparkCount, x, y }]);
    setHeartPops((prev) => [...prev, { id: sparkCount, x, y }]);
    setSparkCount((prev) => prev + 1);

    // Auto-remove spark after half a second
    setTimeout(() => {
      setClickSparks((prev) => prev.filter((s) => s.id !== sparkCount));
      setHeartPops((prev) => prev.filter((h) => h.id !== sparkCount));
    }, 800);
  };

  const isPortrait = wallpaper.aspectRatio === 'portrait';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className={`group relative overflow-hidden bg-slate-950 border border-slate-900 rounded-2xl shadow-md transition-all duration-300 hover:shadow-indigo-500/10 hover:border-indigo-500/40 select-none flex flex-col cursor-pointer transform-gpu ${
        isPortrait ? 'row-span-2' : 'row-span-1'
      }`}
      onClick={() => onView(wallpaper)}
    >
      {/* Image container with strict responsive ratios to lock stability */}
      <div className={`relative w-full overflow-hidden bg-slate-900/30 transform-gpu ${
        isPortrait ? 'aspect-[3/4.5] sm:aspect-[3/4.2]' : 'aspect-[16/10.5]'
      }`}>
        
        {/* Hardware-accelerated shimmer skeleton preloader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          </div>
        )}

        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-500 transform-gpu will-change-transform ${
            imageLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-md'
          } group-hover:scale-105`}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            if (onLoadError) {
              onLoadError(wallpaper.id);
            }
          }}
        />

        {/* Hover / Inactive Backdrop Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges (Category & Aspect Mode) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-indigo-400 bg-slate-950/80 border border-indigo-500/20 rounded backdrop-blur-xs">
            {wallpaper.category}
          </span>
          <span className="px-1.5 py-0.5 text-[8px] font-semibold text-slate-400 bg-slate-950/80 rounded backdrop-blur-xs font-mono uppercase">
            {wallpaper.aspectRatio}
          </span>
        </div>

        {/* Floating Sparks Context (+3 score animation) */}
        <AnimatePresence>
          {clickSparks.map((spark) => (
            <motion.span
              key={`spark-${spark.id}`}
              initial={{ opacity: 1, y: -5, scale: 0.8 }}
              animate={{ opacity: 0, y: -65, scale: 1.2, x: (Math.random() - 0.5) * 40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute z-30 pointer-events-none font-sans font-black text-xs md:text-sm text-emerald-400 tracking-wider flex items-center gap-0.5"
              style={{
                top: `${spark.y}px`,
                left: `${spark.x}px`,
                textShadow: '0 0 8px rgba(16,185,129,0.6)',
              }}
            >
              <Star className="w-3 h-3 fill-emerald-400 stroke-emerald-400" />
              +3 Pts
            </motion.span>
          ))}

          {heartPops.map((pop) => (
            <motion.span
              key={`heart-${pop.id}`}
              initial={{ opacity: 1, y: 0, scale: 0.5, rotate: 0 }}
              animate={{ opacity: 0, y: -80, scale: 1.5, rotate: (Math.random() - 0.5) * 60, x: (Math.random() - 0.5) * 60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute z-35 pointer-events-none flex items-center justify-center text-rose-500 text-lg drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]"
              style={{
                top: `${pop.y - 15}px`,
                left: `${pop.x - 10}px`,
              }}
            >
              ❤️
            </motion.span>
          ))}

          {showCenterHeart && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [1, 1.4, 1.2], opacity: [1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px]"
            >
              <div className="bg-slate-950/80 border border-rose-500/35 p-6 rounded-full shadow-[0_0_50px_rgba(244,63,94,0.4)] flex flex-col items-center justify-center">
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.4, repeat: 1 }}
                  className="text-4xl md:text-5xl text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.7)]"
                >
                  ❤️
                </motion.span>
                <span className="text-[10px] text-rose-400 font-mono font-black uppercase tracking-widest mt-1.5 animate-pulse">PINNED! +3 PTS</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Add Pin Button "+in" */}
        <div className="absolute top-3 right-3 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePinAction}
            className={`relative flex items-center gap-1.5 py-2 px-3 text-[11px] font-black rounded-lg transition-all shadow-lg transform h-8 select-none ${
              isPinned
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border border-indigo-400/40 cursor-pointer active:scale-95'
                : isDailyLimitReached
                ? 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500/30 cursor-not-allowed shadow-rose-900/40'
                : 'bg-indigo-500 hover:bg-indigo-400 text-slate-950 border border-transparent cursor-pointer active:scale-95'
            }`}
            title={isPinned ? 'Liked' : isDailyLimitReached ? 'Daily limit of 100 reached! Resets at 12 AM Tokyo standard time JST.' : 'Liking this wallpaper grants 3 points!'}
          >
            <Plus className={`w-3.5 h-3.5 transition-transform duration-200 stroke-[2.5] ${isPinned ? 'rotate-45' : isDailyLimitReached ? 'rotate-90 text-rose-200' : ''}`} />
            <span>{isPinned ? 'Liked' : isDailyLimitReached ? 'Limit ✖' : '+in'}</span>
          </motion.button>
        </div>

        {/* View Detail Hover Hint Indicator */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-1.5 bg-slate-900/90 text-[10px] font-bold text-slate-200 py-1.5 px-3 rounded-full border border-slate-750 backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5 text-indigo-400" /> View Live Wallpaper Info
          </span>
        </div>
      </div>

      {/* Visual Footnotes Info */}
      <div className="p-3 bg-slate-950 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-xs font-black text-slate-200 tracking-tight leading-tight line-clamp-1 select-text">
            {wallpaper.title}
          </h3>
          <p className="text-[10px] text-slate-500 font-mono select-none">
            by <span className="font-semibold text-slate-400">@{wallpaper.author}</span>
          </p>
        </div>

        <div className="flex items-center justify-between text-[9px] text-slate-500 pt-2.5 mt-2.5 border-t border-slate-900 select-none">
          <span className="truncate max-w-[80px]">
            {wallpaper.character || 'Original'}
          </span>
          <div className="flex items-center gap-2">
            <span>Dls: {wallpaper.downloads}</span>
            <span>★ {wallpaper.saves + (isPinned ? 1 : 0)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
