import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Sliders, Bell, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '../api/client';

export default function Settings() {
  const [reseedLoading, setReseedLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleReSeed = async () => {
    setReseedLoading(true);
    setSuccessMsg('');
    try {
      // Re-trigger database scan notification scan
      await api.get('/notifications');
      setSuccessMsg('Extraction scan & notification evaluation complete.');
    } catch (e) {
      console.error(e);
    } finally {
      setReseedLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">System Settings & Configuration</h1>
        <p className="text-xs text-slate-400 mt-1">
          Executive profile identity, AI response tuning & data extraction trigger preferences.
        </p>
      </div>

      {/* User Profile Section */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <User size={18} className="text-sky-400" /> Executive Profile Identity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Executive Name</label>
            <input
              type="text"
              value="Arjun Malhotra"
              disabled
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Executive Role</label>
            <input
              type="text"
              value="VP Sales"
              disabled
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Email Address</label>
            <input
              type="text"
              value="arjun.malhotra@company.com"
              disabled
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Evaluation Reference Week</label>
            <input
              type="text"
              value="Week 39 (21 – 25 September 2026)"
              disabled
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sky-400 font-bold"
            />
          </div>
        </div>
      </div>

      {/* AI Preferences */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sliders size={18} className="text-purple-400" /> AI Grounding & Response Tuning
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <div>
              <div className="font-bold text-slate-200">Strict Source Evidence Grounding</div>
              <div className="text-slate-400">Prevent AI from fabricating ungrounded commitments or deadlines.</div>
            </div>
            <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded">Active</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <div>
              <div className="font-bold text-slate-200">Automatic Risk Scoring Engine</div>
              <div className="text-slate-400">Evaluate overdue + unassigned tasks as CRITICAL risk.</div>
            </div>
            <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded">Active</span>
          </div>
        </div>
      </div>

      {/* Data Status & Manual Refresh */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <RefreshCw size={18} className="text-emerald-400" /> Data Source Intelligence Scan
        </h2>

        <p className="text-xs text-slate-400">
          Re-evaluate risk rules and notification scans across preloaded source email threads, transcripts, voice notes & calendar events.
        </p>

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        <button
          onClick={handleReSeed}
          disabled={reseedLoading}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={16} className={reseedLoading ? 'animate-spin' : ''} />
          {reseedLoading ? 'Scanning...' : 'Re-Run Intelligence Scan'}
        </button>
      </div>
    </div>
  );
}
