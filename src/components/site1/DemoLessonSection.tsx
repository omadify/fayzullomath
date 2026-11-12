import React from 'react';
import { useApp } from '../../context/AppContext';
import { MathRenderer } from '../common/MathRenderer';
import { PlayCircle, Clock, FileText, CheckCircle2, Award } from 'lucide-react';
import { AnimatedSticker } from '../common/AnimatedSticker';

const getEmbedUrl = (url?: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  const ytMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return trimmed;
};

export const DemoLessonSection: React.FC = () => {
  const { db, setActiveSite, setActiveCourseId } = useApp();
  const demoLesson = db.lessons.find(l => l.isDemo) || db.lessons[0];

  if (!demoLesson) return null;

  return (
    <section id="demo-lesson" className="py-16 bg-transparent border-b border-stone-200/40 dark:border-stone-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
            <AnimatedSticker symbol="🔥" size="sm" />
            <span>Namunaviy Bepul Dars</span>
            <AnimatedSticker symbol="✨" size="sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-3">
            Dars Sifatini O‘zingiz Baholang
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Fayzullo ustozning 42 daqiqalik darsini bepul tomosha qiling va nostandart test yechish usullarini sinab ko‘ring.
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Video Player Column */}
            <div className="lg:col-span-7">
              <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-md border border-stone-800 relative">
                <iframe
                  src={getEmbedUrl(demoLesson.videoUrl)}
                  title={demoLesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Lesson Details Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="font-bold text-rose-600 dark:text-rose-400 uppercase">
                  1-Dars (Namunaviy)
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {demoLesson.durationMinutes} daqiqa
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white leading-snug">
                {demoLesson.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {demoLesson.description}
              </p>

              {/* Formula Highlight */}
              {demoLesson.mathFormula && (
                <div className="bg-[#FBF9F5] dark:bg-stone-800/60 p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-700/80 text-center">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold tracking-wider mb-1">
                    Darsdagi Asosiy Formula (KaTeX)
                  </div>
                  <MathRenderer content={demoLesson.mathFormula} block />
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => {
                    setActiveCourseId(demoLesson.courseId);
                    setActiveSite('site2_lms');
                  }}
                  className="px-5 py-2.5 text-xs font-semibold rounded-xl text-white bg-[#F95738] hover:bg-[#E04828] shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Kabinetda Barcha Darslarni Ko‘rish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
