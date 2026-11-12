import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OwnerDashboard } from './OwnerDashboard';
import { SiteBuilderManager } from './SiteBuilderManager';
import { CoursesManager } from './CoursesManager';
import { AIQuizGenerator } from './AIQuizGenerator';
import { TestsManager } from './TestsManager';
import { ResultsManager } from './ResultsManager';
import { StudentsManager } from './StudentsManager';
import { VIPTariffsManager } from './VIPTariffsManager';
import { SupportTicketsManager } from './SupportTicketsManager';
import { AuditLogViewer } from './AuditLogViewer';
import { TeacherProfileManager } from './TeacherProfileManager';
import { ThemeBackgroundManager } from './ThemeBackgroundManager';
import { LeaderboardManager } from './LeaderboardManager';
import { OlympiadManager } from './OlympiadManager';
import { SiteCreatorsManager } from './SiteCreatorsManager';
import { DepositsFinanceManager } from './DepositsFinanceManager';
import { UniversalAiKeyModal } from '../common/UniversalAiKeyModal';
import { AIProviderStatusIndicator } from './AIProviderStatusIndicator';
import {
  LayoutDashboard,
  Layers,
  PlayCircle,
  Sparkles,
  Award,
  Users,
  CreditCard,
  MessageSquare,
  Shield,
  ArrowLeft,
  LogOut,
  Camera,
  Palette,
  Trophy,
  Clock,
  Code2,
  Wallet,
  Zap
} from 'lucide-react';
import { AnimatedSticker, renderWithAnimatedEmojis } from '../common/AnimatedSticker';
import { supabase } from '../../lib/supabase';

export const Site3Owner: React.FC = () => {
  const { setActiveSite, setIsOwnerAuth, db, refreshDb } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [supabaseProfilesCount, setSupabaseProfilesCount] = useState<number | null>(null);
  const [supabasePendingCount, setSupabasePendingCount] = useState<number | null>(null);

  // Auto-refresh DB and Supabase counts every 4s while in admin panel
  React.useEffect(() => {
    async function loadStats() {
      refreshDb();
      try {
        const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        if (typeof count === 'number') setSupabaseProfilesCount(count);
      } catch (e) {
        // ignore
      }
      try {
        const { count } = await supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending');
        if (typeof count === 'number') setSupabasePendingCount(count);
      } catch (e) {
        // ignore
      }
    }
    loadStats();
    const interval = setInterval(() => {
      loadStats();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const pendingDepositsCount = supabasePendingCount !== null
    ? supabasePendingCount
    : (db.depositTransactions || []).filter(t => t.status === 'pending').length;
  const nonOwnerUsersCount = Math.max(supabaseProfilesCount || 0, (db.users || []).filter(u => u.role === 'student' || (u as any).role !== 'owner').length);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    refreshDb();
  };

  const navItems = [
    { id: 'dashboard', label: '📊 Boshqaruv Paneli', icon: LayoutDashboard },
    {
      id: 'deposits',
      label: '💰 Depozitlar & Moliya',
      icon: Wallet,
      badge: pendingDepositsCount > 0 ? `${pendingDepositsCount} ta yangi!` : 'Moliya'
    },
    {
      id: 'students',
      label: '👥 O‘quvchilar & Balans',
      icon: Users,
      badge: `${nonOwnerUsersCount} nafar`
    },
    { id: 'leaderboard', label: '🏆 O‘quvchilar Reytingi', icon: Trophy, badge: 'Leaderboard' },
    { id: 'olympiad', label: '⏳ Mavzumiy Test & Sanoq', icon: Clock, badge: 'Countdown' },
    { id: 'creators_mgmt', label: '💻 Sayt Yaratuvchilari', icon: Code2, badge: '3 Dasturchi' },
    { id: 'theme_bg', label: '🎨 5 Ta Orqa Fon', icon: Palette, badge: 'Jonli Fon' },
    { id: 'teacher_profile', label: '👨‍🏫 Ustoz Rasmi & Profil', icon: Camera, badge: 'Rasm' },
    { id: 'courses', label: '📚 Kurslar & Video Darslar', icon: PlayCircle },
    { id: 'tests', label: '📝 Testlar & Savollar', icon: Award },
    { id: 'ai_quiz', label: '🤖 AI Test & Zanjir', icon: Sparkles, badge: 'AI' },
    { id: 'results', label: '🏅 Sertifikat Natijalari', icon: Award },
    { id: 'vip', label: '👑 VIP Tariflar Sozlamasi', icon: CreditCard },
    { id: 'site_builder', label: '🧱 Sayt Konstruktori', icon: Layers, badge: 'No-Code' },
    { id: 'tickets', label: '📩 Murojaatlar & Yordam', icon: MessageSquare },
    { id: 'audit', label: '🛡️ Audit Jurnali', icon: Shield }
  ];

  const handleLogout = () => {
    setIsOwnerAuth(false);
    setActiveSite('site1_open');
  };

  return (
    <div className="min-h-[calc(100vh-61px)] bg-transparent text-stone-900 dark:text-stone-100 flex flex-col md:flex-row transition-colors">
      {/* Owner Sidebar - Pinned & Sticky to viewport with translucent glassmorphism */}
      <aside className="w-full md:w-72 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md border-r border-stone-200/80 dark:border-stone-800 p-4 sm:p-5 flex flex-col justify-between shrink-0 md:sticky md:top-[61px] md:h-[calc(100vh-61px)] md:overflow-y-auto z-20">
        <div>
          {/* Owner Identity Header */}
          <div className="p-3.5 bg-rose-50/80 dark:bg-rose-950/40 backdrop-blur-xs rounded-2xl border border-rose-200/60 dark:border-rose-900/40 mb-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
              FO
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
                {db.teacherProfile?.name || 'Fayzullo Omanullayev'}
              </div>
              <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>CREATOR & SUPER ADMIN</span>
              </div>
            </div>
          </div>

          {/* Real-time AI Status & Balance live badge */}
          <div className="mb-2">
            <AIProviderStatusIndicator
              onOpenKeyModal={() => setIsAiModalOpen(true)}
              compact={true}
            />
          </div>

          {/* Universal AI Quick Access Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="w-full mb-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-orange-500/10 border border-amber-500/30 hover:border-rose-500/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white">
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <Zap className="w-4 h-4 fill-rose-500 text-rose-500 group-hover:scale-110 transition-transform" />
                <span>⚡ Universal AI Dvigateli</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white uppercase">
                {db.aiSettings?.provider || 'Gemini'}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 truncate">
              {db.aiSettings?.providerLabel || 'Har qanday AI kaliti (Groq/Gemini/OpenAI/Claude)'}
            </div>
          </button>

          {/* Navigation Links with Emojis */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-xs font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/80 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate flex items-center gap-1.5">{renderWithAnimatedEmojis(item.label)}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 ml-1.5 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 mt-5 space-y-1">
          <button
            onClick={() => setActiveSite('site1_open')}
            className="w-full text-left px-3.5 py-2 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white flex items-center gap-2 transition-colors font-medium rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ochiq Saytni Ko‘rish</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl flex items-center gap-2 transition-colors font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Owner Content Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <OwnerDashboard onNavigateTab={setActiveTab} />}
          {activeTab === 'deposits' && <DepositsFinanceManager />}
          {activeTab === 'teacher_profile' && <TeacherProfileManager />}
          {activeTab === 'theme_bg' && <ThemeBackgroundManager />}
          {activeTab === 'leaderboard' && <LeaderboardManager />}
          {activeTab === 'olympiad' && <OlympiadManager />}
          {activeTab === 'creators_mgmt' && <SiteCreatorsManager />}
          {activeTab === 'ai_quiz' && <AIQuizGenerator />}
          {activeTab === 'students' && <StudentsManager />}
          {activeTab === 'results' && <ResultsManager />}
          {activeTab === 'courses' && <CoursesManager />}
          {activeTab === 'tests' && <TestsManager />}
          {activeTab === 'site_builder' && <SiteBuilderManager />}
          {activeTab === 'vip' && <VIPTariffsManager />}
          {activeTab === 'tickets' && <SupportTicketsManager />}
          {activeTab === 'audit' && <AuditLogViewer />}
        </div>
      </main>

      {/* Universal AI Key Configuration Modal */}
      <UniversalAiKeyModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
