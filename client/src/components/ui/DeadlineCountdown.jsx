import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export default function DeadlineCountdown({ countdown }) {
  if (!countdown || !countdown.label) return <span className="text-xs text-slate-500">No deadline</span>;

  if (countdown.isOverdue) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
        <AlertCircle size={12} />
        {countdown.label}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
      <Clock size={12} className="text-slate-400" />
      {countdown.label}
    </span>
  );
}
