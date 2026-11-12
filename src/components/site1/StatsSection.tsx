import React from 'react';
import { useApp } from '../../context/AppContext';
import { AnimatedSticker } from '../common/AnimatedSticker';

export const StatsSection: React.FC = () => {
  const { db } = useApp();
  const section = db.siteSections.find(s => s.key === 'stats');
  if (section && !section.isVisible) return null;

  const stats = [
    {
      value: `${db.teacherProfile.studentsCount}+`,
      label: 'O‘quvchilar Soni',
      desc: 'Respublika bo‘ylab onlayn va oflayn ta’lim olgan abituriyentlar',
      symbol: '👥'
    },
    {
      value: `${db.teacherProfile.nationalCertCount}+`,
      label: 'Milliy Sertifikat',
      desc: 'A+ va A darajali sertifikat sohiblari (100% imtiyoz)',
      symbol: '🏆'
    },
    {
      value: `${db.teacherProfile.grantCount}+`,
      label: 'OTM Davlat Granti',
      desc: 'TATU, Turin, O‘zMU, Inha va xorijiy OTM grantiga ega bo‘lganlar',
      symbol: '🎓'
    },
    {
      value: `${db.teacherProfile.experienceYears} Yil`,
      label: 'Pedagogik Tajriba',
      desc: 'Doimiy yangilanib boruvchi ilg‘or metodika va test yechish san’ati',
      symbol: '🔥'
    }
  ];

  return (
    <section className="py-12 bg-white/75 dark:bg-[#15171a]/75 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-stone-200/60 dark:divide-stone-800/60">
          {stats.map((stat, idx) => (
            <div key={idx} className={`${idx !== 0 ? 'pt-6 lg:pt-0 lg:pl-8' : ''}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-3xl sm:text-4xl font-black text-[#F95738] tabular-nums tracking-tight">
                  {stat.value}
                </span>
                <AnimatedSticker symbol={stat.symbol} size="md" />
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">
                {stat.label}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
