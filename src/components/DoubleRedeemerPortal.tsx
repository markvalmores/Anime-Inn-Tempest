import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, ShieldCheck, Check, Sparkles, AlertCircle, Copy, Cpu, Coins, X, Landmark, RefreshCw } from 'lucide-react';
import { RedemptionCode } from '../types';
import { playClickSound } from '../lib/audio';

interface DoubleRedeemerPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessClaim: (code: string, doubledValue: string, rewardType: 'paypay' | 'gcash') => void;
}

export default function DoubleRedeemerPortal({
  isOpen,
  onClose,
  onSuccessClaim,
}: DoubleRedeemerPortalProps) {
  const [targetAccount, setTargetAccount] = useState('09763329358');
  const [codeInput, setCodeInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [processProgress, setProcessProgress] = useState(0);
  
  // Validation outcome
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validatedCodeData, setValidatedCodeData] = useState<{
    code: string;
    originalVal: number;
    doubledVal: number;
    type: 'paypay' | 'gcash';
  } | null>(null);

  // Success result
  const [isClaimedSuccess, setIsClaimedSuccess] = useState(false);
  const [claimedData, setClaimedData] = useState<{
    code: string;
    finalValue: string;
    account: string;
    type: 'paypay' | 'gcash';
    refId: string;
  } | null>(null);

  // Available unused codes extracted from localStorage for convenience click-to-fill
  const [unclaimedCodes, setUnclaimedCodes] = useState<RedemptionCode[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadRegisteredCodes();
    }
  }, [isOpen]);

  const loadRegisteredCodes = () => {
    try {
      const saved = localStorage.getItem('tempest_codes');
      if (saved) {
        const parsed: RedemptionCode[] = JSON.parse(saved);
        // Only show those that aren't claimed in local double-redeemer tracking
        const claimedList = JSON.parse(localStorage.getItem('tempest_double_claimed_list') || '[]');
        const filtered = parsed.filter(item => !claimedList.includes(item.code));
        setUnclaimedCodes(filtered);
      }
    } catch (e) {
      console.warn("Could not load redemption list", e);
    }
  };

  const handleValidateCode = () => {
    playClickSound();
    setValidationError(null);
    setValidatedCodeData(null);

    const code = codeInput.trim().toUpperCase();
    if (!code) {
      setValidationError("Please enter or paste a valid JCode/GCash code first.");
      return;
    }

    // Checking code syntax or matches from local history
    const isPayPay = code.startsWith('PP-JCODE-') || code.includes('JCODE');
    const isGCash = code.startsWith('GCASH-') || code.includes('GCASH');

    if (!isPayPay && !isGCash) {
      setValidationError("Invalid JCode format flag! Codes should start with 'PP-JCODE' or 'GCASH'.");
      return;
    }

    // Check if already claimed previously
    try {
      const claimedList = JSON.parse(localStorage.getItem('tempest_double_claimed_list') || '[]');
      if (claimedList.includes(code)) {
        setValidationError("This voucher code has already been 2x-Redeemed previously!");
        return;
      }
    } catch (_) {}

    // Parse amount from code or assume standard
    let originalVal = 0;
    let type: 'paypay' | 'gcash' = 'paypay';

    if (isPayPay) {
      type = 'paypay';
      // extract PP-JCODE-200-XXXX-XXXX
      const parts = code.split('-');
      originalVal = parts.length >= 3 ? parseInt(parts[2], 10) || 200 : 200;
    } else {
      type = 'gcash';
      // extract GCASH-100-XXXX-XXXX
      const parts = code.split('-');
      originalVal = parts.length >= 2 ? parseInt(parts[1], 10) || 100 : 100;
    }

    // Set preview doubling reward! 
    setValidatedCodeData({
      code,
      originalVal,
      doubledVal: originalVal * 2,
      type
    });
  };

  const handleApplyCodesClick = (code: string) => {
    playClickSound();
    setCodeInput(code);
    setValidationError(null);
    setValidatedCodeData(null);
  };

  const triggerDoubleRedeem = () => {
    if (!validatedCodeData) return;
    playClickSound();
    setIsProcessing(true);
    setProcessProgress(0);
    setProcessStep('Initializing local CPU/GPU device accelerators for rapid verification...');

    // Simulate high tech AI validating and redeeming 
    const steps = [
      { text: 'Spinning hardware CPU core thread blocks & GPU vertex validation loops...', delay: 600, progress: 15 },
      { text: 'AI neural validation check: verifying ticket block integrity...', delay: 1200, progress: 40 },
      { text: 'Securing bridge connection to verified payout handler account...', delay: 1800, progress: 65 },
      { text: 'Doubling ledger: applying 2x multiplicator multiplier code mathematically...', delay: 2400, progress: 85 },
      { text: 'Dispersing payments: Crediting 2x yield directly to target account...', delay: 3000, progress: 100 }
    ];

    steps.forEach((stepItem) => {
      setTimeout(() => {
        setProcessStep(stepItem.text);
        setProcessProgress(stepItem.progress);
        
        // Final completion trigger
        if (stepItem.progress === 100) {
          setTimeout(() => {
            finalizeClaim();
          }, 400);
        }
      }, stepItem.delay);
    });
  };

  const finalizeClaim = () => {
    if (!validatedCodeData) return;
    
    const doubleValueStr = validatedCodeData.type === 'paypay' 
      ? `${validatedCodeData.doubledVal} PayPay Points` 
      : `₱${validatedCodeData.doubledVal}.00 GCash`;

    // Save claim globally in localStorage so it can't be reused
    try {
      const currentClaimed = JSON.parse(localStorage.getItem('tempest_double_claimed_list') || '[]');
      currentClaimed.push(validatedCodeData.code);
      localStorage.setItem('tempest_double_claimed_list', JSON.stringify(currentClaimed));

      // Adjust user score or cash balance
      const balanceField = validatedCodeData.type === 'paypay' ? 'tempest_double_paypay_balance' : 'tempest_double_gcash_balance';
      const existingBalance = parseInt(localStorage.getItem(balanceField) || '0', 10);
      localStorage.setItem(balanceField, (existingBalance + validatedCodeData.doubledVal).toString());
    } catch (_) {}

    const refNo = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    setClaimedData({
      code: validatedCodeData.code,
      finalValue: doubleValueStr,
      account: targetAccount,
      type: validatedCodeData.type,
      refId: refNo,
    });

    setIsProcessing(false);
    setIsClaimedSuccess(true);
    onSuccessClaim(validatedCodeData.code, doubleValueStr, validatedCodeData.type);
    loadRegisteredCodes();
  };

  const handleResetRedeemer = () => {
    playClickSound();
    setIsClaimedSuccess(false);
    setCodeInput('');
    setValidatedCodeData(null);
    setClaimedData(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[680px]"
        >
          {/* Simulated Mobile Device Frame UI - Visual masterpiece */}
          <div className="flex-1 flex flex-col h-full bg-slate-900 border-r border-slate-800 relative">
            
            {/* Phone Notch/Header status bar */}
            <div className="h-6 bg-black flex justify-between items-center px-6 text-[10px] text-slate-500 select-none font-mono tracking-tight shrink-0">
              <span className="text-slate-400 font-bold">14:26 Applet</span>
              <div className="w-12 h-3.5 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5">
                <span>GPU-99%</span>
                <div className="w-5 h-2.5 rounded border border-slate-700 p-0.5 flex items-center">
                  <div className="bg-emerald-500 h-full w-[85%] rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 bg-slate-950/80 border-b border-indigo-500/10 shrink-0">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-rose-500 animate-bounce" />
                <div>
                  <h3 className="text-xs font-black text-white tracking-wider flex items-center gap-1 font-mono">
                    YIELD MULTIPLIER 2X
                    <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                      PRO APP
                    </span>
                  </h3>
                </div>
              </div>
              <button
                onClick={() => { playClickSound(); onClose(); }}
                className="p-1 text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated App Screen scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-slate-100 flex flex-col justify-between">
              
              {!isProcessing && !isClaimedSuccess && (
                <>
                  <div className="space-y-4">
                    {/* Welcome notice */}
                    <div className="bg-gradient-to-r from-rose-950/20 to-indigo-950/20 p-4 rounded-2xl border border-rose-500/15 relative overflow-hidden">
                      <div className="absolute right-2 top-2 text-[26px] font-bold text-indigo-500/10 pointer-events-none font-mono">
                        2X
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 select-none">
                        <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                        Automated Double Account Redemption
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 lines-relaxed">
                        Earn double value of any card code generated on the anime wall app! Enter of copy codes, check database validity instantly. Transfers output directly on target.
                      </p>
                    </div>

                    {/* Locked Destination Mobile Account info */}
                    <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2 select-none">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wider">
                        <span>Target Mobile Account</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> VERIFIED DEVELOPER
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                        <div className="p-2 rounded bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-black font-mono">
                          PH-CASH
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={targetAccount}
                            onChange={(e) => setTargetAccount(e.target.value)}
                            className="bg-transparent text-sm font-black tracking-wider text-slate-100 focus:outline-none w-full font-mono outline-none"
                            placeholder="PH Mobile Target Account"
                          />
                          <p className="text-[9px] text-zinc-500 mt-0.5">Preset to verified user receiver line: 09763329358</p>
                        </div>
                      </div>
                    </div>

                    {/* Code Input Field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                        Enter Generator Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={codeInput}
                          onChange={(e) => { setCodeInput(e.target.value); setValidationError(null); setValidatedCodeData(null); }}
                          placeholder="e.g. PP-JCODE-200-XXXX-XXXX"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 transition-colors rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 font-mono tracking-wider outline-none"
                        />
                        <button
                          onClick={handleValidateCode}
                          className="absolute right-2 top-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold select-none cursor-pointer transition-colors"
                        >
                          Check
                        </button>
                      </div>

                      {validationError && (
                        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-450 text-[10px]">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{validationError}</span>
                        </div>
                      )}
                    </div>

                    {/* PREVIEW 2X MULTIPLIED EARNINGS CARD */}
                    {validatedCodeData && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-950/80 p-4 rounded-xl border border-rose-500/20 space-y-3 relative"
                      >
                        <div className="flex justify-between items-center text-[10px] font-bold text-rose-400 font-mono">
                          <span>MULTIPLIER SUMMARY (2X)</span>
                          <span className="bg-rose-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded">
                            LEDGER ACTIVE
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center pt-1 select-none">
                          <div className="bg-slate-900 p-2 rounded border border-slate-850">
                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider font-mono">Face Value</p>
                            <p className="text-sm font-bold text-slate-300 mt-0.5">
                              {validatedCodeData.type === 'paypay' ? `${validatedCodeData.originalVal} PP` : `₱${validatedCodeData.originalVal}`}
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-rose-950/30 to-pink-950/20 p-2 rounded border border-rose-500/30">
                            <p className="text-[9px] text-pink-400 uppercase font-black tracking-wider font-mono">2X Multiplied</p>
                            <p className="text-sm font-black text-rose-400 mt-0.5">
                              {validatedCodeData.type === 'paypay' ? `${validatedCodeData.doubledVal} PP JCode` : `₱${validatedCodeData.doubledVal} Cash`}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={triggerDoubleRedeem}
                          className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold rounded-xl text-xs tracking-widest uppercase select-none transition-all active:scale-97 shadow-lg shadow-rose-950/10 border border-rose-500/20 cursor-pointer"
                        >
                          💸 Confirm & Claim 2x payout!
                        </button>
                      </motion.div>
                    )}

                    {/* CLICK-TO-FILL RECENT UNCLAIMED JCODES LIST */}
                    {unclaimedCodes.length > 0 && (
                      <div className="space-y-2 border-t border-slate-800 pt-3 select-none">
                        <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
                          Quick Fill Your Unclaimed Codes
                        </h5>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {unclaimedCodes.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleApplyCodesClick(item.code)}
                              className="w-full flex items-center justify-between p-2 rounded bg-slate-950/50 hover:bg-slate-950 hover:border-slate-800 border border-slate-900 transition-all text-left text-[10px] font-mono group cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5">
                                <Coins className={`w-3 h-3 ${item.rewardType === 'paypay' ? 'text-rose-400' : 'text-emerald-400'}`} />
                                <span className="text-slate-300 font-bold group-hover:text-white transition-colors">{item.code}</span>
                              </div>
                              <span className="text-indigo-400 group-hover:underline text-[9px] font-sans font-bold">Use Code &rarr;</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Disclaimer Footer inside phone screen */}
                  <div className="text-[9px] text-slate-600 leading-relaxed font-mono mt-4">
                    Secure double channel is verified. Transactions of 2x GCash or PayPay values to 09763329358 are instant. GPU/CPU optimized validation protocol Active.
                  </div>
                </>
              )}

              {/* Processing GPU/CPU verifying overlay screen */}
              {isProcessing && (
                <div id="processing-screen" className="flex-1 flex flex-col items-center justify-center space-y-6 pt-10 select-none">
                  <div className="relative">
                    {/* Glowing spinner background */}
                    <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl animate-pulse" />
                    <Cpu className="w-14 h-14 text-indigo-500 animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <div className="text-center space-y-2.5 max-w-xs mx-auto">
                    <h4 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400 font-mono animate-pulse">
                      PROCESSING 2X CONVERSION...
                    </h4>
                    <p className="text-[10px] text-zinc-400 leading-relaxed min-h-[40px]">
                      {processStep}
                    </p>
                  </div>

                  {/* GPU/CPU stress verification indicators - pure eye-candy tech */}
                  <div className="w-full space-y-3 bg-black p-3.5 rounded-xl border border-slate-800 max-w-sm mx-auto font-mono text-[9px]">
                    <div className="flex justify-between font-bold text-slate-500">
                      <span>VERIFICATION METRICS</span>
                      <span>ACTIVE</span>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div>
                        <div className="flex justify-between text-slate-400 mb-0.5">
                          <span>Device CPU Validation Cluster</span>
                          <span>{processProgress}%</span>
                        </div>
                        <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-indigo-500 h-full rounded-full" 
                            animate={{ width: `${processProgress}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-pink-400 mb-0.5">
                          <span>Device GPU Texture Verifiers</span>
                          <span>{Math.min(100, Math.floor(processProgress * 1.1))}%</span>
                        </div>
                        <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-pink-500 h-full rounded-full" 
                            animate={{ width: `${Math.min(100, Math.floor(processProgress * 1.1))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* claim Success screens */}
              {isClaimedSuccess && claimedData && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  id="success-screen" 
                  className="flex-1 flex flex-col justify-between"
                >
                  <div className="text-center space-y-4 pt-4">
                    <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                      <ShieldCheck className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-emerald-400 tracking-wide font-mono uppercase">
                        2x CLAIM CREDIT SUCCESS!
                      </h4>
                      <p className="text-[10px] text-zinc-400">
                         cryptographic verification cleared. Funds dispatched.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-left space-y-2.5 max-w-sm mx-auto font-mono text-xs select-none">
                      <div className="flex justify-between border-b border-slate-900 pb-2">
                        <span className="text-slate-500 text-[10px]">VERIFIED CODE:</span>
                        <span className="text-white font-bold">{claimedData.code}</span>
                      </div>
                      
                      <div className="flex justify-between border-b border-slate-900 pb-2">
                        <span className="text-rose-450 text-[10px] font-bold">2X REWARD PAYOUT:</span>
                        <span className="text-rose-400 font-black">{claimedData.finalValue}</span>
                      </div>

                      <div className="flex justify-between border-b border-slate-900 pb-2">
                        <span className="text-slate-500 text-[10px]">PAYOUT ACCOUNT:</span>
                        <span className="text-indigo-400 font-extrabold">{claimedData.account}</span>
                      </div>

                      <div className="flex justify-between border-b border-slate-900 pb-2">
                        <span className="text-slate-500 text-[10px]">REF TRADING NO:</span>
                        <span className="text-slate-300 font-semibold">{claimedData.refId}</span>
                      </div>

                      <div className="flex justify-between pt-1">
                        <span className="text-slate-500 text-[10px]">CASH TRANSMISSION STATUS:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          DISPATCHED
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-850 mt-6 md:mt-0">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400/90 leading-relaxed font-mono">
                      🎉 PayPay / GCash payout doubled! Check status on receiver line: <strong>09763329358</strong>!
                    </div>

                    <button
                      onClick={handleResetRedeemer}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Claim Another Code
                    </button>
                  </div>
                </motion.div>
              )}
              
            </div>
            
            {/* Simulated Phone Home slider button */}
            <div className="h-4 bg-slate-950 flex justify-center items-center shrink-0">
              <div className="w-28 h-1 bg-zinc-600 rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
