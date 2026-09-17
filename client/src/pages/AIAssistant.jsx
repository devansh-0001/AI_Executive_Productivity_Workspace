import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import api from '../api/client';

const suggestedQuestions = [
  "What do I need to do today?",
  "What have I promised this week?",
  "What is overdue?",
  "What am I waiting on?",
  "What is at risk before Friday?",
  "What did I promise Raghav?",
  "Who owns the Mumbai lease renewal?",
  "What changed since Monday?",
  "Give me my executive briefing."
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Good morning Arjun. I am LeadDesk, your executive assistant. Ask me anything about your commitments, pending tasks, deadlines, email threads, risks, or calendar conflicts.",
      evidenceRefs: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    const userMsg = { role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        conversationId,
        message: q
      });

      const { data } = res.data;
      setConversationId(data.conversationId);

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.message.content,
          evidenceRefs: data.evidenceRefs || []
        }
      ]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an error connecting to the executive intelligence database. Please try again.",
          evidenceRefs: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">AI Executive Assistant</h1>
            <p className="text-xs text-slate-400">Context-aware Q&A grounded strictly in email, transcript & calendar data.</p>
          </div>
        </div>

        <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Strictly Grounded (No Hallucinations)
        </span>
      </div>

      {/* Suggested Question Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {suggestedQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 hover:text-white whitespace-nowrap transition"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-y-auto space-y-6 shadow-xl">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white font-bold text-xs'
                  : 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white'
              }`}
            >
              {m.role === 'user' ? 'AM' : <Bot size={18} />}
            </div>

            <div className={`space-y-2 max-w-2xl ${m.role === 'user' ? 'text-right' : ''}`}>
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-none'
                }`}
              >
                {m.content}
              </div>

              {/* Evidence Refs badge */}
              {m.evidenceRefs && m.evidenceRefs.length > 0 && (
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
                  <div className="font-bold text-slate-300 flex items-center gap-1">
                    <FileText size={12} className="text-sky-400" /> Supporting Grounded Evidence:
                  </div>
                  {m.evidenceRefs.map((ref, rIdx) => (
                    <div key={rIdx} className="text-slate-400 flex items-center gap-2">
                      <span className="text-sky-400 font-bold">•</span>
                      <span>{ref.title} ({ref.sourceType})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot size={18} />
            </div>
            <div className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
              LeadDesk is reasoning over your database context...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Arjun's AI Executive Assistant... (e.g., 'What is overdue?')"
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-5 pr-14 py-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 shadow-2xl"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-3 top-3 p-2 bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl disabled:opacity-50 transition shadow"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
