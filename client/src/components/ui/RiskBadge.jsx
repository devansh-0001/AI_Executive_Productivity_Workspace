import React from 'react';
import { AlertTriangle, AlertOctagon, ShieldAlert, Shield } from 'lucide-react';

const riskConfig = {
  LOW: { label: 'Low Risk', bg: 'bg-slate-800', text: 'text-slate-400', icon: Shield },
  MEDIUM: { label: 'Medium Risk', bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: AlertTriangle },
  HIGH: { label: 'High Risk', bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: AlertOctagon },
  CRITICAL: { label: 'Critical Risk', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse', icon: ShieldAlert }
};

export default function RiskBadge({ level = 'LOW', onClick }) {
  const config = riskConfig[level] || riskConfig.LOW;
  const Icon = config.icon;

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border cursor-pointer ${config.bg} ${config.text}`}
      title="Click to view risk reasons"
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}
