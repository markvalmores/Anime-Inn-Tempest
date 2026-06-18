import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  LogIn,
  ShoppingBag,
  Info,
  Layers,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Compass,
  Zap,
  TrendingUp,
  Award,
  BookOpen,
  Monitor,
  Smartphone,
  Facebook,
  Heart,
  Flame,
  Clock,
  Coins,
  Gift,
  Calendar,
  RefreshCw,
  ArrowUp,
  Wallet,
  History,
  Trash2,
  CalendarDays,
  X
} from 'lucide-react';

import { AnimeWallpaper, RedemptionCode, UserStats, LikedHistoryItem } from './types';
import { CATEGORIES, INITIAL_WALLPAPERS, fetchLiveAnimeWallpapers } from './data/wallpapers';
import AnimeCard from './components/AnimeCard';
import ShopModal from './components/ShopModal';
import DoubleRedeemerPortal from './components/DoubleRedeemerPortal';
import WallpaperDetailModal from './components/WallpaperDetailModal';
import LikedHistoryModal from './components/LikedHistoryModal';
import ProfileShareHub, { PRESET_AVATARS, PRESET_COVERS } from './components/ProfileShareHub';
import AppRegisterForm from './components/AppRegisterForm';
import AppLoginForm from './components/AppLoginForm';
import AdminConsole from './components/AdminConsole';
import VerifiedBadge from './components/VerifiedBadge';
import SocialHome from './components/SocialHome';
import { playClickSound } from './lib/audio';

// Logo asset path from image generator
// @ts-ignore
import mainLogo from './assets/images/anime_inn_logo_1779662647105.png';

// Multi-timezone high-precision calculation to target exactly Tokyo standard time
export const getJstTimeInfo = () => {
  const now = new Date();
  
  try {
    const jstFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const parts = jstFormatter.formatToParts(now);
    const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));
    
    const yyyy = partMap.year;
    const mm = partMap.month;
    const dd = partMap.day;
    const jstTodayStr = `${yyyy}-${mm}-${dd}`;
    
    const currentTokyoHours = parseInt(partMap.hour, 10);
    const currentTokyoMinutes = parseInt(partMap.minute, 10);
    const currentTokyoSeconds = parseInt(partMap.second, 10);
    
    // Seconds elapsed since 12:00:00 AM JST
    const secondsElapsed = (currentTokyoHours * 3600) + (currentTokyoMinutes * 60) + currentTokyoSeconds;
    // Total seconds in a day: 86400
    const secondsRemaining = 86400 - secondsElapsed;
    
    const hrs = Math.floor(secondsRemaining / 3600);
    const mins = Math.floor((secondsRemaining % 3600) / 60);
    const secs = secondsRemaining % 60;
    
    const countdownStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    
    return {
      jstTodayStr,
      countdownStr
    };
  } catch (err) {
    // Elegant fallback if Intl is unsupported or errors
    const countdownStr = "Calculating...";
    return {
      jstTodayStr: new Date().toISOString().split('T')[0],
      countdownStr
    };
  }
};

export const getJstDateString = (timestamp: number) => {
  try {
    const jstFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = jstFormatter.formatToParts(new Date(timestamp));
    const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));
    return `${partMap.year}-${partMap.month}-${partMap.day}`;
  } catch (_) {
    return new Date(timestamp).toISOString().split('T')[0];
  }
};

export default function App() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(true);
  const [bypassClicks, setBypassClicks] = useState<number>(0);

  const handleBypassClick = () => {
    setBypassClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setIsMaintenanceMode(false);
        return 0;
      }
      return next;
    });
  };

  // Current active view state: gallery, register, login, social
  const [currentPage, setCurrentPage] = useState<'gallery' | 'register' | 'login' | 'social'>('gallery');

  // Lifted profile databases and configurations
  const [profilesDb, setProfilesDb] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem('tempest_users_db');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) { return {}; }
    }
    return {};
  });

  const [activeUserEmail, setActiveUserEmail] = useState<string>(() => {
    return localStorage.getItem('tempest_active_user_email') || '';
  });

  const [activeCodes, setActiveCodes] = useState<string[]>(() => {
    const saved = localStorage.getItem('tempest_login_codes');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) { return []; }
    }
    return ['MARKDAVID777', 'LOYALTY2026', 'TEMPESTFREE', 'OFFLINE4EVER', 'ADMIN123', 'GIVE777'];
  });

  const [wallpapers, setWallpapers] = useState<AnimeWallpaper[]>(INITIAL_WALLPAPERS);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeTag, setActiveTag] = useState<string>('All Tags');
  const [points, setPoints] = useState<number>(0);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [redeemedCodes, setRedeemedCodes] = useState<RedemptionCode[]>([]);
  const [brokenIds, setBrokenIds] = useState<string[]>([]);

  const handleLoadError = (id: string) => {
    setBrokenIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  // Daily JST Login states
  const [streak, setStreak] = useState<number>(0);
  const [lastClaimDate, setLastClaimDate] = useState<string>('');
  const [countdown, setCountdown] = useState<string>('24:00:00');
  const [showDaysGrid, setShowDaysGrid] = useState<boolean>(false);
  const [dailyLikesCount, setDailyLikesCount] = useState<number>(0);
  const [dailyLikesDate, setDailyLikesDate] = useState<string>('');

  // Modal control states
  const [selectedWallpaper, setSelectedWallpaper] = useState<AnimeWallpaper | null>(null);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [isRedeemerOpen, setIsRedeemerOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [likedHistory, setLikedHistory] = useState<LikedHistoryItem[]>([]);

  // Pagination pointer and safety refs for infinite scroll generator to prevent race conditions
  const [loadedOffset, setLoadedOffset] = useState<number>(INITIAL_WALLPAPERS.length);
  const loadedOffsetRef = useRef<number>(INITIAL_WALLPAPERS.length);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const loadingMoreRef = useRef<boolean>(false);

  // Refs for stable scroll handling & callback containment
  const galleryContainerRef = useRef<HTMLElement | null>(null);
  const fetchMoreItemsRef = useRef<() => void>(() => {});

  // New States for Floating Bubbles & Smart Filter Refreshing
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [showLikedFilter, setShowLikedFilter] = useState<'all' | 'liked' | 'hideLiked'>('hideLiked');

  // Live indicators
  const [stats] = useState({
    downloads: 14205,
    activeUsers: 841,
    payoutsCompleted: 120
  });

  // Keep track of recent like history mock-actions to populate the "Recent Earnings" sidebar nicely
  const [recentActions, setRecentActions] = useState<{ id: string; text: string; time: string; plus: boolean }[]>([
    { id: 'act-1', text: 'Daily Login Reward', time: '1h ago', plus: true },
    { id: 'act-2', text: 'Liked Cyberpunk Shibuya', time: '4h ago', plus: true },
  ]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem('tempest_points');
    const savedPinned = localStorage.getItem('tempest_pinned');
    const savedCodes = localStorage.getItem('tempest_codes');
    const savedStreak = localStorage.getItem('tempest_streak');
    const savedLastClaim = localStorage.getItem('tempest_last_claim_date');
    const savedHistory = localStorage.getItem('tempest_liked_history');

    if (savedPoints) setPoints(parseInt(savedPoints, 10));
    if (savedCodes) setRedeemedCodes(JSON.parse(savedCodes));
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    if (savedLastClaim) setLastClaimDate(savedLastClaim);

    let initialPinned: string[] = [];
    if (savedPinned) {
      try {
        initialPinned = JSON.parse(savedPinned);
      } catch (err) {
        initialPinned = [];
      }
    }

    let historyList: LikedHistoryItem[] = [];
    if (savedHistory) {
      try {
        historyList = JSON.parse(savedHistory);
      } catch (err) {
        historyList = [];
      }
    } else if (initialPinned.length > 0) {
      // Migrate existing pinned IDs to history so previous likes aren't lost immediately
      historyList = initialPinned.map(id => {
        const wp = INITIAL_WALLPAPERS.find(w => w.id === id);
        return {
          id,
          title: wp ? wp.title : 'Anime Wallpaper',
          imageUrl: wp ? wp.imageUrl : '',
          likedAt: Date.now(), // Assigned now, will expire in 30 days
          category: wp ? wp.category : 'General',
          character: wp ? wp.character : 'Unknown'
        };
      });
    }

    // Auto-Delete expired liked items (older than 30 days) to prevent storage piling up
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const nowTime = Date.now();
    const activeHistory = historyList.filter(item => {
      const age = nowTime - item.likedAt;
      return age < thirtyDaysInMs;
    });

    const purgedCount = historyList.length - activeHistory.length;
    if (purgedCount > 0) {
      setRecentActions(prev => [
        { id: `purge-${Date.now()}`, text: `Auto-Purged ${purgedCount} expired likes (>30 Days)`, time: 'Just now', plus: false },
        ...prev.slice(0, 5)
      ]);
    }

    // Synchronize both state variables and localStorage
    const activePinnedIds = activeHistory.map(item => item.id);
    setPinnedIds(activePinnedIds);
    setLikedHistory(activeHistory);

    localStorage.setItem('tempest_pinned', JSON.stringify(activePinnedIds));
    localStorage.setItem('tempest_liked_history', JSON.stringify(activeHistory));

    // Initial JST setup
    try {
      const { countdownStr, jstTodayStr } = getJstTimeInfo();
      setCountdown(countdownStr);

      // Load or initialize daily likes count according to JST Tokyo date
      const savedDailyLikesDate = localStorage.getItem('tempest_daily_likes_date');
      const savedDailyLikesCount = localStorage.getItem('tempest_daily_likes_count');

      if (savedDailyLikesDate === jstTodayStr) {
        if (savedDailyLikesCount) {
          setDailyLikesCount(parseInt(savedDailyLikesCount, 10));
        }
        setDailyLikesDate(jstTodayStr);
      } else {
        setDailyLikesCount(0);
        setDailyLikesDate(jstTodayStr);
        localStorage.setItem('tempest_daily_likes_date', jstTodayStr);
        localStorage.setItem('tempest_daily_likes_count', '0');
      }
    } catch (_) {}
  }, []);

  // Update countdown clock every second targeted to Tokyo time
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const { countdownStr, jstTodayStr } = getJstTimeInfo();
        setCountdown(countdownStr);

        // Check if the Tokyo JST day shifted to reset daily likes count
        setDailyLikesDate((currentDate) => {
          if (currentDate && currentDate !== jstTodayStr) {
            setDailyLikesCount(0);
            localStorage.setItem('tempest_daily_likes_date', jstTodayStr);
            localStorage.setItem('tempest_daily_likes_count', '0');
            
            setRecentActions(prev => [
              { id: `daychange-${Date.now()}`, text: 'Tokyo Midnight! Daily count resettled.', time: 'Just now', plus: false },
              ...prev.slice(0, 5)
            ]);
            return jstTodayStr;
          }
          return currentDate || jstTodayStr;
        });
      } catch (err) {
        console.warn(err);
      }
    }, 1005);
    return () => clearInterval(timer);
  }, []);

  // Scroll Handler for right gallery container (prevents DOM document lookups that break on different browsers)
  const handleGalleryScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const handleScrollToTop = () => {
    if (galleryContainerRef.current) {
      galleryContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleRefreshFeed = () => {
    if (loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);

    const randomOffset = Math.floor(Math.random() * 210) + 12;
    const countToLoad = 12;

    fetchLiveAnimeWallpapers(randomOffset, countToLoad)
      .then((newItems) => {
        setWallpapers((prev) => {
          // Keep pinned/liked wallpapers, but purge unpinned ones from the active feed
          // to make it completely fresh, so the user doesn't load a bulk of unliked items.
          const likedWallpapers = prev.filter(wp => pinnedIds.includes(wp.id));
          const existingIds = new Set(likedWallpapers.map(item => item.id));

          const uniqueNewItems = newItems.map(item => {
            if (existingIds.has(item.id)) {
              return {
                ...item,
                id: `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
              };
            }
            return item;
          });

          return [...likedWallpapers, ...uniqueNewItems];
        });

        setLoadedOffset(randomOffset + countToLoad);
        loadedOffsetRef.current = randomOffset + countToLoad;

        setRecentActions(prev => [
          { id: `refresh-${Date.now()}`, text: 'Refreshed & Pulled 12 Fresh Wallpapers', time: 'Just now', plus: true },
          ...prev.slice(0, 5)
        ]);
      })
      .catch((err) => {
        console.warn('Manual Feed refresh engaged failsafe:', err);
      })
      .finally(() => {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      });
  };

  // Calculate current JST date dynamically
  const { jstTodayStr: currentJstToday } = getJstTimeInfo();
  const canClaim = lastClaimDate !== currentJstToday;

  const handleClaimReward = () => {
    if (!canClaim) return;

    const newStreak = streak >= 30 ? 1 : streak + 1;
    setStreak(newStreak);
    setLastClaimDate(currentJstToday);
    
    localStorage.setItem('tempest_streak', newStreak.toString());
    localStorage.setItem('tempest_last_claim_date', currentJstToday);

    // Claim gives +7 points daily
    const nextPoints = points + 7;
    updatePoints(nextPoints);

    setRecentActions(prev => [
      { id: `claim-${Date.now()}`, text: `Claimed Day ${newStreak} Check-in (+7 Pts)`, time: 'Just now', plus: true },
      ...prev.slice(0, 5)
    ]);
  };

  // Save to LocalStorage during state shifts
  const updatePoints = (newPoints: number) => {
    setPoints(newPoints);
    localStorage.setItem('tempest_points', newPoints.toString());
  };

  const handlePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updatedPinned: string[];
    let rewardPoints = 0;
    const targetWp = wallpapers.find(w => w.id === id) || INITIAL_WALLPAPERS.find(w => w.id === id);
    const title = targetWp ? targetWp.title : 'Anime Wallpaper';

    if (pinnedIds.includes(id)) {
      // Unliking
      // If the entry was liked today, decrement daily count
      const histItem = likedHistory.find(item => item.id === id);
      if (histItem) {
        const itemJstDate = getJstDateString(histItem.likedAt);
        const { jstTodayStr } = getJstTimeInfo();
        if (itemJstDate === jstTodayStr) {
          const nextCount = Math.max(0, dailyLikesCount - 1);
          setDailyLikesCount(nextCount);
          localStorage.setItem('tempest_daily_likes_count', nextCount.toString());
        }
      }

      updatedPinned = pinnedIds.filter((p) => p !== id);
      rewardPoints = -3;
      setRecentActions(prev => [
        { id: `act-${Date.now()}`, text: `Removed like from ${title}`, time: 'Just now', plus: false },
        ...prev.slice(0, 5)
      ]);

      // Update likedHistory
      const nextHistory = likedHistory.filter(item => item.id !== id);
      setLikedHistory(nextHistory);
      localStorage.setItem('tempest_liked_history', JSON.stringify(nextHistory));
    } else {
      // Pinning/Liking check daily limit of 100 first
      if (dailyLikesCount >= 100) {
        setRecentActions(prev => [
          { id: `err-${Date.now()}`, text: '100 Like Limit reached! Resets at midnight JST', time: 'Just now', plus: false },
          ...prev.slice(0, 5)
        ]);
        return;
      }

      // Pinning/Liking gives 3 points
      updatedPinned = [...pinnedIds, id];
      rewardPoints = 3;
      setRecentActions(prev => [
        { id: `act-${Date.now()}`, text: `Liked "${title}" (+3 Pts)`, time: 'Just now', plus: true },
        ...prev.slice(0, 5)
      ]);

      const nextCount = dailyLikesCount + 1;
      setDailyLikesCount(nextCount);
      localStorage.setItem('tempest_daily_likes_count', nextCount.toString());

      // Save to likedHistory with current timestamp so it triggers auto-delete exactly after 30 days
      const newHistoryItem: LikedHistoryItem = {
        id,
        title,
        imageUrl: targetWp ? targetWp.imageUrl : '',
        likedAt: Date.now(),
        category: targetWp ? targetWp.category : 'General',
        character: targetWp ? targetWp.character : 'Unknown'
      };
      const nextHistory = [newHistoryItem, ...likedHistory];
      setLikedHistory(nextHistory);
      localStorage.setItem('tempest_liked_history', JSON.stringify(nextHistory));
    }

    setPinnedIds(updatedPinned);
    localStorage.setItem('tempest_pinned', JSON.stringify(updatedPinned));
    updatePoints(Math.max(0, points + rewardPoints));
  };

  const handleClearHistory = () => {
    setPinnedIds([]);
    setLikedHistory([]);
    localStorage.setItem('tempest_pinned', JSON.stringify([]));
    localStorage.setItem('tempest_liked_history', JSON.stringify([]));
    
    setRecentActions(prev => [
      { id: `clear-hist-${Date.now()}`, text: 'Cleared all Liked History logs', time: 'Just now', plus: false },
      ...prev.slice(0, 5)
    ]);
  };

  const handleViewFromHistory = (id: string) => {
    const wp = wallpapers.find(w => w.id === id) || INITIAL_WALLPAPERS.find(w => w.id === id);
    if (wp) {
      setSelectedWallpaper(wp);
    }
  };

  const handleRedeemCode = (newCode: RedemptionCode) => {
    const updatedCodes = [newCode, ...redeemedCodes];
    setRedeemedCodes(updatedCodes);
    localStorage.setItem('tempest_codes', JSON.stringify(updatedCodes));
    updatePoints(Math.max(0, points - newCode.pointsUsed));
    
    const rewardName = newCode.rewardType === 'paypay' ? '200 PP Points JCode' : 'GCash ₱100 Code';
    setRecentActions(prev => [
      { id: `act-${Date.now()}`, text: `Generated ${rewardName}! Use 2x App to double!`, time: 'Just now', plus: true },
      ...prev.slice(0, 5)
    ]);
  };

  const handlePurchaseVerifiedBadge = () => {
    if (points < 50000) return;
    updatePoints(Math.max(0, points - 50000));

    if (activeUserEmail) {
      const cleanEmail = activeUserEmail.toLowerCase().trim();
      const updated = { ...profilesDb };
      if (updated[cleanEmail]) {
        updated[cleanEmail] = {
          ...updated[cleanEmail],
          isVerified: true,
          verifiedUntil: Date.now() + 30 * 24 * 60 * 60 * 1000 // 1 month
        };
        setProfilesDb(updated);
        localStorage.setItem('tempest_users_db', JSON.stringify(updated));
      }
    }

    setRecentActions(prev => [
      { id: `verified-${Date.now()}`, text: `Purchased 1-Month Verified Badge (-50,000 Pts)`, time: 'Just now', plus: false },
      ...prev.slice(0, 5)
    ]);
  };

  const handleSuccessDoubleClaim = (code: string, doubledValue: string, rewardType: 'paypay' | 'gcash') => {
    setRecentActions(prev => [
      { id: `double-${Date.now()}`, text: `💥 Doubled 2X: ${code} & sent ${doubledValue} to 09763329358`, time: 'Just now', plus: true },
      ...prev.slice(0, 5)
    ]);
  };

  const fetchMoreItems = () => {
    if (loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);

    const countToLoad = 12;
    const currentOffset = loadedOffsetRef.current;
    
    // reserve next block immediately to prevent overlapping calls
    loadedOffsetRef.current = currentOffset + countToLoad;

    fetchLiveAnimeWallpapers(currentOffset, countToLoad)
      .then((newItems) => {
        setWallpapers((prev) => {
          // Avoid key collision securely by filtering duplicate IDs
          const existingIds = new Set(prev.map(item => item.id));
          const uniqueNewItems = newItems.map(item => {
            if (existingIds.has(item.id)) {
              // Ensure uniqueness if same ID is returned or resolved
              return {
                ...item,
                id: `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
              };
            }
            return item;
          });
          const updated = [...prev, ...uniqueNewItems];
          // Cache the latest 100 wallpapers
          localStorage.setItem('cached_wallpapers', JSON.stringify(updated.slice(-100)));
          return updated;
        });
        setLoadedOffset(loadedOffsetRef.current);
      })
      .catch((err) => {
        console.warn("Failsafe handling engaged for public anime APIs:", err);
      })
      .finally(() => {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      });
  };

  // Safe Infinite Scroll Trigger using IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMoreRef.current) {
          fetchMoreItems();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, []); // Only run once on mount

  // Keep the callback ref up-to-date synchronously on every render
  useEffect(() => {
    fetchMoreItemsRef.current = fetchMoreItems;
  }, [fetchMoreItems]);

  // Eagerly populate and stream fresh wallpaper graphics from free APIs on immediate mount
  // Preload from cache first if available
  useEffect(() => {
    const cached = localStorage.getItem('cached_wallpapers');
    if (cached) {
      try {
        setWallpapers(JSON.parse(cached));
      } catch (e) {
        console.error("Cache parsing error", e);
        fetchMoreItems();
      }
    } else {
      fetchMoreItems();
    }
  }, []);

  // Removed problematic IntersectionObserver to fix infinite loop refresh cycles.
  // We now rely on explicit user actions for refreshing like the "Refresh Feed" button.

  // Filtering Wallpapers by category, tag, and liked check values
  const filteredWallpapers = wallpapers.filter((wp) => {
    const isNotBroken = !brokenIds.includes(wp.id);
    const matchesCategory = activeCategory === 'All' || wp.category === activeCategory;
    const matchesTag = activeTag === 'All Tags' || (wp.tags && wp.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase()));
    
    // Liked status filtering
    const isPinned = pinnedIds.includes(wp.id);
    let matchesLikedFilter = true;
    if (showLikedFilter === 'liked') {
      matchesLikedFilter = isPinned;
    } else {
      // By default or 'hideLiked', exclude liked/saved items completely so the feed stays fresh!
      matchesLikedFilter = !isPinned;
    }

    return isNotBroken && matchesCategory && matchesTag && matchesLikedFilter;
  });

  const activeProfile = activeUserEmail ? profilesDb[activeUserEmail.toLowerCase().trim()] : null;
  const isAdmin = activeUserEmail.toLowerCase().trim() === 'mdv4244@gmail.com';

  // Circular progress ring calculations for Daily Like Quota Tracker
  const progressRadius = 20;
  const progressCircumference = 2 * Math.PI * progressRadius;
  const progressPercentage = Math.min((dailyLikesCount / 100) * 100, 100);
  const progressStrokeDashoffset = progressCircumference - (progressPercentage / 100) * progressCircumference;

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      
      <AnimatePresence>
        {isMaintenanceMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-slate-950 flex flex-col items-center justify-center p-6 select-none overflow-hidden"
          >
            {/* Background glowing gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.5)_1px,transparent_1px)] bg-[size:32px_32px] opacity-35 pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center space-y-6">
              {/* Glowing Warm Welcome Badge */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase font-mono"
              >
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                <span>ONLINE GIVING PORTAL</span>
              </motion.div>

              {/* Welcome Headline */}
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white font-display uppercase drop-shadow-[0_4px_12px_rgba(99,102,241,0.25)]">
                WELCOME TO THE ONLY HONEST GIVING APP
              </h1>

              {/* Broadcast Message card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 font-mono">System Broadcast</p>
                <p className="text-sm md:text-base text-slate-300 font-semibold tracking-tight mb-4">
                  Press the cross to continue the experience
                </p>
                
                {/* Large Interactive Close Cross Button */}
                <div className="flex justify-center items-center py-2">
                  <motion.button
                    whileHover={{ scale: 1.15, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      playClickSound();
                      setIsMaintenanceMode(false);
                    }}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:brightness-110 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 border border-white/20 cursor-pointer pointer-events-auto"
                    aria-label="Continue"
                  >
                    <X className="w-9 h-9 stroke-[3]" />
                  </motion.button>
                </div>
              </div>

              {/* Bunny Stage & Animation Wrapper */}
              <div className="relative w-full max-w-sm h-80 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col items-center justify-end pb-8 shadow-inner overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/20 to-transparent pointer-events-none" />
                
                {/* Floating ambient star sparkles */}
                <div className="absolute inset-8 pointer-events-none">
                  {/* Left Star */}
                  <motion.div
                    animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute top-4 left-6"
                  >
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                  </motion.div>
                  {/* Right Star */}
                  <motion.div
                    animate={{ y: [0, -12, 0], opacity: [0.4, 0.8, 0.4], scale: [1, 0.7, 1] }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-8 right-6"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </motion.div>
                  {/* Bottom Star */}
                  <motion.div
                    animate={{ scale: [0.7, 1.1, 0.7], opacity: [0.2, 0.9, 0.2] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.25 }}
                    className="absolute bottom-16 left-12"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  </motion.div>
                </div>

                {/* ANIMATED DANCING BUNNY VECTOR */}
                <div className="relative z-10 filter drop-shadow-[0_12px_24px_rgba(139,92,246,0.18)]">
                  <svg viewBox="0 0 200 210" className="w-48 h-52">
                    {/* Pulsing Floor Shadow */}
                    <motion.ellipse
                      cx="100"
                      cy="192"
                      rx="42"
                      ry="6"
                      fill="#020617"
                      animate={{ scaleX: [0.93, 1.07, 0.93], opacity: [0.8, 0.5, 0.8] }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                    />

                    {/* Wiggling Left Ear */}
                    <motion.g
                      animate={{ rotate: [-10, 10, -10] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                      style={{ transformOrigin: "45px 85px" }}
                    >
                      <ellipse cx="45" cy="50" rx="11" ry="34" fill="#FFFFFF" transform="rotate(-15, 45, 50)" />
                      <ellipse cx="45" cy="53" rx="5" ry="24" fill="#FFA3B5" transform="rotate(-15, 45, 53)" />
                    </motion.g>

                    {/* Wiggling Right Ear */}
                    <motion.g
                      animate={{ rotate: [10, -10, 10] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 }}
                      style={{ transformOrigin: "155px 85px" }}
                    >
                      <ellipse cx="155" cy="50" rx="11" ry="34" fill="#FFFFFF" transform="rotate(15, 155, 50)" />
                      <ellipse cx="155" cy="53" rx="5" ry="24" fill="#FFA3B5" transform="rotate(15, 155, 53)" />
                    </motion.g>

                    {/* Bobbing Head */}
                    <motion.g
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                    >
                      <circle cx="100" cy="100" r="41" fill="#FFFFFF" />
                      
                      {/* Rosy blush cheeks */}
                      <circle cx="73" cy="111" r="6" fill="#FF8D9C" opacity="0.6" />
                      <circle cx="127" cy="111" r="6" fill="#FF8D9C" opacity="0.6" />

                      {/* Blinking Eyes */}
                      <motion.g
                        animate={{ scaleY: [1, 0.05, 1, 1, 1] }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                        style={{ transformOrigin: "100px 100px" }}
                      >
                        {/* Left Pupil */}
                        <circle cx="81" cy="98" r="4" fill="#0F172A" />
                        <circle cx="79" cy="96" r="1.5" fill="#FFFFFF" />
                        
                        {/* Right Pupil */}
                        <circle cx="119" cy="98" r="4" fill="#0F172A" />
                        <circle cx="117" cy="96" r="1.5" fill="#FFFFFF" />
                      </motion.g>

                      {/* Happy mouth & pink nose */}
                      <polygon points="100,105 97,102 103,102" fill="#FF5E7E" />
                      <path d="M 96,108 Q 100,111 104,108" stroke="#0F172A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </motion.g>

                    {/* Sways Body and Arms */}
                    <motion.g
                      animate={{ 
                        rotate: [-5, 5, -5],
                        skewX: [-2, 2, -2]
                      }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                      style={{ transformOrigin: "100px 180px" }}
                    >
                      {/* White Pear Body */}
                      <path d="M 76,134 Q 61,189 100,189 Q 139,189 124,134 Z" fill="#FFFFFF" />
                      
                      {/* Red Ribbon Bowtie */}
                      <polygon points="100,143 91,136 91,150" fill="#F43F5E" />
                      <polygon points="100,143 109,136 109,150" fill="#F43F5E" />
                      <circle cx="100" cy="143" r="3" fill="#FFE4E6" />

                      {/* Left Swinging Wave Arm */}
                      <motion.path
                        d="M 68,145 Q 42,128 36,143"
                        stroke="#FFFFFF"
                        strokeWidth="11"
                        strokeLinecap="round"
                        fill="none"
                        animate={{ rotate: [-24, 24, -24] }}
                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                        style={{ transformOrigin: "68px 145px" }}
                      />

                      {/* Right Swinging Wave Arm */}
                      <motion.path
                        d="M 132,145 Q 158,128 164,143"
                        stroke="#FFFFFF"
                        strokeWidth="11"
                        strokeLinecap="round"
                        fill="none"
                        animate={{ rotate: [24, -24, 24] }}
                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.3 }}
                        style={{ transformOrigin: "132px 145px" }}
                      />
                    </motion.g>

                    {/* Alternating Tapping Feet */}
                    <g>
                      {/* Left Foot pink pads */}
                      <motion.ellipse
                        cx="81"
                        cy="192"
                        rx="11"
                        ry="5.5"
                        fill="#FFFFFF"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.3, ease: "easeInOut" }}
                      />
                      <motion.ellipse
                        cx="81"
                        cy="192"
                        rx="6"
                        ry="2.5"
                        fill="#FFA3B5"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.3, ease: "easeInOut" }}
                      />

                      {/* Right Foot pink pads */}
                      <motion.ellipse
                        cx="119"
                        cy="192"
                        rx="11"
                        ry="5.5"
                        fill="#FFFFFF"
                        animate={{ y: [-5, 0, -5] }}
                        transition={{ repeat: Infinity, duration: 0.3, ease: "easeInOut", delay: 0.15 }}
                      />
                      <motion.ellipse
                        cx="119"
                        cy="192"
                        rx="6"
                        ry="2.5"
                        fill="#FFA3B5"
                        animate={{ y: [-5, 0, -5] }}
                        transition={{ repeat: Infinity, duration: 0.3, ease: "easeInOut", delay: 0.15 }}
                      />
                    </g>
                  </svg>
                </div>

                <span className="text-[10px] text-slate-500 font-mono tracking-widest mt-4 uppercase animate-pulse">
                  Dancing Bun Bunny v2.5 Stable
                </span>
              </div>

              {/* Hidden System Bypass Indicator at Bottom */}
              <div 
                onClick={handleBypassClick}
                className="pt-8 flex flex-col items-center gap-1.5 cursor-pointer selection:bg-transparent"
                title="System override key"
              >
                <div className="flex items-center gap-2 bg-slate-900/40 hover:bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800/80 transition-all active:scale-95 text-slate-500 hover:text-slate-400">
                  <motion.div
                    animate={{ rotate: bypassClicks > 0 ? bypassClicks * 72 : 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </motion.div>
                  <span className="text-[10px] font-mono tracking-wider uppercase font-bold">
                    {bypassClicks > 0 ? `Bypass active: ${bypassClicks}/5` : 'SECURE SYSTEM ENCRYPTED'}
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Navigation matching Geometric Balance styling */}
      <nav className="h-16 border-b border-slate-800 bg-slate-900/50 px-6 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => { playClickSound(); setCurrentPage('gallery'); }} 
            className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-xl italic text-slate-100 overflow-hidden shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <img
              src={mainLogo}
              alt="AT"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="logo-text-fallback">AT</span>
          </div>
          <div>
            <h1 
              onClick={() => { playClickSound(); setCurrentPage('gallery'); }} 
              className="text-sm md:text-base font-extrabold tracking-tight leading-none uppercase text-white cursor-pointer hover:text-indigo-300 transition-colors"
            >
              Anime Inn Tempest
            </h1>
            <p className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
              your one stop shop to earn while liking your HOBBY
            </p>
          </div>
        </div>

        {/* Dynamic Pages Tab Control - Direct Screen Switching */}
        <div className="flex items-center gap-1 bg-slate-950/40 p-1 rounded-xl border border-slate-850/80">
          <button
            onClick={() => { playClickSound(); setCurrentPage('gallery'); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
              currentPage === 'gallery' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏡 Feed
          </button>
          <button
            onClick={() => { playClickSound(); setCurrentPage('social'); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
              currentPage === 'social' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            id="nav-social-btn"
          >
            💬 Social Home
          </button>
          <button
            onClick={() => { playClickSound(); setCurrentPage('register'); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
              currentPage === 'register' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            id="nav-register-btn"
          >
            📝 Register
          </button>
          <button
            onClick={() => { playClickSound(); setCurrentPage('login'); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-wider cursor-pointer transition-all ${
              currentPage === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            id="nav-login-btn"
          >
            🔑 Login
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden xs:flex items-center bg-slate-800 px-3 py-1 rounded-full border border-slate-700/80 font-mono">
            <span className="text-[9px] font-bold text-slate-400 mr-1.5 uppercase">WALLET:</span>
            <span className="text-indigo-400 font-extrabold text-[11px] md:text-xs tracking-tight">{points.toLocaleString()} pts</span>
          </div>

          {/* User Profile display based on real session credentials */}
          {activeProfile ? (
            <div className="flex items-center gap-2 border-l border-slate-800 pl-3 md:pl-4" id="logged-user-avatar-slot">
              <img 
                src={activeProfile.avatar} 
                alt="" 
                className="w-8 h-8 rounded-full border-2 border-indigo-500 object-cover shrink-0" 
                referrerPolicy="no-referrer"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-black truncate text-slate-200 flex items-center gap-1.5 leading-none">
                  {activeProfile.nickname}
                  <VerifiedBadge email={activeProfile.email} isVerified={activeProfile.isVerified} />
                </span>
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none mt-1">
                  {isAdmin ? '👑 ADMIN' : '⭐ MEMBER'}
                </span>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  setActiveUserEmail('');
                  localStorage.removeItem('tempest_active_user_email');
                  setRecentActions(prev => [
                    { id: `logout-${Date.now()}`, text: 'Signed out active member account', time: 'Just now', plus: false },
                    ...prev
                  ]);
                  setCurrentPage('gallery');
                }}
                className="px-2 py-1 bg-slate-800/80 hover:bg-rose-955 border border-slate-700 text-slate-400 hover:text-rose-450 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer select-none"
                title="Log out of Secure Profile"
                id="header-logout-btn"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-slate-800 pl-3 md:pl-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-500">
                G
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-slate-450">Guest Mode</span>
            </div>
          )}
        </div>
      </nav>

      {/* Main Structural Layout Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Sidebar: Points milestones and fast Shop redeem launcher */}
        <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/30 p-5 md:p-6 flex flex-row lg:flex-col gap-4 lg:gap-6 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto shrink-0 select-none">
          
          {/* Shop Milestone Launcher with 2x Redeemer App */}
          <div className="bg-indigo-600/10 border border-indigo-500/25 rounded-xl p-4 lg:p-5 flex-1 min-w-[260px] lg:min-w-0 flex flex-col justify-between">
            <div>
              <h2 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-mono">
                <Coins className="w-3.5 h-3.5" />
                Next Big Reward
              </h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs lg:text-sm text-slate-350 font-bold">200 PayPay JCode</span>
                <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded font-mono font-black">1k pts</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full mb-4 border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-rose-500 h-full rounded-full shadow-[0_0_8px_rgba(244,63,94,0.3)] transition-all duration-305"
                  style={{ width: `${Math.min((points / 1000) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { playClickSound(); setIsShopOpen(true); }}
                className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 rounded-lg font-black text-xs tracking-wider transition-colors cursor-pointer select-none"
              >
                1. Exchange JCode Shop
              </button>
              <button 
                onClick={() => { playClickSound(); setIsRedeemerOpen(true); }}
                className="w-full py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-lg font-black text-xs tracking-wider transition-colors cursor-pointer select-none flex items-center justify-center gap-1 shadow-md shadow-pink-950/20"
              >
                <Smartphone className="w-3.5 h-3.5 animate-bounce" />
                2. Open 2X Double App
              </button>
            </div>
          </div>

          {/* Recent Earnings Timeline */}
          <div className="hidden lg:flex flex-col gap-4 flex-1">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Recent Actions
            </h3>
            <div className="space-y-2.5 max-h-[180px] lg:max-h-none overflow-y-auto pr-1">
              {recentActions.map((act) => (
                <div key={act.id} className="flex items-center gap-2.5 p-2 bg-slate-800/40 rounded-lg border border-slate-700/50 text-[11px] transition-all hover:bg-slate-800/60">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${act.plus ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
                  <span className="text-slate-300 truncate flex-1 font-medium">{act.text}</span>
                  <span className="text-[9px] text-slate-500 shrink-0 font-mono">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Command Console System for administrator accounts */}
          {isAdmin && (
            <AdminConsole
              profilesDb={profilesDb}
              setProfilesDb={setProfilesDb}
              activeCodes={activeCodes}
              setActiveCodes={setActiveCodes}
            />
          )}

          {/* Help Profile panel */}
          <div className="p-4 bg-slate-800/20 border border-slate-800/80 rounded-xl flex-1 lg:flex-initial min-w-[240px] lg:min-w-0 flex flex-col justify-center">
            <p className="text-[10px] text-slate-400 mb-1.5 font-semibold">Secure Code Delivery Profile:</p>
            <a 
              href="https://www.facebook.com/usagyuunvtuber5" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs font-mono text-indigo-300 hover:text-indigo-400 transition-colors flex items-center gap-1 truncate font-bold"
            >
              <span>fb.com/usagyuunvtuber5</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
        </aside>

        {/* Router screen condition switch */}
        {currentPage === 'gallery' ? (
          /* Right Gallery Feed: Showcase Masonry Catalogue Grid */
          <section 
            ref={galleryContainerRef}
            onScroll={handleGalleryScroll}
            className="flex-1 p-5 md:p-6 overflow-y-auto flex flex-col gap-6" 
            id="right-gallery-container"
          >
          
          {/* Daily Tokyo Time Login Bonus Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl border border-indigo-500/20 p-5 md:p-6 shadow-xl flex flex-col gap-5 select-none shrink-0" id="daily-login-banner">
            {/* Ambient Background Glow elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start md:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                  <Gift className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">DAILY TOKYO BONUS</span>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-medium">Tokyo JST Midnight Reset</span>
                  </div>
                  <h3 className="text-base md:text-lg font-extrabold text-white tracking-tight mt-0.5 flex items-center gap-1.5">
                    Day Check-In Streak: <span className="text-indigo-400 font-mono text-lg">{streak}/30</span>
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Claim +7 points every day. Consistently log in up to 30 days to maximize your wallet rewards for GCash redemptions!
                  </p>
                </div>
              </div>

              {/* Reset Time Countdown & Claim Action Button */}
              <div className="flex items-center md:items-end justify-between md:flex-col gap-4 bg-slate-950/40 p-3 md:p-0 md:bg-transparent rounded-xl border border-slate-800/60 md:border-0">
                <div className="flex flex-col md:items-end">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider md:text-right flex items-center gap-1 md:justify-end">
                    <Clock className="w-3 h-3 text-indigo-400" /> RESETS IN (TOKYO TIME)
                  </span>
                  <span className="text-sm md:text-base font-black text-white font-mono tracking-wider md:text-right text-indigo-300">
                    {countdown}
                  </span>
                </div>

                <button
                  onClick={handleClaimReward}
                  disabled={!canClaim}
                  id="claim-reward-button"
                  className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all select-none duration-250 ${
                    canClaim
                      ? 'bg-indigo-500 hover:bg-indigo-400 text-slate-950 hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer active:scale-95'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  }`}
                >
                  {canClaim ? `Claim Day ${streak >= 30 ? 1 : streak + 1} (+7 pts)` : 'Claimed Today ✔️'}
                </button>
              </div>
            </div>

            {/* Daily Like Quota Tracker */}
            <div className="border-t border-indigo-500/15 pt-4 mt-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 select-none">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center select-none shrink-0">
                  {/* SVG progress ring around the heart */}
                  <svg className="absolute w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 48 48">
                    {/* Background Track Circle */}
                    <circle
                      cx="24"
                      cy="24"
                      r="19"
                      className="stroke-slate-800"
                      strokeWidth="3"
                      fill="none"
                    />
                    {/* Active Progress Circle */}
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="19"
                      className={dailyLikesCount >= 100 ? "stroke-rose-500" : "stroke-indigo-400"}
                      strokeWidth="3.2"
                      fill="none"
                      strokeLinecap="round"
                      animate={{ strokeDashoffset: progressStrokeDashoffset }}
                      style={{
                        strokeDasharray: progressCircumference,
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 80, 
                        damping: 15,
                        mass: 0.8
                      }}
                    />
                  </svg>
                  <div className={`p-2 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${dailyLikesCount >= 100 ? 'bg-rose-500/15 text-rose-400' : 'bg-indigo-600/10 text-indigo-400'}`}>
                    <Heart className={`w-4.5 h-4.5 ${dailyLikesCount >= 100 ? 'fill-current text-rose-500 animate-pulse' : 'text-indigo-400'}`} />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                    Daily Pin Limit: <span className={`font-mono font-black ${dailyLikesCount >= 100 ? 'text-rose-400 bg-rose-900/40 px-1.5 py-0.5 rounded border border-rose-500/20' : 'text-indigo-400 bg-indigo-900/40 px-1.5 py-0.5 rounded border border-indigo-500/20'}`}>{dailyLikesCount}/100</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {dailyLikesCount >= 100 
                      ? '100 likes cap reached! Liking is disabled and "+in" buttons are turned red. Resets at midnight.' 
                      : 'Newly liked wallpapers grant +3 points up to a limit of 100 total likes daily.'
                    }
                  </p>
                </div>
              </div>

              {/* Quota indicator */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start bg-slate-950/20 px-3 py-1.5 rounded-lg border border-indigo-500/5 sm:border-0 sm:bg-transparent">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dailyLikesCount >= 100 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-ping'}`} />
                  <span className={`text-[10px] uppercase font-mono font-bold tracking-wider ${dailyLikesCount >= 100 ? 'text-rose-400 font-extrabold' : 'text-emerald-400'}`}>
                    {dailyLikesCount >= 100 ? 'Limit Active' : 'Allow Likes'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick collapsable link to reveal all 30 days tiles journey */}
            <div className="border-t border-indigo-500/10 pt-4 mt-1 relative z-10">
              <button
                onClick={() => setShowDaysGrid(!showDaysGrid)}
                id="toggle-days-grid-button"
                className="text-[10px] font-bold text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5 cursor-pointer select-none"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{showDaysGrid ? 'Hide 30-Day Check-In Calendar' : 'View 30-Day Check-In Calendar'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showDaysGrid ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showDaysGrid && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mt-4" id="days-checkin-grid">
                      {Array.from({ length: 30 }).map((_, index) => {
                        const dayNum = index + 1;
                        const isClaimed = dayNum <= streak;
                        const isToday = dayNum === (streak >= 30 ? 1 : streak + 1) && canClaim;

                        return (
                          <div
                            key={dayNum}
                            className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all ${
                              isClaimed
                                ? 'bg-indigo-500/15 border-indigo-550 text-indigo-300 shadow-[inset_0_0_8px_rgba(99,102,241,0.15)] font-black'
                                : isToday
                                ? 'bg-indigo-500/25 border-indigo-400 text-white animate-pulse font-bold'
                                : 'bg-slate-900/50 border-slate-800 text-slate-500'
                            }`}
                          >
                            <span className="text-[9px] uppercase tracking-wider mb-0.5">Day {dayNum}</span>
                            <span className="text-[10px] font-bold font-mono">
                              {isClaimed ? '✔️' : '+7pts'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Secures points registration & beautiful share cards widget */}
          <ProfileShareHub
            currentPoints={points}
            onUpdatePoints={updatePoints}
            onAddRecentAction={(text, plus) => setRecentActions(prev => [{ id: `action-${Date.now()}`, text, time: 'Just now', plus }, ...prev.slice(0, 5)])}
            profilesDb={profilesDb}
            setProfilesDb={setProfilesDb}
            activeUserEmail={activeUserEmail}
            setActiveUserEmail={setActiveUserEmail}
            activeCodes={activeCodes}
            setActiveCodes={setActiveCodes}
          />

          {/* Categorized Filter controls & Stats Header */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-800 pb-5" id="categorized-filter-controls">
            
            {/* Quick Primary Filters */}
            <div className="flex flex-wrap items-center gap-2 select-none">
              <button 
                onClick={() => setActiveCategory('All')} 
                className={`px-4 py-1.5 text-xs font-black rounded-full transition-all select-none cursor-pointer ${
                  activeCategory === 'All'
                    ? 'bg-white text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/40 bg-slate-950/20'
                }`}
              >
                Trending All
              </button>
              
              <button 
                onClick={() => setActiveCategory('Cyberpunk Neon')} 
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all select-none cursor-pointer ${
                  activeCategory === 'Cyberpunk Neon'
                    ? 'bg-indigo-550 text-white font-black shadow-md shadow-indigo-500/10'
                    : 'text-slate-450 hover:text-white hover:bg-slate-900/40 bg-slate-950/20'
                }`}
              >
                Cyberpunk
              </button>

              <button 
                onClick={() => setActiveCategory('Scenic & Sky')} 
                className={`hidden md:inline-block px-4 py-1.5 text-xs font-bold rounded-full transition-all select-none cursor-pointer ${
                  activeCategory === 'Scenic & Sky'
                    ? 'bg-indigo-550 text-white font-black shadow-md shadow-indigo-500/10'
                    : 'text-slate-450 hover:text-white hover:bg-slate-900/40 bg-slate-950/20'
                }`}
              >
                Scenery
              </button>

              {/* Liked & Unliked Filtration Toggles to prevent bulk lookups */}
              <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 shrink-0 ml-0 lg:ml-2">
                <button
                  onClick={() => setShowLikedFilter('hideLiked')}
                  className={`px-3 py-1.5 rounded-md text-[10px] uppercase tracking-wider font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    showLikedFilter === 'hideLiked'
                      ? 'bg-indigo-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Show only fresh wallpapers you haven't liked yet"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span>Fresh Feed</span>
                </button>
                <button
                  onClick={() => setShowLikedFilter('liked')}
                  className={`px-3 py-1.5 rounded-md text-[10px] uppercase tracking-wider font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    showLikedFilter === 'liked'
                      ? 'bg-indigo-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-indigo-400'
                  }`}
                  title="Show Liked Images Only"
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                  <span>Liked ({pinnedIds.length})</span>
                </button>
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="px-3 py-1.5 rounded-md text-[10px] uppercase tracking-wider font-extrabold transition-all cursor-pointer flex items-center gap-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-850/60"
                  title="View already liked 30-day chronological history cache"
                >
                  <History className="w-3.5 h-3.5 text-amber-500" />
                  <span>History ({likedHistory.length})</span>
                </button>
              </div>
            </div>
            
            {/* Interactive Refresh catalyst & count */}
            <div className="flex items-center justify-between sm:justify-end gap-3 select-none self-stretch lg:self-auto">
              <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                <span>Displaying</span>
                <span className="text-indigo-400 font-bold">{filteredWallpapers.length} Wallpapers</span>
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              </div>

              {/* Refresh Feed Trigger Button with smooth rotating lock animation */}
              <button
                onClick={handleRefreshFeed}
                disabled={loadingMore}
                id="refresh-feed-button"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 hover:text-indigo-200 text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer shadow-md"
                title="Pulls completely fresh, rich unliked wallpapers from free public APIs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingMore ? 'animate-spin text-emerald-400' : ''}`} />
                <span>Refresh Feed</span>
              </button>
            </div>
          </div>

          {/* Quick categories full layout horizontally */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none shrink-0 filter-scroll border-b border-slate-900">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  // Resets or maintains tags as they narrow down
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/40 font-black'
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-850/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Trending Tags Section - Allows narrowing down results */}
          <div className="flex flex-col gap-2 border-b border-slate-900 pb-4 select-none shrink-0" id="trending-tags-section">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse shrink-0" />
                Trending Tags
              </span>
              {activeTag !== 'All Tags' && (
                <button
                  onClick={() => setActiveTag('All Tags')}
                  className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer select-none"
                >
                  Clear Tag Filter (Active: #{activeTag})
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 filter-scroll" id="trending-tags-scroller">
              {['All Tags', 'Cyberpunk', 'Neon', 'SciFi', 'Sky', 'CherryBlossom', 'Fantasy', 'Retro', 'Lo-Fi', 'Samurai', 'Traditional', 'Hologram', 'Tech', 'Minimalist', 'Synthwave', 'Solo', 'Moegirl', 'Cute'].map((tag) => {
                const isSelected = activeTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 transform-gpu active:scale-95 ${
                      isSelected
                        ? 'bg-indigo-500 text-slate-950 font-black shadow-md shadow-indigo-500/20'
                        : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span className={`text-[10px] ${isSelected ? 'text-slate-950 opacity-90' : 'text-indigo-400'}`}>#</span>
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Geometric responsive dynamic flex layout or grid catalog */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredWallpapers.map((wallpaper) => (
              <AnimeCard
                key={wallpaper.id}
                wallpaper={wallpaper}
                onView={(wp) => setSelectedWallpaper(wp)}
                onPin={handlePin}
                isPinned={pinnedIds.includes(wallpaper.id)}
                isDailyLimitReached={dailyLikesCount >= 100}
                onLoadError={handleLoadError}
              />
            ))}
          </div>

          {/* Infinite Scroll Load Trigger Sentinel */}
          <div ref={sentinelRef} className="pt-8 pb-12 flex flex-col items-center justify-center gap-3">
             {loadingMore ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-2 select-none"
              >
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 rounded-full border-4 border-slate-900 border-t-indigo-500" 
                />
                <span className="text-xs font-semibold tracking-wider text-indigo-400/80 font-mono">Loading more anime visuals...</span>
              </motion.div>
            ) : (
              <button
                onClick={fetchMoreItems}
                className="py-2.5 px-6 rounded-full border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:border-slate-700 font-bold text-xs text-slate-450 hover:text-slate-250 transition-all select-none cursor-pointer active:scale-97"
              >
                Load more wallpapers
              </button>
            )}
          </div>
        </section>
        ) : currentPage === 'social' ? (
          <SocialHome
            activeProfile={activeProfile}
            profilesDb={profilesDb}
            onUpdateProfiles={setProfilesDb}
            playClickSound={playClickSound}
          />
        ) : currentPage === 'register' ? (
          <section className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col items-center justify-center bg-slate-950/40 relative select-none" id="dedicated-register-section">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06),transparent_70%)] pointer-events-none" />
            <div className="w-full max-w-xl bg-slate-900 border border-slate-850/80 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-400/30 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-black tracking-tight text-white uppercase">DEDICATED REGISTER PORTAL</h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-0.5">Secure registration database - All your points will be permanent locked!</p>
                </div>
              </div>
              <AppRegisterForm 
                currentPoints={points}
                profilesDb={profilesDb}
                onRegisterSuccess={(profile) => {
                  setProfilesDb(prev => {
                    const updated = { ...prev, [profile.email.toLowerCase().trim()]: profile };
                    
                    if (profile.referredBy) {
                      const refEmail = profile.referredBy.toLowerCase().trim();
                      if (updated[refEmail]) {
                        const currentRef = (updated[refEmail].referralCount || 0) + 1;
                        let bonusPoints = 0;
                        let textAction = `Joined using ${updated[refEmail].nickname}'s referral link`;
                        
                        if (currentRef === 21) {
                          bonusPoints = 2000;
                          textAction = `🎉 ${updated[refEmail].nickname} reached 21 referrals & earned 2,000 pts bonus!`;
                        }
                        
                        updated[refEmail] = {
                          ...updated[refEmail],
                          referralCount: currentRef,
                          points: (updated[refEmail].points || 0) + bonusPoints
                        };

                        if (activeUserEmail && refEmail === activeUserEmail.toLowerCase().trim()) {
                          setPoints(updated[refEmail].points);
                        }

                        setRecentActions(prevActions => [
                          { id: `ref-mod-${Date.now()}`, text: textAction, time: 'Just now', plus: bonusPoints > 0 },
                          ...prevActions.slice(0, 5)
                        ]);
                      }
                    }

                    localStorage.setItem('tempest_users_db', JSON.stringify(updated));
                    return updated;
                  });
                  setActiveUserEmail(profile.email);
                  localStorage.setItem('tempest_active_user_email', profile.email);
                  setPoints(profile.points);
                  setRecentActions(prev => [{ id: `reg-${Date.now()}`, text: `Registered Profile ${profile.nickname}`, time: 'Just now', plus: true }, ...prev.slice(0, 5)]);
                  setCurrentPage('gallery');
                }}
                activeCodes={activeCodes}
              />
            </div>
          </section>
        ) : (
          <section className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col items-center justify-center bg-slate-950/40 relative select-none" id="dedicated-login-section">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06),transparent_70%)] pointer-events-none" />
            <div className="w-full max-w-lg bg-slate-900 border border-slate-850/80 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-400/30 rounded-xl flex items-center justify-center shrink-0">
                  <LogIn className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-black tracking-tight text-white uppercase">MEMBER SECURE LOGIN</h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-0.5">Access your registered points from any node or mobile browser</p>
                </div>
              </div>
              <AppLoginForm 
                profilesDb={profilesDb}
                onLoginSuccess={(profile) => {
                  setActiveUserEmail(profile.email);
                  localStorage.setItem('tempest_active_user_email', profile.email);
                  updatePoints(profile.points);
                  setRecentActions(prev => [{ id: `login-${Date.now()}`, text: `Welcome back, ${profile.nickname}!`, time: 'Just now', plus: true }, ...prev.slice(0, 5)]);
                  setCurrentPage('gallery');
                }}
                activeCodes={activeCodes}
              />
            </div>
          </section>
        )}

      </main>

      {/* Footer Status Bar matching exact theme specification */}
      <footer className="h-8 border-t border-slate-800 bg-slate-950 px-4 md:px-6 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest shrink-0 select-none">
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Global Server: Optimized</span>
          <span>● Status: Online</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-indigo-400">Stable Architecture Active</span>
          <span>&copy; 2026 Anime Inn Tempest</span>
        </div>
      </footer>

      {/* Modal overlays retained */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        points={points}
        redeemedCodes={redeemedCodes}
        onRedeem={handleRedeemCode}
        activeUserEmail={activeUserEmail}
        activeProfile={activeProfile}
        onPurchaseVerifiedBadge={handlePurchaseVerifiedBadge}
      />

      <DoubleRedeemerPortal
        isOpen={isRedeemerOpen}
        onClose={() => setIsRedeemerOpen(false)}
        onSuccessClaim={handleSuccessDoubleClaim}
      />

      <WallpaperDetailModal
        wallpaper={selectedWallpaper}
        onClose={() => setSelectedWallpaper(null)}
        onPin={handlePin}
        isPinned={!!selectedWallpaper && pinnedIds.includes(selectedWallpaper.id)}
        isDailyLimitReached={dailyLikesCount >= 100}
      />

      <LikedHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        likedHistory={likedHistory}
        onUnlike={(id, e) => handlePin(id, e)}
        onView={handleViewFromHistory}
        onClearAll={handleClearHistory}
      />

      {/* Floating Action Bubbles System */}
      <div className="fixed bottom-12 right-6 z-50 flex flex-col sm:flex-row items-center gap-3 pointer-events-none">
        
        {/* Floating Wallet Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-auto flex items-center gap-2.5 bg-slate-900/95 hover:bg-slate-850 border border-indigo-500/40 px-4 py-2.5 rounded-full shadow-lg shadow-indigo-600/20 backdrop-blur-md cursor-pointer select-none border-b-2 active:scale-95 transition-all text-white group"
          onClick={() => setIsShopOpen(true)}
          title="Click to view JCode & GCash Rewards Shop"
        >
          <div className="w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-400/40 relative">
            <Wallet className="w-3.5 h-3.5 text-indigo-400 group-hover:animate-bounce" />
            <div className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-widest text-slate-400 leading-none">Your Wallet</span>
            <span className="text-xs md:text-sm font-black font-mono tracking-tight text-white mt-0.5 group-hover:text-indigo-300 transition-colors">
              {points.toLocaleString()} <span className="text-[10px] text-indigo-400 font-bold">pts</span>
            </span>
          </div>
        </motion.div>

        {/* Floating 2X Redeemer App Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="pointer-events-auto flex items-center gap-2.5 bg-gradient-to-r from-rose-950/90 to-pink-950/90 hover:from-rose-900 hover:to-pink-900 border border-rose-500/40 px-4 py-2.5 rounded-full shadow-lg shadow-rose-600/20 backdrop-blur-md cursor-pointer select-none border-b-2 active:scale-95 transition-all text-white group"
          onClick={() => { playClickSound(); setIsRedeemerOpen(true); }}
          title="Open PayPay & GCash 2X Double Claimer App"
        >
          <div className="w-6 h-6 rounded-full bg-rose-600/20 flex items-center justify-center border border-rose-450/40 relative">
            <Smartphone className="w-3.5 h-3.5 text-rose-400 group-hover:animate-bounce" />
            <div className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-pink-400 animate-ping" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-widest text-rose-300 leading-none">CLAIM 2X YIELD</span>
            <span className="text-xs font-black font-mono tracking-tight text-white mt-0.5 group-hover:text-pink-300 transition-colors uppercase">
              REDEEMER APP
            </span>
          </div>
        </motion.div>

        {/* Return to Top Bubble */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="pointer-events-auto p-3 rounded-full bg-indigo-600 hover:bg-indigo-550 text-white font-black shadow-lg shadow-indigo-600/30 cursor-pointer select-none active:scale-90 hover:scale-105 transition-all outline-none border border-indigo-400/30 flex items-center justify-center"
              onClick={handleScrollToTop}
              title="Return to top smoothly"
            >
              <ArrowUp className="w-4 h-4 text-white animate-pulse" />
            </motion.button>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}

