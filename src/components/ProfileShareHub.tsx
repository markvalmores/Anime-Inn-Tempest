import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Share2,
  Twitter,
  Facebook,
  MessageSquare,
  Copy,
  Check,
  Lock,
  Mail,
  Camera,
  User,
  CheckCircle,
  ExternalLink,
  Plus,
  Trash2,
  Download,
  UserPlus,
  LogIn,
  LogOut,
  Sparkles,
  RefreshCw,
  Award,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import { playClickSound } from '../lib/audio';
import { INITIAL_WALLPAPERS } from '../data/wallpapers';

// Preset Covers
const PRESET_COVERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80", // Cyberpunk Grid
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80", // Retro Synthwave
  "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80", // Sky Scenery
  "https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?auto=format&fit=crop&w=800&q=80"  // Cherry Blossom
];

// Preset Avatars
const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=150&q=80", // Anime Girl
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80", // Chibi Boy
  "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?auto=format&fit=crop&w=150&q=80", // Cool Mask
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=150&q=80"  // Synth Neon
];

export interface UserProfile {
  email: string;
  userId: string; // Format e.g., "12132"
  nickname: string;
  avatar: string;
  coverPhoto: string;
  points: number;
}

interface ProfileShareHubProps {
  currentPoints: number;
  onUpdatePoints: (newPoints: number) => void;
  onAddRecentAction: (text: string, plus: boolean) => void;
}

export default function ProfileShareHub({
  currentPoints,
  onUpdatePoints,
  onAddRecentAction
}: ProfileShareHubProps) {
  // Global profile register database
  const [profilesDb, setProfilesDb] = useState<Record<string, UserProfile>>(() => {
    const saved = localStorage.getItem('tempest_users_db');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) { return {}; }
    }
    return {};
  });

  // Logged-in email
  const [activeUserEmail, setActiveUserEmail] = useState<string>(() => {
    return localStorage.getItem('tempest_active_user_email') || '';
  });

  // Current logged in profile state
  const activeProfile = activeUserEmail ? profilesDb[activeUserEmail.toLowerCase().trim()] : null;

  // Login Codes Database (saved so "depends on me/Mark" holds custom-made values)
  const [activeCodes, setActiveCodes] = useState<string[]>(() => {
    const saved = localStorage.getItem('tempest_login_codes');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) { return []; }
    }
    // Prepopulated active codes
    return ['MARKDAVID777', 'LOYALTY2026', 'TEMPESTFREE', 'OFFLINE4EVER', 'ADMIN123', 'GIVE777'];
  });

  // UI inputs
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerNickname, setRegisterNickname] = useState('');
  const [registerCode, setRegisterCode] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [coverIndex, setCoverIndex] = useState(0);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginCodeBox, setLoginCodeBox] = useState('');

  // Editing profile toggles
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editAvatarIdx, setEditAvatarIdx] = useState(0);
  const [editCoverIdx, setEditCoverIdx] = useState(0);

  // Admin section: Mark David custom codes manage
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Sharing feedbacks
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [showSharePreview, setShowSharePreview] = useState(false);
  const [shareImgUrl, setShareImgUrl] = useState('');

  // Mode select
  const [formMode, setFormMode] = useState<'register' | 'login' | 'none'>('none');
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  // Wallpaper selector states
  const [selectableWallpapers, setSelectableWallpapers] = useState<any[]>([]);
  const [selectedWallId, setSelectedWallId] = useState<string>('');
  const [captureLoading, setCaptureLoading] = useState(false);
  const [shareSuccessAlert, setShareSuccessAlert] = useState('');
  const [shareErrorAlert, setShareErrorAlert] = useState('');

  // Hydrate selectable wallpapers list
  useEffect(() => {
    const list: any[] = [];
    
    // 1. Liked history
    try {
      const savedHist = localStorage.getItem('tempest_liked_history');
      if (savedHist) {
        const parsed = JSON.parse(savedHist);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: any) => {
            if (item && item.imageUrl && !list.find(x => x.imageUrl === item.imageUrl)) {
              list.push({
                id: item.id || `hist-${Date.now()}-${Math.random()}`,
                title: item.title || 'Loved Art',
                imageUrl: item.imageUrl,
                author: item.author || 'Member',
                category: item.category || 'Liked'
              });
            }
          });
        }
      }
    } catch (_) {}

    // 2. Cached Wallpapers
    try {
      const savedCached = localStorage.getItem('cached_wallpapers');
      if (savedCached) {
        const parsed = JSON.parse(savedCached);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: any) => {
            if (item && item.imageUrl && !list.find(x => x.imageUrl === item.imageUrl)) {
              list.push({
                id: item.id || `cached-${Date.now()}-${Math.random()}`,
                title: item.title || 'Dynamic Illustration',
                imageUrl: item.imageUrl,
                author: item.author || 'Creator',
                category: item.category || 'Live Feed'
              });
            }
          });
        }
      }
    } catch (_) {}

    // 3. INITIAL STOCK PRESETS
    INITIAL_WALLPAPERS.forEach((item) => {
      if (item && item.imageUrl && !list.find(x => x.imageUrl === item.imageUrl)) {
        list.push({
          id: item.id,
          title: item.title,
          imageUrl: item.imageUrl,
          author: item.author || 'Pixiv Studio',
          category: item.category
        });
      }
    });

    setSelectableWallpapers(list);
    if (list.length > 0) {
      setSelectedWallId(list[0].id);
    }
  }, []);

  // Sync state helpers
  useEffect(() => {
    localStorage.setItem('tempest_users_db', JSON.stringify(profilesDb));
  }, [profilesDb]);

  useEffect(() => {
    localStorage.setItem('tempest_login_codes', JSON.stringify(activeCodes));
  }, [activeCodes]);

  // Synchronize app principal points state with logged-in user points securely
  useEffect(() => {
    if (activeProfile && activeProfile.points !== currentPoints) {
      // Keep points in sync if they performed check-in or liked anime inside the App
      setProfilesDb(prev => {
        const next = { ...prev };
        const key = activeUserEmail.toLowerCase().trim();
        if (next[key]) {
          next[key] = {
            ...next[key],
            points: currentPoints
          };
        }
        return next;
      });
    }
  }, [currentPoints, activeUserEmail]);

  // Handle register submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');
    playClickSound();

    const email = registerEmail.trim().toLowerCase();
    if (!email) {
      setErrorText('Please enter your email to secure points.');
      return;
    }

    if (profilesDb[email]) {
      setErrorText('This email is already registered. Please go to Login instead!');
      return;
    }

    // Verify code
    const enteredCode = registerCode.trim().toUpperCase();
    if (!activeCodes.includes(enteredCode)) {
      setErrorText('Invalid code. Click "PM Mark David" below to request a login key!');
      return;
    }

    // Generate random 5 digit User ID (like 12132 format)
    const randomId = Math.floor(10000 + Math.random() * 90000).toString();

    // Create profile - User gets to keep current local points!
    const newProfile: UserProfile = {
      email,
      userId: randomId,
      nickname: registerNickname.trim() || `User_${randomId}`,
      avatar: PRESET_AVATARS[avatarIndex],
      coverPhoto: PRESET_COVERS[coverIndex],
      points: currentPoints // Keep points!
    };

    setProfilesDb(prev => ({
      ...prev,
      [email]: newProfile
    }));

    setActiveUserEmail(email);
    localStorage.setItem('tempest_active_user_email', email);
    setFormMode('none');
    setSuccessText('Successfully secure-registered! Your points are locked to your email!');
    onAddRecentAction(`Created Secure Profile [UID-${randomId}]`, true);

    // Reset fields
    setRegisterEmail('');
    setRegisterNickname('');
    setRegisterCode('');
  };

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');
    playClickSound();

    const email = loginEmail.trim().toLowerCase();
    if (!email) {
      setErrorText('Enter your email address.');
      return;
    }

    // Check if profile exists
    const profile = profilesDb[email];
    if (!profile) {
      setErrorText('No profile associated with this email. Create one by clicking Register!');
      return;
    }

    // Validate code
    const enteredCode = loginCodeBox.trim().toUpperCase();
    if (!activeCodes.includes(enteredCode)) {
      setErrorText('Incorrect verification code. PM Mark David on Facebook to secure yours!');
      return;
    }

    // Sync points from profile database to the App
    setActiveUserEmail(email);
    localStorage.setItem('tempest_active_user_email', email);
    onUpdatePoints(profile.points);
    setFormMode('none');
    setSuccessText(`Welcome back, ${profile.nickname}! Syncing secured points...`);
    onAddRecentAction(`Secured Profile login: ${profile.nickname}`, true);

    // Reset fields
    setLoginEmail('');
    setLoginCodeBox('');
  };

  // Log Out
  const handleLogOut = () => {
    playClickSound();
    setActiveUserEmail('');
    localStorage.removeItem('tempest_active_user_email');
    onAddRecentAction('Switched back to Guest Local cache', false);
    setSuccessText('Returned to local guest mode.');
  };

  // Admin Code Creation (Mark David depends on codes)
  const handleAddCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = adminCodeInput.trim().toUpperCase();
    if (!code) return;
    playClickSound();

    if (activeCodes.includes(code)) {
      setErrorText('This code already exists!');
      return;
    }

    setActiveCodes(prev => [...prev, code]);
    setAdminCodeInput('');
    setSuccessText(`Code "${code}" created successfully!`);
    onAddRecentAction(`Created Login Key: ${code}`, true);
  };

  const handleDeleteCode = (codeToDelete: string) => {
    playClickSound();
    setActiveCodes(prev => prev.filter(c => c !== codeToDelete));
    onAddRecentAction(`Revoked Login Key: ${codeToDelete}`, false);
  };

  // Social Sharing buttons triggers
  const shareText = "Check out Anime Inn Tempest - The Only Honest Japanese Anime Wallpaper app where you earn rewards!";
  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    playClickSound();
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      onAddRecentAction('Copied app referral link', true);
    });
  };

  const handleTwitterShare = () => {
    playClickSound();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'referrer');
  };

  const handleFacebookShare = () => {
    playClickSound();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'referrer');
  };

  const handleMessengerShare = () => {
    playClickSound();
    // Desktop URL redirect & mobile protocols
    const url = `https://www.facebook.com/dialog/send?app_id=184484190795&link=${encodeURIComponent(shareUrl)}&redirect_uri=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'referrer');
  };

  // HTML5 canvas dynamic share picture generation
  const handleGenerateSharePhoto = () => {
    playClickSound();
    const canvas = document.createElement('canvas');
    canvas.width = 750;
    canvas.height = 430;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Outer Background Glassy Gradient
    const bGrad = ctx.createLinearGradient(0, 0, 750, 430);
    bGrad.addColorStop(0, '#0f172a'); // slate-900
    bGrad.addColorStop(0.5, '#020617'); // slate-950
    bGrad.addColorStop(1, '#1e1b4b'); // deep indigo-950
    ctx.fillStyle = bGrad;
    ctx.fillRect(0, 0, 750, 430);

    // Decorative Tech Grid Layout
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 750; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 430);
      ctx.stroke();
    }
    for (let j = 0; j < 430; j += 30) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(750, j);
      ctx.stroke();
    }

    // Glowing Frame
    ctx.shadowColor = '#6366f1';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3.5;
    ctx.strokeRect(20, 20, 710, 390);
    ctx.shadowBlur = 0; // reset shadow

    // App header
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px system-ui, -apple-system, sans-serif';
    ctx.fillText('ANIME INN TEMPEST', 55, 60);

    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 11px system-ui, monospace';
    ctx.fillText('THE ONLY HONEST GIVING APP • STABLE SYSTEM v2.5', 55, 82);

    // Profile Details Card Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.fillRect(50, 110, 650, 220);
    ctx.strokeRect(50, 110, 650, 220);

    // Draw user info
    const nickname = activeProfile ? activeProfile.nickname : 'Guest Voyager';
    const userId = activeProfile ? `UID-${activeProfile.userId}` : 'UID-TEMP-05';
    const uPoints = activeProfile ? activeProfile.points : currentPoints;
    const isRegText = activeProfile ? '🔒 SECURED & REGISTERED' : '🔑 GUEST CACHE';

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 22px system-ui, sans-serif';
    ctx.fillText(nickname, 180, 160);

    ctx.fillStyle = '#10b981'; // emerald-500
    ctx.font = '900 11px system-ui, sans-serif';
    ctx.fillText(isRegText, 180, 182);

    // User ID & points
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 13px system-ui, monospace';
    ctx.fillText(`MEMBER ID: ${userId}`, 180, 218);

    ctx.fillStyle = '#f43f5e'; // rose-500
    ctx.font = '900 28px system-ui, sans-serif';
    ctx.fillText(`${uPoints.toLocaleString()}`, 180, 275);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '800 13px system-ui, sans-serif';
    ctx.fillText('ACTIVE WALLET POINTS', 180, 298);

    // Custom circular drawing to bypass CORS image security and draw a lovely customizable vector avatar
    ctx.fillStyle = '#4f46e5';
    ctx.beginPath();
    ctx.arc(110, 210, 45, 0, Math.PI * 2);
    ctx.fill();

    // inner avatar design
    ctx.fillStyle = '#a5b4fc';
    ctx.beginPath();
    ctx.arc(110, 200, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(110, 245, 30, Math.PI, Math.PI * 2);
    ctx.fill();

    // Drawing a little star inside avatar
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('★', 102, 205);

    // Footer of Share card
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px system-ui, sans-serif';
    ctx.fillText('Scan or Visit: ais-pre-iylwvxyzmr3qpjg7w6b5vf-9199574104.asia-southeast1.run.app', 50, 385);
    ctx.fillText('Scan QR to join the family & check-in daily for fast rewards', 50, 400);

    // Display generated image data URL
    try {
      const dataUrl = canvas.toDataURL('image/png');
      setShareImgUrl(dataUrl);
      setShowSharePreview(true);
    } catch (err) {
      console.warn('Canvas share fail:', err);
    }
  };

  const triggerDownload = () => {
    playClickSound();
    const link = document.createElement('a');
    link.download = `tempest_member_${activeProfile ? activeProfile.userId : 'guest'}.png`;
    link.href = shareImgUrl;
    link.click();
    setCopiedImage(true);
    setTimeout(() => {
      setCopiedImage(false);
      setShowSharePreview(false);
    }, 2000);
    onAddRecentAction('Downloaded member collector card', true);
  };

  const openEditMode = () => {
    playClickSound();
    if (activeProfile) {
      setEditNickname(activeProfile.nickname);
      setEditAvatarIdx(PRESET_AVATARS.indexOf(activeProfile.avatar));
      setEditCoverIdx(PRESET_COVERS.indexOf(activeProfile.coverPhoto));
      setIsEditing(true);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile || !activeUserEmail) return;
    playClickSound();

    const updatedProfile: UserProfile = {
      ...activeProfile,
      nickname: editNickname.trim() || activeProfile.nickname,
      avatar: PRESET_AVATARS[editAvatarIdx],
      coverPhoto: PRESET_COVERS[editCoverIdx]
    };

    setProfilesDb(prev => ({
      ...prev,
      [activeUserEmail.toLowerCase().trim()]: updatedProfile
    }));

    setIsEditing(false);
    setSuccessText('Profile successfully customized!');
    onAddRecentAction('Customized profile layout settings', true);
  };

  const selectWallpaperById = (id: string) => {
    playClickSound();
    setSelectedWallId(id);
    setShareSuccessAlert('');
    setShareErrorAlert('');
  };

  const handleShareWallpaperFile = async () => {
    playClickSound();
    const wall = selectableWallpapers.find(w => w.id === selectedWallId);
    if (!wall) {
      setShareErrorAlert('Please select a wallpaper first.');
      return;
    }

    setCaptureLoading(true);
    setShareSuccessAlert('');
    setShareErrorAlert('');

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setCaptureLoading(false);
      setShareErrorAlert('Could not construct rendering context.');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const triggerShareWithImage = (isFallback: boolean) => {
      // 1. Draw solid dark premium gradient backdrop
      const grad = ctx.createLinearGradient(0, 0, 600, 760);
      grad.addColorStop(0, '#030712'); // gray-950
      grad.addColorStop(0.5, '#0f172a'); // slate-900
      grad.addColorStop(1, '#020617'); // slate-950
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 760);

      // Decorative Cyber Grid lines
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 600; i += 30) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 760); ctx.stroke();
      }
      for (let j = 0; j <= 760; j += 30) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(600, j); ctx.stroke();
      }

      // 2. Draw artwork image with stylish rounded border
      if (!isFallback) {
        try {
          const imgWidth = img.width;
          const imgHeight = img.height;
          const targetWidth = 560;
          const targetHeight = 440;
          const targetX = 20;
          const targetY = 20;

          const ratio = Math.max(targetWidth / imgWidth, targetHeight / imgHeight);
          const drawWidth = imgWidth * ratio;
          const drawHeight = imgHeight * ratio;
          const cropX = (drawWidth - targetWidth) / 2;
          const cropY = (drawHeight - targetHeight) / 2;

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(targetX, targetY, targetWidth, targetHeight, 16);
          ctx.clip();
          ctx.drawImage(img, -cropX + targetX, -cropY + targetY, drawWidth, drawHeight);
          ctx.restore();
        } catch (err) {
          isFallback = true;
        }
      }

      if (isFallback) {
        // Draw elegant synthetic procedural card if image has CORS issues
        ctx.fillStyle = '#1e1b4b';
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(20, 20, 560, 440, 16);
        ctx.clip();
        ctx.fillRect(20, 20, 560, 440);

        // Synthwave retro grids
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.2)'; // rose-500
        ctx.lineWidth = 1.5;
        for (let i = 20; i <= 580; i += 20) {
          ctx.beginPath(); ctx.moveTo(i, 20); ctx.lineTo(i, 460); ctx.stroke();
        }
        for (let j = 20; j <= 460; j += 20) {
          ctx.beginPath(); ctx.moveTo(20, j); ctx.lineTo(580, j); ctx.stroke();
        }

        // Concentric neon circles
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(300, 240, 80, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)';
        ctx.beginPath(); ctx.arc(300, 240, 120, 0, Math.PI * 2); ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 24px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ANIME INN TEMPEST', 300, 230);

        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('⭐ PREMIUM ARTWORK COLLECTION ⭐', 300, 260);
        ctx.restore();
        ctx.textAlign = 'left';
      }

      // Glowing outer frame
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, 580, 740);

      // 3. Draw glassy footer metadata card
      ctx.fillStyle = 'rgba(11, 15, 30, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(20, 480, 560, 260, 16);
      ctx.fill();
      ctx.stroke();

      // Wallpaper details
      ctx.fillStyle = '#818cf8';
      ctx.font = '900 11px monospace';
      ctx.fillText(wall.category.toUpperCase(), 45, 522);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 22px system-ui, sans-serif';
      ctx.fillText(wall.title, 45, 552);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(`Artist: ${wall.author} • Tempest Premium Series`, 45, 574);

      // User details row
      const nickname = activeProfile ? activeProfile.nickname : 'Guest Voyager';
      const userId = activeProfile ? `UID-${activeProfile.userId}` : 'GUEST-TICKET';
      const verifyBadge = activeProfile ? '🔒 REGISTERED ACCOUNT SECURED' : '🔑 TEMPORARY VISITOR PASS';

      ctx.fillStyle = 'rgba(99, 102, 241, 0.1)';
      ctx.beginPath();
      ctx.roundRect(42, 600, 516, 56, 12);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(`Sender Nickname: ${nickname} [${userId}]`, 58, 622);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(verifyBadge, 58, 642);

      ctx.fillStyle = '#f43f5e';
      ctx.font = '900 13px system-ui, sans-serif';
      ctx.fillText(`+${currentPoints.toLocaleString()} PTS ACTIVE WALLET`, 340, 634);

      // Branding details
      ctx.fillStyle = '#4f46e5';
      ctx.beginPath();
      ctx.arc(48, 685, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.font = '900 12px system-ui, sans-serif';
      ctx.fillText('ANIME INN TEMPEST - REWARDS PORTAL v2.5', 62, 689);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('Scan QR or browse: http://ais-pre-iylwvxyzmr3qpjg7w6b5vf-9199574104.asia-southeast1.run.app', 45, 718);

      // Convert to blob and native-share on mobile or launch preview download
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setCaptureLoading(false);
          setShareErrorAlert('Failed to write image data.');
          return;
        }

        try {
          const formattedTitle = wall.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
          const shareFile = new File([blob], `tempest_wallpaper_${formattedTitle}.png`, { type: 'image/png' });

          if (navigator.canShare && navigator.canShare({ files: [shareFile] })) {
            await navigator.share({
              files: [shareFile],
              title: `Tempest Wallpaper Share: ${wall.title}`,
              text: `Download outstanding anime image "${wall.title}" by ${wall.author} and join Anime Inn Tempest to secure double GCash rewards!`
            });
            onAddRecentAction(`Completed file share of target wallpaper: ${wall.title}`, true);
            setShareSuccessAlert('Excellent! Native system sharing window successfully invoked.');
          } else {
            // Fallback mobile url text share
            await navigator.share({
              title: `Tempest Wallpaper: ${wall.title}`,
              text: `Download incredible "${wall.title}" by ${wall.author}!`,
              url: window.location.href
            });
            setShareSuccessAlert('Shared wallpaper link and summary text successfully.');
          }
        } catch (shareErr: any) {
          console.warn('Native mobile share cancelled or blocked:', shareErr);
          
          // Launch the download modal on fallback
          const dataUrl = canvas.toDataURL('image/png');
          setShareImgUrl(dataUrl);
          setShowSharePreview(true);
          setShareSuccessAlert('Compiled successfully! Collector card ready to save.');
        } finally {
          setCaptureLoading(false);
        }
      }, 'image/png');
    };

    img.onload = () => {
      triggerShareWithImage(false);
    };

    img.onerror = () => {
      triggerShareWithImage(true);
    };

    // Add nocache query to avoid CORS cache matches
    img.src = wall.imageUrl + (wall.imageUrl.includes('?') ? '&' : '?') + 'cors=' + Date.now();
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden select-none" id="profile-share-hub-widget">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
        <div>
          <h2 className="text-sm md:text-base font-black tracking-widest text-indigo-400 uppercase font-mono flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400 animate-pulse" />
            TEMPEST PROFILE HUB
          </h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
            Register your email to secure your points & share custom member cards to any social app
          </p>
        </div>

        {/* Buttons to either Register or Login */}
        {!activeProfile && (
          <div className="flex items-center gap-1.5 self-start">
            <button
              onClick={() => { playClickSound(); setFormMode(formMode === 'register' ? 'none' : 'register'); setErrorText(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 uppercase tracking-wider ${
                formMode === 'register' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-350 hover:bg-slate-750'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
            <button
              onClick={() => { playClickSound(); setFormMode(formMode === 'login' ? 'none' : 'login'); setErrorText(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 uppercase tracking-wider ${
                formMode === 'login' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-350 hover:bg-slate-750'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          </div>
        )}
      </div>

      {/* User Alerts notification */}
      {errorText && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
          {errorText}
        </div>
      )}
      {successText && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          {successText}
        </div>
      )}

      {/* RENDER FORMS */}
      <AnimatePresence mode="wait">
        {formMode === 'register' && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleRegister}
            className="mb-5 p-4 bg-slate-900 border border-indigo-500/15 rounded-xl space-y-4"
          >
            <div className="border-b border-slate-800 pb-2">
              <span className="text-xs font-black text-slate-100 uppercase tracking-widest block font-mono">Create Secure points Profile</span>
              <span className="text-[10px] text-slate-400">All your {currentPoints} pts will be linked to your register database email!</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Email (Required)</label>
                <div className="relative">
                  <Mail className="absolute top-2.5 left-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-850 focus:border-indigo-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Nickname (Optional)</label>
                <div className="relative">
                  <User className="absolute top-2.5 left-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Enter Profile Name"
                    value={registerNickname}
                    onChange={(e) => setRegisterNickname(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-850 focus:border-indigo-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Verification key box */}
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Access Authentication Login Key (Required)</label>
              <div className="relative">
                <Lock className="absolute top-2.5 left-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ask Mark David for a login code key"
                  value={registerCode}
                  onChange={(e) => setRegisterCode(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-850 focus:border-indigo-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 uppercase font-mono outline-none transition-all"
                />
              </div>
            </div>

            {/* Customise look */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-2">Select Chibi Character Avatar</label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { playClickSound(); setAvatarIndex(idx); }}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        avatarIndex === idx ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/10' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-2">Select Profile Card Wallpaper Ambient Theme</label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COVERS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { playClickSound(); setCoverIndex(idx); }}
                      className={`relative w-16 h-10 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        coverIndex === idx ? 'border-indigo-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PM Button & Submit Layout */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <a
                href="https://www.facebook.com/usagyuunvtuber5"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-950 border border-indigo-500/20 text-indigo-300 hover:text-white transition-colors text-xs font-bold text-center flex items-center justify-center gap-1.5"
                title="Message on FB to request your secure activation code"
              >
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>💬 PM Mark David for Login Code</span>
              </a>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => { playClickSound(); setFormMode('none'); }}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 text-xs font-semibold hover:bg-slate-950 cursor-pointer w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-black text-xs uppercase tracking-wider cursor-pointer w-full sm:w-auto shadow-md"
                >
                  Confirm Registration
                </button>
              </div>
            </div>
          </motion.form>
        )}

        {formMode === 'login' && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleLogin}
            className="mb-5 p-4 bg-slate-900 border border-indigo-500/15 rounded-xl space-y-4"
          >
            <div className="border-b border-slate-800 pb-2">
              <span className="text-xs font-black text-slate-100 uppercase tracking-widest block font-mono">Profile Login Hub</span>
              <span className="text-[10px] text-slate-400 font-medium">Verify your registered email and active login key sequence to pull points!</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Registered Email Address</label>
                <div className="relative">
                  <Mail className="absolute top-2.5 left-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="your-registered@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-850 focus:border-indigo-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Enter Activation Code Key</label>
                <div className="relative">
                  <Lock className="absolute top-2.5 left-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Enter authentication login key"
                    value={loginCodeBox}
                    onChange={(e) => setLoginCodeBox(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-850 focus:border-indigo-500/50 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 uppercase font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <a
                href="https://www.facebook.com/usagyuunvtuber5"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-950 border border-indigo-500/20 text-indigo-300 hover:text-white transition-colors text-xs font-bold text-center flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>🔑 PM Mark David for Code</span>
              </a>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => { playClickSound(); setFormMode('none'); }}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 text-xs font-semibold hover:bg-slate-950 cursor-pointer w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-black text-xs uppercase tracking-wider cursor-pointer w-full sm:w-auto shadow-md"
                >
                  Sign In & Sync
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>


      {/* USER NOT REGISTERED VIEW (GUEST ACCOUNT SUMMARY CARD) */}
      {!activeProfile ? (
        <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] bg-indigo-600/10 text-indigo-400 border border-indigo-500/15 px-2 py-0.5 rounded font-black font-mono tracking-widest uppercase block w-max">GUEST MEMBER CHIPS</span>
              <p className="text-white text-xs font-black mt-1">Temporary Points Cache Enabled</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Register your email to secure current <span className="text-white font-bold">{currentPoints} pts</span> from browser cache wipes!</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <button
              onClick={() => { playClickSound(); setFormMode('register'); }}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              Secure Points Now
            </button>
          </div>
        </div>
      ) : (
        /* REGISTERED USER PROFILE VIEW */
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* Cover photo */}
            <div className="w-full h-28 relative">
              <img src={activeProfile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/40 to-[#020617]" />
              
              {/* Profile Config Modifier Icon */}
              <button
                onClick={openEditMode}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/60 backdrop-blur-md hover:bg-slate-900 border border-white/10 hover:border-white/30 text-white transition-all cursor-pointer shadow-md active:scale-95 text-xs font-semibold flex items-center gap-1.5"
                title="Edit visual preferences"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>
            </div>

            {/* Profile Avatar details overlap */}
            <div className="px-5 pb-5 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3.5 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-slate-950 bg-slate-900 relative shadow-2xl shrink-0 group">
                  <img src={activeProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer" onClick={openEditMode}>
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="mb-1 space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-col sm:flex-row">
                    <span className="text-base font-black text-white leading-none tracking-tight">{activeProfile.nickname}</span>
                    <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5" />
                      <span>SECURED</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold font-mono tracking-wide">{activeProfile.email}</p>
                  <div className="text-[10px] text-indigo-300 font-mono flex items-center gap-1 justify-center sm:justify-start">
                    <span>MEMBER ID:</span>
                    <span className="bg-indigo-950/80 border border-indigo-850 px-1.5 rounded text-white font-extrabold">{activeProfile.userId}</span>
                  </div>
                </div>
              </div>

              {/* Status Points Log out */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 border-slate-800/60 pt-3 sm:pt-0 justify-between">
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-none">Vault points</p>
                  <p className="text-lg font-black text-white font-mono mt-1 tracking-tight">
                    {pointsFormatter(activeProfile.points)} <span className="text-indigo-400 text-xs font-bold">PTS</span>
                  </p>
                </div>
                
                <button
                  onClick={handleLogOut}
                  className="px-2.5 py-1 text-[10px] rounded-lg border border-slate-800 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-300 transition-all cursor-pointer hover:bg-slate-950 inline-flex items-center gap-1 select-none font-bold active:scale-95 uppercase tracking-wide"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* EDIT PREFERENCES FORM OVERLAY */}
          <AnimatePresence>
            {isEditing && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSaveEdit}
                className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4"
              >
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-200 uppercase tracking-widest font-mono">Customize Visual Presentation</span>
                  <button type="button" onClick={() => { playClickSound(); setIsEditing(false); }} className="text-slate-400 hover:text-white font-black text-xs">Close</button>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Edit Display Nickname</label>
                  <input
                    type="text"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-white placeholder-slate-700 outline-none"
                    placeholder="Enter Profile Name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-2">Change Avatar Illustration</label>
                    <div className="flex gap-2">
                      {PRESET_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => { playClickSound(); setEditAvatarIdx(idx); }}
                          className={`relative w-10 h-10 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                            editAvatarIdx === idx ? 'border-indigo-500 scale-105' : 'border-transparent opacity-60'
                          }`}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-2">Change Card Wallpaper Backdrop</label>
                    <div className="flex gap-2">
                      {PRESET_COVERS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => { playClickSound(); setEditCoverIdx(idx); }}
                          className={`relative w-14 h-9 rounded overflow-hidden border-2 cursor-pointer transition-all ${
                            editCoverIdx === idx ? 'border-indigo-500 scale-105' : 'border-transparent opacity-60'
                          }`}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1.5">
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setIsEditing(false); }}
                    className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 text-xs font-semibold hover:bg-slate-950 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-550 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    Save customization
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      )}


      {/* MOBILE WALLPAPER TRANSMITTER DECK */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest block font-mono mb-2">
          🎨 PREMIUM WALLPAPER TRANSMITTER (MOBILE DIRECT FILE SHARE)
        </span>
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-4 text-left">
          Select any downloaded, live-fetched, or favorite anime wallpaper from cumulative local caches below. Our canvas engine composites it with active member secure metadata tags, allowing you to instantly share the high-resolution PNG image file directly with mobile social applications!
        </p>

        {/* Carousel selector */}
        {selectableWallpapers.length === 0 ? (
          <div className="p-4 bg-slate-950/40 rounded-xl text-center text-xs text-slate-500 font-mono">
            No wallpapers loaded. Check in later!
          </div>
        ) : (
          <div className="relative mb-4">
            <div className="flex gap-2.5 pb-2.5 overflow-x-auto scroller-flat select-none">
              {selectableWallpapers.map((wall) => {
                const isSelected = selectedWallId === wall.id;
                return (
                  <button
                    key={wall.id}
                    onClick={() => selectWallpaperById(wall.id)}
                    className={`flex-none w-14 h-22 rounded-xl overflow-hidden border-2 transition-all relative group cursor-pointer ${
                      isSelected ? 'border-indigo-400 scale-105 shadow-md shadow-indigo-500/30' : 'border-slate-850 opacity-50 hover:opacity-100 hover:border-slate-750'
                    }`}
                  >
                    <img src={wall.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/90 p-0.5 text-center text-[7px] truncate font-sans text-white uppercase font-black tracking-tighter">
                      {wall.title.slice(0, 10)}
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-indigo-400 rounded-full border border-slate-950" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Wallpaper details and Direct command button */}
        {selectableWallpapers.find(w => w.id === selectedWallId) && (() => {
          const wall = selectableWallpapers.find(w => w.id === selectedWallId);
          return (
            <div className="bg-slate-950/70 rounded-2xl border border-slate-850 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto text-left">
                <div className="w-10 h-14 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shrink-0">
                  <img src={wall.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-black tracking-wider text-indigo-400 uppercase font-mono">{wall.category}</span>
                  <h4 className="text-xs font-bold text-slate-100 truncate mt-0.5">{wall.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate leading-none">by <strong className="text-slate-350">{wall.author}</strong></p>
                </div>
              </div>

              {/* Action and feedback */}
              <div className="flex flex-col gap-1.5 w-full sm:w-auto shrink-0 select-none">
                <button
                  onClick={handleShareWallpaperFile}
                  disabled={captureLoading}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-650 to-indigo-500 hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  id="direct-share-wallpaper"
                >
                  {captureLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Composing File...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-pink-400" />
                      <span>📲 Share Wallpaper File</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })()}

        {/* Toast alerts inside widget page */}
        {shareSuccessAlert && (
          <div className="mt-3 p-2.5 bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 rounded-xl text-[10px] font-mono uppercase tracking-wide text-left animate-pulse">
            ✔️ {shareSuccessAlert}
          </div>
        )}
        {shareErrorAlert && (
          <div className="mt-3 p-2.5 bg-rose-500/10 border border-rose-500/15 text-rose-400 rounded-xl text-[10px] font-mono uppercase tracking-wide text-left">
            ⚠️ {shareErrorAlert}
          </div>
        )}
      </div>


      {/* SOCIAL MEDIA SHARING HUB BAR */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block font-mono mb-3">🚀 AMPLIFY ON SOCIAL CHANNELS & SAVE IMAGES</span>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono">
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950/60 hover:text-white transition-colors cursor-pointer group active:scale-95 text-slate-350"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold">Copy Link</span>
              </>
            )}
          </button>

          {/* Twitter / X */}
          <button
            onClick={handleTwitterShare}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950/60 hover:text-white transition-colors cursor-pointer group active:scale-95 text-slate-350"
          >
            <Twitter className="w-3.5 h-3.5 text-[#1DA1F2] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold">Twitter / X</span>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebookShare}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950/60 hover:text-white transition-colors cursor-pointer group active:scale-95 text-slate-350"
          >
            <Facebook className="w-3.5 h-3.5 text-[#1877F2] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold">Facebook</span>
          </button>

          {/* Messenger */}
          <button
            onClick={handleMessengerShare}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950/60 hover:text-white transition-colors cursor-pointer group active:scale-95 text-slate-350"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#0084FF] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold">Messenger</span>
          </button>

          {/* Share Photo Button */}
          <button
            onClick={handleGenerateSharePhoto}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-xl bg-gradient-to-r from-rose-600/10 to-pink-600/10 border border-pink-500/25 hover:border-pink-500/50 hover:text-white transition-colors cursor-pointer group active:scale-95 text-pink-300 shadow-md shadow-pink-950/10"
          >
            <Download className="w-3.5 h-3.5 text-pink-400 group-hover:animate-bounce" />
            <span className="text-[10px] font-extrabold uppercase tracking-wide">Share Photo</span>
          </button>
        </div>
      </div>


      {/* MARK DAVID'S LOGIN KEY sandbox depends on codes */}
      <div className="mt-5 pt-3 border-t border-slate-800/40">
        <button
          onClick={() => { playClickSound(); setShowAdminPanel(!showAdminPanel); }}
          className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 tracking-wider uppercase flex items-center gap-1.5 cursor-pointer select-none"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>👨‍💻 Are you Mark David? Code Customization Settings</span>
        </button>

        <AnimatePresence>
          {showAdminPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-slate-950/80 border border-slate-850/60 rounded-xl space-y-4 overflow-hidden"
            >
              <div className="border-b border-slate-850 pb-2">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest font-mono">Mark David's Code Sandbox Controller</span>
                <p className="text-[9px] text-slate-500">Only you configure the active registration login codes allowed in local instance</p>
              </div>

              {/* Active list */}
              <div>
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block mb-2">Currently Approved Login Keys:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeCodes.map((c) => (
                    <div key={c} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1 text-[10px] font-mono font-bold text-slate-200 flex items-center gap-1.5 transition-all">
                      <span>{c}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCode(c)}
                        className="text-slate-500 hover:text-rose-400 font-extrabold text-[12px] h-3.5 w-3.5 flex items-center justify-center rounded hover:bg-slate-850 active:scale-90"
                        title="Revoke and delete code key"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {activeCodes.length === 0 && (
                    <span className="text-[10px] text-rose-500 block font-mono">No keys active. Users will block registering! Add one below.</span>
                  )}
                </div>
              </div>

              {/* Form to append keys */}
              <form onSubmit={handleAddCode} className="flex gap-2">
                <input
                  type="text"
                  placeholder="CREATE CUSTOM ALPHA-NUMERIC CODE (e.g. GCASHGOD)"
                  value={adminCodeInput}
                  onChange={(e) => setAdminCodeInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-850 rounded-xl py-1.5 px-3 text-[10px] font-mono tracking-widest font-semibold uppercase text-white placeholder-slate-700 outline-none focus:border-indigo-500/40"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs uppercase font-mono font-black tracking-wider cursor-pointer max-w-max shrink-0 transition-all flex items-center gap-1 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create</span>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* SCREEN CAPTURE PREVIEW MODAL */}
      <AnimatePresence>
        {showSharePreview && (
          <div className="fixed inset-0 z-[100000] bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-950 border border-indigo-500/30 p-6 rounded-2xl max-w-lg w-full flex flex-col items-center space-y-4 shadow-2xl relative"
            >
              {/* Top Title */}
              <div className="text-center w-full">
                <span className="text-[10px] bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded font-black font-mono tracking-widest uppercase">TEMPEST MEMBER CARD GENERATED</span>
                <h3 className="text-sm font-black text-white mt-1.5 font-mono uppercase tracking-tight">Your Custom Image is Ready!</h3>
                <p className="text-[10px] text-slate-400">Download the collector card to show off on Discord, FB, or messenger</p>
              </div>

              {/* Visual Generated Area */}
              <div className="w-full bg-[#030712] border border-slate-850 rounded-2xl p-1 shadow-inner relative flex items-center justify-center overflow-hidden aspect-[750/430]">
                {shareImgUrl ? (
                  <img src={shareImgUrl} alt="Tempest Share Card" className="w-full h-full object-contain rounded-xl select-none" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-8">
                    <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                    <span className="text-xs text-slate-500">Generating collector portrait...</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 w-full pt-1">
                <button
                  onClick={() => setShowSharePreview(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-850 text-slate-400 hover:text-white text-xs font-semibold hover:bg-slate-900 transition-colors cursor-pointer active:scale-95 font-mono uppercase tracking-wider"
                >
                  Dismiss
                </button>
                <button
                  onClick={triggerDownload}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs uppercase tracking-widest cursor-pointer shadow-md shadow-pink-950/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{copiedImage ? 'Saved! ✔️' : 'Download PNG'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Helper to format points
function pointsFormatter(val: number): string {
  try {
    return val.toLocaleString();
  } catch (_) {
    return val.toString();
  }
}
