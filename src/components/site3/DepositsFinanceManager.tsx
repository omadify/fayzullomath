import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  Settings,
  Save,
  Check,
  X,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Database
} from 'lucide-react';
import { DepositTransaction } from '../../types';
import { DepositStatusBadge } from '../common/DepositStatusBadge';
import { supabase } from '../../lib/supabase';

export const DepositsFinanceManager: React.FC = () => {
  const { db, approveDeposit, rejectDeposit, updateBotSettings, updateStudentFull, refreshDb } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'transactions' | 'bot_settings' | 'manual_adjust'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'completed' | 'rejected'>('all');
  const [successMsg, setSuccessMsg] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
  const [supabasePayments, setSupabasePayments] = useState<any[]>([]);

  // Fetch all payments directly from Supabase payments table: supabase.from('payments').select('*')
  const fetchSupabasePayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && Array.isArray(data)) {
        setSupabasePayments(data);
        return;
      }
    } catch (e) {
      console.warn('Direct Supabase payments query notice:', e);
    }

    // Fallback via backend proxy
    try {
      const res = await fetch('/api/supabase/payments');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSupabasePayments(json.data);
      }
    } catch (err) {
      console.warn('Fallback payments fetch notice:', err);
    }
  };

  // Auto-poll every 3.5s so new deposit requests arrive in real time
  React.useEffect(() => {
    fetchSupabasePayments();
    refreshDb();
    const interval = setInterval(() => {
      fetchSupabasePayments();
      refreshDb();
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchSupabasePayments(), refreshDb()]);
    setTimeout(() => setRefreshing(false), 600);
  };

  // Bot settings form state
  const currentBot = db.telegramBotSettings || {
    botUsername: 'fayzullo_matematika_bot',
    botName: 'Fayzullo Matematika To‘lov Boti',
    isActive: true,
    minDepositAmount: 10000,
    cardOrMerchantInfo: 'Humo/Uzcard orqali to‘g‘ridan-to‘g‘ri botda avtomatik tasdiqlash',
    supportTelegram: '@fayzullo_math_admin',
    autoApprovalDemo: true
  };

  const [botForm, setBotForm] = useState({
    botUsername: currentBot.botUsername,
    botName: currentBot.botName,
    isActive: currentBot.isActive,
    minDepositAmount: currentBot.minDepositAmount,
    cardOrMerchantInfo: currentBot.cardOrMerchantInfo,
    supportTelegram: currentBot.supportTelegram,
    autoApprovalDemo: !!currentBot.autoApprovalDemo
  });

  // Manual balance adjust state
  const [selectedStudentId, setSelectedStudentId] = useState<string>(db.users.find(u => u.role === 'student')?.id || '');
  const [adjustAmount, setAdjustAmount] = useState<number>(50000);
  const [adjustType, setAdjustType] = useState<'add' | 'subtract'>('add');
  const [adjustNote, setAdjustNote] = useState('');

  // Map all payments from Supabase payments table
  const allTxsMap = new Map<string, any>();

  // 1. Add all Supabase payments (primary authoritative payments table)
  supabasePayments.forEach(p => {
    const matchedUser = (db.users || []).find(
      u => (u.email && p.user_email && u.email.toLowerCase() === p.user_email.toLowerCase()) ||
           (u.phone && p.user_email && p.user_email.includes(u.phone.replace(/\D/g, '')))
    );

    const emailPrefix = (p.user_email || '').split('@')[0] || 'O‘quvchi';
    const isDigits = /^\d+$/.test(emailPrefix);
    const fallbackName = isDigits ? `O‘quvchi (${emailPrefix})` : (emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));

    allTxsMap.set(p.id, {
      id: p.id,
      userId: matchedUser?.id || p.user_email || 'user-' + p.id.slice(0, 8),
      userName: matchedUser ? `${matchedUser.name} ${matchedUser.surname || ''}`.trim() : fallbackName,
      userPhone: matchedUser?.phone || (isDigits ? emailPrefix : ''),
      user_email: p.user_email,
      telegramUsername: matchedUser?.telegramUsername || '',
      amount: Number(p.amount) || 0,
      status: p.status || 'pending',
      method: p.receipt_url ? 'card' : 'telegram_bot',
      paymentCode: `DEP-${p.id.slice(0, 8).toUpperCase()}`,
      receiptUrl: p.receipt_url || '',
      createdAt: p.created_at || new Date().toISOString(),
      isSupabase: true
    });
  });

  // 2. Merge any local transactions not yet in Supabase
  (db.depositTransactions || []).forEach(tx => {
    if (!allTxsMap.has(tx.id)) {
      allTxsMap.set(tx.id, tx);
    } else {
      const existing = allTxsMap.get(tx.id);
      allTxsMap.set(tx.id, {
        ...existing,
        ...tx,
        id: existing.id,
        // Status from Supabase takes precedence if approved
        status: existing.status === 'approved' ? 'approved' : (tx.status || existing.status)
      });
    }
  });

  const transactions = Array.from(allTxsMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredTxs = transactions.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (t.userName || '').toLowerCase().includes(q) ||
      (t.telegramUsername || '').toLowerCase().includes(q) ||
      (t.userPhone || '').includes(q) ||
      (t.user_email || '').toLowerCase().includes(q) ||
      (t.paymentCode || '').toLowerCase().includes(q);

    let matchesStatus = true;
    if (statusFilter === 'all') {
      matchesStatus = true;
    } else if (statusFilter === 'approved' || statusFilter === 'completed') {
      matchesStatus = t.status === 'approved' || t.status === 'completed';
    } else {
      matchesStatus = t.status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  // Financial statistics
  const totalCompletedSum = transactions
    .filter(t => t.status === 'completed' || t.status === 'approved')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const totalStudentBalances = db.users
    .filter(u => u.role === 'student')
    .reduce((acc, u) => acc + (u.balance || 0), 0);

  const handleApprove = async (id: string) => {
    setSuccessMsg('To‘lov tasdiqlanmoqda (Supabase: status: approved)...');
    try {
      // 1. Update status to 'approved' directly in Supabase payments table
      const { error: supErr } = await supabase
        .from('payments')
        .update({ status: 'approved' })
        .eq('id', id);

      if (supErr) {
        console.warn('Supabase payments update error:', supErr.message);
      } else {
        console.log('✅ Supabase payments status muvaffaqiyatli approved qilindi! ID:', id);
      }
    } catch (e) {
      console.warn('Direct Supabase update exception:', e);
    }

    // 2. Update local db, credit student wallet and notify
    await approveDeposit(id);
    await Promise.all([fetchSupabasePayments(), refreshDb()]);
    setSuccessMsg('✅ To‘lov muvaffaqiyatli tasdiqlandi (status: approved) va o‘quvchi hisobiga qo‘shildi!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleReject = async (id: string) => {
    if (confirm('Rostdan ham ushbu depozit so‘rovini rad etmoqchimisiz?')) {
      try {
        await supabase
          .from('payments')
          .update({ status: 'rejected' })
          .eq('id', id);
      } catch (e) {
        console.warn('Supabase reject exception:', e);
      }
      await rejectDeposit(id);
      await Promise.all([fetchSupabasePayments(), refreshDb()]);
      setSuccessMsg('Depozit rad etildi.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleSaveBotSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBotSettings(botForm);
    setSuccessMsg('Telegram Bot sozlamalari muvaffaqiyatli saqlandi!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleManualAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = db.users.find(u => u.id === selectedStudentId);
    if (!student) return;

    const currentBal = student.balance || 0;
    const finalAmount = adjustType === 'add' ? currentBal + adjustAmount : Math.max(0, currentBal - adjustAmount);

    await updateStudentFull({
      id: student.id,
      balance: finalAmount
    });

    setSuccessMsg(`${student.name} ning hisob balansi yangilandi: ${finalAmount.toLocaleString()} so‘m`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Wallet className="w-3.5 h-3.5" />
            <span>💰 Moliya & Depozit Boshqaruvi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            Telegram Bot Depozitlari va O‘quvchilar Hamyonini Boshqarish
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Telegram bot orqali tushgan barcha depozitlarni ko‘ring, tasdiqlang, bot sozlamalarini o‘zgartiring va o‘quvchilar balansini qo‘lda to‘g‘rilang.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-2 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-500' : ''}`} />
            <span>{refreshing ? 'Yangilanmoqda...' : '🔄 Depozitlarni Yangilash'}</span>
          </button>

          {successMsg && (
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </span>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-stone-400 uppercase font-semibold">Jami Depozitlar (Bot)</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums font-mono">
            {totalCompletedSum.toLocaleString()} so‘m
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-stone-400 uppercase font-semibold">Mavjud O‘quvchilar Balansi</div>
          <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white mt-1 tabular-nums font-mono">
            {totalStudentBalances.toLocaleString()} so‘m
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-stone-400 uppercase font-semibold">Kutilayotgan Depozitlar</div>
          <div className={`text-xl sm:text-2xl font-black mt-1 tabular-nums ${pendingCount > 0 ? 'text-amber-500' : 'text-stone-500'}`}>
            {pendingCount} ta so‘rov
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="text-[11px] text-stone-400 uppercase font-semibold">Faol Telegram Bot</div>
          <div className="text-sm font-bold text-sky-600 dark:text-sky-400 mt-1.5 flex items-center gap-1 truncate font-mono">
            <Send className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">@{currentBot.botUsername}</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveSubTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'transactions'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Barcha Depozit Tranzaksiyalari ({transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bot_settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'bot_settings'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Telegram Bot Sozlamalari</span>
        </button>

        <button
          onClick={() => setActiveSubTab('manual_adjust')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'manual_adjust'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Balansni Qo‘lda O‘zgartirish</span>
        </button>
      </div>

      {/* Subtab 1: Transactions Table */}
      {activeSubTab === 'transactions' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Ism, telefon, @telegram yoki kod orqali qidirish..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-semibold">Holat:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="all">Barchasi ({transactions.length})</option>
                <option value="pending">Kutilayotgan ({transactions.filter(t => t.status === 'pending').length})</option>
                <option value="approved">Tasdiqlangan ({transactions.filter(t => t.status === 'approved' || t.status === 'completed').length})</option>
                <option value="rejected">Rad etilgan ({transactions.filter(t => t.status === 'rejected').length})</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {filteredTxs.length === 0 ? (
            <div className="text-center py-10 text-stone-500 text-xs">
              Tranzaksiyalar topilmadi.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-[11px] text-stone-400 uppercase font-bold">
                    <th className="pb-3">Kod</th>
                    <th className="pb-3">O‘quvchi</th>
                    <th className="pb-3">Telegram Username</th>
                    <th className="pb-3">Miqdor</th>
                    <th className="pb-3">Usul / Chek</th>
                    <th className="pb-3">Sana</th>
                    <th className="pb-3">Holat</th>
                    <th className="pb-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                  {filteredTxs.map(tx => (
                    <tr key={tx.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                      <td className="py-3 font-mono font-bold text-stone-900 dark:text-white">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{tx.paymentCode}</span>
                          {tx.isSupabase && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              ⚡ Supabase
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="font-bold text-stone-900 dark:text-white">{tx.userName}</div>
                        <div className="text-[11px] text-stone-500 font-mono">
                          {tx.userPhone || (tx.user_email ? `✉️ ${tx.user_email}` : '')}
                        </div>
                      </td>
                      <td className="py-3">
                        {tx.telegramUsername ? (
                          <a
                            href={`https://t.me/${tx.telegramUsername}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-bold"
                          >
                            @{tx.telegramUsername}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>
                      <td className="py-3 font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                        +{tx.amount.toLocaleString()} so‘m
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.method === 'card' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' : 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                          }`}>
                            {tx.method === 'card' ? '💳 Karta' : '🤖 Telegram'}
                          </span>
                          {tx.receiptUrl && (
                            <button
                              type="button"
                              onClick={() => setViewingReceipt(tx.receiptUrl!)}
                              className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>🧾 Chek</span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-stone-500">
                        {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString().slice(0, 5)}
                      </td>
                      <td className="py-3">
                        <DepositStatusBadge status={tx.status} size="sm" showSubtext={false} />
                      </td>
                      <td className="py-3 text-right">
                        {tx.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApprove(tx.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                              title="To‘lovni tasdiqlash va o‘quvchi hisobiga pul qo‘shish (status: approved)"
                            >
                              <Check className="w-3 h-3" />
                              <span>Tasdiqlash</span>
                            </button>
                            <button
                              onClick={() => handleReject(tx.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900 text-red-700 dark:text-red-300 font-bold text-[11px] transition-colors cursor-pointer"
                              title="Rad etish"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : tx.status === 'approved' || tx.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tasdiqlangan ✓</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400 font-medium">Rad etilgan</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: Bot Settings */}
      {activeSubTab === 'bot_settings' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl">
          <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2 mb-1">
            <Send className="w-5 h-5 text-sky-500" />
            <span>Telegram Bot Integratsiyasi Sozlamalari</span>
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            O‘quvchilar ushbu botga yo‘naltiriladi va depozit to‘lovlarini amalga oshiradilar.
          </p>

          <form onSubmit={handleSaveBotSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Telegram Bot Username (@sizning_botingiz):
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-sky-500">@</span>
                <input
                  type="text"
                  required
                  value={botForm.botUsername}
                  onChange={e => setBotForm({ ...botForm, botUsername: e.target.value.replace(/^@/, '') })}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs font-mono font-bold text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Bot Nomi (Sarlavha):
              </label>
              <input
                type="text"
                required
                value={botForm.botName}
                onChange={e => setBotForm({ ...botForm, botName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs font-semibold text-stone-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Minimal Depozit Miqdori (so‘m):
                </label>
                <input
                  type="number"
                  required
                  value={botForm.minDepositAmount}
                  onChange={e => setBotForm({ ...botForm, minDepositAmount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs font-mono font-bold text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Telegram Admin Profil (@admin):
                </label>
                <input
                  type="text"
                  value={botForm.supportTelegram}
                  onChange={e => setBotForm({ ...botForm, supportTelegram: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs font-mono font-bold text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                To‘lov usullari va ko‘rsatmalar:
              </label>
              <input
                type="text"
                value={botForm.cardOrMerchantInfo}
                onChange={e => setBotForm({ ...botForm, cardOrMerchantInfo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs text-stone-900 dark:text-white"
              />
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/60 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-white">
                  Demo & Tezkor Avtomatik Tasdiqlash
                </div>
                <div className="text-[11px] text-stone-500">
                  Yoqilganda o‘quvchi bot tugmasini bosgach mablag‘ darhol hisobiga o‘tadi
                </div>
              </div>
              <input
                type="checkbox"
                checked={botForm.autoApprovalDemo}
                onChange={e => setBotForm({ ...botForm, autoApprovalDemo: e.target.checked })}
                className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Sozlamalarni Saqlash</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Subtab 3: Manual Balance Adjust */}
      {activeSubTab === 'manual_adjust' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl">
          <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <span>O‘quvchi Balansini Qo‘lda To‘ldirish / O‘zgartirish</span>
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            O‘quvchi hisobiga to‘g‘ridan-to‘g‘ri pul qo‘shing yoki ayiring (masalan mukofot, naqd to‘lov yoki kompensatsiya).
          </p>

          <form onSubmit={handleManualAdjust} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                O‘quvchini tanlang:
              </label>
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold text-stone-900 dark:text-white"
              >
                {db.users.filter(u => u.role === 'student').map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.surname} ({s.phone}) — Hozirgi balansi: {(s.balance || 0).toLocaleString()} so‘m
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Amal turi:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('add')}
                    className={`py-2 rounded-xl text-xs font-extrabold border ${
                      adjustType === 'add'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600'
                    }`}
                  >
                    + Qo‘shish
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('subtract')}
                    className={`py-2 rounded-xl text-xs font-extrabold border ${
                      adjustType === 'subtract'
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600'
                    }`}
                  >
                    - Ayirish
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Summa (so‘m):
                </label>
                <input
                  type="number"
                  required
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs font-mono font-bold text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Izoh / Sabab:
              </label>
              <input
                type="text"
                placeholder="Masalan: Olimpiada 1-o‘rin mukofoti yoki qo‘lda to‘lov"
                value={adjustNote}
                onChange={e => setAdjustNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs text-stone-900 dark:text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Balansni Yangilash</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Receipt Viewing Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-4">
              <h4 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <span>🧾 O‘quvchi To‘lov Kvitansiyasi / Cheki</span>
              </h4>
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 flex items-center justify-center max-h-[60vh]">
              <img src={viewingReceipt} alt="To'lov cheki" className="object-contain w-full h-full" />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
