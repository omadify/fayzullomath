import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  Wallet,
  Send,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  CreditCard,
  QrCode,
  DollarSign,
  Upload,
  RefreshCw,
  FileText
} from 'lucide-react';
import { DepositStatusBadge } from '../common/DepositStatusBadge';
import { supabase } from '../../lib/supabase';

export const StudentWalletDepositView: React.FC = () => {
  const { currentUser, db, requestDeposit, refreshDb } = useApp();
  const [activeMethod, setActiveMethod] = useState<'card' | 'bot'>('card');
  const [amount, setAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [telegramUser, setTelegramUser] = useState<string>(currentUser?.telegramUsername || '');
  const [receiptBase64, setReceiptBase64] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [successModal, setSuccessModal] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const [supabasePayments, setSupabasePayments] = useState<any[]>([]);

  // Fetch payments directly from Supabase payments table
  const fetchSupabasePayments = async () => {
    if (!currentUser) return;
    const userEmail = (
      currentUser.email ||
      (currentUser.phone ? `${currentUser.phone.replace(/\D/g, '')}@fayzullo-math.uz` : `${currentUser.id}@fayzullo-math.uz`)
    ).toLowerCase();

    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && Array.isArray(data)) {
        // Filter rows matching this user's email or recent ones
        const userRows = data.filter(
          p => !p.user_email || p.user_email.toLowerCase() === userEmail || p.user_email.includes(currentUser.phone?.replace(/\D/g, '') || 'xyz')
        );
        setSupabasePayments(userRows);
      }
    } catch (err) {
      console.warn('Supabase payments query notice:', err);
    }
  };

  // Auto-poll every 3.5s so when admin approves deposit, balance updates immediately
  useEffect(() => {
    refreshDb();
    fetchSupabasePayments();
    const interval = setInterval(() => {
      refreshDb();
      fetchSupabasePayments();
    }, 3500);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshDb(), fetchSupabasePayments()]);
    setTimeout(() => setRefreshing(false), 600);
  };

  const botSettings = db.telegramBotSettings || {
    botUsername: 'fayzullo_matematika_bot',
    botName: 'Fayzullo Matematika To‘lov Boti',
    isActive: true,
    minDepositAmount: 10000
  };

  const CARD_NUMBER = '9860 3501 0244 5678';
  const CARD_HOLDER = 'Fayzullo Omanullayev';
  const CARD_BANK = 'Uzcard / Humo / Click / Payme';

  const presetAmounts = [50000, 100000, 200000, 500000, 1000000];

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
    if (val) {
      setAmount(Number(val));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || amount < (botSettings.minDepositAmount || 10000)) return;

    setLoading(true);
    try {
      let uploadedReceiptUrl = '';
      if (receiptBase64) {
        try {
          const upRes = await api.uploadAsset(receiptBase64, `chek_${currentUser.id}_${Date.now()}.png`);
          if (upRes.success && upRes.url) {
            uploadedReceiptUrl = upRes.url;
          }
        } catch (upErr) {
          console.warn('Chek yuklashda xatolik, davom etilmoqda', upErr);
        }
      }

      const userEmail = (
        currentUser.email ||
        (currentUser.phone ? `${currentUser.phone.replace(/\D/g, '')}@fayzullo-math.uz` : `${currentUser.id}@fayzullo-math.uz`)
      ).toLowerCase();

      // 1. Insert directly into Supabase payments table
      try {
        const { data: supData, error: supErr } = await supabase
          .from('payments')
          .insert([
            {
              user_email: userEmail,
              amount: Number(amount),
              receipt_url: uploadedReceiptUrl || '',
              status: 'pending'
            }
          ])
          .select();

        if (supData && supData[0]) {
          console.log('✅ Supabase payments jadvaliga to‘lov yozildi:', supData[0]);
        } else if (supErr) {
          console.warn('Supabase payments insert notice:', supErr.message);
        }
      } catch (sErr) {
        console.warn('Supabase payments insert exception:', sErr);
      }

      // 2. Also register in local system and notify creator
      const res = await requestDeposit(
        amount,
        telegramUser || currentUser.telegramUsername,
        activeMethod,
        uploadedReceiptUrl,
        activeMethod === 'card' ? CARD_NUMBER : undefined,
        activeMethod === 'card' ? 'Karta orqali to‘lov cheki bilan yuborildi' : undefined
      );

      setSuccessModal({
        amount,
        code: res?.transaction?.paymentCode || `DEP-${Math.floor(10000 + Math.random() * 90000)}`,
        botUsername: botSettings.botUsername,
        method: activeMethod,
        hasReceipt: !!uploadedReceiptUrl
      });
      setReceiptBase64('');
      setReceiptFileName('');
      await Promise.all([refreshDb(), fetchSupabasePayments()]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyCard = () => {
    navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g, ''));
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  // Combine Supabase payments and local deposit transactions
  const combinedDepositsMap = new Map<string, any>();

  // 1. Add Supabase payments first (live from Supabase payments table)
  supabasePayments.forEach(p => {
    combinedDepositsMap.set(p.id, {
      id: p.id,
      userId: currentUser?.id,
      userName: `${currentUser?.name} ${currentUser?.surname || ''}`.trim(),
      userPhone: currentUser?.phone || '',
      amount: Number(p.amount) || 0,
      status: p.status || 'pending',
      method: p.receipt_url ? 'card' : 'telegram_bot',
      paymentCode: `DEP-${p.id.slice(0, 8).toUpperCase()}`,
      receiptUrl: p.receipt_url || '',
      createdAt: p.created_at || new Date().toISOString(),
      isSupabase: true
    });
  });

  // 2. Add local deposits
  (db.depositTransactions || [])
    .filter(tx => tx.userId === currentUser?.id || (currentUser?.phone && tx.userPhone === currentUser.phone))
    .forEach(tx => {
      if (!combinedDepositsMap.has(tx.id)) {
        combinedDepositsMap.set(tx.id, tx);
      }
    });

  const myDeposits = Array.from(combinedDepositsMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const cleanTg = (telegramUser || currentUser?.telegramUsername || '').replace(/^@/, '');
  const tgBotLink = `https://t.me/${botSettings.botUsername}?start=dep_${currentUser?.id || 'demo'}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Wallet className="w-3.5 h-3.5" />
            <span>💰 Shaxsiy Hisob & Hamyon</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            Balansni To‘ldirish & Depozit Boshqaruvi
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Hisobingizni Bank kartasi (Click, Payme, Uzum) yoki Telegram bot orqali to‘ldiring. To‘lovlar admin tomonidan darhol tasdiqlanadi.
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-2 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-500' : ''}`} />
          <span>{refreshing ? 'Yangilanmoqda...' : '🔄 Balansni Yangilash'}</span>
        </button>
      </div>

      {/* Top 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Balance Showcase */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-stone-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Wallet className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-emerald-200 uppercase">
                Mavjud Asosiy Balans
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                {currentUser?.vipTier && currentUser.vipTier !== 'none' && currentUser.vipTier !== 'free' ? `${currentUser.vipTier.toUpperCase()} VIP` : 'ODDIY'}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-black tracking-tight tabular-nums">
                {(currentUser?.balance || 0).toLocaleString()} <span className="text-lg font-bold">so‘m</span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-1">
                Kurslar, VIP rejalar va maxsus testlar uchun ishlatiladi
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-emerald-100 relative z-10">
            <span>ID: <strong className="font-mono text-white">{currentUser?.id?.slice(0, 10)}</strong></span>
            <span>Tel: <strong className="font-mono text-white">{currentUser?.phone}</strong></span>
          </div>
        </div>

        {/* Card 2: Bank Card for Quick Transfer */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                Rasmiy Bank Kartasi
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                Click / Payme
              </span>
            </div>

            <div className="p-3.5 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Karta raqami:</div>
                <button
                  type="button"
                  onClick={copyCard}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedCard ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCard ? 'Nusxalandi!' : 'Nusxa olish'}</span>
                </button>
              </div>
              <div className="text-base sm:text-lg font-black text-stone-900 dark:text-white mt-1 font-mono tracking-wider">
                {CARD_NUMBER}
              </div>
              <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
                {CARD_HOLDER}
              </div>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-3 leading-relaxed">
              Istalgan bank ilovasidan ushbu kartaga pul o‘tkazing va chekni yuklang.
            </p>
          </div>
        </div>

        {/* Card 3: Security & Support */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Xavfsiz Kafolat
            </div>

            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>To‘lov yuborilgach, darhol admin nazoratiga tushadi.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Chek yuklanganda administrator 5-10 daqiqada tasdiqlaydi.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Telegram bot: @{botSettings.botUsername}</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-[11px] text-stone-500 mt-4">
            Qo‘llab-quvvatlash: <strong className="text-stone-800 dark:text-stone-200 font-mono">@fayzullo_math_admin</strong>
          </div>
        </div>
      </div>

      {/* Deposit Action Section with 2 Methods */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* Method Switcher Tabs */}
        <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveMethod('card')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMethod === 'card'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>💳 Bank Kartasi & Chek Yuklash (Click / Payme)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMethod('bot')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMethod === 'bot'
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>🤖 Telegram Bot Orqali To‘lash</span>
          </button>
        </div>

        <form onSubmit={handleSubmitDeposit} className="space-y-6">
          {/* Method 1 Details Banner */}
          {activeMethod === 'card' && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Karta: {CARD_NUMBER} ({CARD_HOLDER})</span>
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
                  Kartaga pul o‘tkazib, kvitansiya (chek) rasmini quyidagi maydonga yuklang. Admin tasdiqlashi bilan balans to‘ldiriladi.
                </div>
              </div>
              <button
                type="button"
                onClick={copyCard}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
              >
                {copiedCard ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCard ? 'Nusxalandi!' : 'Kartani nusxalash'}</span>
              </button>
            </div>
          )}

          {/* Method 2 Details Banner */}
          {activeMethod === 'bot' && (
            <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-sky-600" />
                  <span>Telegram Bot: @{botSettings.botUsername}</span>
                </div>
                <div className="text-[11px] text-sky-700 dark:text-sky-400 mt-1">
                  So‘rov yuborilgach, botda to‘lov kodi hosil qilinadi va avtomatik hisobingizga kiritiladi.
                </div>
              </div>
              <a
                href={tgBotLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors shrink-0 flex items-center gap-1 text-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Botga O‘tish</span>
              </a>
            </div>
          )}

          {/* Preset buttons */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
              Depozit miqdorini tanlang:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {presetAmounts.map(val => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleSelectPreset(val)}
                  className={`py-3 px-3 rounded-2xl text-xs font-extrabold transition-all border cursor-pointer ${
                    amount === val && !customAmount
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-xs'
                      : 'border-stone-200 dark:border-stone-700/80 hover:border-stone-400 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800'
                  }`}
                >
                  {val.toLocaleString()} so‘m
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount & Telegram username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Boshqa miqdor (so‘m):
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Masalan: 350000"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-sm font-mono font-bold text-stone-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-stone-400">
                  so‘m
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Telegram Username (@username):
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-sky-500">@</span>
                <input
                  type="text"
                  placeholder="foydalanuvchi_nomi"
                  value={cleanTg}
                  onChange={e => setTelegramUser(e.target.value.replace(/^@/, ''))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-sm font-mono font-bold text-stone-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Receipt File Upload Field for Card payment */}
          {activeMethod === 'card' && (
            <div className="p-4 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40 space-y-2">
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-emerald-500" />
                  To‘lov Chekini Yuklang (Skrinshot yoki Kvitansiya):
                </span>
                {receiptFileName && (
                  <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                    ✓ {receiptFileName}
                  </span>
                )}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
              />
              <p className="text-[11px] text-stone-400">
                Chek yuklansa, admin to‘lovingizni bir necha daqiqada tasdiqlaydi va balansingiz to‘ldiriladi.
              </p>
            </div>
          )}

          {/* Total Summary */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">To‘ldiriladigan Summa:</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {amount.toLocaleString()} so‘m
            </div>
          </div>

          {/* Submit Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || amount < (botSettings.minDepositAmount || 10000)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>To‘lov So‘rovi Yuborilmoqda...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>{amount.toLocaleString()} so‘m To‘lovni Tasdiqlashga Yuborish</span>
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {activeMethod === 'bot' && (
              <a
                href={tgBotLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-sky-300 dark:border-sky-800 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-xs font-bold transition-colors flex items-center justify-center gap-2 text-center"
              >
                <Send className="w-3.5 h-3.5" />
                <span>To‘g‘ridan-to‘g‘ri Botga Kirish</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </form>
      </div>

      {/* Success Modal showing PENDING / AWAITING ADMIN APPROVAL */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <h4 className="text-xl font-black text-center text-stone-900 dark:text-white mb-2">
              Depozit So‘rovi Yuborildi!
            </h4>

            <div className="flex justify-center mb-3">
              <DepositStatusBadge status="pending" size="md" showSubtext={true} className="items-center" />
            </div>

            <p className="text-xs text-stone-500 text-center mb-4 leading-relaxed">
              To‘lov so‘rovingiz qabul qilindi va admin paneliga yuborildi. Administrator to‘lovni tekshirib tasdiqlashi bilanoq mablag‘ balansingizga avtomatik qo‘shiladi.
            </p>

            <div className="my-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/60 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">So‘ralgan Summa:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  {successModal.amount.toLocaleString()} so‘m
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">To‘lov Usuli:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {successModal.method === 'card' ? '💳 Bank Kartasi' : '🤖 Telegram Bot'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200 dark:border-stone-700">
                <span className="text-stone-500">Tranzaksiya Kodi:</span>
                <button
                  type="button"
                  onClick={() => copyCode(successModal.code)}
                  className="font-mono font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{successModal.code}</span>
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setSuccessModal(null)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Tushunarli, Kutish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white flex items-center gap-2">
            <span>📜 Depozitlar & Tranzaksiyalar Tarixi</span>
          </h3>
          <span className="text-xs text-stone-500">
            Jami: {myDeposits.length} ta so‘rov
          </span>
        </div>

        {myDeposits.length === 0 ? (
          <div className="text-center py-8 text-xs text-stone-500">
            Hali depozit so‘rovi yuborilmagan. Yuqoridagi forma orqali birinchi depozitingizni yuboring.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-[11px] text-stone-400 uppercase font-bold">
                  <th className="pb-3">Kod</th>
                  <th className="pb-3">Miqdor</th>
                  <th className="pb-3">Usul</th>
                  <th className="pb-3">Sana</th>
                  <th className="pb-3 text-right">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {myDeposits.map(tx => (
                  <tr key={tx.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3 font-mono font-bold text-stone-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <span>{tx.paymentCode}</span>
                        {tx.isSupabase && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                            ⚡ Supabase
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                      +{tx.amount.toLocaleString()} so‘m
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.method === 'card' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' : 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                      }`}>
                        {tx.method === 'card' ? '💳 Karta' : '🤖 Telegram'}
                      </span>
                    </td>
                    <td className="py-3 text-stone-500">
                      {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString().slice(0, 5)}
                    </td>
                    <td className="py-3 text-right">
                      <DepositStatusBadge status={tx.status} size="sm" showSubtext={false} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
