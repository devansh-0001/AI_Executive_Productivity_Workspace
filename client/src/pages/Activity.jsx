import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, Clock, CheckCircle2, AlertTriangle, RefreshCw, UserCheck } from 'lucide-react';
import api from '../api/client';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Activity() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await api.get('/activity');
      setHistory(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Reconstructing chronological activity history..." />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Activity Timeline</h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete audit trail of commitment creations, deadline revisions, status updates & follow-ups.
        </p>
      </div>

      {/* Timeline Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="relative border-l-2 border-slate-800 ml-3 pl-6 space-y-6">
          {history.map((item) => (
            <div key={item.id} className="relative space-y-1">
              {/* Point Node */}
              <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-sky-500 border-4 border-slate-900 shadow"></span>

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-400">{item.commitment?.title || 'System Audit Event'}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(item.changedAt).toLocaleString()}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-200">
                Action: <span className="text-white">{item.changedField}</span>
              </div>

              {item.reason && (
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                  {item.reason}
                </p>
              )}

              <div className="text-[10px] text-slate-500">
                Logged by {item.changedBy}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
