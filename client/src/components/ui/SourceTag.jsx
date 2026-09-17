import React from 'react';
import { Mail, Mic, Calendar, FileText } from 'lucide-react';

const icons = {
  EMAIL: Mail,
  TRANSCRIPT: FileText,
  VOICE_NOTE: Mic,
  CALENDAR: Calendar
};

export default function SourceTag({ type = 'EMAIL', title = 'Source' }) {
  const Icon = icons[type] || FileText;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
      <Icon size={12} className="text-sky-400" />
      <span className="capitalize">{type.toLowerCase().replace('_', ' ')}</span>
    </span>
  );
}
