import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  Users,
  HelpCircle,
  Sparkles,
  Calendar as CalendarIcon,
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import RiskBadge from '../components/ui/RiskBadge';
import DeadlineCountdown from '../components/ui/DeadlineCountdown';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EvidenceDrawer from '../components/EvidenceDrawer';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [briefing, setBriefing] = useState(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [selectedCommitment, setSelectedCommitment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setData(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBriefing = async () => {
    setBriefingLoading(true);
    try {
      const res = await api.post('/ai/briefing');
      setBriefing(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setBriefingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Assembling executive intelligence dashboard..." />;

  const { summaryCards, priorityActionList, upcomingMeetings, recentActivity } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Evidence Drawer Modal */}
      <EvidenceDrawer
        commitment={selectedCommitment}
        onClose={() => setSelectedCommitment(null)}
        onUpdateStatus={async (id, status) => {
          await api.patch(`/commitments/${id}`, { status });
          fetchDashboard();
          setSelectedCommitment(null);
        }}
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
            Wednesday, 23 September 2026 • Week 39
          </div>
          <h1 className="text-2xl font-extrabold text-white">Executive Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time commitment intelligence extracted from emails, transcripts, voice notes & calendar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateBriefing}
            disabled={briefingLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-sky-500/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Sparkles size={16} />
            {briefingLoading ? 'Generating Briefing...' : 'Generate Executive Briefing'}
          </button>

          <button
            onClick={() => navigate('/ai-assistant')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition"
          >
            Ask AI Assistant
          </button>
        </div>
      </div>

      {/* Executive Briefing Modal Overlay */}
      {briefing && (
        <div className="p-6 bg-slate-900 border border-sky-500/30 rounded-2xl shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-sky-400 flex items-center gap-2">
              <Sparkles size={18} /> Daily Executive Briefing
            </h3>
            <button onClick={() => setBriefing(null)} className="text-xs text-slate-400 hover:text-white">
              Close Briefing
            </button>
          </div>
          <p className="text-sm font-medium text-slate-200">{briefing.executiveSummary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className="font-bold text-sky-400 uppercase">Today's Priorities</span>
              <ul className="mt-2 space-y-1 text-slate-300">
                {briefing.todaysPriorities?.map((p, i) => <li key={i}>• {p}</li>)}
              </ul>
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <span className="font-bold text-rose-400 uppercase">At Risk / Overdue</span>
              <ul className="mt-2 space-y-1 text-slate-300">
                {briefing.atRiskItems?.map((p, i) => <li key={i}>• {p}</li>)}
              </ul>
            </div>
          </div>
          <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-xs text-sky-300">
            <strong>Recommended Focus:</strong> {briefing.recommendedFocus}
          </div>
        </div>
      )}

      {/* 6 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card
          title="Open Tasks"
          count={summaryCards.totalOpen}
          icon={CheckSquare}
          onClick={() => navigate('/commitments')}
        />
        <Card
          title="Due Today"
          count={summaryCards.dueToday}
          badgeText="Sep 23"
          badgeColor="sky"
          icon={Clock}
          onClick={() => navigate('/commitments?dueToday=true')}
        />
        <Card
          title="Overdue"
          count={summaryCards.overdue}
          badgeText="Action"
          badgeColor="rose"
          icon={AlertTriangle}
          onClick={() => navigate('/commitments?status=OVERDUE')}
        />
        <Card
          title="At Risk"
          count={summaryCards.atRisk}
          badgeText="Critical"
          badgeColor="orange"
          icon={AlertTriangle}
          onClick={() => navigate('/commitments?riskLevel=HIGH')}
        />
        <Card
          title="Waiting On"
          count={summaryCards.waitingOnOthers}
          icon={Users}
          onClick={() => navigate('/commitments?status=WAITING')}
        />
        <Card
          title="Unassigned"
          count={summaryCards.unassigned}
          badgeText="Needs Owner"
          badgeColor="rose"
          icon={HelpCircle}
          onClick={() => navigate('/commitments?isUnassigned=true')}
        />
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Action List (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-rose-400" /> Priority Action List
              </h2>
              <p className="text-xs text-slate-400">Urgent commitments ranked by risk, deadline proximity & unassigned ownership.</p>
            </div>
            <button
              onClick={() => navigate('/commitments')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
            >
              View All ({summaryCards.totalOpen}) <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {priorityActionList.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedCommitment(item)}
                className="p-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white hover:text-sky-400 transition">{item.title}</span>
                    <StatusBadge status={item.status} />
                    <RiskBadge level={item.riskLevel} />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                  {item.riskReasons && item.riskReasons.length > 0 && (
                    <div className="text-[11px] text-rose-300/90 italic">
                      ⚠️ {item.riskReasons[0]}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <DeadlineCountdown countdown={item.countdown} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Panel: Meetings & Activity (1 col) */}
        <div className="space-y-6">
          {/* Upcoming Meetings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarIcon size={16} className="text-sky-400" /> Today's Meetings
              </h3>
              <button onClick={() => navigate('/calendar')} className="text-[11px] text-sky-400 hover:underline">
                Calendar
              </button>
            </div>

            <div className="space-y-2">
              {upcomingMeetings.map((evt) => (
                <div key={evt.id} className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-slate-200">{evt.title}</div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(evt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(evt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-[10px] text-slate-500">{evt.location}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Stream */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RefreshCw size={16} className="text-purple-400" /> Recent Activity
              </h3>
              <button onClick={() => navigate('/activity')} className="text-[11px] text-sky-400 hover:underline">
                Timeline
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {recentActivity.map((act) => (
                <div key={act.id} className="p-2.5 bg-slate-800/30 rounded-lg border border-slate-800/60">
                  <div className="font-medium text-slate-300">{act.commitment?.title || act.changedField}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{act.reason}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{new Date(act.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
