import React, { useState } from 'react';
import { Mail, User, Lock, CheckCircle, RefreshCw, Users } from 'lucide-react';
import { playClickSound } from '../lib/audio';
import { PRESET_AVATARS, PRESET_COVERS } from './ProfileShareHub';

interface AppRegisterFormProps {
  currentPoints: number;
  profilesDb: Record<string, any>;
  onRegisterSuccess: (profile: any) => void;
  activeCodes: string[];
}

export default function AppRegisterForm({
  currentPoints,
  profilesDb,
  onRegisterSuccess,
  activeCodes
}: AppRegisterFormProps) {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [code, setCode] = useState('');
  const [referrerInput, setReferrerInput] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [coverIndex, setCoverIndex] = useState(0);

  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');
    playClickSound();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorText('Please enter your email to proceed.');
      return;
    }

    // Check if mdv4244@gmail.com is registering
    const isTargetAdmin = cleanEmail === 'mdv4244' || cleanEmail === 'mdv4244@gmail.com';

    if (isTargetAdmin) {
      const codeAnswer = window.prompt("Need Code to login mdv4244@gmail.com");
      if (codeAnswer !== "PRAISE GOD FROM WHOM ALL BLESSINGS FLOW") {
        setErrorText("Incorrect admin credential. Access denied.");
        return;
      }
    }

    if (profilesDb[cleanEmail]) {
      setErrorText('This email is already registered. Switch to the Login page instead!');
      return;
    }

    // Validation for verification code (bypassed entirely for administrator)
    if (!isTargetAdmin) {
      const enteredCode = code.trim().toUpperCase();
      if (!activeCodes.includes(enteredCode)) {
        setErrorText('Invalid verification key. Request yours directly from Mark David!');
        return;
      }
    }

    // Optional Referrer validation
    const cleanReferrer = referrerInput.trim().toLowerCase();
    let validatedReferrerEmail = '';
    if (cleanReferrer) {
      if (cleanReferrer === cleanEmail) {
        setErrorText('You cannot list your own email/ID as a referrer!');
        return;
      }
      const foundKey = Object.keys(profilesDb).find(
        k => k.toLowerCase() === cleanReferrer || (profilesDb[k].userId && profilesDb[k].userId.toLowerCase() === cleanReferrer)
      );
      if (!foundKey) {
        setErrorText('Referrer not found. Ensure you entered their exact registered Email or ID!');
        return;
      }
      validatedReferrerEmail = foundKey;
    }

    const randomId = Math.floor(10000 + Math.random() * 90000).toString();
    const newUserProfile = {
      email: cleanEmail,
      userId: randomId,
      nickname: nickname.trim() || (isTargetAdmin ? "Mark David (Admin)" : `User_${randomId}`),
      avatar: PRESET_AVATARS[avatarIndex],
      coverPhoto: PRESET_COVERS[coverIndex],
      points: isTargetAdmin ? Math.max(currentPoints, 99999) : currentPoints, // Admin gets instant legendary wealth!
      referredBy: validatedReferrerEmail || undefined,
      referralCount: 0
    };

    setSuccessText('Success! Register credentials processed, logging you in...');
    
    // Slight pause for premium feedback effect
    setTimeout(() => {
      onRegisterSuccess(newUserProfile);
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left select-none">
      {errorText && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold uppercase tracking-wide font-mono animate-shake">
          ⚠️ {errorText}
        </div>
      )}

      {successText && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold uppercase tracking-wide font-mono flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>{successText}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5 font-bold">Secure Email Address (Required)</label>
          <div className="relative">
            <Mail className="absolute top-2.5 left-3 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              placeholder="e.g. admin@tempest.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-indigo-500/30 font-sans"
              id="register-email-input"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5 font-bold">Profile Nickname (Optional)</label>
          <div className="relative">
            <User className="absolute top-2.5 left-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="e.g. Mark David"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-indigo-500/30"
              id="register-nickname-input"
            />
          </div>
        </div>
      </div>

      {/* Referral Email / ID (Optional) */}
      <div>
        <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5 font-bold flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>Referral Account Email or ID (Optional)</span>
        </label>
        <div className="relative">
          <User className="absolute top-2.5 left-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="e.g. referrer@gmail.com or ID '54321'"
            value={referrerInput}
            onChange={(e) => setReferrerInput(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-indigo-500/30"
            id="register-referrer-input"
          />
        </div>
        <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">
          Referrers earn <span className="text-emerald-400 font-extrabold">+2,000 pts</span> instantly upon reaching exactly <span className="text-indigo-400 font-extrabold">21 registered members</span>!
        </p>
      </div>

      {/* Verification Code block (hidden for admin email address) */}
      {email.trim().toLowerCase() !== 'mdv4244@gmail.com' ? (
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5 font-bold">
            Access Verification Key Code
          </label>
          <div className="relative">
            <Lock className="absolute top-2.5 left-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              required
              placeholder="Enter active code (Request key from Mark David)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 uppercase font-mono tracking-wider outline-none transition-all focus:ring-1 focus:ring-indigo-500/30"
              id="register-code-input"
            />
          </div>
          <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">Valid test invite keys: <span className="text-indigo-400 font-bold">MARKDAVID777, LOYALTY2026, TEMPESTFREE, GIVE777</span></p>
        </div>
      ) : (
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-xl border-dashed">
          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest block font-mono">🛡️ ADMINISTRATOR LOCK RECOGNIZED</span>
          <p className="text-[10px] text-slate-405 leading-relaxed mt-1">
            Bypass active! As Administrator, you are the President of the Inn. Registration code check is automatically skipped, and you will receive master administrator status in the system.
          </p>
        </div>
      )}

      {/* Preset Customizers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-2 font-bold">Choose Chibi Mascot Avatar</label>
          <div className="flex gap-2 flex-wrap">
            {PRESET_AVATARS.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { playClickSound(); setAvatarIndex(idx); }}
                className={`relative w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  avatarIndex === idx ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-600/30' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="referrer" />
                {avatarIndex === idx && (
                  <div className="absolute inset-0 bg-indigo-600/15 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-2 font-bold">Choose Premium Card Banner</label>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COVERS.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { playClickSound(); setCoverIndex(idx); }}
                className={`relative w-16 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  coverIndex === idx ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-600/30' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="referrer" />
                {coverIndex === idx && (
                  <div className="absolute inset-0 bg-indigo-600/15 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg active:scale-[0.98]"
        id="register-submit-btn"
      >
        🔐 Secure Account Profile & Continue
      </button>
    </form>
  );
}
