import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, User } from 'lucide-react';
import { AnimatedSticker } from '../common/AnimatedSticker';

export const TeacherBioSection: React.FC = () => {
  const { db } = useApp();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [db.teacherProfile?.photoUrl]);

  const section = db.siteSections?.find(s => s.key === 'teacher');
  if (section && !section.isVisible) return null;

  const t = db.teacherProfile || {
    name: 'Fayzullo Omanullayev',
    title: 'Matematika fani bo‘yicha Milliy sertifikat eksperti & Pedagog',
    photoUrl: 'https://i.postimg.cc/GtPm4K25/photo-2026-11-09-19-50-01.jpg',
    bio: '8 yildan ortiq tajribaga ega matematika ustozi. Milliy sertifikat A+ va OTM davlat grantlariga tayyorlovchi professional pedagog. Yuzlab o‘quvchilar OTMlarga grant asosida kirgan.',
    experienceYears: 8,
    studentsCount: 1450,
    nationalCertCount: 215
  };

  return (
    <section id="teacher-bio" className="py-16 bg-transparent border-b border-stone-200/40 dark:border-stone-800/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-xl text-center relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-20 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* 1. Teacher Photo (Fayzullo Omanullayev) in strict 9:16 aspect ratio */}
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md aspect-[9/16] rounded-3xl bg-gradient-to-tr from-[#F95738] via-amber-500 to-rose-600 p-2 shadow-2xl mb-8 group-hover:scale-[1.01] transition-transform duration-500">
            <div className="w-full h-full rounded-[22px] overflow-hidden relative bg-stone-950 flex flex-col justify-between">
              {t.photoUrl && !imgError ? (
                <img
                  src={t.photoUrl}
                  alt={t.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 flex flex-col items-center justify-center text-white relative p-6">
                  <User className="w-24 h-24 text-amber-400/80 mb-3" />
                  <span className="text-2xl font-black text-amber-300">
                    {t.name}
                  </span>
                </div>
              )}

              {/* Badges on photo */}
              <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-stone-950/85 text-amber-300 border border-amber-400/50 text-xs font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-lg z-20">
                <AnimatedSticker symbol="🔥" size="sm" />
                <span>Bosh Metodist</span>
              </div>

              <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-emerald-600/90 text-white text-xs font-bold backdrop-blur-md flex items-center gap-1.5 shadow-lg z-20">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Rasmiy Ekspert ✓</span>
              </div>
            </div>
          </div>

          {/* 2. Directly underneath the photo: Name, Title, and About information */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center gap-2 text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-widest bg-rose-50 dark:bg-rose-950/40 px-4 py-1.5 rounded-full">
              <AnimatedSticker symbol="✨" size="sm" />
              <span>Bosh O‘qituvchi & Metodist</span>
              <AnimatedSticker symbol="✨" size="sm" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
              <span>{t.name}</span>
              <AnimatedSticker symbol="👨‍🏫" size="md" />
            </h2>

            <p className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400">
              {t.title}
            </p>

            <div className="pt-2">
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal bg-stone-50/60 dark:bg-stone-800/40 p-6 rounded-2xl border border-stone-200/60 dark:border-stone-800 text-center sm:text-justify">
                {t.bio || '8 yildan ortiq tajribaga ega matematika ustozi. Milliy sertifikat A+ va OTM davlat grantlariga tayyorlovchi professional pedagog.'}
              </p>
            </div>

            {/* Stats pill directly underneath */}
            <div className="pt-4 grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="bg-stone-100/80 dark:bg-stone-800/80 p-3 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 text-center">
                <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                  {t.experienceYears} Yil
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Tajriba</div>
              </div>

              <div className="bg-stone-100/80 dark:bg-stone-800/80 p-3 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 text-center">
                <div className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                  {t.studentsCount}+
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">O‘quvchilar</div>
              </div>

              <div className="bg-stone-100/80 dark:bg-stone-800/80 p-3 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 text-center">
                <div className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">
                  {t.nationalCertCount}+
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">A+ Sertifikat</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
