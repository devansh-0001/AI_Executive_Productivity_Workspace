import React, { useState, useEffect } from 'react';
import { Users, Mail, CheckSquare, Clock, ArrowRight, UserCheck } from 'lucide-react';
import api from '../api/client';
import StatusBadge from '../components/ui/StatusBadge';
import RiskBadge from '../components/ui/RiskBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function People() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [personDetail, setPersonDetail] = useState(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const res = await api.get('/people');
      const data = res.data.data || [];
      setPeople(data);
      if (data.length > 0) {
        fetchPersonDetail(data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonDetail = async (id) => {
    try {
      const res = await api.get(`/people/${id}`);
      setSelectedPerson(people.find(p => p.id === id));
      setPersonDetail(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <LoadingSpinner message="Loading stakeholder commitment directory..." />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Stakeholder Matrix</h1>
        <p className="text-xs text-slate-400 mt-1">
          Track bidirectional obligations: what Arjun owes each stakeholder vs what they owe Arjun.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stakeholder Cards List (1 col) */}
        <div className="space-y-3">
          {people.map((p) => {
            const isSelected = selectedPerson?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => fetchPersonDetail(p.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-sky-500 shadow-lg shadow-sky-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 font-bold text-white flex items-center justify-center text-xs">
                    {p.avatarInitials}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{p.name}</div>
                    <div className="text-[11px] text-slate-400">{p.role}</div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  {p.owedByArjunCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 block font-semibold">
                      Arjun owes {p.owedByArjunCount}
                    </span>
                  )}
                  {p.owesArjunCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 block font-semibold">
                      Owes Arjun {p.owesArjunCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Person Detail Panel (2 cols) */}
        {personDetail ? (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 font-extrabold text-white flex items-center justify-center text-sm shadow">
                  {personDetail.avatarInitials}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{personDetail.name}</h2>
                  <p className="text-xs text-slate-400">{personDetail.role} • {personDetail.email}</p>
                </div>
              </div>
            </div>

            {/* What Arjun Owes Them */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <ArrowRight size={14} /> What Arjun Owes {personDetail.name.split(' ')[0]}
              </h3>

              {personDetail.stakeholderFor && personDetail.stakeholderFor.length > 0 ? (
                <div className="space-y-2">
                  {personDetail.stakeholderFor.map((c) => (
                    <div key={c.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{c.title}</div>
                        <div className="text-[11px] text-slate-400">{c.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={c.status} />
                        <RiskBadge level={c.riskLevel} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-800/30 rounded-xl text-xs text-slate-500">
                  Arjun has no pending commitments owed to {personDetail.name}.
                </div>
              )}
            </div>

            {/* What They Owe Arjun */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <UserCheck size={14} /> What {personDetail.name.split(' ')[0]} Owes Arjun
              </h3>

              {personDetail.commitments && personDetail.commitments.length > 0 ? (
                <div className="space-y-2">
                  {personDetail.commitments.map((c) => (
                    <div key={c.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{c.title}</div>
                        <div className="text-[11px] text-slate-400">{c.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={c.status} />
                        <RiskBadge level={c.riskLevel} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-800/30 rounded-xl text-xs text-slate-500">
                  {personDetail.name} currently owes no deliverables to Arjun.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-500 text-xs">
            Select a stakeholder to view bidirectional commitments.
          </div>
        )}
      </div>
    </div>
  );
}
