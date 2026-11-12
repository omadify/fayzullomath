import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseLevel } from '../../types';
import { PlayCircle, Clock, ArrowRight } from 'lucide-react';
import { AnimatedSticker } from '../common/AnimatedSticker';

export const CoursesSection: React.FC = () => {
  const { db, setActiveSite, setActiveCourseId } = useApp();
  const section = db.siteSections.find(s => s.key === 'courses');
  const [selectedFilter, setSelectedFilter] = useState<'all' | CourseLevel>('all');

  if (section && !section.isVisible) return null;

  const publishedCourses = db.courses.filter(c => c.published);
  const filteredCourses = selectedFilter === 'all'
    ? publishedCourses
    : publishedCourses.filter(c => c.level === selectedFilter);

  const filters: { key: 'all' | CourseLevel; label: string; symbol: string }[] = [
    { key: 'all', label: 'Barcha Kurslar', symbol: '✨' },
    { key: 'sertifikat', label: 'Milliy Sertifikat A+', symbol: '🏆' },
    { key: 'otm', label: 'OTM Kirish Bloki', symbol: '🎓' },
    { key: 'maktab', label: 'Maktab Geometriyasi', symbol: '📐' },
    { key: 'olimpiada', label: 'Oliy Matematika', symbol: '🚀' }
  ];

  const handleOpenCourseInLMS = (courseId: string) => {
    setActiveCourseId(courseId);
    setActiveSite('site2_lms');
  };

  return (
    <section id="courses" className="py-16 bg-white/80 dark:bg-[#15171a]/80 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
            <AnimatedSticker symbol="🔥" size="sm" />
            <span>Ta’lim Dasturlari</span>
            <AnimatedSticker symbol="✨" size="sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-3 flex items-center justify-center gap-2">
            <span>{section?.title || 'Maxsus Ishlab Chiqilgan Kurslar'}</span>
            <AnimatedSticker symbol="📚" size="md" />
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            {section?.subtitle || 'Har bir yo‘nalish uchun tizimli video darslar, konspektlar va amaliy testlar'}
          </p>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-stone-100/90 dark:bg-stone-900/90 rounded-2xl mt-6 border border-stone-200/60 dark:border-stone-800/60 shadow-inner">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  selectedFilter === f.key
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-bold ring-1 ring-stone-200 dark:ring-stone-700'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <AnimatedSticker symbol={f.symbol} size="sm" />
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white/85 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 flex flex-col justify-between hover:border-rose-400/60 dark:hover:border-rose-500/40 transition-all shadow-xs hover:shadow-lg hover:-translate-y-0.5 group"
            >
              <div>
                {/* Clean unboxed metadata */}
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                  <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide flex items-center gap-1">
                    <AnimatedSticker
                      symbol={
                        course.level === 'sertifikat' ? '🏆' :
                        course.level === 'otm' ? '🎓' :
                        course.level === 'maktab' ? '📐' : '🚀'
                      }
                      size="sm"
                    />
                    <span>
                      {course.level === 'sertifikat' ? 'Milliy Sertifikat' : course.level === 'otm' ? 'OTM Bloki' : course.level === 'maktab' ? 'Maktab Baza' : 'Olimpiada'}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
                  <span className="font-mono text-[11px] font-bold text-stone-600 dark:text-stone-400">
                    VIP: {course.requiredVIP.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2 leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  {course.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                  {course.description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 py-3 border-t border-stone-100 dark:border-stone-800/80 mb-4">
                  <span className="flex items-center gap-1.5 font-medium">
                    <PlayCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>{course.lessonsCount} ta Video Dars</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{course.totalDurationMinutes} daqiqa</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Narxi:</span>
                    <span className="text-sm font-extrabold text-stone-900 dark:text-white">
                      {course.price > 0 ? `${course.price.toLocaleString()} so‘m` : 'VIP tarifda bepul'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenCourseInLMS(course.id)}
                    className="px-4 py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-[#F95738] dark:bg-white dark:text-stone-900 dark:hover:bg-[#F95738] dark:hover:text-white rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Darslarni Boshlash</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
