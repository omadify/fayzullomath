import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { InstructorRanking } from '../../types';
import {
  Trophy,
  Medal,
  Award,
  Star,
  Users,
  TrendingUp,
  GraduationCap,
  Sparkles,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Info,
  Calendar,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export const initialInstructors: InstructorRanking[] = [
  {
    id: 'inst-1',
    name: 'Fayzullo Omanullayev',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    roleTitle: 'Akademiya Asoschisi & Bosh Metodist',
    experienceYears: 8,
    nationalCertPassRate: 94.8,
    grantRate: 91.5,
    avgStudentScore: 94.2,
    studentRating: 4.99,
    totalStudents: 1450,
    totalLessons: 240,
    specialties: ['Parametrli Tenglamalar', 'Stereometriya', 'Milliy Sertifikat A+', 'Viyet Nostandart'],
    bioSnippet: 'Formulalarni yodlashsiz, mantiqiy mohiyat orqali o‘rgatish metodikasi muallifi. 215 dan ortiq A+ daraja sohiblari ustozi.',
    badge: '1-o‘rin · Bosh Pedagog'
  },
  {
    id: 'inst-2',
    name: 'Sarvarbek Xoliqov',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    roleTitle: 'Katta Matematika O‘qituvchisi & Olimpiada Koordinatori',
    experienceYears: 6,
    nationalCertPassRate: 88.4,
    grantRate: 85.0,
    avgStudentScore: 89.6,
    studentRating: 4.92,
    totalStudents: 890,
    totalLessons: 175,
    specialties: ['Kombinatorika', 'Ehtimollar Nazariyasi', 'Planimetriya', 'Mantiqiy Yechimlar'],
    bioSnippet: 'Respublika olimpiadasi sovrindori. Geometriya va kombinatorika bo‘yicha tezkor vizual metodika ustasi.',
    badge: '2-o‘rin · Olimpiada Ustasi'
  },
  {
    id: 'inst-3',
    name: 'Dilshodbek Qodirov',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    roleTitle: 'Milliy Sertifikat & DTM Test Tahlilchisi',
    experienceYears: 5,
    nationalCertPassRate: 83.6,
    grantRate: 80.2,
    avgStudentScore: 86.8,
    studentRating: 4.87,
    totalStudents: 640,
    totalLessons: 130,
    specialties: ['Trigonometriya', 'Hosila va Integral', 'Tezkor Test Strategiyalari'],
    bioSnippet: 'UzBMB testlarini soniyalarda tahlil qilish va murakkab funksiyalarni oson yechish metodisti.',
    badge: '3-o‘rin · Test Tahlilchisi'
  },
  {
    id: 'inst-4',
    name: 'Nodirbek Usmonov',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    roleTitle: 'Algebra & Funksional Tahlil Murabbiyi',
    experienceYears: 4,
    nationalCertPassRate: 79.2,
    grantRate: 76.5,
    avgStudentScore: 83.5,
    studentRating: 4.81,
    totalStudents: 480,
    totalLessons: 110,
    specialties: ['Funksiyalar va Grafiklar', 'Logarifmlar', 'Tenglamalar Sistemasi'],
    bioSnippet: 'Funksiyalar grafigi va tengsizliklarni koordinatalar usulida yechish bo‘yicha ixtisoslashgan ustoz.',
    badge: '4-o‘rin'
  },
  {
    id: 'inst-5',
    name: 'Nilufar Saidova',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    roleTitle: 'Boshlang‘ich & Asosiy Matematika Metodisti',
    experienceYears: 4,
    nationalCertPassRate: 76.4,
    grantRate: 73.0,
    avgStudentScore: 81.2,
    studentRating: 4.79,
    totalStudents: 420,
    totalLessons: 95,
    specialties: ['Arifmetika', 'Mantiqiy Masalalar', 'Matnli Masalalar', 'Psixologik Tayyorgarlik'],
    bioSnippet: 'Matematik poydevorni noldan mustahkamlash va test hayajonini yengish bo‘yicha tajribali pedagog.',
    badge: '5-o‘rin'
  }
];

type MetricKey = 'nationalCertPassRate' | 'grantRate' | 'avgStudentScore' | 'studentRating' | 'totalStudents';

interface MetricConfig {
  key: MetricKey;
  label: string;
  unit: string;
  max: number;
  nationalAvg: number;
  description: string;
}

const metricConfigs: MetricConfig[] = [
  {
    key: 'nationalCertPassRate',
    label: 'Milliy Sertifikat A+ Foizi',
    unit: '%',
    max: 100,
    nationalAvg: 32.5,
    description: 'O‘quvchilarining Milliy sertifikat imtihonida A+ va A eng yuqori darajalarni qo‘lga kiritish foizi'
  },
  {
    key: 'grantRate',
    label: 'OTM Davlat Granti Natijasi',
    unit: '%',
    max: 100,
    nationalAvg: 28.0,
    description: 'Abituriyent o‘quvchilarning davlat granti asosida talabalikka qabul qilinish ko‘rsatkichi'
  },
  {
    key: 'avgStudentScore',
    label: 'O‘quvchilar O‘rtacha Bali',
    unit: ' ball',
    max: 100,
    nationalAvg: 58.4,
    description: 'UzBMB va akademiya mock imtihonlarida o‘quvchilar to‘plagan o‘rtacha umumiy ball'
  },
  {
    key: 'studentRating',
    label: 'Mamnuniyat Bahosi',
    unit: ' / 5.0',
    max: 5.0,
    nationalAvg: 4.10,
    description: 'O‘quvchilar va ota-onalar tomonidan dars sifati va natijaga qo‘yilgan o‘rtacha reyting'
  },
  {
    key: 'totalStudents',
    label: 'Tayyorlangan O‘quvchilar',
    unit: ' ta',
    max: 1600,
    nationalAvg: 250,
    description: 'Ushbu ustoz qo‘lida ta’lim olgan va muvaffaqiyatli yakunlagan jami abituriyentlar soni'
  }
];

interface InstructorRankingProps {
  onSelectCourse?: () => void;
}

export const InstructorRankingView: React.FC<InstructorRankingProps> = ({ onSelectCourse }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('nationalCertPassRate');
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorRanking | null>(null);
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');

  const currentMetric = metricConfigs.find(m => m.key === selectedMetric) || metricConfigs[0];

  // Filter and sort instructors
  const filteredAndSortedInstructors = useMemo(() => {
    let list = [...initialInstructors];

    if (filterSpecialty !== 'all') {
      list = list.filter(inst =>
        inst.specialties.some(s => s.toLowerCase().includes(filterSpecialty.toLowerCase()))
      );
    }

    return list.sort((a, b) => b[selectedMetric] - a[selectedMetric]);
  }, [selectedMetric, filterSpecialty]);

  const top3 = useMemo(() => {
    return [...initialInstructors].sort((a, b) => b[selectedMetric] - a[selectedMetric]).slice(0, 3);
  }, [selectedMetric]);

  const getBarColor = (index: number, isLead: boolean) => {
    if (isLead) {
      return 'from-[#F95738] via-amber-500 to-rose-600';
    }
    switch (index) {
      case 0:
        return 'from-amber-500 to-amber-600';
      case 1:
        return 'from-blue-500 to-indigo-600';
      case 2:
        return 'from-emerald-500 to-teal-600';
      case 3:
        return 'from-purple-500 to-violet-600';
      default:
        return 'from-stone-500 to-stone-600';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Akademiya Matematika Ustozlari Reytingi</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Yetakchi Matematika Ustozlari Natijadorligi
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Akademiyamiz ustozlarining Milliy Sertifikat A+ ko‘rsatkichlari, OTM davlat grantlari foizi va o‘quvchilar baholari asosidagi shaffof tahliliy bar chart reytingi. Bosh o‘qituvchi — <strong className="text-white font-bold">Fayzullo Omanullayev</strong>.
          </p>
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 2nd Place */}
        {top3[1] && (
          <div className="order-2 md:order-1 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xs relative">
            <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              <Medal className="w-3.5 h-3.5 text-slate-400" />
              <span>2-o‘rin</span>
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 mb-3 shadow-xs">
                <img src={top3[1].avatarUrl} alt={top3[1].name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white mb-0.5">
                {top3[1].name}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3 line-clamp-1">
                {top3[1].roleTitle}
              </p>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>{currentMetric.label}:</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {top3[1][selectedMetric]}
                    {currentMetric.unit}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>O‘quvchilar:</span>
                  <span>{top3[1].totalStudents} ta</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedInstructor(top3[1])}
              className="mt-4 w-full py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
            >
              Batafsil ma’lumot
            </button>
          </div>
        )}

        {/* 1st Place (Fayzullo Omanullayev - Leader) */}
        {top3[0] && (
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-500/10 dark:via-stone-900 dark:to-stone-900 border-2 border-amber-400/60 dark:border-amber-500/60 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-md relative md:-translate-y-2">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-300 bg-amber-400/30 px-3 py-1 rounded-full border border-amber-400/40">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>1-O‘RIN · YETAKCHI</span>
            </div>

            <div>
              <div className="relative inline-block mb-3">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md">
                  <img src={top3[0].avatarUrl} alt={top3[0].name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              <h3 className="text-lg font-black text-stone-900 dark:text-white mb-0.5">
                {top3[0].name}
              </h3>
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-3">
                {top3[0].roleTitle}
              </p>

              <div className="p-3.5 bg-gradient-to-r from-amber-500/15 to-rose-500/15 dark:from-amber-950/40 dark:to-rose-950/40 rounded-xl space-y-1.5 text-xs border border-amber-500/20">
                <div className="flex justify-between items-center text-stone-700 dark:text-stone-200">
                  <span className="font-medium">{currentMetric.label}:</span>
                  <span className="text-base font-black text-rose-600 dark:text-rose-400">
                    {top3[0][selectedMetric]}
                    {currentMetric.unit}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
                  <span>Milliy Sertifikat A+:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">94.8%</span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
                  <span>OTM Grantlari:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">91.5%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedInstructor(top3[0])}
              className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F95738] to-[#E04828] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Fayzullo ustoz profili</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div className="order-3 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xs relative">
            <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-full">
              <Medal className="w-3.5 h-3.5 text-amber-600" />
              <span>3-o‘rin</span>
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-600/60 dark:border-amber-700 mb-3 shadow-xs">
                <img src={top3[2].avatarUrl} alt={top3[2].name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white mb-0.5">
                {top3[2].name}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3 line-clamp-1">
                {top3[2].roleTitle}
              </p>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>{currentMetric.label}:</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {top3[2][selectedMetric]}
                    {currentMetric.unit}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>O‘quvchilar:</span>
                  <span>{top3[2].totalStudents} ta</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedInstructor(top3[2])}
              className="mt-4 w-full py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
            >
              Batafsil ma’lumot
            </button>
          </div>
        )}
      </div>

      {/* Interactive Bar Chart Section */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Metric Switcher Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white">
                Natijadorlik Bar Chart Grafigi
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {currentMetric.description}
            </p>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 dark:bg-stone-800/80 p-1.5 rounded-2xl">
            {metricConfigs.map(m => (
              <button
                key={m.key}
                onClick={() => setSelectedMetric(m.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedMetric === m.key
                    ? 'bg-white dark:bg-stone-900 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* National Benchmark Banner */}
        <div className="my-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              Respublika bo‘yicha o‘rtacha ko‘rsatkich: <strong className="font-bold text-amber-700 dark:text-amber-400">{currentMetric.nationalAvg}{currentMetric.unit}</strong>.
              Akademiya yetakchisi <strong>Fayzullo Omanullayev</strong> ko‘rsatkichi bu me’yordan qariyb <strong>{(94.8 / 32.5).toFixed(1)} baravar</strong> yuqori!
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold shrink-0 self-start sm:self-auto">
            +{(filteredAndSortedInstructors[0][selectedMetric] - currentMetric.nationalAvg).toFixed(1)}{currentMetric.unit} farq
          </span>
        </div>

        {/* The Bar Chart */}
        <div className="space-y-6 pt-2">
          {filteredAndSortedInstructors.map((inst, index) => {
            const val = inst[selectedMetric];
            const percentWidth = Math.min(100, Math.max(12, (val / currentMetric.max) * 100));
            const isFayzullo = inst.name.includes('Fayzullo');

            return (
              <div
                key={inst.id}
                onClick={() => setSelectedInstructor(inst)}
                className="group cursor-pointer p-3 sm:p-4 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-all border border-transparent hover:border-stone-200 dark:hover:border-stone-800"
              >
                {/* Tutor Info Header above bar */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      index === 0
                        ? 'bg-amber-500 text-white'
                        : index === 1
                        ? 'bg-slate-300 text-stone-800 dark:bg-slate-700 dark:text-white'
                        : index === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                    }`}>
                      {index + 1}
                    </span>

                    <div className="w-9 h-9 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 shrink-0">
                      <img src={inst.avatarUrl} alt={inst.name} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 dark:text-white group-hover:text-rose-600 transition-colors">
                          {inst.name}
                        </span>
                        {isFayzullo && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase">
                            Bosh Ustoz
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:inline">
                        {inst.roleTitle}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base sm:text-lg font-black text-stone-900 dark:text-white group-hover:text-rose-600 transition-colors">
                      {val}{currentMetric.unit}
                    </span>
                    <span className="text-[10px] text-stone-400 block">
                      {inst.totalStudents} o‘quvchi
                    </span>
                  </div>
                </div>

                {/* Animated Bar with Visual Scale */}
                <div className="relative w-full h-8 sm:h-9 bg-stone-100 dark:bg-stone-800 rounded-xl overflow-hidden p-1 flex items-center">
                  {/* National Average benchmark indicator line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-dashed border-r-2 border-stone-400 dark:border-stone-500 z-10"
                    style={{ left: `${(currentMetric.nationalAvg / currentMetric.max) * 100}%` }}
                    title={`Respublika o‘rtacha: ${currentMetric.nationalAvg}${currentMetric.unit}`}
                  />

                  {/* Filled Progress Bar */}
                  <div
                    className={`h-full rounded-lg bg-gradient-to-r ${getBarColor(index, isFayzullo)} transition-all duration-700 flex items-center justify-between px-3 text-white font-bold text-xs shadow-xs`}
                    style={{ width: `${percentWidth}%` }}
                  >
                    <span className="truncate pr-2 text-[11px] font-semibold opacity-95">
                      {inst.name}
                    </span>
                    <span className="text-xs font-black shrink-0">
                      {val}{currentMetric.unit}
                    </span>
                  </div>
                </div>

                {/* Specialties preview pills */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-1">
                  {inst.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] font-medium text-stone-600 dark:text-stone-400"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Benchmark Chart Legend */}
        <div className="mt-8 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gradient-to-r from-[#F95738] to-amber-500" />
              <span>Fayzullo Omanullayev (Bosh ustoz)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-indigo-600" />
              <span>Akademiya murabbiylari</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-stone-400 border border-stone-400" />
              <span>Respublika o‘rtachasi</span>
            </div>
          </div>

          <span className="text-[11px] font-medium">
            Ma’lumotlar so‘nggi Milliy Sertifikat va OTM kirish sessiyalari asosida yangilangan
          </span>
        </div>
      </div>

      {/* Comparison Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedInstructors.map(inst => (
          <div
            key={inst.id}
            className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:border-rose-400 dark:hover:border-rose-600 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={inst.avatarUrl}
                    alt={inst.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white text-base">
                      {inst.name}
                    </h4>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      {inst.experienceYears} yillik tajriba
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{inst.studentRating}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                {inst.bioSnippet}
              </p>

              {/* Metrics mini grid */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl text-xs mb-4">
                <div>
                  <span className="text-[10px] text-stone-400 block">Milliy Sertifikat:</span>
                  <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm">
                    {inst.nationalCertPassRate}% A+
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Davlat Granti:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                    {inst.grantRate}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">O‘rtacha Ball:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {inst.avgStudentScore} / 100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">O‘quvchilar:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {inst.totalStudents}+ nafar
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedInstructor(inst)}
              className="w-full py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-rose-500 dark:hover:border-rose-500 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Profil va darslarni ko‘rish</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Instructor Detail Modal */}
      {selectedInstructor && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedInstructor(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedInstructor.avatarUrl}
                alt={selectedInstructor.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-stone-200 dark:border-stone-700 shadow-md"
              />
              <div>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                  {selectedInstructor.badge || 'Ustoz Reytingi'}
                </span>
                <h3 className="text-xl font-black text-stone-900 dark:text-white">
                  {selectedInstructor.name}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {selectedInstructor.roleTitle}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700">
                <span className="font-bold text-stone-900 dark:text-white block mb-1">
                  Ustoz Metodikasi va Tavsifi:
                </span>
                <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-xs">
                  {selectedInstructor.bioSnippet}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-[11px] text-amber-700 dark:text-amber-300 block">
                    Milliy Sertifikat A+:
                  </span>
                  <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                    {selectedInstructor.nationalCertPassRate}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block">
                    OTM Davlat Granti:
                  </span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {selectedInstructor.grantRate}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <span className="text-[11px] text-blue-700 dark:text-blue-300 block">
                    O‘quvchilar O‘rtacha Bali:
                  </span>
                  <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                    {selectedInstructor.avgStudentScore} ball
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <span className="text-[11px] text-rose-700 dark:text-rose-300 block">
                    O‘quvchilar Mamnuniyati:
                  </span>
                  <span className="text-lg font-black text-rose-600 dark:text-rose-400">
                    {selectedInstructor.studentRating} / 5.0
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-stone-900 dark:text-white block mb-2">
                  Asosiy Mutaxassislik Yo‘nalishlari:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedInstructor.specialties.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedInstructor(null)}
              className="w-full mt-6 py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-semibold text-xs transition-colors"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
