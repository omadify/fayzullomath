import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Wallet,
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { AnimatedSticker } from '../common/AnimatedSticker';
import { VIPPlan } from '../../types';

export const StudentSubscriptionsView: React.FC<{
  onNavigateTab?: (tab: string) => void;
}> = ({ onNavigateTab }) => {
  const { db, currentUser, purchaseVIPPlan } = useApp();
  const [purchasingPlan, setPurchasingPlan] = useState<VIPPlan | null>(null);
  const [insufficientModal, setInsufficientModal] = useState<any | null>(null);
  const [successModal, setSuccessModal] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const currentVIP = currentUser?.vipTier || 'start';
  const currentBalance = currentUser?.balance || 0;

  const handleSelectPlan = async (plan: VIPPlan) => {
    if (!currentUser) return;

    if (currentVIP === plan.id) return;

    // Check balance first
    if (plan.priceMonthly > 0 && currentBalance < plan.priceMonthly) {
      const missing = plan.priceMonthly - currentBalance;
      setInsufficientModal({
        plan,
        price: plan.priceMonthly,
        currentBalance,
        missing
      });
      return;
    }

    // Balance is enough, open confirmation modal
    setPurchasingPlan(plan);
  };

  const handleConfirmPurchase = async () => {
    if (!purchasingPlan) return;

    setLoading(true);
    try {
      const res = await purchaseVIPPlan(purchasingPlan.id);
      if (res.success) {
        setSuccessModal({
          plan: purchasingPlan,
          user: res.user
        });
        setPurchasingPlan(null);
      } else if (res.reason === 'insufficient_balance') {
        setPurchasingPlan(null);
        setInsufficientModal({
          plan: purchasingPlan,
          price: res.price,
          currentBalance: res.currentBal,
          missing: res.missing
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDeposit = () => {
    setInsufficientModal(null);
    if (onNavigateTab) {
      onNavigateTab('wallet');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <AnimatedSticker symbol="👑" size="sm" />
            <span>VIP Obuna & Rasmiy Tariflar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <span>Tariflarni Boshqarish va Xarid Qilish</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Tarifga o‘tish uchun avval hisobingizda yetarli depozit mablag‘i bo‘lishi lozim. Balansingiz yetarli bo‘lgach bitta tugma orqali faollashtirishingiz mumkin.
          </p>
        </div>

        {/* Balance badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs shrink-0 flex flex-col justify-between">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-100">
            Joriy Balansingiz:
          </div>
          <div className="text-xl font-black tabular-nums font-mono my-0.5">
            {currentBalance.toLocaleString()} so‘m
          </div>
          <button
            onClick={() => onNavigateTab && onNavigateTab('wallet')}
            className="mt-1 text-[11px] font-bold text-emerald-100 hover:text-white underline flex items-center gap-1 cursor-pointer"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>+ Balansni to‘ldirish (Depozit)</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {db.vipPlans.map(plan => {
          const isCurrent = currentVIP === plan.id;
          const isAffordable = currentBalance >= plan.priceMonthly || plan.priceMonthly === 0;

          return (
            <div
              key={plan.id}
              className={`bg-white/85 dark:bg-stone-900/85 backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between transition-all border shadow-xs relative ${
                isCurrent
                  ? 'border-2 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black text-stone-900 dark:text-white flex items-center gap-1.5">
                    <AnimatedSticker
                      symbol={
                        (plan.id as string) === 'start' || (plan.id as string) === 'free' ? '✨' :
                        (plan.id as string) === 'gold' || (plan.id as string) === 'pro' ? '⚡' :
                        plan.id === 'platinum' ? '🏆' : '👑'
                      }
                      size="sm"
                    />
                    <span>{plan.name}</span>
                  </h3>

                  {isCurrent && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Faol Tarif
                    </span>
                  )}
                </div>

                <div className="text-2xl font-black text-stone-900 dark:text-white tabular-nums mb-1 font-mono">
                  {plan.priceMonthly.toLocaleString()} <span className="text-xs text-stone-500 font-normal">so‘m</span>
                </div>
                <div className="text-[11px] text-stone-400 mb-4">
                  {plan.durationDays} kunlik doimiy kirish
                </div>

                <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300 mb-6 border-t border-stone-100 dark:border-stone-800 pt-4">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 font-medium text-stone-900 dark:text-white">
                    <AnimatedSticker symbol="🤖" size="sm" />
                    <span>AI: {plan.hasAI ? `${plan.aiDailyLimit > 500 ? 'Cheksiz' : `${plan.aiDailyLimit} ta/kun`}` : 'Mavjud emas'}</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <button
                disabled={isCurrent}
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed border border-stone-200 dark:border-stone-700'
                    : isAffordable
                    ? 'bg-gradient-to-r from-[#F95738] to-[#E04828] hover:from-[#E04828] hover:to-rose-700 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {isCurrent ? (
                  <span>Sizning Faol Tarifingiz ✓</span>
                ) : isAffordable ? (
                  <>
                    <span>Shu Tarifga O‘tish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Depozit Qilish & O‘tish</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: INSUFFICIENT BALANCE (DEPOSIT REQUIRED) */}
      {insufficientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-black text-stone-900 dark:text-white">
                Balansingizda Mablag‘ Yetarli Emas!
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Ushbu VIP tarifga o‘tish uchun avval hisobingizni Telegram Bot orqali depozit kiritib to‘ldirishingiz va tasdiqlashingiz lozim.
              </p>
            </div>

            {/* Calculations Box */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Tanlangan Tarif:</span>
                <span className="font-extrabold text-stone-900 dark:text-white">
                  {insufficientModal.plan.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Tarif Narxi:</span>
                <span className="font-extrabold text-stone-900 dark:text-white font-mono">
                  {insufficientModal.price.toLocaleString()} so‘m
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Joriy Balansingiz:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {insufficientModal.currentBalance.toLocaleString()} so‘m
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-700">
                <span className="text-amber-600 dark:text-amber-400 font-bold">Kamchilik Summa:</span>
                <span className="font-black text-amber-600 dark:text-amber-400 text-sm font-mono">
                  {insufficientModal.missing.toLocaleString()} so‘m
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleGoToDeposit}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>💰 Hamyonga O‘tish & Depozit Kiritish</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setInsufficientModal(null)}
                className="w-full py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Bekor Qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMATION BEFORE PURCHASE */}
      {purchasingPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AnimatedSticker symbol="👑" size="lg" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-black text-stone-900 dark:text-white">
                VIP Tarif Xaridini Tasdiqlaysizmi?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Tanlangan tarif balansingizdan avtomatik yechiladi va {purchasingPlan.durationDays} kunlik obuna faollashadi.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Tarif Nomi:</span>
                <span className="font-extrabold text-stone-900 dark:text-white">
                  {purchasingPlan.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Yechiladigan Summa:</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                  {purchasingPlan.priceMonthly.toLocaleString()} so‘m
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Xariddan Keyingi Balans:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {Math.max(0, currentBalance - purchasingPlan.priceMonthly).toLocaleString()} so‘m
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmPurchase}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Faollashtirilmoqda...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Balansdan Yechish va Tarifni Ochish</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPurchasingPlan(null)}
                className="w-full py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Orqaga
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PURCHASE SUCCESS */}
      {successModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-black text-stone-900 dark:text-white">
                Tabriklaymiz! VIP Tarif Faol!
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Sizning akkauntingiz muvaffaqiyatli <strong>{successModal.plan.name}</strong> tarifiga yangilandi. Barcha yopiq video darslar va AI matematika yordamchisi ochildi!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSuccessModal(null)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-colors"
            >
              Darslarni Boshlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
