import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';

export const SupportTicketsManager: React.FC = () => {
  const { db, replySupportTicket } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const tickets = db.supportTickets;

  const handleReply = async (ticketId: string) => {
    if (!replyText.trim()) return;

    setLoading(true);
    try {
      await replySupportTicket(ticketId, replyText);
      setReplyText('');
      setSelectedTicketId(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-white">
          O‘quvchilar Murojaatlari va Yordam Markazi
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Sayt 1 va kabinetdan kelib tushgan savollarni ko‘rish, javob qaytarish va holatini boshqarish
        </p>
      </div>

      <div className="space-y-4">
        {tickets.length === 0 ? (
          <p className="text-center py-10 text-stone-500 text-xs">Hozircha yangi murojaatlar yo‘q.</p>
        ) : (
          tickets.map(ticket => {
            const isAnswered = ticket.status === 'answered';
            const isReplying = selectedTicketId === ticket.id;

            return (
              <div
                key={ticket.id}
                className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                        {ticket.userName}
                      </h4>
                      <span className="text-xs text-stone-500 font-mono">
                        ({ticket.userPhone})
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {ticket.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-400">
                      {new Date(ticket.createdAt).toLocaleString('uz-UZ')}
                    </span>
                    {isAnswered ? (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Javob berilgan
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Yangi
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-[#FBF9F5] dark:bg-stone-800/40 p-4 rounded-xl border border-stone-100 dark:border-stone-800">
                  "{ticket.message}"
                </p>

                {ticket.replyText && (
                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                      Fayzullo ustoz javobi:
                    </span>
                    {ticket.replyText}
                  </div>
                )}

                {!isAnswered && (
                  <div>
                    {isReplying ? (
                      <div className="space-y-3 pt-2">
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Javobingizni yozing..."
                          className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-xs text-stone-900 dark:text-white"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedTicketId(null)}
                            className="px-3 py-1.5 text-xs text-stone-500 rounded-lg"
                          >
                            Bekor Qilish
                          </button>
                          <button
                            disabled={loading}
                            onClick={() => handleReply(ticket.id)}
                            className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 text-white flex items-center gap-1.5"
                          >
                            <Send className="w-3 h-3" />
                            <span>Javobni Yuborish</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedTicketId(ticket.id);
                          setReplyText('');
                        }}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 transition-colors"
                      >
                        Javob Yozish
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
