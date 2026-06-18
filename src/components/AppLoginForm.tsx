import React, { useState } from 'react';
import { Mail, Lock, RefreshCw } from 'lucide-react';
import { playClickSound } from '../lib/audio';

interface AppLoginFormProps {
  profilesDb: Record<string, any>;
  onLoginSuccess: (profile: any) => void;
  activeCodes: string[];
}

export default function AppLoginForm({
  profilesDb,
  onLoginSuccess,
  activeCodes
}: AppLoginFormProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');
    playClickSound();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorText('Please specify your registered email.');
      return;
    }

    const isTargetAdmin = cleanEmail === 'mdv4244' || cleanEmail === 'mdv4244@gmail.com';

    if (isTargetAdmin) {
      const codeAnswer = window.prompt("Need Code to login mdv4244@gmail.com");
      if (codeAnswer !== "PRAISE GOD FROM WHOM ALL BLESSINGS FLOW") {
        setErrorText("Incorrect admin credential. Access denied.");
        return;
      }
    }

    // Locate profile
    const profile = profilesDb[cleanEmail];
    if (!profile) {
      setErrorText('No existing profile associated with this email. Please head to the Register page first!');
      return;
    }

    // Passcode code check (skipped for admin)
    if (!isTargetAdmin) {
      const enteredCode = code.trim().toUpperCase();
      if (!activeCodes.includes(enteredCode)) {
        setErrorText('Incorrect login verification key. Please ask Mark David on Facebook for your code!');
        return;
      }
    }

    setSuccessText(`Access Authorized! Welcome back, ${profile.nickname}...`);

    setTimeout(() => {
      onLoginSuccess(profile);
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left select-none">
      {errorText && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold uppercase tracking-wide font-mono animate-shake" id="login-error-toast">
          ⚠️ {errorText}
        </div>
      )}

      {successText && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold uppercase tracking-wide font-mono flex items-center gap-2" id="login-success-toast">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
          <span>{successText}</span>
        </div>
      )}

      <div>
        <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5 font-bold">Registered email address</label>
        <div className="relative">
          <Mail className="absolute top-2.5 left-3 w-4 h-4 text-slate-500" />
          <input
            type="email"
            required
            placeholder="e.g. admin@tempest.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 outline-none transition-all focus:ring-1 focus:ring-indigo-500/30"
            id="login-email-input"
          />
        </div>
      </div>

      {email.trim().toLowerCase() !== 'mdv4244@gmail.com' ? (
        <div>
          <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5 font-bold">Verification Login Key</label>
          <div className="relative">
            <Lock className="absolute top-2.5 left-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              required
              placeholder="Enter active login passcode key"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-600 uppercase font-mono tracking-wider outline-none transition-all focus:ring-1 focus:ring-indigo-500/30"
              id="login-code-input"
            />
          </div>
          <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">Valid test login keys: <span className="text-indigo-400 font-bold">MARKDAVID777, LOYALTY2026, TEMPESTFREE, ADMIN123</span></p>
        </div>
      ) : (
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-xl border-dashed">
          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest block font-mono">🛡️ ADMINISTRATOR LOCK RECOGNIZED</span>
          <p className="text-[10px] text-slate-405 leading-relaxed mt-1">
            Passcode bypass is active for this account. Sign-in operates immediately without verification key constraints!
          </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg active:scale-[0.98]"
        id="login-submit-btn"
      >
        🔑 Secure Login & Synchronize Wallet
      </button>
    </form>
  );
}
