import React, { useState } from 'react';
import { Shield, Plus, Gift, Users, Lock, Unlock, Key, RefreshCcw } from 'lucide-react';
import { playClickSound } from '../lib/audio';

interface AdminConsoleProps {
  profilesDb: Record<string, any>;
  setProfilesDb: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  activeCodes: string[];
  setActiveCodes: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function AdminConsole({
  profilesDb,
  setProfilesDb,
  activeCodes,
  setActiveCodes
}: AdminConsoleProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [newCodeInput, setNewCodeInput] = useState('');
  const [securityPassword, setSecurityPassword] = useState('');
  const [isGeneratorUnlocked, setIsGeneratorUnlocked] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [addPointsInput, setAddPointsInput] = useState('500');

  const [notification, setNotification] = useState('');
  const [authError, setAuthError] = useState('');

  // Handle password validation
  const handleUnlockGenerator = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setAuthError('');

    // Obfuscated credential verification to prevent unauthorized inspection
    if (typeof window !== 'undefined' && window.btoa && btoa(securityPassword) === 'MTIxOTk3') {
      setIsGeneratorUnlocked(true);
      setNotification('ACCESS GRANTED: Master Code Generator Unlocked!');
      setTimeout(() => setNotification(''), 3000);
    } else {
      setAuthError('INVALID SECURITY PASSWORD! Access Denied.');
    }
  };

  // Generate random safe key
  const handleGenerateRandomKey = () => {
    playClickSound();
    if (!isGeneratorUnlocked) {
      setAuthError('Please unlock with security password first!');
      return;
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'TEMPEST_';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCodeInput(result);
  };

  // Handle adding custom invite code key
  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    if (!isGeneratorUnlocked) {
      setAuthError('Master Generator lock is active! Provide valid secondary password.');
      return;
    }

    const cleanCode = newCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (activeCodes.includes(cleanCode)) {
      setNotification('Code key already exists in active list!');
      return;
    }

    setActiveCodes(prev => {
      const updated = [...prev, cleanCode];
      localStorage.setItem('tempest_login_codes', JSON.stringify(updated));
      return updated;
    });

    setNewCodeInput('');
    setNotification(`Successfully registered login key "${cleanCode}"!`);
    
    setTimeout(() => {
      setNotification('');
    }, 4000);
  };

  // Handle gifting points directly
  const handleGiftPoints = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    const targetEmail = selectedUserEmail.toLowerCase().trim();
    const parsedAmount = parseInt(addPointsInput, 10);

    if (!targetEmail || isNaN(parsedAmount) || parsedAmount <= 0) return;

    if (!profilesDb[targetEmail]) {
      setNotification('Specified email address does not exist.');
      return;
    }

    setProfilesDb(prev => {
      const updatedProfile = {
        ...prev[targetEmail],
        points: (prev[targetEmail].points || 0) + parsedAmount
      };
      const updatedDb = {
        ...prev,
        [targetEmail]: updatedProfile
      };
      localStorage.setItem('tempest_users_db', JSON.stringify(updatedDb));
      return updatedDb;
    });

    setNotification(`Gifted +${parsedAmount} points to user ${profilesDb[targetEmail].nickname}!`);
    setAddPointsInput('500');

    setTimeout(() => {
      setNotification('');
    }, 4000);
  };

  const registeredUsers = Object.values(profilesDb);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-indigo-500/30 rounded-xl p-4 select-none shrink-0 shadow-lg relative overflow-hidden" id="admin-console-wrapper">
      {/* Background glow lines */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

      <div 
        onClick={() => { playClickSound(); setIsOpen(!isOpen); }}
        className="flex items-center justify-between cursor-pointer border-b border-indigo-500/15 pb-2.5 mb-3"
      >
        <div className="flex items-center gap-2 text-indigo-400 font-black tracking-tight text-xs uppercase font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <Shield className="w-4 h-4" />
          <span>👑 Mark's Admin Console</span>
        </div>
        <button className="text-[10px] uppercase font-mono tracking-widest text-slate-400 hover:text-white font-bold transition-colors">
          {isOpen ? '[ HIDE ]' : '[ SHOW ]'}
        </button>
      </div>

      {notification && (
        <div className="p-2 mb-3 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-mono uppercase font-extrabold tracking-wide text-center">
          ⚡ {notification}
        </div>
      )}

      {authError && (
        <div className="p-2 mb-3 bg-rose-500/15 border border-rose-500/20 text-rose-450 rounded-lg text-[10px] font-mono uppercase font-extrabold tracking-wide text-center animate-shake">
          ⚠️ {authError}
        </div>
      )}

      {isOpen && (
        <div className="space-y-4 text-left font-mono">
          
          {/* Section 1: Security Password Lock Gateway */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-indigo-550/15 space-y-2.5">
            <span className="text-[9px] uppercase text-indigo-400 block font-black flex items-center gap-1.5">
              {isGeneratorUnlocked ? (
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span>CODE GENERATOR LOCK SYSTEM</span>
            </span>

            {!isGeneratorUnlocked ? (
              <form onSubmit={handleUnlockGenerator} className="space-y-1.5">
                <p className="text-[8px] text-slate-400 uppercase leading-relaxed">
                  Provide authorized administrative security passcode to reveal registration deck controls:
                </p>
                <div className="flex gap-1.5">
                  <input
                    type="password"
                    placeholder="Enter lock password..."
                    value={securityPassword}
                    onChange={(e) => setSecurityPassword(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg py-1 px-2 text-[11px] text-white outline-none placeholder-slate-650"
                    id="admin-security-password-input"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-rose-955 hover:bg-rose-950 border border-rose-800 text-rose-400 rounded-lg font-black text-[10px] uppercase cursor-pointer"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-emerald-400 bg-emerald-500/10 p-1 px-2 rounded border border-emerald-500/20">
                  <span>🟢 AUTHENTICATED AS PRESIDENT</span>
                  <button 
                    onClick={() => { playClickSound(); setIsGeneratorUnlocked(false); setSecurityPassword(''); }}
                    className="text-[8px] underline text-rose-400 hover:text-rose-300 uppercase"
                  >
                    Lock Deck
                  </button>
                </div>

                {/* Create active invite / login keys */}
                <form onSubmit={handleCreateCode} className="space-y-1.5">
                  <label className="text-[9px] uppercase text-slate-400 block font-black">
                    🔑 Make & Validate Login Key:
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. MARK777"
                      value={newCodeInput}
                      onChange={(e) => setNewCodeInput(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 uppercase rounded-lg py-1 px-2 text-[11px] text-white outline-none"
                      id="admin-new-code-input"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateRandomKey}
                      className="px-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-indigo-300 border border-slate-700 cursor-pointer text-xs"
                      title="Generate random secure key"
                    >
                      <Key className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="submit"
                      className="px-3 bg-indigo-650 hover:bg-indigo-605 rounded-lg text-white font-black text-xs cursor-pointer active:scale-95 transition-all flex items-center justify-center border border-indigo-500/30"
                      title="Register secure key"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* General Codes display panel */}
            <div className="border-t border-slate-900 pt-2 font-mono">
              <span className="text-[9px] uppercase text-slate-400 block font-black mb-1">
                Active keys in system:
              </span>
              <div className="flex flex-wrap gap-1 max-h-[48px] overflow-y-auto">
                {activeCodes.map((c) => (
                  <span key={c} className="text-[8px] bg-slate-950 text-slate-350 px-1.5 py-0.5 rounded font-bold border border-slate-850 transition-all hover:border-indigo-500/30">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Account Directory */}
          <div className="border-t border-slate-800 pt-3">
            <span className="text-[9px] uppercase text-slate-400 block font-black flex items-center gap-1 mb-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Registered Accounts ({registeredUsers.length}):</span>
            </span>
            {registeredUsers.length > 0 ? (
              <div className="space-y-1.5 max-h-[105px] overflow-y-auto pr-1">
                {registeredUsers.map((user: any) => (
                  <div key={user.email} className="p-1.5 bg-slate-950 border border-slate-850 rounded-lg flex items-center justify-between gap-1 text-[10px]">
                    <div className="truncate flex-1">
                      <span className="text-white font-bold block truncate leading-none mb-0.5">{user.nickname}</span>
                      <span className="text-slate-500 text-[8px] tracking-tight block truncate leading-none">
                        {user.email.toLowerCase().trim() === 'mdv4244@gmail.com' ? 'ADMINISTRATIVE SECURED' : user.email} (ID: {user.userId})
                      </span>
                    </div>
                    <span className="text-indigo-400 font-extrabold text-[10px] shrink-0">{user.points?.toLocaleString()} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-[9px] text-slate-550 block italic">No members registered yet. Share key codes to recruit!</span>
            )}
          </div>

          {/* Section 3: Gift points reward adjustor */}
          <form onSubmit={handleGiftPoints} className="border-t border-slate-800 pt-3 space-y-2">
            <span className="text-[9px] uppercase text-slate-400 block font-black flex items-center gap-1 leading-none mb-0.5">
              <Gift className="w-3.5 h-3.5 text-indigo-400 animate-bounce" />
              <span>Instant points Gifter:</span>
            </span>
            {registeredUsers.length > 0 ? (
              <div className="space-y-1.5">
                <select
                  value={selectedUserEmail}
                  onChange={(e) => setSelectedUserEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-[10px] text-slate-300 outline-none"
                  id="admin-gift-user-select"
                >
                  <option value="">-- SELECT USER EMAIL --</option>
                  {registeredUsers.map((user: any) => (
                    <option key={user.email} value={user.email}>
                      {user.nickname} ({user.email.toLowerCase().trim() === 'mdv4244@gmail.com' ? 'ADMINISTRATIVE SECURED' : user.email})
                    </option>
                  ))}
                </select>

                <div className="flex gap-1.5">
                  <input
                    type="number"
                    min="1"
                    placeholder="pts"
                    value={addPointsInput}
                    onChange={(e) => setAddPointsInput(e.target.value)}
                    className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-white"
                    id="admin-gift-points-input"
                  />
                  <button
                    type="submit"
                    className="flex-1 py-1 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-white font-black text-[10px] uppercase tracking-wider cursor-pointer active:scale-95 transition-all text-center"
                    id="admin-gift-submit-btn"
                  >
                    Gift Points
                  </button>
                </div>
              </div>
            ) : (
              <span className="text-[9px] text-slate-550 block italic">Register an account first to reward points!</span>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
