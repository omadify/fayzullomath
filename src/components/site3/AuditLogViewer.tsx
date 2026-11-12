import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Clock, FileText } from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const { db } = useApp();
  const logs = db.auditLogs || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-rose-600" />
          <span>Xavfsizlik va Administrator Audit Jurnali</span>
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Platformada amalga oshirilgan barcha tizim o‘zgarishlari, loginlar va yangilanishlar tarixi
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 text-xs bg-stone-50/50 dark:bg-stone-800/40">
                <th className="py-3.5 px-4 font-semibold">Vaqt</th>
                <th className="py-3.5 px-4 font-semibold">Bajaruvchi</th>
                <th className="py-3.5 px-4 font-semibold">Amal Turi</th>
                <th className="py-3.5 px-4 font-semibold">Bo‘lim / Obyekt</th>
                <th className="py-3.5 px-4 font-semibold">Batafsil Tafsilot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="py-3.5 px-4 text-stone-400 font-mono text-xs tabular-nums">
                    {new Date(log.timestamp).toLocaleString('uz-UZ')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">
                    {log.actor}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-stone-600 dark:text-stone-300">
                    {log.entity}
                  </td>
                  <td className="py-3.5 px-4 text-stone-700 dark:text-stone-300">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
