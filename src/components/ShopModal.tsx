import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Star, X, Check, Copy, ExternalLink, Calendar, Smartphone } from 'lucide-react';
import { RedemptionCode } from '../types';

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

  const pointsNeeded = 1000;
  const canRedeem = points >= pointsNeeded;

  const handleRedeem = () => {
    if (!canRedeem) return;

    // Generate GCASH Code format: GCASH-100-XXXX-XXXX
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const segment2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const codeStr = `GCASH-100-${segment1}-${segment2}`;

    const newCode: RedemptionCode = {
      id: `rc-${Date.now()}`,
      code: codeStr,
      amountGcash: 100,
      pointsUsed: pointsNeeded,
      redeemedAt: new Date().toISOString(),
      status: 'active',
    };

    onRedeem(newCode);
    setSuccessCode(codeStr);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          id="shop-modal"
          className="relative w-full max-w-2xl overflow-hidden bg-slate-900 border border-slate-850 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-slate-950 border-b border-slate-850">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100 select-none">GCash Redemption Shop</h2>
                <p className="text-xs text-slate-400">Exchange your points for real GCash rewards</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 px-4 text-slate-400 hover:text-slate-200 transition-colors bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-sm select-none"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Balance Badge Card */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/20 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">Your Wallet Balance</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">{points.toLocaleString()}</span>
                  <span className="text-sm font-semibold text-indigo-300">points</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Earn points simply by clicking <strong className="text-slate-200">+in</strong> on your favorite wallpapers!
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="w-full md:w-56 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">To target</span>
                  <span className="text-indigo-400 font-semibold">{points} / {pointsNeeded}</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300"
                    style={{ width: `${Math.min((points / pointsNeeded) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Main Offer Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              {/* Offer visual */}
              <div className="col-span-1 md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-850 bg-gradient-to-b from-transparent to-emerald-950/10">
                <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/25 mb-4 text-emerald-400">
                  <Smartphone className="w-10 h-10 animate-pulse" />
                </div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">GCash Voucher</span>
                <span className="text-3xl font-extrabold text-white mt-1">₱100.00</span>
                <span className="text-xs text-slate-500 mt-1">Instant Code Generator</span>
              </div>

              {/* Offer Description and Action */}
              <div className="col-span-1 md:col-span-7 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">₱100 GCash Load Voucher</h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    Purchase ₱100 worth of GCash codes instantly. Redemptions are stable, one-time generation keys. Need 1,000 pts per deal.
                  </p>
                  
                  <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-slate-900 border border-slate-850/60 text-xs text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
                    <span>Rate: 1 Pinned Likes (+in) = 3 Points</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 flex flex-col gap-2">
                  <button
                    disabled={!canRedeem}
                    onClick={handleRedeem}
                    id="purchase-btn"
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 select-none ${
                      canRedeem
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 cursor-pointer active:scale-98 shadow-emerald-500/10'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {canRedeem ? (
                      <>
                        <Check className="w-5 h-5 stroke-[2.5]" />
                        Redeem Code for 1,000 Points!
                      </>
                    ) : (
                      `Need ${pointsNeeded - points} more points`
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
                className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-4 shadow-xl"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span className="p-1 rounded-full bg-emerald-500 text-slate-950">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  Code Generated Successfully!
                </div>
                
                <div className="bg-slate-950 p-4 rounded-lg flex items-center justify-between border border-emerald-500/20 font-mono">
                  <span className="text-lg font-bold tracking-wider text-slate-100">{successCode}</span>
                  <button
                    onClick={() => copyToClipboard(successCode, 'success')}
                    className="p-2 hover:bg-slate-900 border border-slate-800 rounded-md text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs font-sans"
                  >
                    {copiedId === 'success' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2 text-slate-300 text-xs leading-relaxed">
                  <p className="font-semibold text-slate-200">⚠️ IMPORTANT INSTRUCTIONS TO CLAIM:</p>
                  <p>
                    Your voucher has been registered. To claim the physical ₱100 GCash transfer to your mobile number, send this generated code with your mobile cash account details directly to this verified profile:
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://www.facebook.com/usagyuunvtuber5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold select-none transition-colors border border-indigo-500/20"
                    >
                      <span>Message @usagyuunvtuber5 on Facebook</span>
                      <ExternalLink className="w-3.5 h-3.5 animate-bounce" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Redemption History List */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                Your Transactions ({redeemedCodes.length})
              </h4>

              {redeemedCodes.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-slate-850 bg-slate-950/20 text-slate-500 text-sm">
                  No vouchers claimed yet. Start using "+in" on wallpapers to collect points!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {redeemedCodes.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-850 bg-slate-950/40 hover:bg-slate-950/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-slate-200">{item.code}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-900/40 text-indigo-300 border border-indigo-500/20">
                            ₱{item.amountGcash} GCash
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Redeemed on {new Date(item.redeemedAt).toLocaleDateString()} at {new Date(item.redeemedAt).toLocaleTimeString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => copyToClipboard(item.code, item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-800 hover:bg-slate-900 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 font-medium transition-colors cursor-pointer select-none"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                        
                        <a
                          href="https://www.facebook.com/usagyuunvtuber5"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/20 transition-all cursor-pointer flex items-center justify-center"
                          title="Message this profile to claim payout"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-950 border-t border-slate-850 text-center text-slate-600 text-[10px]">
            Please take a screenshot of your generated voucher and send to Usagyuun Vtuber on Facebook. Minimum payout rules apply.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
