import React, { useState, useEffect } from 'react';
import { Database, Mail, FileText, Mic, Calendar as CalendarIcon, Search } from 'lucide-react';
import api from '../api/client';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Sources() {
  const [sources, setSources] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('EMAIL'); // EMAIL, TRANSCRIPT, VOICE_NOTE, CALENDAR
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const res = await api.get('/sources');
      setSources(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Inspecting raw source data repositories..." />;

  const { emails, meetings, voiceNotes, calendarEvents } = sources;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Source Data Explorer</h1>
        <p className="text-xs text-slate-400 mt-1">
          Inspect raw emails, meeting transcripts, voice notes & calendar events feeding the extraction engine.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        {[
          { key: 'EMAIL', label: `Email Threads (${emails.length})`, icon: Mail },
          { key: 'TRANSCRIPT', label: `Meeting Transcripts (${meetings.length})`, icon: FileText },
          { key: 'VOICE_NOTE', label: `Voice Notes (${voiceNotes.length})`, icon: Mic },
          { key: 'CALENDAR', label: `Calendar Events (${calendarEvents.length})`, icon: CalendarIcon }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === tab.key
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="space-y-4">
        {activeTab === 'EMAIL' && (
          <div className="space-y-4">
            {emails.map(t => (
              <div key={t.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase font-mono">Thread ID: {t.id}</span>
                    <h3 className="text-base font-bold text-white">{t.subject}</h3>
                  </div>
                  <span className="text-xs text-slate-400">{t.emails.length} Messages</span>
                </div>

                <div className="space-y-3 pl-4 border-l-2 border-slate-800">
                  {t.emails.map(e => (
                    <div key={e.id} className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-medium text-slate-300">
                        <span className="font-bold text-sky-400">{e.sender}</span>
                        <span className="text-[10px] text-slate-500">{new Date(e.sentAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-sans">{e.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'TRANSCRIPT' && (
          <div className="space-y-4">
            {meetings.map(m => (
              <div key={m.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-sky-400 uppercase font-mono">Meeting ID: {m.id}</span>
                    <h3 className="text-base font-bold text-white">{m.title}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">Participants: {m.participants}</div>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(m.date).toLocaleDateString()}</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                  {m.transcriptRaw}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'VOICE_NOTE' && (
          <div className="space-y-4">
            {voiceNotes.map(vn => (
              <div key={vn.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">Voice Note ID: {vn.id}</span>
                    <h3 className="text-base font-bold text-white">{vn.title}</h3>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(vn.recordedAt).toLocaleString()}</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-200/90 whitespace-pre-line italic">
                  "{vn.transcriptRaw}"
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'CALENDAR' && (
          <div className="space-y-4">
            {calendarEvents.map(ce => (
              <div key={ce.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Event ID: {ce.id}</span>
                    <h3 className="text-base font-bold text-white">{ce.title}</h3>
                  </div>
                  <span className="text-xs text-slate-400">{ce.location}</span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div><strong>Start:</strong> {new Date(ce.startTime).toLocaleString()}</div>
                  <div><strong>End:</strong> {new Date(ce.endTime).toLocaleString()}</div>
                  <div><strong>Attendees:</strong> {ce.attendees}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
