import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, AlertTriangle, MapPin, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../api/client';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      const res = await api.get('/calendar');
      setEvents(res.data.data.events || []);
      setConflicts(res.data.data.conflicts || []);
      if (res.data.data.events?.length > 0) {
        setSelectedEvent(res.data.data.events[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading executive calendar matrix..." />;

  const days = [
    { name: 'Monday', date: '21 Sep', iso: '2026-09-21' },
    { name: 'Tuesday', date: '22 Sep', iso: '2026-09-22' },
    { name: 'Wednesday', date: '23 Sep', iso: '2026-09-23' },
    { name: 'Thursday', date: '24 Sep', iso: '2026-09-24' },
    { name: 'Friday', date: '25 Sep', iso: '2026-09-25' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Calendar Intelligence</h1>
          <p className="text-xs text-slate-400 mt-1">
            Agenda view, schedule conflict detection & meeting prep deadline alignment.
          </p>
        </div>
      </div>

      {/* Calendar Conflict Alert Banner */}
      {conflicts.length > 0 && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 animate-pulse">
          <AlertTriangle size={20} className="text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h3 className="font-bold text-rose-300">Calendar Conflicts Detected ({conflicts.length})</h3>
            {conflicts.map(c => (
              <p key={c.id} className="text-rose-200">{c.message}</p>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map(day => {
          const dayEvents = events.filter(e => e.startTime.startsWith(day.iso));
          const isCurrentDay = day.iso === '2026-09-23';

          return (
            <div
              key={day.iso}
              className={`p-4 rounded-2xl border ${
                isCurrentDay ? 'bg-slate-900 border-sky-500/60 shadow-lg shadow-sky-500/5' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className={`font-bold text-xs ${isCurrentDay ? 'text-sky-400' : 'text-slate-300'}`}>
                  {day.name}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">{day.date}</span>
              </div>

              <div className="space-y-2">
                {dayEvents.length === 0 ? (
                  <div className="text-[11px] text-slate-600 text-center py-6">No scheduled meetings</div>
                ) : (
                  dayEvents.map(evt => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                        evt.isConflicting
                          ? 'bg-rose-500/10 border-rose-500/40 text-rose-200 hover:bg-rose-500/20'
                          : selectedEvent?.id === evt.id
                          ? 'bg-sky-500/10 border-sky-500 text-white'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold line-clamp-1">{evt.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(evt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(evt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {evt.isConflicting && (
                        <span className="mt-1.5 inline-block text-[9px] font-bold text-rose-400 uppercase">
                          ⚠️ Overlap Conflict
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Event Details & Prep Panel */}
      {selectedEvent && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-semibold text-sky-400 uppercase">Selected Event Details</span>
              <h2 className="text-xl font-bold text-white mt-0.5">{selectedEvent.title}</h2>
            </div>
            {selectedEvent.isConflicting && (
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                Conflict Flagged
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Time & Location</span>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Clock size={14} className="text-sky-400" />
                {new Date(selectedEvent.startTime).toLocaleString()}
              </div>
              <div className="text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin size={14} className="text-indigo-400" />
                {selectedEvent.location || 'Virtual Meeting'}
              </div>
            </div>

            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 col-span-2">
              <span className="text-slate-400 block mb-1">Attendees</span>
              <div className="font-medium text-slate-200">
                {selectedEvent.attendees}
              </div>
            </div>
          </div>

          {/* Linked Commitments & Suggested Prep */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <Sparkles size={14} className="text-sky-400" /> Linked Deliverables & Preparation Deadlines
            </h4>
            {selectedEvent.linkedCommitments && selectedEvent.linkedCommitments.length > 0 ? (
              <div className="space-y-2">
                {selectedEvent.linkedCommitments.map(c => (
                  <div key={c.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{c.title}</div>
                      <div className="text-[11px] text-slate-400">{c.description}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-medium">
                      Linked Task
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-slate-800/30 rounded-xl text-xs text-slate-500">
                No preliminary prep deliverables required before this meeting.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
