import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UniversalAiKeyModal } from '../common/UniversalAiKeyModal';
import { AIProviderStatusIndicator } from './AIProviderStatusIndicator';
import {
  Users,
  CreditCard,
  Award,
  PlayCircle,
  MessageSquare,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Layers,
  Wallet,
  Send,
  Zap,
  Database
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface OwnerDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onNavigateTab }) => {
  const { db } = useApp();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [supabaseProfilesCount, setSupabaseProfilesCount] = useState<number | null>(null);
  const [supabasePayments, setSupabasePayments] = useState<any[]>([]);

  React.useEffect(() => {
    async function loadSupabaseStats() {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        if (!error && typeof count === 'number') {
          setSupabaseProfilesCount(count);
        }
      } catch (e) {
        // ignore
      }

      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*');
        if (!error && data) {
          setSupabasePayments(data);
        }
      } catch (e) {
        // ignore
      }
    }
    loadSupabaseStats();
  }, []);

  const totalStudents = Math.max(supabaseProfilesCount || 0, db.users.filter(u => u.role === 'student').length);
  const activeVIPs = db.users.filter(u => u.role === 'student' && u.vipTier !== 'free').length;
  const totalCourses = db.courses.length;
  const totalLessons = db.lessons.length;
  const totalTests = db.tests.length;
  const totalResults = db.studentResults?.length || 0;
  const newTickets = db.supportTickets.filter(t => t.status === 'new').length;

  const allPayments = [
    ...supabasePayments.map(p => ({
      amount: Number(p.amount) || 0,
      status: p.status
    })),
    ...(db.depositTransactions || []).filter(t => !supabasePayments.some(sp => sp.id === t.id))
  ];

  const totalDepositsSum = allPayments
    .filter(t => t.status === 'completed' || t.status === 'approved')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const pendingDepositsCount = allPayments.filter(t => t.status === 'pending').length;
  const totalStudentBalances = db.users
    .filter(u => u.role === 'student')
    .reduce((acc, u) => acc + (u.balance || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
            Platforma Boshqaruv Markazi
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Xush kelibsiz, Fayzullo ustoz!
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            Barcha o‘quvchilar, Telegram bot depozitlari, hamyon hisoblari, yangi kurslar, testlar, reyting va sayt ko‘rinishini shu yerdan to‘liq boshqaring.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            title="AI provayderini sozlash, test qilish va bepul kalitlar"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>⚡ AI Dvigateli ({db.aiSettings?.provider?.toUpperCase() || 'GEMINI'})</span>
          </button>
          <button
            onClick={() => onNavigateTab('deposits')}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>💰 Moliya & Depozitlar</span>
          </button>
          <button
            onClick={() => onNavigateTab('site_builder')}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-white text-stone-900 hover:bg-stone-100 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-rose-600" />
            <span>Sayt Konstruktori</span>
          </button>
        </div>
      </div>

      {/* Real-Time AI Provider Connectivity & Balance Diagnostic Indicator */}
      <AIProviderStatusIndicator
        onOpenKeyModal={() => setIsAiModalOpen(true)}
      />

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => onNavigateTab('deposits')}
          className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-emerald-500 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>💰 Telegram Bot Depozitlari</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
            {totalDepositsSum.toLocaleString()} so‘m
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {pendingDepositsCount > 0 ? (
              <strong className="text-amber-500">{pendingDepositsCount} ta kutilayotgan so‘rov</strong>
            ) : (
              'Barcha depozitlar tasdiqlangan'
            )}
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-stone-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>👥 Jami O‘quvchilar</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tabular-nums">
            {totalStudents} nafar
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Balans jami: <strong className="font-mono text-stone-600 dark:text-stone-300">{totalStudentBalances.toLocaleString()} so‘m</strong>
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('courses')}
          className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-stone-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>📚 Kurslar va Darslar</span>
            <PlayCircle className="w-4 h-4 text-[#F95738]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tabular-nums">
            {totalCourses} ta kurs
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            {totalLessons} ta video dars yuklangan
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('tickets')}
          className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs cursor-pointer hover:border-stone-400 transition-all"
        >
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>📩 Yangi Murojaatlar</span>
            <MessageSquare className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tabular-nums">
            {newTickets} ta yangi
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Saytdan yuborilgan savollar
          </span>
        </div>
      </div>

      {/* Quick Action Cards & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Management Links */}
        <div className="lg:col-span-6 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white mb-4">
            Tezkor Boshqaruv Amallari
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => onNavigateTab('deposits')}
              className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 hover:border-emerald-500 text-left transition-colors bg-emerald-50/30 dark:bg-emerald-950/20 cursor-pointer"
            >
              <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-0.5">💰 Depozitlar & Moliya</div>
              <div className="text-stone-400 text-[11px]">Telegram bot, hisoblar va to‘lovlar</div>
            </button>
            <button
              onClick={() => onNavigateTab('students')}
              className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 hover:border-blue-500 text-left transition-colors bg-blue-50/30 dark:bg-blue-950/20 cursor-pointer"
            >
              <div className="font-bold text-blue-700 dark:text-blue-400 mb-0.5">👥 O‘quvchilar & Balans</div>
              <div className="text-stone-400 text-[11px]">Telegram, qo‘shimcha tel, email va balans</div>
            </button>
            <button
              onClick={() => onNavigateTab('leaderboard')}
              className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 hover:border-amber-500 text-left transition-colors bg-amber-50/30 dark:bg-amber-950/20 cursor-pointer"
            >
              <div className="font-bold text-amber-700 dark:text-amber-400 mb-0.5">🏆 O‘quvchilar Reytingi</div>
              <div className="text-stone-400 text-[11px]">Leaderboard & Top-3 shoxsupasi</div>
            </button>
            <button
              onClick={() => onNavigateTab('olympiad')}
              className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 hover:border-rose-500 text-left transition-colors bg-rose-50/30 dark:bg-rose-950/20 cursor-pointer"
            >
              <div className="font-bold text-rose-600 dark:text-rose-400 mb-0.5">⏱️ Mavzumiy Test & Sanoq</div>
              <div className="text-stone-400 text-[11px]">G‘oliblar & teskari sanoq soati</div>
            </button>
            <button
              onClick={() => onNavigateTab('creators_mgmt')}
              className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 hover:border-sky-500 text-left transition-colors bg-sky-50/30 dark:bg-sky-950/20 cursor-pointer"
            >
              <div className="font-bold text-sky-600 dark:text-sky-400 mb-0.5">💻 Sayt Yaratuvchilari</div>
              <div className="text-stone-400 text-[11px]">3 dasturchi, tillar, telegram & tel</div>
            </button>
            <button
              onClick={() => onNavigateTab('theme_bg')}
              className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 hover:border-purple-500 text-left transition-colors bg-purple-50/30 dark:bg-purple-950/20 cursor-pointer"
            >
              <div className="font-bold text-purple-600 dark:text-purple-400 mb-0.5">🎨 5 Ta Orqa Fon</div>
              <div className="text-stone-400 text-[11px]">Jonli harakatlanuvchi formulalar</div>
            </button>
          </div>
        </div>

        {/* Audit Log Overview */}
        <div className="lg:col-span-6 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">
              So‘nggi Administrator Amallari (Audit Log)
            </h3>
            <button
              onClick={() => onNavigateTab('audit')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              To‘liq jurnal →
            </button>
          </div>

          <div className="space-y-3">
            {db.auditLogs.slice(0, 4).map(log => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-stone-900 dark:text-white">
                    {log.details}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    {log.actor} · {log.action} · {log.entity}
                  </div>
                </div>
                <div className="text-[10px] text-stone-400 shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <UniversalAiKeyModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
