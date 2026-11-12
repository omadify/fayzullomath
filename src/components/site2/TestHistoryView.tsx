import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const TestHistoryView: React.FC = () => {
  const { db, currentUser } = useApp();
  const attempts = db.testAttempts.filter(a => a.userId === currentUser?.id);

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
          Testlar va Imtihonlar Tarixi
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Barcha topshirilgan quiz va mock sinovlarining to‘liq hisoboti
        </p>
      </div>

      {attempts.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200/60 dark:border-stone-800">
          <Award className="w-10 h-10 text-stone-400 mx-auto mb-2" />
          <p className="text-xs sm:text-sm text-stone-500">
            Siz hozircha birorta ham test sinovini topshirmadingiz.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 text-xs">
                <th className="py-3 px-3 font-semibold">Test Nomi</th>
                <th className="py-3 px-3 font-semibold">Ball / Natija</th>
                <th className="py-3 px-3 font-semibold">To‘g‘ri Javoblar</th>
                <th className="py-3 px-3 font-semibold">Sarflangan Vaqt</th>
                <th className="py-3 px-3 font-semibold">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {attempts.map(a => {
                const percent = Math.round((a.score / a.maxScore) * 100);
                return (
                  <tr key={a.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-stone-900 dark:text-white">
                      {a.testTitle}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
                        {a.score} ball ({percent}%)
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-stone-600 dark:text-stone-300">
                      {a.correctCount} / {a.totalQuestions} ta
                    </td>
                    <td className="py-3.5 px-3 text-stone-500 tabular-nums">
                      {Math.round(a.timeSpentSeconds / 60)} daqiqa
                    </td>
                    <td className="py-3.5 px-3 text-stone-500 text-xs tabular-nums">
                      {new Date(a.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
