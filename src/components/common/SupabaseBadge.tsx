import React, { useEffect, useState } from 'react';
import { Database, CheckCircle2, Key, ExternalLink, X, ShieldCheck } from 'lucide-react';

export const SupabaseBadge: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const projectUrl = 'https://gysicpcivqmwwcjayvid.supabase.co';

  const checkStatus = () => {
    fetch('/api/supabase/status')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsConnected(data.supabaseConnected);
          setHasApiKey(data.hasApiKey);
        }
      })
      .catch(() => {
        setIsConnected(false);
      });
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    setLoading(true);
    setSaveStatus('');
    try {
      const res = await fetch('/api/owner/supabase-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: projectUrl, key: apiKeyInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setIsConnected(data.supabaseConnected);
        setHasApiKey(true);
        setSaveStatus('✅ Muvaffaqiyatli ulandi! Endi barcha o‘quvchilar ushbu Supabase loyihasiga tushadi.');
        checkStatus();
      } else {
        setSaveStatus('❌ Ulanishda xatolik yuz berdi.');
      }
    } catch (err) {
      setSaveStatus('❌ Serverga bog‘lanishda xatolik.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        title="Supabase sozlamalari va API Key ulanishi"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-all shadow-xs ${
          isConnected && hasApiKey
            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
        }`}
      >
        <Database className={`w-3.5 h-3.5 ${isConnected && hasApiKey ? 'text-emerald-500 animate-pulse' : 'text-amber-500'}`} />
        <span>Supabase ({isConnected && hasApiKey ? 'Ulangan' : 'Kalit kiritilmagan'})</span>
        {isConnected && hasApiKey ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <Key className="w-3.5 h-3.5 text-amber-500" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Supabase Loyihangizni Ulang</h3>
                <p className="text-xs text-slate-400">Dashboard: <span className="font-mono text-emerald-400">gysipcivqmwwcjayvid</span></p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 mb-4 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Supabase URL:</span>
                <span className="font-mono text-indigo-300 font-semibold">{projectUrl}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Holat:</span>
                <span className={`font-semibold ${isConnected && hasApiKey ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isConnected && hasApiKey ? '⚡ Ulangan va tayyor' : '⚠️ API Key kiritish kutilmoqda'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Supabase Anon (Public) yoki Service Role Key kiriting:
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-mono text-emerald-300 placeholder-slate-600 outline-hidden transition-all"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <p>
                  Supabase Dashboardingizdan (<strong>Project Settings -&gt; API</strong>) <strong>anon key</strong>ni nusxalab shu yerga past qiling. Shunda barcha o‘quvchilar ro‘yxatdan o‘tganda to‘g‘ridan-to‘g‘ri sizning Supabase loyihangizga saqlanadi.
                </p>
              </div>

              {saveStatus && (
                <div className={`p-3 rounded-xl text-xs font-medium ${saveStatus.startsWith('✅') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                  {saveStatus}
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <a
                  href="https://supabase.com/dashboard/project/gysipcivqmwwcjayvid/settings/api"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <span>Project Settings -&gt; API ga o‘tish</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="submit"
                  disabled={loading || !apiKeyInput.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Ulanmoqda...' : 'Kalitni Saqlash & Ulash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
