import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, ArrowUpDown, CheckCircle2, User, HelpCircle } from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/ui/StatusBadge';
import RiskBadge from '../components/ui/RiskBadge';
import PriorityBadge from '../components/ui/PriorityBadge';
import DeadlineCountdown from '../components/ui/DeadlineCountdown';
import SourceTag from '../components/ui/SourceTag';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EvidenceDrawer from '../components/EvidenceDrawer';

export default function Commitments() {
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommitment, setSelectedCommitment] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [viewTab, setViewTab] = useState('ALL'); // ALL, MY_COMMITMENTS, OTHERS, UNASSIGNED

  useEffect(() => {
    fetchCommitments();
  }, [statusFilter, riskFilter, priorityFilter, sortBy, viewTab]);

  const fetchCommitments = async () => {
    setLoading(true);
    try {
      let url = `/commitments?sortBy=${sortBy}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (riskFilter) url += `&riskLevel=${riskFilter}`;
      if (priorityFilter) url += `&priority=${priorityFilter}`;
      
      if (viewTab === 'UNASSIGNED') url += `&isUnassigned=true`;

      const res = await api.get(url);
      let data = res.data.data || [];

      // Filter locally for tabs & search
      if (viewTab === 'MY_COMMITMENTS') {
        data = data.filter(c => c.owner && c.owner.email.includes('arjun'));
      } else if (viewTab === 'OTHERS') {
        data = data.filter(c => c.owner && !c.owner.email.includes('arjun'));
      }

      if (search) {
        const s = search.toLowerCase();
        data = data.filter(c => c.title.toLowerCase().includes(s) || (c.description && c.description.toLowerCase().includes(s)));
      }

      setCommitments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/commitments/${id}`, { status });
      fetchCommitments();
      if (selectedCommitment?.id === id) {
        setSelectedCommitment(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Evidence Drawer Modal */}
      <EvidenceDrawer
        commitment={selectedCommitment}
        onClose={() => setSelectedCommitment(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Commitment Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized register of personal commitments, external promises & unassigned responsibilities.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { key: 'ALL', label: 'All Commitments' },
          { key: 'MY_COMMITMENTS', label: "My Commitments (Arjun)" },
          { key: 'OTHERS', label: 'Assigned to Others' },
          { key: 'UNASSIGNED', label: 'Unassigned / Needs Owner' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setViewTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              viewTab === tab.key
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter commitments..."
              className="w-full bg-slate-800 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="OVERDUE">Overdue</option>
            <option value="AT_RISK">At Risk</option>
            <option value="WAITING">Waiting</option>
            <option value="UNASSIGNED">Unassigned</option>
          </select>

          {/* Risk filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="dueDate">Sort by Deadline</option>
            <option value="priority">Sort by Priority</option>
            <option value="riskLevel">Sort by Risk</option>
            <option value="updatedAt">Sort by Recent Activity</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Retrieving commitment matrix..." />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="p-4">Commitment</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Stakeholder</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Risk Level</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {commitments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No commitments match your current filter parameters.
                    </td>
                  </tr>
                ) : (
                  commitments.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCommitment(c)}
                      className="hover:bg-slate-800/60 transition cursor-pointer"
                    >
                      <td className="p-4 max-w-sm">
                        <div className="font-bold text-slate-100 hover:text-sky-400 transition">{c.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{c.description}</div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <SourceTag type={c.sourceType} />
                        </div>
                      </td>

                      <td className="p-4">
                        {c.owner ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-white">
                              {c.owner.avatarInitials}
                            </span>
                            <span className="font-medium text-slate-200">{c.owner.name}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            <HelpCircle size={12} /> Unassigned
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="text-slate-300 font-medium">
                          {c.stakeholder ? c.stakeholder.name : 'Internal Team'}
                        </span>
                      </td>

                      <td className="p-4">
                        <DeadlineCountdown countdown={c.countdown} />
                      </td>

                      <td className="p-4">
                        <StatusBadge status={c.status} />
                      </td>

                      <td className="p-4">
                        <RiskBadge level={c.riskLevel} />
                      </td>

                      <td className="p-4 text-right">
                        {c.status !== 'COMPLETED' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(c.id, 'COMPLETED');
                            }}
                            className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 rounded-lg border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 ml-auto"
                            title="Mark complete"
                          >
                            <CheckCircle2 size={14} /> Done
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
