import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, X, ZoomIn, ShieldCheck, Eye } from 'lucide-react';
import { StudentResult } from '../../types';

// Xarita: Postimg kichik eskiz kodlarini to'liq yuqori aniqlikdagi HD URL larga aylantirish
const POSTIMG_HD_MAP: Record<string, string> = {
  'zLqk83MT': 'https://i.postimg.cc/SKM1LMf1/photo-2026-11-09-18-26-21.jpg',
  'DW7cnmDd': 'https://i.postimg.cc/0NwXGw03/photo-2026-11-09-18-26-29.jpg',
  'SXmGkj5D': 'https://i.postimg.cc/FKLCbLx5/photo-2026-11-09-18-26-33.jpg',
  'xk9Pnq75': 'https://i.postimg.cc/HLyv0y9q/photo-2026-11-09-18-26-39.jpg',
  'DW7cnmDg': 'https://i.postimg.cc/zfg2wgF9/photo-2026-11-09-18-26-42.jpg',
  'KKm5x4V0': 'https://i.postimg.cc/jj7367hY/photo-2026-11-09-18-26-47.jpg',
  'qtpG4gYY': 'https://i.postimg.cc/0NwXGwC8/photo-2026-11-09-18-26-51.jpg',
  '94cBCzSK': 'https://i.postimg.cc/9f7gP7Bm/photo-2026-11-09-18-26-55.jpg',
  'R3vT4q82': 'https://i.postimg.cc/4392v914/photo-2026-11-09-18-26-59.jpg',
  '7CqNwbcp': 'https://i.postimg.cc/cJnk7nc4/photo-2026-11-09-18-27-02.jpg',
  'JyRQMtgf': 'https://i.postimg.cc/3wvfjvZx/photo-2026-11-09-18-27-07.jpg',
  'gwGKmrQ9': 'https://i.postimg.cc/JhkY3kQh/photo-2026-11-09-18-27-11.jpg',
  '1gMrtshJ': 'https://i.postimg.cc/xCVx61sD/photo-2026-11-09-18-27-15.jpg',
  'jWv45t0M': 'https://i.postimg.cc/3RQStxLQ/photo-2026-11-09-18-27-19.jpg',
  'MctmTq2s': 'https://i.postimg.cc/1t1Cv3WZ/photo-2026-11-09-18-27-22.jpg',
  'PLKQxTsV': 'https://i.postimg.cc/tTGSB4rb/photo-2026-11-09-18-27-29.jpg',
  'mcVyDBfn': 'https://i.postimg.cc/0Q1WVyt9/photo-2026-11-09-18-27-37.jpg',
  'f35fLDnr': 'https://i.postimg.cc/Hx1Z6kSd/photo-2026-11-09-18-27-41.jpg',
  'f35fLDn1': 'https://i.postimg.cc/zBYtxGdD/photo-2026-11-09-18-30-07.jpg',
};

export function getCrystalClearCertificateUrl(rawUrl: string | undefined): string {
  if (!rawUrl) return '';
  for (const [thumbCode, hdUrl] of Object.entries(POSTIMG_HD_MAP)) {
    if (rawUrl.includes(thumbCode)) {
      return hdUrl;
    }
  }
  return rawUrl;
}

export const ResultsSection: React.FC = () => {
  const { db } = useApp();
  const section = db.siteSections?.find(s => s.key === 'results');
  const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  if (section && !section.isVisible) return null;

  const results = db.studentResults?.filter(r => r.isPublished) || [];

  // Rasmni har doim tiniq HD va barqaror ochish (agar tarmoq sekinlashsa yoki postimg vaqtincha javob bermasa mahalliy zaxiraga o'tadi)
  const resolveImageSource = (res: StudentResult) => {
    const isFailed = failedImages[res.id];
    const localBackup = `/uploads/certificates/cert_${res.id}.jpg`;
    
    if (isFailed) {
      return localBackup;
    }

    const upgradedUrl = getCrystalClearCertificateUrl(res.certificateImageUrl);
    return upgradedUrl || localBackup;
  };

  const handleImageError = (id: string) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <section id="results" className="py-20 bg-white dark:bg-[#15171a] border-b border-stone-200/60 dark:border-stone-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Matematika Milliy Sertifikat Natijalari</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight mb-3">
            {section?.title || 'O‘quvchilarimizning Matematika Milliy Sertifikatlari'}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            {section?.subtitle || 'Fayzullo ustoz shogirdlarining rasmiy Milliy sertifikat (A+, A darajalar) va 90+ ballik natijalari'}
          </p>
        </div>

        {/* Results Grid: Clean Certificate Cards (Faqat Ism, Ball, Tiniq Rasm va Ko'rish tugmasi) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {results.map(res => {
            const imgSrc = resolveImageSource(res);

            return (
              <div
                key={res.id}
                onClick={() => setSelectedResult(res)}
                className="bg-[#FBF9F5] dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl p-3 sm:p-4 overflow-hidden flex flex-col justify-between hover:border-rose-400 dark:hover:border-rose-600 transition-all shadow-xs hover:shadow-xl group cursor-pointer"
              >
                {/* Katta va tiniq Sertifikat rasmi containeri (Vertikal A4 sertifikatlar uchun maxsus moslashgan) */}
                <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full bg-stone-100 dark:bg-stone-900 rounded-2xl flex items-center justify-center p-2 overflow-hidden group/img">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={`${res.studentName} — ${res.score}`}
                      loading="lazy"
                      decoding="async"
                      onError={() => handleImageError(res.id)}
                      className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-[1.02]"
                      style={{ imageRendering: 'high-quality' as any }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-amber-600 to-rose-700 rounded-xl">
                      <Award className="w-16 h-16 text-white/40" />
                    </div>
                  )}

                  {/* Hover overlay with zoom button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] rounded-2xl">
                    <span className="px-4 py-2 rounded-xl bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-white font-bold text-xs flex items-center gap-2 shadow-lg">
                      <ZoomIn className="w-4 h-4 text-rose-600" />
                      <span>HD formatda ko‘rish</span>
                    </span>
                  </div>
                </div>

                {/* Pastki qism: O'quvchi ismi, To'plagan bali va Ko'rish tugmasi */}
                <div className="pt-4 pb-1 px-1 flex flex-col gap-3 justify-between flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="overflow-hidden">
                      <h4 className="font-black text-stone-900 dark:text-white text-base sm:text-lg truncate">
                        {res.studentName}
                      </h4>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                        {res.certificateType || 'Milliy Sertifikat'} {res.examDate ? `· ${res.examDate}` : ''}
                      </div>
                    </div>

                    {/* To'plagan bali */}
                    <div className="shrink-0">
                      <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-black text-xs shadow-xs">
                        {res.score}
                      </span>
                    </div>
                  </div>

                  {/* Ko'rish tugmasi */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedResult(res);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-stone-700 dark:text-stone-200 hover:text-rose-600 dark:hover:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-stone-200/60 dark:border-stone-700/60"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Sertifikatni to‘liq ko‘rish</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Certificate Modal (HD formatda to'liq ko'rsatish) */}
      {selectedResult && (
        <div 
          onClick={() => setSelectedResult(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl relative my-auto flex flex-col max-h-[96vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200 dark:border-stone-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 dark:text-white text-base sm:text-lg">
                    {selectedResult.studentName}
                  </h3>
                  <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    {selectedResult.certificateType || 'Milliy Sertifikat'} · {selectedResult.score}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedResult(null)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title="Yopish"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Katta va tiniq HD Sertifikat rasmi containeri (To'liq HD, siqilmasdan) */}
            <div className="relative rounded-2xl bg-stone-100 dark:bg-stone-950 flex items-center justify-center p-2 sm:p-3 overflow-hidden flex-1 min-h-[350px] max-h-[82vh]">
              {resolveImageSource(selectedResult) ? (
                <img
                  src={resolveImageSource(selectedResult)}
                  alt={`${selectedResult.studentName} — ${selectedResult.score}`}
                  onError={() => handleImageError(selectedResult.id)}
                  className="object-contain w-full h-full max-h-[80vh] mx-auto rounded-xl"
                  style={{ imageRendering: 'high-quality' as any }}
                />
              ) : (
                <div className="p-12 text-center text-stone-900 dark:text-white">
                  <Award className="w-16 h-16 mx-auto mb-2 text-amber-500" />
                  <div className="text-2xl font-black">{selectedResult.score}</div>
                </div>
              )}
            </div>

            {/* Pastki panel */}
            <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center shrink-0">
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                Matematika Milliy Sertifikati — Rasmiy HD Natija
              </span>
              <button
                type="button"
                onClick={() => setSelectedResult(null)}
                className="px-6 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-xs transition-colors hover:bg-stone-800 dark:hover:bg-stone-100 cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
