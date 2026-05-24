import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Flame, Heart, Search, Eye, Trash2, ShieldAlert } from 'lucide-react';
import { LikedHistoryItem } from '../types';

interface LikedHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  likedHistory: LikedHistoryItem[];
  onUnlike: (id: string, e: React.MouseEvent) => void;
  onView: (id: string) => void;
  onClearAll: () => void;
}

export default function LikedHistoryModal({
  isOpen,
  onClose,
  likedHistory,
  onUnlike,
  onView,
  onClearAll
}: LikedHistoryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Format liked datetime
  const formatTimeAgo = (timestamp: number) => {
    try {
      const diffMs = Date.now() - timestamp;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return `${diffDays}d ago`;
    } catch (_) {
      return 'Some time ago';
    }
  };

  // Remaining days helper
  const getDaysRemaining = (timestamp: number) => {
    try {
      const diffMs = Date.now() - timestamp;
      const daysPassed = Math.floor(diffMs / 86400000);
      return Math.max(0, 30 - daysPassed);
    } catch (_) {
      return 30;
    }
  };

  const filteredHistory = likedHistory.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      (item.title || '').toLowerCase().includes(q) ||
      (item.character || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q)
    );
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          id="liked-history-modal"
          className="relative w-full max-w-2xl bg-slate-950 border border-indigo-500/20 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-slate-900/60 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/25 text-rose-400">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-100 uppercase tracking-wide select-none">
                  Liked Wallpaper History
                </h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-0.5">
                  Chronological offline-first system cache
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 px-4 text-slate-400 hover:text-slate-150 transition-colors bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider select-none cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Banner explaining 30 Days Auto-purging */}
          <div className="bg-amber-500/10 border-b border-amber-500/20 p-4 px-5 flex items-start gap-3 select-none">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-left">
              <span className="text-xs font-bold text-amber-400 block uppercase tracking-wide">
                Storage Optimization Active (30-Day Auto Delete)
              </span>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                Liked wallpapers and reward points are kept in sync securely! To keep your local browser safe, prevent data piles, and optimize server transfers, each liked wallpaper entry is automatically removed from this log <strong>30 days</strong> after liking.
              </p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-4 px-5 border-b border-slate-900 bg-slate-900/20 flex flex-col sm:flex-row gap-3 items-center justify-between select-none">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search history by name, title, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-500"
              />
            </div>

            {/* Metrics & Clear actions */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-stretch sm:self-auto">
              <span className="text-[11px] font-mono text-slate-400 leading-none">
                Cached: <strong className="text-indigo-400">{likedHistory.length}</strong> / 100 max
              </span>
              
              {likedHistory.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Are you absolutely sure you want to delete all entries from your history file? This will reset like actions.')) {
                      onClearAll();
                    }
                  }}
                  className="text-[10px] text-rose-450 hover:text-rose-400 font-extrabold uppercase tracking-widest flex items-center gap-1 transition-colors select-none cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Cache</span>
                </button>
              )}
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3" id="history-items-scroller">
            {filteredHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center select-none">
                <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center text-slate-600 mb-3">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-350">No history found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  {likedHistory.length === 0 
                    ? "Go ahead and check some incredible wallpapers! Your liked logs will automatically show up here."
                    : "No items match your active search filter."
                  }
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => {
                const daysRemaining = getDaysRemaining(item.likedAt);
                const progressWidth = Math.min((daysRemaining / 30) * 100, 100);

                return (
                  <motion.div
                    key={item.id}
                    layoutId={`hist-${item.id}`}
                    className="flex bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 rounded-xl p-3 items-center justify-between gap-4 transition-all hover:border-indigo-500/10 group"
                  >
                    {/* Left: Wallpaper Thumbnail & Title */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="relative w-11 h-16 bg-slate-950 rounded-md overflow-hidden shrink-0 border border-slate-800">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                            <Heart className="w-4 h-4 text-slate-700" />
                          </div>
                        )}
                      </div>
                      
                      <div className="min-w-0 text-left">
                        <span className="text-[9px] font-black tracking-widest uppercase text-indigo-400 font-mono block">
                          {item.category || 'General'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100 truncate mt-0.5 group-hover:text-indigo-300 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-450">
                          <span className="truncate max-w-[120px]">{item.character || 'Original'}</span>
                          <span>•</span>
                          <span className="font-mono text-[9px] text-slate-500">{formatTimeAgo(item.likedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Days Remaining Counter */}
                    <div className="hidden sm:flex flex-col w-28 shrink-0 text-left select-none">
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-slate-500 uppercase">Cache Lift:</span>
                        <span className="font-bold text-indigo-300">{daysRemaining} days</span>
                      </div>
                      <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden block">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            daysRemaining > 15 ? 'bg-emerald-500' : daysRemaining > 5 ? 'bg-indigo-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${progressWidth}%` }}
                        />
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* View Large */}
                      <button
                        onClick={() => onView(item.id)}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-white transition-all cursor-pointer select-none"
                        title="Display full details and dimensions"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Unlike */}
                      <button
                        onClick={(e) => onUnlike(item.id, e)}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/40 text-rose-500 hover:bg-rose-950/20 transition-all cursor-pointer select-none"
                        title="Unlike and wipe from history cache"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer stats count */}
          <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500 select-none">
            <span>Clean Sweep Frequency: 30 days</span>
            <span className="text-amber-400">Memory safe operation active</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
