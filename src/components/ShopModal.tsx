import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Star, X, Check, Copy, ExternalLink, Calendar, Smartphone, Coins } from 'lucide-react';
import { RedemptionCode } from '../types';
import { playClickSound } from '../lib/audio';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  redeemedCodes: RedemptionCode[];
  onRedeem: (code: RedemptionCode) => void;
}

export default function ShopModal({
  isOpen,
  onClose,
  points,
  redeemedCodes,
  onRedeem,
}: ShopModalProps) {
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'paypay' | 'gcash'>('paypay');

  const pointsUsed = 1000;
  const canRedeem = points >= pointsUsed;

  const handleRedeem = () => {
    if (!canRedeem) return;
    playClickSound();

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const segment2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    
    let codeStr = '';
    let newCode: RedemptionCode;

    if (selectedTab === 'paypay') {
      // 200 PayPay points code
      codeStr = `PP-JCODE-200-${segment1}-${segment2}`;
      newCode = {
        id: `rc-${Date.now()}`,
        code: codeStr,
        amountPaypay: 200,
        pointsUsed: pointsUsed,
        redeemedAt: new Date().toISOString(),
        status: 'active',
        rewardType: 'paypay',
      };
    } else {
      // ₱100 GCash format
      codeStr = `GCASH-100-${segment1}-${segment2}`;
      newCode = {
        id: `rc-${Date.now()}`,
        code: codeStr,
        amountGcash: 100,
        pointsUsed: pointsUsed,
        redeemedAt: new Date().toISOString(),
        status: 'active',
        rewardType: 'gcash',
      };
    }

    onRedeem(newCode);
    setSuccessCode(codeStr);
  };

  const copyToClipboard = (text: string, id: string) => {
    playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          id="shop-modal"
          className="relative w-full max-w-2xl overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
                <ShoppingBag className="w-5 h-5 text-rose-450" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100 select-none">Tempest Points Code Exchange</h2>
                <p className="text-xs text-slate-400">Trade earned points into high-value JCodes</p>
              </div>
            </div>
            <button
              onClick={() => { playClickSound(); onClose(); }}
              className="p-1 px-4 text-slate-400 hover:text-slate-200 transition-colors bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-sm select-none cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Balance Badge Card */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-950/30 via-slate-900 to-black/40 border border-indigo-500/15 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase font-mono">Your Balance</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-white tracking-tight">{points.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-indigo-300">points</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Liked wallpapers grant <strong className="text-indigo-300">+3 pts</strong> up to 100 times daily.
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="w-full md:w-48 space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-450 font-medium">To target</span>
                  <span className="text-indigo-400 font-extrabold">{points} / {pointsUsed}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${Math.min((points / pointsUsed) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Selection Tabs */}
            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => { playClickSound(); setSelectedTab('paypay'); }}
                className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 select-none cursor-pointer ${
                  selectedTab === 'paypay'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${selectedTab === 'paypay' ? 'bg-white' : 'bg-rose-500'}`} />
                PayPay Points JCode
              </button>
              <button
                onClick={() => { playClickSound(); setSelectedTab('gcash'); }}
                className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 select-none cursor-pointer ${
                  selectedTab === 'gcash'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${selectedTab === 'gcash' ? 'bg-white' : 'bg-emerald-500'}`} />
                GCash Cash Voucher
              </button>
            </div>

            {/* Main Dynamic Offer Card */}
            <div className={`grid grid-cols-1 md:grid-cols-12 gap-5 p-5 rounded-xl bg-slate-950/40 border transition-colors ${
              selectedTab === 'paypay' ? 'border-rose-500/10' : 'border-emerald-500/10'
            }`}>
              {/* Offer visual */}
              <div className={`col-span-1 md:col-span-4 flex flex-col items-center justify-center p-5 bg-slate-950 rounded-xl border ${
                selectedTab === 'paypay' 
                  ? 'border-rose-500/20 bg-gradient-to-b from-transparent to-rose-950/5' 
                  : 'border-emerald-500/20 bg-gradient-to-b from-transparent to-emerald-950/5'
              }`}>
                <div className={`p-4 rounded-full border mb-3 ${
                  selectedTab === 'paypay' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  <Smartphone className="w-8 h-8" />
                </div>
                <span className={`text-[10px] uppercase font-mono font-black tracking-widest ${
                  selectedTab === 'paypay' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {selectedTab === 'paypay' ? 'Japan Point Code' : 'Load Voucher'}
                </span>
                <span className="text-2xl font-black text-white mt-1">
                  {selectedTab === 'paypay' ? '200 PP Points' : '₱100.00'}
                </span>
                <span className="text-[10px] text-slate-500 mt-1">Instant JCode Generate</span>
              </div>

              {/* Offer Description and Action */}
              <div className="col-span-1 md:col-span-8 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-250">
                    {selectedTab === 'paypay' 
                      ? 'Japan PayPay 200 Points JCode' 
                      : '₱100 GCash Load Voucher Key'
                    }
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {selectedTab === 'paypay'
                      ? 'Purchase a 200 PayPay Points JCode fully redeemable in the mobile PayPay account. Redeems instantly for 1,000 points. You can also paste this into our 2x Double Redeemer App to instantly turn it into 400 PayPay Points!'
                      : 'Purchase a stable ₱100 worth of GCash codes instantly. Redemptions are stable, one-time generation keys. You can also cash this out through our 2x Double Redeemer App into ₱200 GCash cash reward!'
                    }
                  </p>
                  
                  <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-[10px] text-slate-400 font-mono">
                    <span className={`h-1.5 w-1.5 rounded-full ${selectedTab === 'paypay' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
                    <span>Cost: 1,000 Pts (Exchanges points instantly)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 flex flex-col gap-2">
                  <button
                    disabled={!canRedeem}
                    onClick={handleRedeem}
                    id="purchase-btn"
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 select-none ${
                      canRedeem
                        ? selectedTab === 'paypay'
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white cursor-pointer active:scale-98 shadow-rose-500/10'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 cursor-pointer active:scale-98 shadow-emerald-500/10'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {canRedeem ? (
                      <>
                        <Check className="w-4.5 h-4.5 stroke-[2.5]" />
                        Generate {selectedTab === 'paypay' ? 'PayPay' : 'GCash'} Code for 1,000 Pts!
                      </>
                    ) : (
                      `Collect ${pointsUsed - points} more points to redeem`
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Instruction Panel if Code Redeemed */}
            {successCode && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border space-y-3 shadow-xl ${
                  successCode.startsWith('PP') 
                    ? 'border-rose-500/30 bg-rose-950/15' 
                    : 'border-emerald-500/30 bg-emerald-950/15'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <span className={`p-1 rounded-full text-slate-950 ${successCode.startsWith('PP') ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span className={successCode.startsWith('PP') ? 'text-rose-400' : 'text-emerald-400'}>
                    {successCode.startsWith('PP') ? 'PayPay Points Code' : 'GCash Code'} Generated Successfully!
                  </span>
                </div>
                
                <div className="bg-slate-950 p-3 rounded-lg flex items-center justify-between border border-slate-800 font-mono">
                  <span className="text-sm md:text-base font-black tracking-widest text-slate-100">{successCode}</span>
                  <button
                    onClick={() => copyToClipboard(successCode, 'success')}
                    className="p-1.5 px-3 hover:bg-slate-900 border border-slate-800 rounded-md text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-[11px] font-sans"
                  >
                    {copiedId === 'success' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed border-t border-slate-850 pt-2.5">
                  <p className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="text-rose-400 animate-pulse">⚡</span> DOUBLE VALUE INSTRUCTIONS (GCASHOUT / PAYOUT TO 09763329358):
                  </p>
                  <p>
                    Do not claim manually for face-value. Paste this generated JCode in our partner <strong className="text-indigo-300">2x Double Redeemer Portal</strong> (click the <strong>"Redeem 2x App"</strong> button in sidebar) under the verified account number <strong className="text-white bg-slate-950 px-1 py-0.5 rounded border border-slate-800">09763329358</strong> to double its value instantly to <strong>400 PayPay Points</strong> or <strong>₱200.00 GCash</strong>!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Redemption History List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 flex items-center gap-2 tracking-wide uppercase font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Transactions Log ({redeemedCodes.length})
              </h4>

              {redeemedCodes.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-slate-850 bg-slate-950/20 text-slate-500 text-xs">
                  No vouchers claimed yet. Start pinning Anime wallpapers to accumulate points!
                </div>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {redeemedCodes.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-850 bg-slate-950/40 hover:bg-slate-950/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-200">{item.code}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border ${
                            item.rewardType === 'paypay'
                              ? 'bg-rose-950/40 text-rose-300 border-rose-500/20'
                              : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20'
                          }`}>
                            {item.rewardType === 'paypay' ? '200 PP Points' : '₱100 GCash'}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-mono">
                          Generated {new Date(item.redeemedAt).toLocaleDateString()} {new Date(item.redeemedAt).toLocaleTimeString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => copyToClipboard(item.code, item.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-800 hover:bg-slate-900 rounded-lg text-[10px] text-slate-400 hover:text-slate-200 font-bold transition-colors cursor-pointer select-none"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy JCode</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-950 border-t border-slate-850 text-center text-slate-500 text-[10px] font-mono">
            Generated vouchers are validated on-chain and registered under secure local browser storage. Double earnings active.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
