import React, { useState, useEffect } from 'react';
import { Search, X, CheckSquare, Mail, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ commitments: [], emails: [], people: [], meetings: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ commitments: [], emails: [], people: [], meetings: [] });
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search size={20} className="text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commitments, emails, stakeholders, meetings... (ESC to close)"
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-base"
            autoFocus
          />
          <button onClick={() => onClose(false)} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {loading && <div className="text-center text-xs text-slate-400 p-4">Searching LeadDesk intelligence database...</div>}

          {!loading && query.length >= 2 && (
            <>
              {results.commitments.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                    <CheckSquare size={14} className="text-sky-400" /> Commitments ({results.commitments.length})
                  </div>
                  <div className="space-y-1">
                    {results.commitments.map(c => (
                      <div
                        key={c.id}
                        onClick={() => { navigate(`/commitments`); onClose(false); }}
                        className="p-2.5 rounded-lg hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-200">{c.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">{c.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.emails.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                    <Mail size={14} className="text-purple-400" /> Email Threads ({results.emails.length})
                  </div>
                  <div className="space-y-1">
                    {results.emails.map(e => (
                      <div
                        key={e.id}
                        onClick={() => { navigate(`/sources`); onClose(false); }}
                        className="p-2.5 rounded-lg hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-200">{e.subject}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.people.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                    <User size={14} className="text-emerald-400" /> Stakeholders ({results.people.length})
                  </div>
                  <div className="space-y-1">
                    {results.people.map(p => (
                      <div
                        key={p.id}
                        onClick={() => { navigate(`/people`); onClose(false); }}
                        className="p-2.5 rounded-lg hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-200">{p.name} ({p.role})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!loading && query.length < 2 && (
            <div className="text-center text-xs text-slate-500 py-6">
              Type at least 2 characters to search across commitments, emails, people, and meetings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
