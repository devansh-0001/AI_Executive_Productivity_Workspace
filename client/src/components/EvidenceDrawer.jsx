import React from 'react';
import { X, ShieldCheck, AlertTriangle, FileText, Clock, User, CheckCircle2 } from 'lucide-react';
import StatusBadge from './ui/StatusBadge';
import RiskBadge from './ui/RiskBadge';
import DeadlineCountdown from './ui/DeadlineCountdown';
import SourceTag from './ui/SourceTag';

export default function EvidenceDrawer({ commitment, onClose, onUpdateStatus }) {
  if (!commitment) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-slate-900 border-l border-slate-700 shadow-2xl z-40 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SourceTag type={commitment.sourceType} />
          <span className="text-xs text-slate-400 font-mono">ID: {commitment.id.slice(0, 8)}</span>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">{commitment.title}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{commitment.description}</p>
        </div>

        {/* Status & Actions Bar */}
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/60 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Current Status</div>
            <StatusBadge status={commitment.status} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Risk Evaluation</div>
            <RiskBadge level={commitment.riskLevel} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Deadline</div>
            <DeadlineCountdown countdown={commitment.countdown} />
          </div>
        </div>

        {/* Actions */}
        {commitment.status !== 'COMPLETED' && (
          <button
            onClick={() => onUpdateStatus(commitment.id, 'COMPLETED')}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition"
          >
            <CheckCircle2 size={16} /> Mark Task as Completed
          </button>
        )}

        {/* Stakeholders & Ownership */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
              <User size={14} className="text-sky-400" /> Owner
            </div>
            <div className="text-sm font-bold text-white">
              {commitment.owner ? commitment.owner.name : <span className="text-rose-400 font-bold">Unassigned / Unconfirmed</span>}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Status: <span className="font-semibold text-slate-300">{commitment.ownershipStatus || 'UNASSIGNED'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
              <User size={14} className="text-purple-400" /> Stakeholder / Client
            </div>
            <div className="text-sm font-bold text-white">
              {commitment.stakeholder ? commitment.stakeholder.name : 'Internal Team'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {commitment.stakeholder ? commitment.stakeholder.role : 'Executive Team'}
            </div>
          </div>
        </div>

        {/* Risk Reasoning */}
        {commitment.riskReasons && commitment.riskReasons.length > 0 && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle size={14} /> Risk Analysis & Reasoning
            </h4>
            <ul className="space-y-1">
              {commitment.riskReasons.map((r, idx) => (
                <li key={idx} className="text-xs text-rose-200 flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Grounded Source Evidence */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <FileText size={14} className="text-sky-400" /> Grounded Source Excerpts
          </h4>
          {commitment.evidence && commitment.evidence.length > 0 ? (
            <div className="space-y-2">
              {commitment.evidence.map(e => (
                <div key={e.id} className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
                  <p className="italic text-slate-200 mb-2">"{e.excerpt}"</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Source: {e.sourceType}</span>
                    <span>Confidence: {Math.round(e.confidence * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-slate-800/40 rounded text-xs text-slate-500">
              Sourced from {commitment.sourceType} ({commitment.sourceId})
            </div>
          )}
        </div>

        {/* History Timeline */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Clock size={14} className="text-emerald-400" /> Commitment History & Evolution
          </h4>
          {commitment.history && commitment.history.length > 0 ? (
            <div className="space-y-3 relative border-l-2 border-slate-700 ml-2 pl-4">
              {commitment.history.map(h => (
                <div key={h.id} className="relative text-xs">
                  <span className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-slate-600 border-2 border-slate-900"></span>
                  <div className="font-semibold text-slate-200">{h.changedField}</div>
                  <div className="text-slate-400 mt-0.5">{h.reason || `Changed to ${h.newValue}`}</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {new Date(h.changedAt).toLocaleString()} by {h.changedBy}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500">No recorded history changes yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
