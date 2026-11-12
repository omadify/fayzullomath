import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VIPPlan } from '../../types';
import { Save, CheckCircle, Sparkles, CreditCard } from 'lucide-react';

export const VIPTariffsManager: React.FC = () => {
  const { db, updateVIPPlans } = useApp();
  const [plans, setPlans] = useState<VIPPlan[]>(JSON.parse(JSON.stringify(db.vipPlans)));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePlanChange = (index: number, field: keyof VIPPlan, value: any) => {
    setPlans(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = async () => {
    await updateVIPPlans(plans);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
            VIP Tariflar va Narxlar Sozlamalari
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            START, GOLD, PLATINUM va INDIVIDUAL paketlarining oylik narxi, kunlari va AI limitlarini boshqarish
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Narxlarni Yangilash</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Tariflar va narxlar Sayt 1 hamda Sayt 2 da darhol yangilandi!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={plan.id}
            className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="font-bold text-base text-stone-900 dark:text-white">
                {plan.name}
              </h3>
              <span className="text-[10px] font-bold uppercase text-rose-600 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40">
                {plan.id}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-500 mb-1 font-medium">Narxi (so‘m)</label>
                <input
                  type="number"
                  value={plan.priceMonthly}
                  onChange={e => handlePlanChange(idx, 'priceMonthly', parseInt(e.target.value, 10))}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent font-bold text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-stone-500 mb-1 font-medium">Amal Qilish Muddati (Kun)</label>
                <input
                  type="number"
                  value={plan.durationDays}
                  onChange={e => handlePlanChange(idx, 'durationDays', parseInt(e.target.value, 10))}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent font-bold text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-stone-500 mb-1 font-medium">Qisqa Tavsif</label>
                <textarea
                  rows={2}
                  value={plan.description}
                  onChange={e => handlePlanChange(idx, 'description', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-white"
                />
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">AI Yordamchisi:</span>
                  <input
                    type="checkbox"
                    checked={plan.hasAI}
                    onChange={e => handlePlanChange(idx, 'hasAI', e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                </div>

                {plan.hasAI && (
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">Kunlik AI so‘rov limiti</label>
                    <input
                      type="number"
                      value={plan.aiDailyLimit}
                      onChange={e => handlePlanChange(idx, 'aiDailyLimit', parseInt(e.target.value, 10))}
                      className="w-full p-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-transparent font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
