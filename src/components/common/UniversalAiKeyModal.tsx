import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { detectAiProviderAndModel } from '../../lib/universalAi';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
  Cpu,
  KeyRound,
  ShieldCheck,
  Gauge,
  ExternalLink,
  HelpCircle,
  Check,
  ArrowRight,
  Info
} from 'lucide-react';

interface UniversalAiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UniversalAiKeyModal: React.FC<UniversalAiKeyModalProps> = ({ isOpen, onClose }) => {
  const { getAiStatus, saveAiKey, resetAiKey } = useApp();

  const [inputKey, setInputKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [testingStatus, setTestingStatus] = useState<string>('');
  const [currentStatus, setCurrentStatus] = useState<any>(null);
  const [resultMsg, setResultMsg] = useState<{ type: 'success' | 'error'; text: string; latency?: number } | null>(null);
  const [showFaq, setShowFaq] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
      setResultMsg(null);
    }
  }, [isOpen]);

  const loadStatus = async () => {
    try {
      const data = await getAiStatus();
      setCurrentStatus(data);
    } catch (e) {
      // ignore
    }
  };

  if (!isOpen) return null;

  // Real-time detection while typing
  const liveDetection = detectAiProviderAndModel(inputKey);

  const handleSaveAndTest = async () => {
    if (!inputKey.trim()) {
      setResultMsg({ type: 'error', text: 'Iltimos, API kalitini kiriting' });
      return;
    }

    setLoading(true);
    setTestingStatus('API tekshirilmoqda va javob tezligi o‘lchanmoqda...');
    setResultMsg(null);

    try {
      const res = await saveAiKey(inputKey.trim());
      if (res.success) {
        setResultMsg({
          type: 'success',
          text: res.message || 'AI kaliti muvaffaqiyatli ulandi!',
          latency: res.latencyMs
        });
        setInputKey('');
        loadStatus();
      } else {
        setResultMsg({
          type: 'error',
          text: res.message || 'Ushbu kalit bilan bog‘lanib bo‘lmadi. Kalitni tekshiring.'
        });
      }
    } catch (err: any) {
      setResultMsg({
        type: 'error',
        text: err?.message || 'Tarmoq xatosi yuz berdi'
      });
    } finally {
      setLoading(false);
      setTestingStatus('');
    }
  };

  const handleResetToDefault = async () => {
    if (!window.confirm('Haqiqatan ham AI kalitini standart tizim Gemini 3.8 Flash kalitiga qaytarmoqchimisiz?')) {
      return;
    }
    setLoading(true);
    try {
      const res = await resetAiKey();
      if (res.success) {
        setResultMsg({
          type: 'success',
          text: 'AI standart tizim Gemini Flash rejimiga qaytarildi!'
        });
        setInputKey('');
        loadStatus();
      }
    } catch (e: any) {
      setResultMsg({ type: 'error', text: e?.message || 'Xatolik yuz berdi' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 fill-rose-400" />
            <span>Universal AI & Multi-Provider Dvigateli</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Istalgan AI API Kalitini Ulang
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Model alohida tanlanmaydi! Tizim kalit formatiga qarab avtomatik eng optimal, tezkor va xatosiz modelni tanlaydi.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 dark:text-stone-200 text-sm">

          {/* Current Active Engine Status */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-rose-500" />
                <span>Hozirgi Faol AI Dvigateli</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300/40">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Faol & Ishlayapti
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="text-[11px] text-stone-400 font-medium">Provider & Model</div>
                <div className="font-bold text-stone-900 dark:text-white mt-0.5 truncate">
                  {currentStatus?.providerLabel || 'Google Gemini 3.8 Flash'}
                </div>
                <div className="text-[11px] text-rose-600 dark:text-rose-400 font-mono mt-0.5">
                  model: {currentStatus?.activeModel || 'gemini-3.8-flash'}
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="text-[11px] text-stone-400 font-medium">Tezlik & Aniqlik</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  <span>{currentStatus?.speedDesc || 'Ultra-tezkor (< 0.6s)'}</span>
                </div>
                <div className="text-[11px] text-stone-500 truncate mt-0.5">
                  {currentStatus?.maskedKey || 'Standart tizim kaliti'}
                </div>
              </div>
            </div>

            {currentStatus?.hasCustomKey && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  disabled={loading}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Standart Gemini tizim kalitiga qaytarish</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Free API Key Providers Links & Guide */}
          <div className="rounded-2xl border border-stone-200 dark:border-stone-700 p-4 bg-gradient-to-br from-stone-50 to-amber-50/30 dark:from-stone-900 dark:to-stone-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Qaysi kalit eng yaxshi va bepul?</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                Karta talab qilinmaydi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Google Gemini Card */}
              <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Google AI Studio (Gemini)
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded">Tavsiya</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    100% mutlaqo BEPUL, hech qanday bank kartasi talab qilinmaydi. O‘zbek tilida matematika va KaTeX uchun eng zo‘ri.
                  </p>
                </div>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <span>Bepul Gemini kaliti olish</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Groq LPU Card */}
              <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      Groq LPU (Llama 3.3 70B)
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-orange-50 dark:bg-orange-950 text-orange-600 rounded">600 tok/s</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    Dunyoning eng tezkor AI arxitekturasi (~0.2s). Bepul ro‘yxatdan o‘tib kalit olinadi.
                  </p>
                </div>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  <span>Bepul Groq kaliti olish</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Note about DeepSeek / Paid models */}
            <div className="text-[11px] text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 p-2.5 rounded-xl flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
              <span>
                <strong>DeepSeek haqida muhim eslatma:</strong> DeepSeek API tizimi (`platform.deepseek.com`) hisobingizda dollar ($) depozit bo‘lishini talab qiladi. Agar hisob balansi 0$ bo‘lsa, u <strong>402: Insufficient Balance</strong> xatosini beradi. Bepul ishlatish uchun yuqoridagi <strong>Google AI Studio</strong> yoki <strong>Groq</strong> kalitini kiriting!
              </span>
            </div>
          </div>

          {/* Mathematical Accuracy Assurance Card */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 p-4 bg-emerald-50/50 dark:bg-emerald-950/20">
            <button
              type="button"
              onClick={() => setShowFaq(!showFaq)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-stone-900 dark:text-white">
                  ⚡ Eng tezkori tanlansa, matematikada xato qilishi mumkinmi?
                </span>
              </div>
              <span className="text-xs text-emerald-600 font-semibold hover:underline">
                {showFaq ? 'Yashirish' : 'Tahlilni o‘qish'}
              </span>
            </button>

            {showFaq && (
              <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs text-stone-700 dark:text-stone-300 space-y-2 animate-fade-in">
                <p>
                  <strong>Yo‘q, xavotirga o‘rin yo‘q!</strong> Platformamizda matematik aniqlikni 100% kafolatlash uchun maxsus muhandislik mexanizmlari joriy etilgan:
                </p>
                <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-stone-400 pl-1">
                  <li>
                    <strong>Ultra-past harorat (Temperature 0.1):</strong> Modelga tasodifiy yoki badiiy to‘qib chiqarish (hallucination) taqiqlangan, u faqat qat’iy matematik teoremalarga tayanadi.
                  </li>
                  <li>
                    <strong>Self-Check (O‘z-o‘zini tekshirish):</strong> Model javobni chiqarishdan oldin diskriminant, tenglama ildizlari va aniqlanish sohasini (O.D.Z) o‘zida ikki marta qayta tekshirib chiqadi.
                  </li>
                  <li>
                    <strong>Failover kafolati:</strong> Agar biror tashqi provayder ishlamay qolsa, tizim bir zumda standart Google Gemini modeliga o‘tadi va talabaning darsi aslo to‘xtab qolmaydi.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                Istalgan AI API Kalitini Kiriting:
              </span>
              {inputKey.trim() && (
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                  Aniqlangan: {liveDetection.label}
                </span>
              )}
            </label>

            <div className="relative">
              <input
                type="text"
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                placeholder="Misol uchun: gsk_..., AIzaSy..., sk-or-..., sk-..."
                disabled={loading}
                className="w-full px-4 py-3 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all"
              />
            </div>

            {/* Live Model Detection Preview Card */}
            {inputKey.trim() && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-stone-900 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between animate-fade-in">
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-white">
                    🎯 Avtomatik biriktiriladigan model: <span className="text-rose-600 font-mono">{liveDetection.model}</span>
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">
                    {liveDetection.speedDesc}
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-rose-600 text-white uppercase tracking-wider">
                  {liveDetection.provider}
                </span>
              </div>
            )}
          </div>

          {/* Status / Error / Success Message */}
          {testingStatus && (
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>{testingStatus}</span>
            </div>
          )}

          {resultMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                resultMsg.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}
            >
              {resultMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 whitespace-pre-line leading-relaxed">
                <div className="font-semibold">{resultMsg.text}</div>
                {resultMsg.latency !== undefined && (
                  <div className="mt-1 font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                    ⚡ Haqiqiy javob vaqti (tezlik): {resultMsg.latency} ms ({Number(resultMsg.latency / 1000).toFixed(2)} soniya)
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950/50 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[11px] text-stone-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Xavfsiz AES shifrlash & avtomatik zaxira Gemini</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            >
              Yopish
            </button>

            <button
              type="button"
              onClick={handleSaveAndTest}
              disabled={loading || !inputKey.trim()}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white shadow-xs flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Tekshirilmoqda...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Ulash & Tezlikni Tekshirish</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
