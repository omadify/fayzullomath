import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { AnimatedSticker } from '../common/AnimatedSticker';

export const VIPPricingSection: React.FC = () => {
  const { db, setActiveSite } = useApp();
  const section = db.siteSections.find(s => s.key === 'vip');
  const [showComparison, setShowComparison] = useState(false);

  if (section && !section.isVisible) return null;

  return (
    <section id="vip" className="py-16 bg-transparent border-b border-stone-200/40 dark:border-stone-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
            <AnimatedSticker symbol="👑" size="sm" />
            <span>Obuna va VIP Tariflar</span>
            <AnimatedSticker symbol="💎" size="sm" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-3">
            {section?.title || 'VIP Tariflar va Qulay Narxlar'}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {section?.subtitle || 'Har qanday byudjet va maqsad uchun moslashuvchan ta’lim paketlari'}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {db.vipPlans.map(plan => {
            const isPopular = plan.isPopular;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                  isPopular
                    ? 'bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-2 border-[#F95738] shadow-md hover:scale-[1.02]'
                    : 'bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 shadow-xs hover:border-stone-400'
                }`}
              >
                {plan.badge && (
                  <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-stone-500 mb-4 min-h-[32px]">
                    {plan.description}
                  </p>

                  <div className="mb-6 pb-5 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tabular-nums">
                        {plan.priceMonthly.toLocaleString()}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">so‘m</span>
                    </div>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      Amal qilish muddati: {plan.durationDays} kun
                    </span>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300 mb-8">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/80 font-medium">
                      {plan.hasAI ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span className="text-stone-900 dark:text-white">
                            Gemini AI Yordamchisi: <span className="text-rose-600 dark:text-rose-400 font-bold">{plan.aiDailyLimit > 500 ? 'Cheksiz' : `${plan.aiDailyLimit} ta/kun`}</span>
                          </span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                          <span className="text-stone-400">
                            AI Yordamchisi (Mavjud emas)
                          </span>
                        </>
                      )}
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setActiveSite('site2_lms')}
                  className={`w-full py-2.5 text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                    isPopular
                      ? 'bg-[#F95738] hover:bg-[#E04828] text-white'
                      : 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-100'
                  }`}
                >
                  <span>Tanlash</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Toggle comparison table button */}
        <div className="text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white underline underline-offset-4"
          >
            {showComparison ? 'Taqqoslama jadvalni yashirish ▲' : 'Barcha tariflarni batafsil taqqoslash jadvali ▼'}
          </button>
        </div>

        {/* Comparison Table */}
        {showComparison && (
          <div className="mt-8 overflow-x-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xs">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500">
                  <th className="py-3 px-3">Xizmat va Imkoniyatlar</th>
                  <th className="py-3 px-3 text-center">START</th>
                  <th className="py-3 px-3 text-center text-rose-600 font-bold">GOLD</th>
                  <th className="py-3 px-3 text-center">PLATINUM</th>
                  <th className="py-3 px-3 text-center">INDIVIDUAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-stone-800 dark:text-stone-200">Asosiy Video Darslar</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600">✓</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-stone-800 dark:text-stone-200">Milliy Sertifikat Maxsus Darslari</td>
                  <td className="py-2.5 px-3 text-center text-stone-300">✕</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600">✓</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600">✓</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-stone-800 dark:text-stone-200">Maxsus Formula & Masalalar To‘plami</td>
                  <td className="py-2.5 px-3 text-center text-stone-400">Alohida xarid</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600">Standart</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600">Barcha Masalalar</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600">To‘liq Qo‘llanma + Yechimlar</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-stone-800 dark:text-stone-200">AI Matematika Yordamchisi</td>
                  <td className="py-2.5 px-3 text-center text-stone-300">✕ Qulflangan</td>
                  <td className="py-2.5 px-3 text-center text-stone-800 dark:text-stone-200">50 ta/kun</td>
                  <td className="py-2.5 px-3 text-center text-stone-800 dark:text-stone-200">150 ta/kun</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">Cheksiz</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-stone-800 dark:text-stone-200">Rasmiy Formatdagi Mock Imtihonlar</td>
                  <td className="py-2.5 px-3 text-center text-stone-300">✕</td>
                  <td className="py-2.5 px-3 text-center text-stone-400">Cheklangan</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600">✓ Cheksiz</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600">✓ Cheksiz</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-stone-800 dark:text-stone-200">Shaxsiy Ustoz Nazorati</td>
                  <td className="py-2.5 px-3 text-center text-stone-300">✕</td>
                  <td className="py-2.5 px-3 text-center text-stone-300">✕</td>
                  <td className="py-2.5 px-3 text-center text-stone-400">Vebinarlar</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">Haftada 2 marta</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
