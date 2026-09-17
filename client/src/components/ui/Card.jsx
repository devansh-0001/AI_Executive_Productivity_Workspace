import React from 'react';

export default function Card({ title, count, badgeText, badgeColor = 'sky', icon: Icon, onClick, active }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
        active
          ? 'bg-slate-800 border-sky-500 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500'
          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 hover:border-slate-600'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && <Icon size={18} className="text-sky-400" />}
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-white tracking-tight">{count ?? 0}</span>
        {badgeText && (
          <span className={`text-xs px-2 py-0.5 rounded font-medium bg-${badgeColor}-500/10 text-${badgeColor}-400 border border-${badgeColor}-500/20`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
