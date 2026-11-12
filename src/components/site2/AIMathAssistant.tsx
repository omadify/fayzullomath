import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MathRenderer } from '../common/MathRenderer';
import { api } from '../../services/api';
import {
  Sparkles,
  Send,
  Lock,
  RotateCcw,
  ArrowRight,
  AlertCircle,
  Bot,
  User,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIMathAssistant: React.FC<{ onUpgradeVIP: () => void }> = ({ onUpgradeVIP }) => {
  const { currentUser, db } = useApp();
  const vipTier = currentUser?.vipTier || 'start';
  const isAIAvailable = vipTier === 'gold' || vipTier === 'platinum' || vipTier === 'individual';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: `Assalomu alaykum, ${currentUser?.name || 'o‘quvchi'}! Men Fayzullo ustozning AI matematika yordamchisiman.
Menga istalgan algebraik, geometrik, trigonometrik yoki milliy sertifikat masalasini yuboring. Men uni qadamma-qadam, qat'iy teoremalar va KaTeX formulalari bilan tushuntirib beraman!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Quick Math Snippets to insert directly
  const quickMathSnippets = [
    { label: 'x²', insert: 'x^2' },
    { label: '√x', insert: '\\sqrt{x}' },
    { label: 'a/b', insert: '\\frac{a}{b}' },
    { label: '∫', insert: '\\int ' },
    { label: 'log_a(x)', insert: '\\log_a(x)' },
    { label: 'lim', insert: '\\lim_{x \\to 0}' },
    { label: 'sin(x)', insert: '\\sin(x)' },
    { label: 'cos(x)', insert: '\\cos(x)' },
    { label: 'π', insert: '\\pi' },
    { label: '≤', insert: '\\le ' },
    { label: '≥', insert: '\\ge ' },
    { label: '∞', insert: '\\infty' }
  ];

  // Sample prompt chips
  const samplePrompts = [
    'x^2 - 5x + 6 = 0 tenglamani Viyet teoremasi orqali yechib ber',
    '\\int x \\cdot \\sin(x) dx integralini bo‘laklab integrallash usulida ko‘rsat',
    'To‘g‘ri burchakli uchburchakda gipotenuza 10, katet 6 bo‘lsa, ichki chizilgan aylana radiusi necha?',
    '\\log_2(x-1) + \\log_2(x+1) = 3 tenglamani aniqlanish sohasi bilan yech'
  ];

  const handleInsertSnippet = (snippet: string) => {
    setInput(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + snippet);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || loading) return;

    setErrorMsg('');
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.solveMathWithAI(q, vipTier);
      if (res.success && res.answer) {
        const aiMsg: ChatMessage = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: res.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        setErrorMsg(res.message || 'Javob olishda xatolik yuz berdi');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Tarmoq xatosi yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'init-' + Date.now(),
        sender: 'ai',
        text: 'Yangi suhbat boshlandi. Yangi savolingizni yozing!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // If START tier -> Gated lock curtain
  if (!isAIAvailable) {
    return (
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
          VIP Funksiya Cheklovi
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white mb-3">
          AI Matematika Yordamchisi Qulflangan
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
          Sizning joriy tarifingiz: <span className="font-bold uppercase text-stone-800 dark:text-stone-200">{vipTier}</span>.
          Sun’iy intellekt orqali masalalarni bosqichma-bosqich yechish va formulalar tahlili faqat <span className="font-bold text-stone-900 dark:text-white">GOLD</span>, <span className="font-bold text-stone-900 dark:text-white">PLATINUM</span> va <span className="font-bold text-stone-900 dark:text-white">INDIVIDUAL</span> tariflarida mavjud.
        </p>

        <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 text-left text-xs space-y-2 mb-8">
          <div className="font-semibold text-stone-900 dark:text-white mb-1">
            GOLD tarifiga o‘tsangiz:
          </div>
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
            <span className="text-emerald-600">✓</span> Kuniga 50 ta masalani qadam-baqadam yechish
          </div>
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
            <span className="text-emerald-600">✓</span> KaTeX formulalar va geometrik chizmalar tushuntirishi
          </div>
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
            <span className="text-emerald-600">✓</span> O‘xshash yangi misollar generatsiyasi
          </div>
        </div>

        <button
          onClick={onUpgradeVIP}
          className="px-6 py-3 text-xs font-semibold rounded-xl text-white bg-[#F95738] hover:bg-[#E04828] shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Tarifni GOLD ga Yangilash</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Active AI Assistant View for GOLD/PLATINUM/INDIVIDUAL
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl shadow-sm flex flex-col h-[780px] overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-1.5 flex-wrap">
              <span>AI Matematika Yordamchisi</span>
              <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
                {vipTier}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>100% Aniq Matematik Tahlil</span>
              </span>
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {db.aiSettings?.providerLabel || 'Universal AI'} · {db.aiSettings?.speedDesc || 'Ultra-tezkor'} · KaTeX
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Yangi Chat</span>
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                msg.sender === 'user'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-tr-none'
                  : 'bg-[#FBF9F5] dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 text-stone-800 dark:text-stone-200 rounded-tl-none shadow-xs'
              }`}
            >
              <MathRenderer content={msg.text} />
              
              <div className="flex items-center justify-between text-[10px] mt-2.5 pt-1.5 border-t border-stone-200/40 dark:border-stone-700/40">
                <span className={msg.sender === 'user' ? 'text-stone-400 dark:text-stone-500' : 'text-stone-400'}>
                  {msg.timestamp}
                </span>

                {msg.sender === 'ai' && (
                  <button
                    onClick={() => handleCopyText(msg.id, msg.text)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    title="Yechimni nusxalash"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Nusxalandi</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Nusxa olish</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#FBF9F5] dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 p-4 rounded-2xl text-xs text-stone-600 dark:text-stone-300 flex items-center gap-2 shadow-xs">
              <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Fayzullo ustozning AI yordamchisi masalani bosqichma-bosqich yechmoqda va hisob-kitobni tekshirmoqda...</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      {messages.length < 3 && (
        <div className="px-4 py-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 overflow-x-auto text-[11px] bg-stone-50/30 dark:bg-stone-900/40">
          <span className="text-stone-400 shrink-0 font-medium">Namunaviy savollar:</span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              {p.slice(0, 35)}...
            </button>
          ))}
        </div>
      )}

      {/* Quick Math Symbols Inserter Toolbar */}
      <div className="px-4 py-1.5 border-t border-stone-200/60 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-800/40 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
          Formulalar:
        </span>
        {quickMathSnippets.map((snip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleInsertSnippet(snip.insert)}
            className="px-2 py-0.5 text-xs font-mono font-bold rounded-md bg-white dark:bg-stone-800 border border-stone-300/80 dark:border-stone-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:border-rose-400 text-stone-700 dark:text-stone-200 shrink-0 transition-all cursor-pointer shadow-2xs"
            title={`Qo'shish: ${snip.insert}`}
          >
            {snip.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Matematik savol yoki formulani yozing (masalan, \int x^2 dx yoki x^2-5x+6=0)..."
            className="flex-1 px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-hidden focus:border-rose-500 shadow-xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-[#F95738] hover:bg-[#E04828] text-white disabled:opacity-50 transition-colors font-semibold text-xs flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
          >
            <span>Yuborish</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
