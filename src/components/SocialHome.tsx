import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUp, ArrowDown, MessageSquare, ThumbsUp, Heart, Smile, Send, 
  Sparkles, Shield, User, Hash, Users, Zap, Image, Share2, Award, 
  Eye, Flame, MessageCircle, Pin, Volume2
} from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';

interface UserProfile {
  email: string;
  nickname: string;
  avatar: string;
  title: string;
  points: number;
  referralCount: number;
  userId: string;
  bio?: string;
  views?: number;
  isVerified?: boolean;
}

interface PostReaction {
  like: number;
  love: number;
  haha: number;
  wow: number;
  sad: number;
  angry: number;
  userReaction?: string; // 'like' | 'love' | etc.
}

interface RedditPost {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  authorTitle: string;
  email: string; // to obscure if mdv4244
  content: string;
  image?: string;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  reactions: PostReaction;
  comments: Comment[];
  createdAt: string;
  tags: string[];
}

interface Comment {
  id: string;
  author: string;
  authorAvatar: string;
  authorTitle: string;
  content: string;
  createdAt: string;
  upvotes: number;
}

interface Message {
  id: string;
  author: string;
  authorAvatar: string;
  authorTitle: string;
  email: string;
  content: string;
  stickerUrl?: string | null;
  createdAt: string;
  reactions: { [key: string]: number }; // emoji -> count
}

const STICKERS = [
  { name: 'Happy Megumin', emoji: '🌟', url: 'https://i.waifu.pics/b6m8GgX.png' },
  { name: 'Cool Runner', emoji: '🕶️', url: 'https://i.waifu.pics/W-Wk-mF.png' },
  { name: 'Aria Love', emoji: '💖', url: 'https://i.waifu.pics/P~m8GgX.png' },
  { name: 'Neko Wave', emoji: '🐈', url: 'https://i.waifu.pics/uK1p_gD.png' },
  { name: 'Zen Chibi', emoji: '🍵', url: 'https://i.waifu.pics/G-m8GgX.png' },
  { name: 'Shock Anya', emoji: '💥', url: 'https://i.waifu.pics/Sg5m~gX.png' }
];

const PRESET_POSTS: RedditPost[] = [
  {
    id: 'post-1',
    title: '🔥 LEAKED: The legendary 21 referrals vault secret holds 2,000 PTS immediately!',
    author: 'Inn President',
    authorAvatar: 'https://i.waifu.pics/G-m8GgX.png',
    authorTitle: ' Inn President & Founder',
    email: 'mdv4244@gmail.com',
    content: 'Greeting travelers! The Tempest Tavern remains fully transparent. Under absolute developer-secured terms, you can register and share your credentials. Remember, our wallpapers are completely offline and coded to stream instantly - NO MORE server delays or artificial intelligence slowness! Upvote if you earned your first payout today! 🚀',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    upvotes: 84,
    downvotes: 2,
    userVote: null,
    reactions: { like: 12, love: 24, haha: 1, wow: 8, sad: 0, angry: 0 },
    tags: ['Announcement', 'InnBypass', 'PointsVault'],
    createdAt: '3 hours ago',
    comments: [
      {
        id: 'c1',
        author: 'LofiVibes99',
        authorAvatar: 'https://i.waifu.pics/uK1p_gD.png',
        authorTitle: 'Cozy Voyager',
        content: 'This actually loads absolutely instant. Lovin the offline wallpaper updates!',
        upvotes: 11,
        createdAt: '2 hours ago'
      },
      {
        id: 'c2',
        author: 'KenshinDesu',
        authorAvatar: 'https://i.waifu.pics/W-Wk-mF.png',
        authorTitle: 'Cyber Ronin',
        content: 'Praise God! Cleanest build so far. No artificial delay!',
        upvotes: 9,
        createdAt: '1 hour ago'
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Let\'s rate the new "Anime Movie Specials" section! (Your Name, Suzume, weathering...) 🎬',
    author: 'SakuraBlossom',
    authorAvatar: 'https://i.waifu.pics/b6m8GgX.png',
    authorTitle: 'VIP Curator',
    email: 'sakura_bloom@tempesthub.org',
    content: 'Just checked out the newly loaded cinematic wallpapers under the Specials page. The colors of Kimi No Na Wa and Starfall Twilight look absolutely stunning. Kudos to the dev!',
    image: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80',
    upvotes: 49,
    downvotes: 1,
    userVote: null,
    reactions: { like: 18, love: 32, haha: 0, wow: 11, sad: 0, angry: 0 },
    tags: ['MovieSpecials', 'ScenicFeed', 'CuratorRate'],
    createdAt: '6 hours ago',
    comments: []
  }
];

const PRESET_MESSAGES: Message[] = [
  {
    id: 'm1',
    author: 'SakuraBlossom',
    authorAvatar: 'https://i.waifu.pics/b6m8GgX.png',
    authorTitle: 'VIP Curator',
    email: 'sakura_bloom@tempesthub.org',
    content: 'Welcome to Tempest Tavern! What is your favorite live wallpaper so far?',
    createdAt: '10:14 AM',
    reactions: { '👍': 4, '💖': 6 }
  },
  {
    id: 'm2',
    author: 'KenshinDesu',
    authorAvatar: 'https://i.waifu.pics/W-Wk-mF.png',
    authorTitle: 'Cyber Ronin',
    email: 'kenshin@cybernet.io',
    content: 'The Shonen and Cyberpunk ones are clean! Plus the heart pop is super satisfying.',
    createdAt: '10:15 AM',
    reactions: { '🔥': 5 }
  }
];

interface SocialHomeProps {
  activeProfile: UserProfile | null;
  profilesDb: { [email: string]: UserProfile };
  onUpdateProfiles: (updated: { [email: string]: UserProfile }) => void;
  playClickSound: () => void;
}

export default function SocialHome({
  activeProfile,
  profilesDb,
  onUpdateProfiles,
  playClickSound
}: SocialHomeProps) {
  const [activeSegment, setActiveSegment] = useState<'reddit' | 'discord'>('reddit');
  const [posts, setPosts] = useState<RedditPost[]>(() => {
    const saved = localStorage.getItem('tempest_reddit_posts');
    return saved ? JSON.parse(saved) : PRESET_POSTS;
  });
  
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const [commentsInputs, setCommentsInputs] = useState<{ [postId: string]: string }>({});

  // Discord Segment State
  const [activeChannel, setActiveChannel] = useState<'#lounge' | '#stickers-battle' | '#points-clash'>('#lounge');
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('tempest_discord_m');
    return saved ? JSON.parse(saved) : PRESET_MESSAGES;
  });
  const [chatInput, setChatInput] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [selectedUserForViews, setSelectedUserForViews] = useState<UserProfile | null>(null);

  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync to LS
  useEffect(() => {
    localStorage.setItem('tempest_reddit_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('tempest_discord_m', JSON.stringify(messages));
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Simulate automated tavern chat activity to make community feel super alive
  useEffect(() => {
    const chatters = ['KenshinDesu', 'SakuraBlossom', 'LofiVibes99', 'ZenWatcher', 'AnyaAria'];
    const sentences = [
      'Omg points are permanent locked in, so secure!',
      'Did you guys try the new Anime Movie Specials? Kimi No Na Wa Twilight looks INSANE!',
      'Liking wallpapers instantly grants +3 points, I already hit my daily 100 limit haha',
      'The heart pop is so therapeutic to watch ❤️',
      'President vault has absolute developer security, nice job.',
      'Check out the sticker tray! Smiling Chibi sticker is cute.',
      'I am sharing my referral link to get that 2,000 PTS payout bonus!'
    ];

    const interval = setInterval(() => {
      // Choose to push a live typing event first
      const randomChatter = chatters[Math.floor(Math.random() * chatters.length)];
      setTypingUsers([randomChatter]);

      setTimeout(() => {
        setTypingUsers([]);
        
        const isSticker = Math.random() > 0.6;
        let newMsg: Message;

        if (isSticker) {
          const randSticker = STICKERS[Math.floor(Math.random() * STICKERS.length)];
          newMsg = {
            id: `msg-sim-${Date.now()}`,
            author: randomChatter,
            authorAvatar: randSticker.url,
            authorTitle: 'Tavern Regular',
            email: `${randomChatter.toLowerCase()}@tempest.moe`,
            content: `Sent a sticker: ${randSticker.name}`,
            stickerUrl: randSticker.url,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: { '🔥': 2, '❤️': 1 }
          };
        } else {
          newMsg = {
            id: `msg-sim-${Date.now()}`,
            author: randomChatter,
            authorAvatar: 'https://i.waifu.pics/uK1p_gD.png',
            authorTitle: 'Tavern Regular',
            email: `${randomChatter.toLowerCase()}@tempest.moe`,
            content: sentences[Math.floor(Math.random() * sentences.length)],
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: { '👍': 1 }
          };
        }

        setMessages(prev => [...prev, newMsg]);
      }, 3500);

    }, 22000); // Trigger every 22 seconds

    return () => clearInterval(interval);
  }, []);

  // Increment views on profile click
  const handleProfileClick = (userEmail: string) => {
    playClickSound();
    const cleanEmail = userEmail.toLowerCase().trim();
    const db = { ...profilesDb };
    
    if (db[cleanEmail]) {
      const currentViews = db[cleanEmail].views || 0;
      db[cleanEmail] = {
        ...db[cleanEmail],
        views: currentViews + 1
      };
      onUpdateProfiles(db);
      setSelectedUserForViews(db[cleanEmail]);
    } else {
      // Create inline/mock profile viewer for post author if not registered in system DB yet
      setSelectedUserForViews({
        email: cleanEmail,
        nickname: cleanEmail === 'mdv4244@gmail.com' ? 'Inn President' : cleanEmail.split('@')[0],
        avatar: 'https://i.waifu.pics/G-m8GgX.png',
        title: cleanEmail === 'mdv4244@gmail.com' ? 'President & Admin (SECURED)' : 'Regular Member',
        points: 420,
        referralCount: 2,
        userId: 'USER-' + Math.floor(1000 + Math.random() * 9000),
        views: Math.floor(15 + Math.random() * 50),
        bio: 'Warm greetings from Cozy Inn tavern!'
      });
    }
  };

  // Reddit Create Post
  const handleCreateRedditPost = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const authorNickname = activeProfile ? activeProfile.nickname : 'Anonymous Guest';
    const authorAvatar = activeProfile ? activeProfile.avatar : 'https://i.waifu.pics/G-m8GgX.png';
    const authorTitle = activeProfile ? (activeProfile.email === 'mdv4244@gmail.com' ? 'Inn President & Founder' : 'Inn Member') : 'Newcomer';
    const authorEmail = activeProfile ? activeProfile.email : 'guest@tempest.com';

    const newPost: RedditPost = {
      id: `post-custom-${Date.now()}`,
      title: newPostTitle,
      author: authorNickname,
      authorAvatar,
      authorTitle,
      email: authorEmail,
      content: newPostContent,
      image: newPostImage || undefined,
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
      tags: newPostTag ? [newPostTag] : ['Discussion'],
      createdAt: 'Just now',
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTag('');
    setNewPostImage('');
    setShowCreatePost(false);
  };

  // Reddit Upvote/Downvote
  const handleVote = (postId: string, type: 'up' | 'down') => {
    playClickSound();
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;

      let newUp = p.upvotes;
      let newDown = p.downvotes;
      let nextVote: 'up' | 'down' | null = type;

      if (p.userVote === type) {
        // Undo vote
        if (type === 'up') newUp -= 1;
        if (type === 'down') newDown -= 1;
        nextVote = null;
      } else {
        // Apply or change vote
        if (p.userVote === 'up') newUp -= 1;
        if (p.userVote === 'down') newDown -= 1;

        if (type === 'up') newUp += 1;
        if (type === 'down') newDown += 1;
      }

      return {
        ...p,
        upvotes: newUp,
        downvotes: newDown,
        userVote: nextVote
      };
    }));
  };

  // Facebook Reaction click
  const handleReact = (postId: string, reactionType: keyof PostReaction) => {
    playClickSound();
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;

      const currentReactions = { ...p.reactions };
      const currentApplied = p.reactions.userReaction;

      if (currentApplied === reactionType) {
        // Toggle off
        currentReactions[reactionType] = Math.max(0, (currentReactions[reactionType] as number) - 1);
        currentReactions.userReaction = undefined;
      } else {
        // Toggle on
        if (currentApplied) {
          // Remove old reaction first
          currentReactions[currentApplied as keyof PostReaction] = Math.max(0, (currentReactions[currentApplied as keyof PostReaction] as number) - 1);
        }
        currentReactions[reactionType] = (currentReactions[reactionType] as number) + 1;
        currentReactions.userReaction = reactionType;
      }

      return {
        ...p,
        reactions: currentReactions
      };
    }));
  };

  // Reddit Comment Submit
  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    const commentText = commentsInputs[postId];
    if (!commentText || !commentText.trim()) return;

    const authorNickname = activeProfile ? activeProfile.nickname : 'Anonymous Guest';
    const authorAvatar = activeProfile ? activeProfile.avatar : 'https://i.waifu.pics/G-m8GgX.png';
    const authorTitle = activeProfile ? (activeProfile.email === 'mdv4244@gmail.com' ? 'Inn President' : 'Inn Member') : 'Newcomer';

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      author: authorNickname,
      authorAvatar,
      authorTitle,
      content: commentText,
      createdAt: 'Just now',
      upvotes: 1
    };

    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: [...p.comments, newComment]
      };
    }));

    setCommentsInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Discord Send message
  const handleSendChatMessage = (stickerUrl?: string) => {
    playClickSound();
    if (!chatInput.trim() && !stickerUrl) return;

    const authorName = activeProfile ? activeProfile.nickname : 'Anonymous Guest';
    const authorAvatar = activeProfile ? activeProfile.avatar : 'https://i.waifu.pics/G-m8GgX.png';
    const authorTitle = activeProfile ? (activeProfile.email === 'mdv4244@gmail.com' ? 'Inn President & Founder' : 'Inn Member') : 'Newcomer';
    const authorEmail = activeProfile ? activeProfile.email : 'guest@tempest.com';

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      author: authorName,
      authorAvatar,
      authorTitle,
      email: authorEmail,
      content: chatInput,
      stickerUrl,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: {}
    };

    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setShowStickers(false);
  };

  // Chat message reactions
  const handleReactToChatMessage = (msgId: string, emoji: string) => {
    playClickSound();
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const copyReact = { ...m.reactions };
      copyReact[emoji] = (copyReact[emoji] || 0) + 1;
      return {
        ...m,
        reactions: copyReact
      };
    }));
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-950 font-sans" id="social-home-root-frame">
      {/* Social Central Container */}
      <div className="flex-1 flex flex-col overflow-y-auto border-r border-slate-900 p-4 md:p-6 lg:p-8">
        
        {/* Flagship Social Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5 mb-6">
          <div>
            <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded font-black uppercase tracking-widest font-mono">
              Tempest Community Plaza
            </span>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <Sparkles className="w-5.5 h-5.5 text-indigo-400 animate-pulse" />
              Social Home
            </h1>
            <p className="text-xs text-slate-400">
              reddit style post boards and serverless chat forums. Share, upvote, comment, & view profile views in real time!
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-850/80 shrink-0 self-start md:self-auto select-none">
            <button
              onClick={() => { playClickSound(); setActiveSegment('reddit'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSegment === 'reddit' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Reddit plaza
            </button>
            <button
              onClick={() => { playClickSound(); setActiveSegment('discord'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSegment === 'discord' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Tempest Lounge chat
            </button>
          </div>
        </div>

        {/* ----------------- Segment 1: REDDIT PLAZA ----------------- */}
        {activeSegment === 'reddit' && (
          <div className="flex-1 flex flex-col gap-6" id="social-reddit-segment">
            {/* Create Post Header Trigger */}
            <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-xl border border-slate-850/60 select-none">
              <div className="flex items-center gap-3">
                <img 
                  src={activeProfile?.avatar || 'https://i.waifu.pics/G-m8GgX.png'} 
                  alt="" 
                  className="w-10 h-10 rounded-full object-cover border border-slate-800"
                />
                <div>
                  <span className="text-slate-200 text-xs font-bold block">Share a new opinion or artwork</span>
                  <span className="text-[10px] text-slate-500 font-mono">Create custom post on Reddit style boards</span>
                </div>
              </div>
              <button
                onClick={() => { playClickSound(); setShowCreatePost(prev => !prev); }}
                className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-600/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer select-none"
              >
                {showCreatePost ? 'Collapse' : 'Create Post +'}
              </button>
            </div>

            {/* Create Post Form */}
            <AnimatePresence>
              {showCreatePost && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleCreateRedditPost}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 overflow-hidden"
                >
                  <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono">Compose New Post</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Post Title (e.g. My favorite Ghibli/Shinkai anime wallpapers!)"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Category Tag (e.g. Scenic, Discussion, WallpaperLeak)"
                      value={newPostTag}
                      onChange={(e) => setNewPostTag(e.target.value)}
                      className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <input
                    type="url"
                    placeholder="Optional image url (e.g. https://i.waifu.pics/b6m8GgX.png)"
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500"
                  />

                  <textarea
                    required
                    placeholder="Write interesting description content..."
                    rows={4}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 resize-none"
                  ></textarea>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => { playClickSound(); setShowCreatePost(false); }}
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-xs text-slate-400 font-bold rounded-lg border border-slate-850 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-black uppercase rounded-lg cursor-pointer"
                    >
                      Post with bypass!
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* List of Reddit style posts */}
            <div className="flex flex-col gap-6">
              {posts.map(post => (
                <div 
                  key={post.id}
                  className="bg-slate-900/60 border border-slate-900 rounded-2xl p-4 md:p-5 shadow-md flex flex-col gap-4 relative"
                >
                  {/* Top Header of Post Card */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={post.authorAvatar} 
                        alt="" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/20 cursor-pointer"
                        onClick={() => handleProfileClick(post.email)}
                        title="Click to visit user's realtime profile stats!"
                      />
                      <div className="text-left">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span 
                            onClick={() => handleProfileClick(post.email)}
                            className="text-xs font-black text-slate-200 hover:text-indigo-400 cursor-pointer flex items-center gap-1.5 leading-none"
                          >
                            {post.email.toLowerCase().trim() === 'mdv4244@gmail.com' ? 'Inn President' : post.author}
                            <VerifiedBadge email={post.email} isVerified={profilesDb[post.email.toLowerCase().trim()]?.isVerified || (post as any).isVerified} />
                          </span>
                          <span className="text-[8px] tracking-wide uppercase px-1.5 py-0.5 rounded font-mono font-bold bg-indigo-950/80 border border-indigo-900/40 text-indigo-400">
                            {post.email.toLowerCase().trim() === 'mdv4244@gmail.com' ? '👑 PRESIDENT & CREATOR' : post.authorTitle}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-500 block leading-none mt-1 font-mono">{post.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {post.tags.map(t => (
                        <span key={t} className="text-[8px] uppercase tracking-wider font-bold bg-slate-950 text-indigo-400/80 border border-indigo-500/10 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="text-left space-y-3">
                    <h2 className="text-sm md:text-base font-extrabold text-white tracking-tight leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                      {post.content}
                    </p>

                    {post.image && (
                      <div className="relative overflow-hidden rounded-xl border border-slate-850/60 aspect-[16/9.5] w-full bg-slate-950">
                        <img 
                          src={post.image} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Reddit Upvote & Downvote Panel combined with Facebook reactions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-900">
                    <div className="flex items-center gap-4">
                      {/* REDDIT VOTE PANEL */}
                      <div className="flex items-center bg-slate-950/60 p-1 rounded-xl border border-slate-850/80 select-none font-mono text-[11px] font-bold">
                        <button
                          onClick={() => handleVote(post.id, 'up')}
                          className={`p-1.5 rounded-lg hover:bg-slate-900 transition-all ${
                            post.userVote === 'up' ? 'text-emerald-400' : 'text-slate-550 hover:text-slate-200'
                          }`}
                          title="Upvote post"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <span className={`px-2 select-all ${
                          post.userVote === 'up' ? 'text-emerald-400 font-extrabold' : post.userVote === 'down' ? 'text-rose-450 font-extrabold' : 'text-slate-300'
                        }`}>
                          {post.upvotes - post.downvotes}
                        </span>
                        <button
                          onClick={() => handleVote(post.id, 'down')}
                          className={`p-1.5 rounded-lg hover:bg-slate-900 transition-all ${
                            post.userVote === 'down' ? 'text-rose-450' : 'text-slate-550 hover:text-slate-200'
                          }`}
                          title="Downvote post"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* FACEBOOK REACTIONS POPUP */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {[
                          { key: 'like', icon: '👍', count: post.reactions.like },
                          { key: 'love', icon: '❤️', count: post.reactions.love },
                          { key: 'haha', icon: '😆', count: post.reactions.haha },
                          { key: 'wow', icon: '😮', count: post.reactions.wow },
                          { key: 'sad', icon: '😢', count: post.reactions.sad },
                          { key: 'angry', icon: '😡', count: post.reactions.angry }
                        ].map(rect => (
                          <button
                            key={rect.key}
                            onClick={() => handleReact(post.id, rect.key as keyof PostReaction)}
                            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-xl font-mono border hover:scale-103 transition-all ${
                              post.reactions.userReaction === rect.key
                                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 font-bold'
                                : 'bg-slate-950/20 border-slate-900 hover:border-slate-850 text-slate-400'
                            }`}
                          >
                            <span>{rect.icon}</span>
                            <span className="text-[10px]">{rect.count}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-450 font-semibold">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments.length} Comments</span>
                    </div>
                  </div>

                  {/* Post Comments Drawer */}
                  <div className="bg-slate-950/40 border border-slate-900/50 rounded-xl p-3 md:p-4 space-y-3 text-left">
                    <span className="text-[9px] text-slate-550 uppercase tracking-wider font-bold block font-mono">Comments Section ({post.comments.length})</span>
                    
                    {post.comments.length > 0 ? (
                      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                        {post.comments.map(c => (
                          <div key={c.id} className="p-2.5 rounded-lg bg-slate-900/30 border border-slate-900 flex gap-2">
                            <img src={c.authorAvatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] font-black text-slate-250 leading-none">{c.author}</span>
                                <span className="text-[7.5px] uppercase bg-slate-950 px-1 py-0.2 rounded text-slate-500 scale-90 border border-slate-850">{c.authorTitle}</span>
                              </div>
                              <p className="text-[11px] text-slate-300 mt-1">{c.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-650 italic">No comments yet. Be the first to express an opinion!</p>
                    )}

                    {/* Comment Input */}
                    <form 
                      onSubmit={(e) => handleAddComment(post.id, e)}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        required
                        placeholder="Type standard response..."
                        value={commentsInputs[post.id] || ''}
                        onChange={(e) => setCommentsInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-[11px] text-white placeholder-slate-600 outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] uppercase font-black tracking-widest cursor-pointer"
                      >
                        Reply
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- Segment 2: TEMPEST LOUNGE CHAT (DISCORD-LIKE) ----------------- */}
        {activeSegment === 'discord' && (
          <div className="flex-1 flex flex-col md:flex-row gap-4 h-[550px] border border-slate-900 rounded-2xl bg-slate-900/20" id="social-discord-segment">
            
            {/* discord left channels lists */}
            <div className="w-full md:w-52 border-r border-slate-900 p-3 select-none flex flex-col gap-4 text-left">
              <div>
                <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider font-mono">Channels</span>
                <div className="flex flex-col gap-1 mt-1.5">
                  {[
                    { val: '#lounge', icon: '💬', desc: 'General Chitchat' },
                    { val: '#stickers-battle', icon: '🎨', desc: 'Stickers Showcase' },
                    { val: '#points-clash', icon: '💎', desc: 'Points Milestones' }
                  ].map(ch => (
                    <button
                      key={ch.val}
                      onClick={() => { playClickSound(); setActiveChannel(ch.val as any); }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-black transition-all text-left truncate cursor-pointer ${
                        activeChannel === ch.val ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1">
                        <span>{ch.icon}</span> {ch.val}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* STICKERS TRAY DRAWER (ONE-CLICK DISCORD-LIKE SEND) */}
              <div className="border-t border-slate-900 pt-3 mt-auto">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Anime Stickers 🌟</span>
                  <span className="text-[8px] bg-indigo-950 border border-indigo-900 text-indigo-400 px-1 py-0.1 rounded font-bold">Inst.-Send</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {STICKERS.map(st => (
                    <button
                      key={st.name}
                      onClick={() => handleSendChatMessage(st.url)}
                      className="aspect-square bg-slate-950 border border-slate-850 hover:border-indigo-500/40 hover:bg-slate-900 rounded-lg p-1.5 transition-all text-center flex flex-col items-center justify-center cursor-pointer"
                      title={`Send instant ${st.name} sticker!`}
                    >
                      <img src={st.url} alt="" className="w-7 h-7 object-cover rounded pointer-events-none" referrerPolicy="no-referrer" />
                      <span className="text-[8px] text-slate-500 truncate w-full mt-0.5">{st.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* discord right message feed */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              <div className="bg-slate-950/80 p-2.5 border-b border-slate-900 select-none flex items-center justify-between text-left">
                <div>
                  <span className="text-xs font-black text-white">{activeChannel}</span>
                  <span className="text-[9px] text-slate-500 block">General custom public discussion vault space</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
                  <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Interactive Live Node</span>
                </div>
              </div>

              {/* Message scroll list */}
              <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-3.5 max-h-[380px]">
                {messages.map(msg => (
                  <div key={msg.id} className="group flex gap-2.5 text-left">
                    <img 
                      src={msg.authorAvatar} 
                      alt="" 
                      className="w-8 h-8 rounded-full border border-slate-800 object-cover cursor-pointer"
                      onClick={() => handleProfileClick(msg.email)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span 
                          onClick={() => handleProfileClick(msg.email)}
                          className="text-xs font-black text-slate-200 hover:text-indigo-400 cursor-pointer flex items-center gap-1 leading-none"
                        >
                          {msg.email.toLowerCase().trim() === 'mdv4244@gmail.com' ? 'Inn President' : msg.author}
                          <VerifiedBadge email={msg.email} isVerified={profilesDb[msg.email.toLowerCase().trim()]?.isVerified} />
                        </span>
                        <span className="text-[7.5px] uppercase bg-slate-950 text-indigo-400 px-1 py-0.2 rounded border border-indigo-900/40">
                          {msg.email.toLowerCase().trim() === 'mdv4244@gmail.com' ? 'Inn Founder' : msg.authorTitle}
                        </span>
                        <span className="text-[8px] text-slate-500 font-mono">{msg.createdAt}</span>
                      </div>

                      {/* Content block */}
                      {msg.stickerUrl ? (
                        <div className="mt-1.5 border border-slate-800 bg-slate-950/40 p-2 rounded-xl inline-block max-w-[150px]">
                          <img src={msg.stickerUrl} alt="" className="w-20 h-20 object-cover rounded-lg" referrerPolicy="no-referrer" />
                          <span className="text-[9px] text-indigo-400/80 font-mono font-bold mt-1 block">Sent Sticker</span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-300 pr-4 mt-1 font-sans">{msg.content}</p>
                      )}

                      {/* Msg reactions block */}
                      <div className="flex gap-1 mt-1.5 select-none">
                        {Object.entries(msg.reactions).map(([reaction, count]) => (
                          <button
                            key={reaction}
                            onClick={() => handleReactToChatMessage(msg.id, reaction)}
                            className="bg-slate-950/60 border border-slate-850 rounded px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-white"
                          >
                            {reaction} {count}
                          </button>
                        ))}
                        {/* Reaction options buttons on hover */}
                        <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 ml-1 transition-opacity">
                          {['👍', '💖', '🔥', '😆'].map(r => (
                            <button
                              key={r}
                              onClick={() => handleReactToChatMessage(msg.id, r)}
                              className="hover:scale-120 text-[10px]"
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing status notification bar */}
                {typingUsers.length > 0 && (
                  <div className="text-left text-[9px] text-slate-500 font-mono italic animate-pulse">
                    ✏️ {typingUsers.join(', ')} is typing instant tavern chord...
                  </div>
                )}
                
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Send Message input strip */}
              <div className="p-3 border-t border-slate-900 bg-slate-950/40 flex gap-2">
                <input
                  type="text"
                  placeholder={`Send direct response message to ${activeChannel} channel...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendChatMessage(); }}
                  className="flex-1 bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 outline-none transition-all"
                />
                
                <button
                  type="button"
                  onClick={() => handleSendChatMessage()}
                  className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Social Sidebar: Active tavern members & profile view stat tracker */}
      <div className="w-full md:w-64 p-4 md:p-6 bg-slate-900/20 flex flex-col gap-6" id="social-sidebar-members">
        
        {/* Real-time viewer display card */}
        {selectedUserForViews && (
          <div className="p-4 bg-gradient-to-br from-indigo-950 to-slate-950 rounded-xl border border-indigo-500/20 text-left relative overflow-hidden select-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
            <h4 className="text-[9px] text-indigo-400 font-black uppercase tracking-wider font-mono">⚡ LIVE PROFILE METRICS</h4>
            
            <div className="flex items-center gap-2 mt-2">
              <img src={selectedUserForViews.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-850" />
              <div>
                <span className="text-xs font-black text-white flex items-center gap-1.5 truncate leading-none">
                  {selectedUserForViews.nickname}
                  <VerifiedBadge email={selectedUserForViews.email} isVerified={selectedUserForViews.isVerified} />
                </span>
                <span className="text-[8px] text-slate-500 tracking-tight font-mono capitalize">{selectedUserForViews.title}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal mt-2 italic">
              {selectedUserForViews.bio || 'Cozy wanderer sharing beautiful anime movie visuals and wallpapers!'}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-900 select-none">
              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-850 text-center">
                <span className="text-[8px] text-slate-550 block uppercase font-mono">Realtime Views</span>
                <div className="flex items-center justify-center gap-1 text-xs font-mono font-black text-white mt-0.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{selectedUserForViews.views || 24}</span>
                </div>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-850 text-center">
                <span className="text-[8px] text-slate-550 block uppercase font-mono">Vault Pts</span>
                <span className="text-xs font-mono font-black text-emerald-400 block mt-0.5">{selectedUserForViews.points?.toLocaleString()} pts</span>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedUserForViews(null)}
              className="w-full mt-2.5 py-1 text-slate-500 hover:text-slate-200 text-[9px] uppercase font-bold tracking-widest font-mono text-center border border-slate-900 border-dashed hover:border-slate-800 rounded bg-slate-950/10 cursor-pointer"
            >
              Close Metric View
            </button>
          </div>
        )}

        {/* Members List */}
        <div className="text-left flex-1 flex flex-col">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-900 select-none mb-3">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-mono">ACTIVE INN MEMBERS ({Object.keys(profilesDb).length + 3})</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {/* Real President instance */}
            <div 
              onClick={() => handleProfileClick('mdv4244@gmail.com')}
              className="p-2 hover:bg-indigo-500/5 border border-slate-900 hover:border-indigo-500/25 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <img src="https://i.waifu.pics/G-m8GgX.png" alt="" className="w-8 h-8 rounded-full border border-indigo-400/40 object-cover" />
                <div className="leading-tight">
                  <span className="text-xs font-black text-indigo-300 flex items-center gap-1 group-hover:text-white transition-colors">
                    Inn President
                    <VerifiedBadge email="mdv4244@gmail.com" />
                  </span>
                  <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest font-mono">PRESIDENT & FOUNDER</span>
                </div>
              </div>
              <Eye className="w-3.5 h-3.5 text-slate-650 group-hover:text-indigo-400 transition-colors" />
            </div>

            {/* Current profilesDb list */}
            {Object.values(profilesDb)
              .filter(u => u.email.toLowerCase().trim() !== 'mdv4244@gmail.com')
              .map(user => (
                <div 
                  key={user.email}
                  onClick={() => handleProfileClick(user.email)}
                  className="p-2 hover:bg-indigo-500/5 border border-slate-900 hover:border-indigo-500/25 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full border border-slate-850 object-cover" />
                    <div className="leading-tight font-mono">
                      <span className="text-xs font-black text-slate-200 flex items-center gap-1 group-hover:text-white transition-colors">
                        {user.nickname}
                        <VerifiedBadge email={user.email} isVerified={user.isVerified} />
                      </span>
                      <span className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest font-mono">MEMBER</span>
                    </div>
                  </div>
                  <Eye className="w-3.5 h-3.5 text-slate-650 group-hover:text-indigo-400 transition-colors" />
                </div>
              ))
            }

            {/* Presets to make it look full */}
            {[
              { nick: 'SakuraBlossom', title: 'Curator', url: 'https://i.waifu.pics/b6m8GgX.png', email: 'sakura_bloom@tempesthub.org' },
              { nick: 'KenshinDesu', title: 'Cyber Ronin', url: 'https://i.waifu.pics/W-Wk-mF.png', email: 'kenshin@cybernet.io' },
              { nick: 'LofiVibes99', title: 'Cozy Voyager', url: 'https://i.waifu.pics/uK1p_gD.png', email: 'lofi99@lofi.com' }
            ].map(pres => (
              <div 
                key={pres.nick}
                onClick={() => handleProfileClick(pres.email)}
                className="p-2 hover:bg-indigo-500/5 border border-slate-900 hover:border-indigo-500/25 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                title="Click to view realtime profile stats!"
              >
                <div className="flex items-center gap-2">
                  <img src={pres.url} alt="" className="w-8 h-8 rounded-full border border-slate-850 object-cover" referrerPolicy="no-referrer" />
                  <div className="leading-tight font-mono">
                    <span className="text-xs font-black text-slate-400 block group-hover:text-white transition-colors">{pres.nick}</span>
                    <span className="text-[8px] text-slate-550 block capitalize leading-none mt-0.5">{pres.title}</span>
                  </div>
                </div>
                <Eye className="w-3.5 h-3.5 text-slate-650 group-hover:text-indigo-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
