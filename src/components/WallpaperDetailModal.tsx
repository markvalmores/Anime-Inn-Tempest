import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Heart, Download, Tag, User, Sparkles, Plus, Image, ExternalLink } from 'lucide-react';
import { AnimeWallpaper } from '../types';

interface WallpaperDetailModalProps {
  wallpaper: AnimeWallpaper | null;
  onClose: () => void;
  onPin: (id: string, e: React.MouseEvent) => void;
  isPinned: boolean;
  isDailyLimitReached?: boolean;
}

export default function WallpaperDetailModal({
  wallpaper,
  onClose,
  onPin,
  isPinned,
  isDailyLimitReached = false,
}: WallpaperDetailModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  if (!wallpaper) return null;

  const handleDownload = () => {
    setDownloading(true);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloading(false);
            // Simulate saving image file
            const a = document.createElement('a');
            a.href = wallpaper.imageUrl;
            a.download = `${wallpaper.title.replace(/\s+/g, '_')}_anime_tempest.jpg`;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        id="detail-modal"
        className="relative w-full max-w-5xl overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Close Button on Mobile / Desktop absolute */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white bg-slate-950/80 hover:bg-slate-950 border border-slate-800 rounded-full cursor-pointer transition-colors shadow-lg"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wallpaper Image Container */}
        <div className="md:w-1/2 bg-slate-950 flex items-center justify-center p-3 relative h-80 md:h-auto min-h-[320px] max-h-[45vh] md:max-h-[90vh]">
          <img
            src={wallpaper.imageUrl}
            alt={wallpaper.title}
            className="w-full h-full object-contain rounded-xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-6 left-6 px-3 py-1 bg-black/70 rounded-full border border-slate-800 backdrop-blur-xs text-[10px] text-slate-400 font-mono capitalize">
            {wallpaper.aspectRatio} Mode
          </div>
        </div>

        {/* Details Panel */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-none">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 text-[11px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                {wallpaper.category}
              </span>
              <h2 className="text-2xl font-black text-slate-100 tracking-tight leading-tight select-text">
                {wallpaper.title}
              </h2>
            </div>

            {/* Author Info */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-sm select-none">
                {wallpaper.author.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-slate-500">Creator</div>
                <div className="text-sm font-semibold text-slate-200 select-all">@{wallpaper.author}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 font-mono">Dls / Saves</div>
                <div className="text-xs font-bold text-slate-300 font-mono">
                  {wallpaper.downloads + (downloading ? 1 : 0)} / {wallpaper.saves + (isPinned ? 1 : 0)}
                </div>
              </div>
            </div>

            {/* Dynamic API metadata like rating, format, episodes */}
            {(wallpaper.rating || wallpaper.type || wallpaper.episodes !== undefined) && (
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/80 rounded-xl border border-slate-850/70 text-center select-none font-sans">
                <div>
                  <span className="block text-[8.5px] text-slate-500 uppercase tracking-wider font-bold">Type</span>
                  <span className="text-xs font-black text-slate-200 uppercase">{wallpaper.type || 'TV'}</span>
                </div>
                <div>
                  <span className="block text-[8.5px] text-slate-500 uppercase tracking-wider font-bold">Episodes</span>
                  <span className="text-xs font-black text-slate-200">{wallpaper.episodes !== undefined ? wallpaper.episodes : 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-[8.5px] text-indigo-400 uppercase tracking-wider font-bold">MAL Score</span>
                  <span className="text-xs font-black text-indigo-300">{wallpaper.rating || '⭐ Rank'}</span>
                </div>
              </div>
            )}

            {/* Synopsis paragraph for live MAL records */}
            {wallpaper.synopsis && (
              <div className="space-y-1.5 font-sans bg-slate-950/40 p-3.5 rounded-xl border border-slate-850/50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Synopsis</span>
                  {wallpaper.malUrl && (
                    <a
                      href={wallpaper.malUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-black flex items-center gap-1 transition-all"
                    >
                      <span>Official MAL Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-450 leading-relaxed max-h-32 overflow-y-auto select-text font-medium pr-1">
                  {wallpaper.synopsis}
                </p>
              </div>
            )}

            {/* Tags and Character */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Featured Character / Source
                </span>
                <span className="text-sm font-bold text-slate-350 select-text">
                  {wallpaper.character || 'Original Design'}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  Keywords / Genres
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {wallpaper.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] bg-slate-800/80 text-slate-350 rounded border border-slate-750 font-medium cursor-default select-all"
                    >
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-6 border-t border-slate-800 mt-6 md:mt-0 flex flex-col sm:flex-row gap-3">
            {/* +in button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => onPin(wallpaper.id, e)}
              className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-sm transition-all select-none flex items-center justify-center gap-2 border cursor-pointer ${
                isPinned
                  ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
                  : isDailyLimitReached
                  ? 'bg-rose-600 text-white border-rose-500/30 hover:bg-rose-700 cursor-not-allowed shadow-md shadow-rose-900/10'
                  : 'bg-indigo-500 text-slate-950 border-transparent hover:bg-indigo-400 active:scale-98 shadow-md shadow-indigo-500/10'
              }`}
              title={isPinned ? 'Liked Already' : isDailyLimitReached ? 'Daily limit of 100 reached! resets at 12 AM Tokyo time JST.' : 'Liking this wallpaper grants 3 points!'}
            >
              <Plus className={`w-4 h-4 transition-transform ${isPinned ? 'rotate-45' : isDailyLimitReached ? 'rotate-90 text-rose-200' : ''}`} />
              <span>{isPinned ? '+Pinned (+3 Pts)' : isDailyLimitReached ? 'Limit Reached ✖' : '+in Wallpaper (+3 Pts)'}</span>
            </motion.button>

            {/* Download Button */}
            <button
              disabled={downloading}
              onClick={handleDownload}
              className={`py-3 px-5 border rounded-xl font-bold text-sm tracking-wide transition-all select-none flex items-center justify-center gap-2 cursor-pointer ${
                downloading
                  ? 'bg-slate-950 text-slate-500 border-slate-850'
                  : 'bg-slate-800 text-slate-200 border-slate-750 hover:bg-slate-750 hover:text-white'
              }`}
            >
              {downloading ? (
                <div className="flex items-center gap-2">
                  <div className="relative w-4 h-4 rounded-full border-2 border-slate-700 border-t-indigo-400 animate-spin" />
                  <span className="text-xs">{downloadProgress}%</span>
                </div>
              ) : (
                <>
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
