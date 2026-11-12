import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentDashboard } from './StudentDashboard';
import { CoursePlayerView } from './CoursePlayerView';
import { MockExamPlayer } from './MockExamPlayer';
import { AIMathAssistant } from './AIMathAssistant';
import { ResultsSection } from '../site1/ResultsSection';
import { TestHistoryView } from './TestHistoryView';
import { StudentSubscriptionsView } from './StudentSubscriptionsView';
import { StudentProfileView } from './StudentProfileView';
import { StudentLeaderboardView } from './StudentLeaderboardView';
import { ThematicOlympiadsSection } from './ThematicOlympiadsSection';
import { SiteCreatorsSection } from '../common/SiteCreatorsSection';
import { StudentWalletDepositView } from './StudentWalletDepositView';
import {
  LayoutDashboard,
  PlayCircle,
  Award,
  Sparkles,
  History,
  CreditCard,
  User,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Trophy,
  Clock,
  Code2,
  Wallet,
  LogOut
} from 'lucide-react';
import { renderWithAnimatedEmojis } from '../common/AnimatedSticker';

export const Site2LMS: React.FC = () => {
  const {
    db,
    currentUser,
    activeCourseId,
    setActiveCourseId,
    activeTestId,
    setActiveTestId,
    setActiveSite,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const navItems = [
    { id: 'dashboard', label: '📊 Boshqaruv Paneli', icon: LayoutDashboard },
    { id: 'wallet', label: '💰 Hisob & Depozit', icon: Wallet, badge: 'Telegram Bot' },
    { id: 'courses', label: '📚 Video Darslarim', icon: PlayCircle },
    { id: 'leaderboard', label: '🏆 O‘quvchilar Reytingi', icon: Trophy, badge: 'Top-10' },
    { id: 'olympiad', label: '⏳ Mavzumiy Test & Sanoq', icon: Clock, badge: 'Live' },
    { id: 'creators', label: '💻 Sayt Yaratuvchilari', icon: Code2, badge: '3 Muhandis' },
    { id: 'tests', label: '📝 Milliy Sertifikat Testi', icon: Award },
    { id: 'ai', label: '🤖 AI Matematika Yordamchisi', icon: Sparkles, badge: 'AI' },
    { id: 'results', label: '🏅 O‘quvchilar Natijalari', icon: Award },
    { id: 'history', label: '📈 Sinovlarim Tarixi', icon: History },
    { id: 'vip', label: '👑 VIP & Tariflar', icon: CreditCard },
    { id: 'profile', label: '👤 Profilim & Sozlamalar', icon: User }
  ];

  // If activeTestId is set, launch MockExamPlayer
  if (activeTestId) {
    return (
      <div className="min-h-screen bg-transparent p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <MockExamPlayer testId={activeTestId} onClose={() => setActiveTestId(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-61px)] bg-transparent text-stone-900 dark:text-stone-100 flex flex-col md:flex-row transition-colors relative z-10">
      {/* LMS Sidebar - Pinned & Sticky to viewport with translucent glassmorphism */}
      <aside className="w-full md:w-68 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md border-r border-stone-200/80 dark:border-stone-800 p-4 sm:p-5 flex flex-col justify-between shrink-0 md:sticky md:top-[61px] md:h-[calc(100vh-61px)] md:overflow-y-auto z-20">
        <div>
          {/* User mini badge & balance */}
          <div className="p-3.5 bg-stone-50/80 dark:bg-stone-800/60 backdrop-blur-xs rounded-2xl border border-stone-200/60 dark:border-stone-700/60 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F95738] to-amber-500 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                {currentUser?.name?.slice(0, 2).toUpperCase() || 'ST'}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
                  {currentUser?.name} {currentUser?.surname}
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span>{currentUser?.vipTier && currentUser.vipTier !== 'none' && currentUser.vipTier !== 'free' ? `VIP: ${currentUser.vipTier.toUpperCase()}` : 'Oddiy Tarif (Tekin)'}</span>
                </div>
              </div>
            </div>

            {/* Quick Balance indicator */}
            <div
              onClick={() => setActiveTab('wallet')}
              className="mt-3 pt-2.5 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-xs cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1">
                <span>💰 Hisob:</span>
              </span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
                {(currentUser?.balance || 0).toLocaleString()} so‘m
              </span>
            </div>
          </div>

          {/* Navigation Links with Emojis */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !activeCourseId;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveCourseId(null);
                    setActiveTab(item.id);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-[#F95738] text-white shadow-xs font-bold'
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

        {/* Back to public site & Logout buttons */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 mt-5 space-y-1">
          <button
            onClick={() => setActiveSite('site1_open')}
            className="w-full text-left px-3.5 py-2 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center gap-2 transition-colors font-medium rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ochiq Saytga Qaytish</span>
          </button>
          <button
            onClick={logout}
            className="w-full text-left px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors font-semibold rounded-xl"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kabinetdan Chiqish</span>
          </button>
        </div>
      </aside>

      {/* LMS Content Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* If Course is actively selected for viewing */}
          {activeCourseId ? (
            <CoursePlayerView
              courseId={activeCourseId}
              onBack={() => setActiveCourseId(null)}
              onOpenTest={(tId) => setActiveTestId(tId)}
              onGoToVIP={() => {
                setActiveCourseId(null);
                setActiveTab('vip');
              }}
            />
          ) : activeTab === 'dashboard' ? (
            <StudentDashboard
              onNavigateTab={(tab: string) => {
                setActiveCourseId(null);
                setActiveTab(tab);
              }}
              onOpenCourse={(cId: string) => setActiveCourseId(cId)}
              onOpenTest={(tId: string) => setActiveTestId(tId)}
            />
          ) : activeTab === 'wallet' ? (
            <StudentWalletDepositView />
          ) : activeTab === 'courses' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                  📚 Video Darslar & Modullar
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Har bir mavzuni ketma-ketlikda o‘rganing va testlarni topshiring
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {db.courses.map(course => (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 mb-2">
                        {course.level}
                      </div>
                      <h3 className="font-bold text-stone-900 dark:text-white text-base mb-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2 mb-4">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      <span className="text-xs text-stone-500">
                        {course.lessonsCount} ta dars
                      </span>
                      <button
                        onClick={() => setActiveCourseId(course.id)}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 transition-colors shadow-xs"
                      >
                        Ochish →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'leaderboard' ? (
            <StudentLeaderboardView />
          ) : activeTab === 'olympiad' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                  ⏳ Mavzumiy Testlar & Musobaqalar
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  O‘tgan saralash g‘oliblari natijalari va keyingi bo‘ladigan katta olimpiadaning teskari sanoq soati
                </p>
              </div>
              <ThematicOlympiadsSection />
            </div>
          ) : activeTab === 'creators' ? (
            <SiteCreatorsSection />
          ) : activeTab === 'tests' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
                  📝 Mock Imtihonlar va Quizlar
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Haqiqiy Milliy sertifikat baholash mezonlari va vaqt cheklovi bilan
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {db.tests.map(test => (
                  <div
                    key={test.id}
                    className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
                        {test.type === 'mock' ? 'Milliy Sertifikat Mock' : test.type === 'diagnostic' ? 'Diagnostika' : 'Quiz'}
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2 leading-snug">
                        {test.title}
                      </h3>
                      <p className="text-xs text-stone-500 leading-relaxed mb-6">
                        {test.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      <div className="text-xs text-stone-500">
                        <span>{test.durationMinutes} daqiqa</span> · <span>Maks: {test.maxScore} ball</span>
                      </div>
                      <button
                        onClick={() => setActiveTestId(test.id)}
                        className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-[#F95738] hover:bg-[#E04828] text-white shadow-xs transition-colors"
                      >
                        Testni Boshlash →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'ai' ? (
            <AIMathAssistant onUpgradeVIP={() => setActiveTab('vip')} />
          ) : activeTab === 'results' ? (
            <div className="space-y-6">
              <ResultsSection />
            </div>
          ) : activeTab === 'history' ? (
            <TestHistoryView />
          ) : activeTab === 'vip' ? (
            <StudentSubscriptionsView />
          ) : (
            <StudentProfileView onNavigateToWallet={() => setActiveTab('wallet')} />
          )}
        </div>
      </main>
    </div>
  );
};
