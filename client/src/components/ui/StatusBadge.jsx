import React from 'react';

const statusConfig = {
  PENDING: { label: 'Pending', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  COMPLETED: { label: 'Completed', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  OVERDUE: { label: 'Overdue', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  AT_RISK: { label: 'At Risk', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  WAITING: { label: 'Waiting', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  UNASSIGNED: { label: 'Unassigned', bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
  SCHEDULED: { label: 'Scheduled', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' }
};

export default function StatusBadge({ status = 'PENDING' }) {
  const config = statusConfig[status] || statusConfig.PENDING;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {config.label}
    </span>
  );
}
