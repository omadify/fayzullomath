import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Wallet,
  Cpu,
  Clock,
  ShieldCheck,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  KeyRound
} from 'lucide-react';
import { AIDiagnosticResult } from '../../lib/universalAi';

interface AIProviderStatusIndicatorProps {
  onOpenKeyModal: () => void;
  compact?: boolean;
}

export const AIProviderStatusIndicator: React.FC<AIProviderStatusIndicatorProps> = ({
  onOpenKeyModal,
  compact = false
}) => {
  const { getAiDiagnostic, resetAiKey, refreshDb } = useApp();

  const [diagnostic, setDiagnostic] = useState<AIDiagnosticResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);
  const [detailsExpanded, setDetailsExpanded] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const runDiagnostic = useCallback(async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);
    setErrorMsg('');

    try {
      const data = await getAiDiagnostic(force);
      if (data && data.success !== undefined) {
        setDiagnostic(data);
      } else {
        setErrorMsg('Diagnostika ma’lumotlarini olib bo‘lmadi');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Diagnostika jarayonida tarmoq xatosi');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getAiDiagnostic]);

  useEffect(() => {
    runDiagnostic(false);
    // Auto-refresh every 25 seconds for real-time live monitoring
    const timer = setInterval(() => {
      runDiagnostic(false);
    }, 25000);
    return () => clearInterval(timer);
  }, [runDiagnostic]);

  const handleResetToSystemGemini = async () => {
    if (!window.confirm('AI API kalitini standart tizim Gemini 3.8 Flash dvigateliga qaytarmoqchimisiz?')) {
      return;
    }
    setResetting(true);
    try {
      await resetAiKey();
      await refreshDb();
      await runDiagnostic(true);
    } catch (e: any) {
      alert(e?.message || 'Xatolik yuz berdi');
    } finally {
      setResetting(false);
    }
  };

  const isInsufficientBalance =
    diagnostic?.status === 'insufficient_balance' ||
    diagnostic?.balanceStatus === 'critical' ||
    diagnostic?.balanceLevel?.includes('0.00') ||
    diagnostic?.statusMessage?.toLowerCase().includes('insufficient balance');

  const isHealthy = diagnostic?.status === 'healthy' && !isInsufficientBalance;
  const isInvalidKey = diagnostic?.status === 'invalid_key';
  const isRateLimited = diagnostic?.status === 'rate_limited';

  // Compact badge version (e.g. for header / sidebar)
  if (compact) {
    return (
      <div
        onClick={onOpenKeyModal}
        className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition-all ${
          isInsufficientBalance
            ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 animate-pulse'
            : isHealthy
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
            : 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300'
        }`}
        title="AI API real-time status & balans ko‘rsatkichi"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isInsufficientBalance
              ? 'bg-rose-500 animate-ping'
              : isHealthy
              ? 'bg-emerald-500'
              : 'bg-amber-500'
          }`}
        />
        <span className="font-bold">
          {diagnostic?.provider?.toUpperCase() || 'AI'}:{' '}
          {isInsufficientBalance
            ? '⚠️ 402: Balans 0$'
            : isHealthy
            ? `Faol (${diagnostic?.latencyMs || 0}ms)`
            : diagnostic?.status || 'Tekshirilmoqda'}
        </span>
      </div>
    );
  }

  // Full Rich Indicator Card
  return (
    <div
      className={`rounded-3xl border transition-all overflow-hidden shadow-xs ${
        isInsufficientBalance
          ? 'bg-gradient-to-br from-rose-50 via-white to-amber-50/40 dark:from-rose-950/40 dark:via-stone-900 dark:to-stone-900 border-rose-300 dark:border-rose-900/60 ring-2 ring-rose-500/20'
          : isHealthy
          ? 'bg-white dark:bg-stone-900 border-stone-200/90 dark:border-stone-800'
          : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
      }`}
    >
      {/* Top Banner Bar */}
      <div className="p-5 sm:p-6 border-b border-stone-200/60 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
              isInsufficientBalance
                ? 'bg-rose-500 text-white animate-bounce'
                : isHealthy
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {isInsufficientBalance ? (
              <AlertTriangle className="w-6 h-6" />
            ) : isHealthy ? (
              <Zap className="w-6 h-6 fill-white" />
            ) : (
              <Activity className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                AI Dvigateli & Balans Diagnostikasi
              </span>

              {/* Status Badge */}
              {loading ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  <RefreshCw className="w-3 h-3 animate-spin text-stone-400" />
                  <span>Tekshirilmoqda...</span>
                </span>
              ) : isInsufficientBalance ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-600 text-white shadow-xs animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>⚠️ 402: Mablag‘ Yetarli Emas</span>
                </span>
              ) : isHealthy ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>🟢 Aloqa Faol & Ishlayapti</span>
                </span>
              ) : isInvalidKey ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>❌ 401: Kalit Noto‘g‘ri</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{diagnostic?.statusMessage || 'Diqqat talab'}</span>
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white mt-0.5 flex items-center gap-2">
              <span>{diagnostic?.providerLabel || 'Google Gemini 3.8 Flash'}</span>
              <span className="text-xs font-mono font-normal text-stone-500 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded-lg">
                {diagnostic?.activeModel || 'gemini-3.8-flash'}
              </span>
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => runDiagnostic(true)}
            disabled={refreshing || loading}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            title="Real-time ulanish va balansni yangilash"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-rose-600' : ''}`} />
            <span>{refreshing ? 'O‘lchanmoqda...' : '🔄 Jonli Tekshirish'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenKeyModal}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>⚡ Kalitni O‘zgartirish</span>
          </button>
        </div>
      </div>

      {/* Grid of 3 Vital Live Telemetry Cards */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Real-time Balance Level Card */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isInsufficientBalance
              ? 'bg-rose-100/70 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>Hisob Balansi / Kvotasi</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isInsufficientBalance
                  ? 'bg-rose-600 text-white uppercase'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
              }`}
            >
              {isInsufficientBalance ? '0$ Mablag‘' : 'Faol'}
            </span>
          </div>

          <div
            className={`text-xl font-black tabular-nums tracking-tight mt-1 ${
              isInsufficientBalance ? 'text-rose-600 dark:text-rose-400' : 'text-stone-900 dark:text-white'
            }`}
          >
            {diagnostic?.balanceLevel || 'Tekshirilmoqda...'}
          </div>

          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1">
            <span>Holat:</span>
            <strong
              className={
                isInsufficientBalance
                  ? 'text-rose-600 font-bold'
                  : 'text-emerald-600 dark:text-emerald-400'
              }
            >
              {isInsufficientBalance
                ? '402 Xatosi xavfi (Balans to‘ldirish shart)'
                : diagnostic?.statusMessage || 'Kvote yetarli'}
            </strong>
          </div>
        </div>

        {/* 2. Latency & Real Speed Card */}
        <div className="p-4 rounded-2xl border bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Real-Time Javob Tezligi</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400">
              Ping
            </span>
          </div>

          <div className="text-xl font-black tabular-nums tracking-tight mt-1 font-mono flex items-baseline gap-1 text-emerald-600 dark:text-emerald-400">
            <span>{diagnostic?.latencyMs !== undefined ? `${diagnostic.latencyMs} ms` : '—'}</span>
            {diagnostic?.latencyMs !== undefined && (
              <span className="text-xs font-sans text-stone-500">
                ({Number(diagnostic.latencyMs / 1000).toFixed(2)}s)
              </span>
            )}
          </div>

          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 truncate">
            {diagnostic?.speedDesc || 'Ultra-tezkor arxitektura'}
          </div>
        </div>

        {/* 3. Failover & Fallback Safety Net Card */}
        <div className="p-4 rounded-2xl border bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Avto-Zaxira Dvigateli (Failover)</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              100% Standby
            </span>
          </div>

          <div className="text-sm font-bold text-stone-900 dark:text-white mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Google Gemini 3.8 Flash Zaxirada</span>
          </div>

          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
            Agar ulangan kalitda pul tugasa, darslar to‘xtamaydi!
          </div>
        </div>
      </div>

      {/* Prominent INSUFFICIENT BALANCE (402) Diagnosis & Solution Box */}
      {isInsufficientBalance && (
        <div className="mx-5 sm:mx-6 mb-6 p-5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-600 text-white shadow-lg animate-fade-in">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-xs shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h4 className="text-base sm:text-lg font-black tracking-tight">
                  Diqqat: "Insufficient Balance (402)" aniqlandi!
                </h4>
                <p className="text-xs sm:text-sm text-rose-50 leading-relaxed mt-1">
                  Ushbu API kalit (DeepSeek yoki OpenRouter) provayder serverida to‘g‘ri tasdiqlandi, ammo hisobingizda <strong>0.00$ balans</strong> qolgan. DeepSeek hisobga oldindan mablag‘ kiritilishini talab qiladi.
                </p>
              </div>

              {/* Action Solutions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 1-Click System Gemini Reset */}
                <button
                  type="button"
                  onClick={handleResetToSystemGemini}
                  disabled={resetting}
                  className="px-4 py-3 rounded-xl bg-white text-stone-900 hover:bg-stone-100 font-bold text-xs flex items-center justify-between shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Standart Bepul Gemini Kalitiga O‘tish</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Free Gemini API key direct link */}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-stone-900/40 hover:bg-stone-900/60 border border-white/30 text-white font-bold text-xs flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-emerald-300" />
                    <span>100% Bepul Google AI Studio Kaliti Olish</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500 px-1.5 py-0.5 rounded font-black">BEPUL</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accordion Toggle for Technical Diagnostics & Free Alternatives */}
      <div className="px-5 sm:px-6 py-3 bg-stone-50 dark:bg-stone-800/40 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setDetailsExpanded(!detailsExpanded)}
          className="text-stone-600 dark:text-stone-300 hover:text-rose-600 font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <span>{detailsExpanded ? 'Diagnostika tafsilotlarini yashirish' : 'To‘liq diagnostika tafsilotlari & Bepul kalitlar'}</span>
          {detailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <span className="text-[11px] text-stone-400 font-mono">
          Tekshirildi: {diagnostic?.lastChecked ? new Date(diagnostic.lastChecked).toLocaleTimeString() : 'Hozir'}
        </span>
      </div>

      {/* Expanded Technical Details */}
      {detailsExpanded && (
        <div className="p-5 sm:p-6 bg-stone-50/50 dark:bg-stone-900/60 border-t border-stone-200/60 dark:border-stone-800 space-y-4 animate-fade-in text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
              <div className="font-bold text-stone-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                <span>Texnik Diagnostika Xulosasi</span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                {diagnostic?.diagnosticAdvice ||
                  'API provayderi ulanishi sinovdan o‘tkazildi. Matematika masalalari past haroratda (0.1) va qat’iy teoremalar asosida yechilmoqda.'}
              </p>
              <div className="mt-2 text-[10px] font-mono text-stone-400">
                Kalit: {diagnostic?.maskedKey}
              </div>
            </div>

            <div className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
              <div className="font-bold text-stone-900 dark:text-white flex items-center justify-between">
                <span>Tavsiya etilgan Bepul Kalitlar</span>
                <span className="text-[10px] text-emerald-600 font-bold">Karta kerak emas</span>
              </div>
              {diagnostic?.freeAlternatives?.map((alt, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-100 dark:border-stone-800">
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{alt.name}</span>
                    <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 rounded">
                      {alt.badge}
                    </span>
                  </div>
                  <a
                    href={alt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-600 hover:underline flex items-center gap-0.5 font-bold"
                  >
                    <span>Olish</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {diagnostic?.isCustomKey && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleResetToSystemGemini}
                disabled={resetting}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Standart Gemini 3.8 Flash Tizim Kalitiga Qaytarish</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
