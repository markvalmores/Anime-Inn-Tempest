import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  email?: string;
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function VerifiedBadge({ email, isVerified, size = 'sm' }: VerifiedBadgeProps) {
  const cleanEmail = email?.toLowerCase().trim();
  const isGolden = cleanEmail === 'mdv4244@gmail.com';
  
  if (!isGolden && !isVerified) return null;

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 w-5'
  };

  if (isGolden) {
    return (
      <span 
        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold tracking-wider uppercase font-mono bg-gradient-to-r from-amber-500/20 via-yellow-500/35 to-amber-600/20 text-yellow-300 border border-yellow-500/40 shadow-[0_0_12px_rgba(234,179,8,0.3)] select-none shrink-0" 
        title="Founder & President - GOLDEN VERIFIED"
      >
        <ShieldCheck className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400/10`} />
        <span>PRESIDENT</span>
      </span>
    );
  }

  return (
    <span 
      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold tracking-wider uppercase font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)] select-none shrink-0"
      title="Verified 1-Month Member"
    >
      <ShieldCheck className={`${sizeClasses[size]} text-blue-400 fill-blue-400/10`} />
      <span>VERIFIED</span>
    </span>
  );
}
