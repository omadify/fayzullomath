import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  PlayCircle,
  Award,
  Sparkles,
  Clock,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Code2,
  Users
} from 'lucide-react';
import { ThematicOlympiadsSection } from './ThematicOlympiadsSection';
import { AnimatedSticker } from '../common/AnimatedSticker';

interface StudentDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenCourse: (courseId: string) => void;
  onOpenTest: (testId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateTab,
  onOpenCourse,
  onOpenTest
}) => {
  const { db, currentUser } = useApp();

  const totalLessons = db.lessons.length || 1;
  const completedCount = currentUser?.completedLessons.length || 0;
  const completionPercentage = Math.round((completedCount / totalLessons) * 100);

  const studentAttempts = db.testAttempts.filter(a => a.userId === currentUser?.id);
  const avgScore = studentAttempts.length > 0
    ? Math.round(studentAttempts.reduce((acc, a) => acc + (a.score / a.maxScore * 100), 0) / studentAttempts.length)
    : 0;

  // Next course to resume
  const firstIncompleteLesson = db.lessons.find(l => !currentUser?.completedLessons.includes(l.id)) || db.lessons[0];
  const resumeCourse = firstIncompleteLesson
    ? db.courses.find(c => c.id === firstIncompleteLesson.courseId)
    : db.courses[0];

  const isVip = Boolean(currentUser?.vipTier && currentUser.vipTier !== 'none' && currentUser.vipTier !== 'free' && currentUser.vipExpiresAt && new Date(currentUser.vipExpiresAt) > new Date());
  const vipTierLabel = isVip ? currentUser?.vipTier?.toUpperCase() : 'ODDIY (TEKIN)';
  const vipExpiresAtLabel = isVip && currentUser?.vipExpiresAt
    ? new Date(currentUser.vipExpiresAt).toLocaleDateString('uz-UZ')
    : 'Aktiv emas (Depozit talab etiladi)';

  const topStudent = db.studentLeaderboard?.[0] || { studentName: 'Shohjahon Abdullayev', points: 2950 };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
            O‘quvchi Kabineti · LMS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Xush kelibsiz, {currentUser?.name || 'O‘quvchi'}!
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg leading-relaxed">
            Bugun yana bir qadam oldinga siljish vaqti. Milliy sertifikat A+ natijasi kundalik muntazam amaliyot natijasida keladi.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 sm:p-5 rounded-2xl shrink-0 flex flex-col justify-between relative z-10 min-w-[200px]">
          <div className="text-[11px] text-stone-300 uppercase tracking-wider font-medium">
            Joriy Tarif Maqomi
          </div>
          <div className="text-lg font-black text-amber-300 uppercase my-1">
            {vipTierLabel}
          </div>
          <div className="text-[11px] text-stone-400">
            {vipExpiresAtLabel}
          </div>
          <button
            onClick={() => onNavigateTab('vip')}
            className="mt-3 w-full py-1.5 text-[11px] font-semibold rounded-lg bg-white text-stone-900 hover:bg-stone-100 transition-colors shadow-xs"
          >
            {isVip ? 'Tarifni Uzaytirish' : 'Depozit Qilish & VIP Olish'}
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Lessons Progress */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>Darslar Jarayoni</span>
            <PlayCircle className="w-4 h-4 text-[#F95738]" />
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-white tabular-nums mb-2">
            {completionPercentage}%
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#F95738] h-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-[11px] text-stone-400 mt-2 block truncate">
            {completedCount} / {totalLessons} dars tugatildi
          </span>
        </div>

        {/* Card 2: Average Score */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>O‘rtacha Test Bali</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-white tabular-nums mb-2">
            {avgScore > 0 ? `${avgScore}%` : '—'}
          </div>
          <span className="text-[11px] text-stone-400 block truncate">
            {studentAttempts.length} ta urinish natijasi
          </span>
        </div>

        {/* Card 3: Student Results */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>A+ Sertifikatlar</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-stone-900 dark:text-white tabular-nums mb-2">
            {db.studentResults?.length || 0} ta
          </div>
          <button
            onClick={() => onNavigateTab('results')}
            className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline block truncate"
          >
            Natijalar arxivi →
          </button>
        </div>

        {/* Card 4: O'quvchilar Reytingi (Student Leaderboard) */}
        <div className="bg-gradient-to-tr from-amber-500/10 via-rose-500/5 to-white dark:to-stone-900 border border-amber-400/50 dark:border-amber-500/30 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 mb-1 font-bold">
              <span>O‘quvchilar Reytingi</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-sm font-black text-stone-900 dark:text-white truncate">
              {topStudent.studentName}
            </div>
            <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold mb-2 flex items-center gap-1">
              <AnimatedSticker symbol="🥇" size="sm" />
              <span>#1 Mutlaq Lider ({topStudent.points} ball)</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('leaderboard')}
            className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline text-left block"
          >
            Shoxsupani ko‘rish →
          </button>
        </div>

        {/* Card 5: Sayt Yaratuvchilari */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span>Sayt Yaratuvchilari</span>
              <Code2 className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-sm font-bold text-stone-900 dark:text-white mb-1">
              3 Nafer Muhandis
            </div>
            <div className="text-[10px] text-stone-400">
              Fullstack · UI/UX · AI
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('creators')}
            className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline block truncate text-left"
          >
            Dasturchilar bilan tanishish →
          </button>
        </div>
      </div>

      {/* MAVZUMIY TESTLAR & JONLI TESKARI SANOQ SOATI (Boshqaruv panelida ko'rsatiladi) */}
      <ThematicOlympiadsSection />

      {/* Resume Learning Card */}
      {firstIncompleteLesson && resumeCourse && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
              <PlayCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                Davom ettirish kerak bo‘lgan dars
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white mt-0.5">
                {firstIncompleteLesson.title}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Kurs: {resumeCourse.title} · Davomiyligi: {firstIncompleteLesson.durationMinutes} daqiqa
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenCourse(resumeCourse.id)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 dark:bg-white dark:text-stone-900 hover:bg-stone-800 rounded-xl transition-colors shrink-0 shadow-xs flex items-center gap-2"
          >
            <span>Darsni Davom Ettirish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Bottom Grid: Available Mock Tests & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Mock Tests Box */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">
              Tavsiya Etiladigan Testlar va Mock Sinovlar
            </h3>
            <button
              onClick={() => onNavigateTab('tests')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
            >
              Barchasi →
            </button>
          </div>

          <div className="space-y-3">
            {db.tests.slice(0, 3).map(test => (
              <div
                key={test.id}
                className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-4 hover:border-stone-300 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white leading-snug">
                    {test.title}
                  </h4>
                  <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-3">
                    <span>{test.durationMinutes} daqiqa</span>
                    <span>·</span>
                    <span>{test.questionsCount} ta savol</span>
                    <span>·</span>
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      Maks: {test.maxScore} ball
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenTest(test.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors shrink-0"
                >
                  Boshlash
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & Announcements */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white mb-4">
            Ustoz E’lonlari va Xabarlar
          </h3>

          <div className="space-y-3">
            {db.notifications.slice(0, 3).map(n => (
              <div
                key={n.id}
                className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 text-xs"
              >
                <div className="font-bold text-stone-900 dark:text-white mb-1">
                  {n.title}
                </div>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-2">
                  {n.message}
                </p>
                <div className="text-[10px] text-stone-400">
                  {new Date(n.createdAt).toLocaleDateString('uz-UZ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
