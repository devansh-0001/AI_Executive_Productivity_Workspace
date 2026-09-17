import React from 'react';

const priorityConfig = {
  LOW: { label: 'P3 - Low', text: 'text-slate-400' },
  MEDIUM: { label: 'P2 - Medium', text: 'text-blue-400' },
  HIGH: { label: 'P1 - High', text: 'text-amber-400 font-semibold' },
  CRITICAL: { label: 'P0 - Critical', text: 'text-rose-400 font-bold' }
};

export default function PriorityBadge({ priority = 'MEDIUM' }) {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM;
  return (
    <span className={`text-xs ${config.text}`}>
      {config.label}
    </span>
  );
}
