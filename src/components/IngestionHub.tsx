'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, firebaseConfigured } from '@/lib/firebase';
import { useLawAuth } from '@/components/AuthBootstrapper';
import { LAW_PRACTICE_AREAS, type LegalMatter, type LegalPracticeArea } from '@/lib/domain';
import {
  Scale,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  UserPlus,
  Search,
} from 'lucide-react';

const INITIAL_DEMO_MATTERS: LegalMatter[] = [
  {
    id: 'matter-trans-01',
    title: 'FAA Airspace Lease & Autonomous Drone Fleet Compliance Review',
    originatingNgo: 'transportation.beamthinktank.space',
    practiceArea: 'transportation-regulatory',
    status: 'intake',
    urgency: 'high',
    assignedParticipantUids: [],
    description: 'Review 14 CFR Part 107 flight waivers, ground operations safety manual, and municipal airspace lease agreement for autonomous cargo drone flight corridors.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'matter-grounds-02',
    title: '800 W. Wells CLT Zoning Variance & Adaptive Reuse Filing',
    originatingNgo: 'grounds.beamthinktank.space',
    practiceArea: 'municipal-zoning-clt',
    status: 'assigned',
    urgency: 'medium',
    assignedParticipantUids: ['demo-user-1'],
    supervisingAttorneyUid: 'atty-1',
    description: 'Prepare zoning board variance petition and Community Land Trust ground lease covenant modifications for historic commercial building conversion.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'matter-forge-03',
    title: 'AI Training Dataset Consent & Open-Source Model Licensing',
    originatingNgo: 'forge.beamthinktank.space',
    practiceArea: 'ip-academic-licensing',
    status: 'memo-drafting',
    urgency: 'high',
    assignedParticipantUids: [],
    description: 'Audit training data provenance, construct artist opt-out consent mechanisms, and structure Apache 2.0 dual-licensing agreements for generative models.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'matter-rag-04',
    title: 'ReadyAimGo Client SLA & Multi-Currency Stipend Contract Caps',
    originatingNgo: 'clients.readyaimgo.biz',
    practiceArea: 'contract-client-services',
    status: 'redline-review',
    urgency: 'medium',
    assignedParticipantUids: [],
    description: 'Draft client service level agreement addendum regarding cross-border currency conversion, stipend disbursement schedules, and liability caps.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'matter-orch-05',
    title: '501(c)(3) Multi-NGO Fiscal Sponsorship & Inter-Domain MOU',
    originatingNgo: 'orchestra.beamthinktank.space',
    practiceArea: 'nonprofit-governance',
    status: 'attorney-approved',
    urgency: 'critical',
    assignedParticipantUids: [],
    supervisingAttorneyUid: 'atty-2',
    description: 'Ecosystem-wide Memorandum of Understanding for shared technology infrastructure, intellectual property co-ownership, and tax compliance.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function IngestionHub() {
  const { user, refreshProfile } = useLawAuth();
  const [matters, setMatters] = useState<LegalMatter[]>(INITIAL_DEMO_MATTERS);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedNgo, setSelectedNgo] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  const [newMatter, setNewMatter] = useState<{
    title: string;
    originatingNgo: LegalMatter['originatingNgo'];
    practiceArea: LegalPracticeArea;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>({
    title: '',
    originatingNgo: 'transportation.beamthinktank.space',
    practiceArea: 'transportation-regulatory',
    urgency: 'medium',
    description: '',
  });

  useEffect(() => {
    if (!firebaseConfigured) return;
    const fetchMatters = async () => {
      try {
        const snap = await getDocs(collection(db, 'legalMatters'));
        if (!snap.empty) {
          const list: LegalMatter[] = [];
          snap.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as LegalMatter);
          });
          setMatters((prev) => [...list, ...prev.filter((m) => !list.some((l) => l.id === m.id))]);
        }
      } catch (err) {
        console.error('Firestore fetch matters error:', err);
      }
    };
    void fetchMatters();
  }, []);

  const handleCreateMatter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: Omit<LegalMatter, 'id'> = {
        ...newMatter,
        status: 'intake',
        assignedParticipantUids: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (firebaseConfigured) {
        const docRef = await addDoc(collection(db, 'legalMatters'), payload);
        setMatters((prev) => [
          {
            ...payload,
            id: docRef.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      } else {
        setMatters((prev) => [
          {
            ...payload,
            id: `matter-local-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }

      setNewMatter({
        title: '',
        originatingNgo: 'transportation.beamthinktank.space',
        practiceArea: 'transportation-regulatory',
        urgency: 'medium',
        description: '',
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimMatter = async (matterId: string) => {
    if (!user) {
      setClaimMessage('Please sign in with BEAM Auth to claim legal matters.');
      return;
    }

    try {
      if (firebaseConfigured) {
        await updateDoc(doc(db, 'legalMatters', matterId), {
          assignedParticipantUids: arrayUnion(user.uid),
          status: 'assigned',
          updatedAt: serverTimestamp(),
        });
        await updateDoc(doc(db, 'participantProfiles', user.uid), {
          activeMatterIds: arrayUnion(matterId),
          updatedAt: serverTimestamp(),
        });
        await refreshProfile();
      }

      setMatters((prev) =>
        prev.map((m) =>
          m.id === matterId
            ? {
                ...m,
                status: 'assigned',
                assignedParticipantUids: Array.from(new Set([...m.assignedParticipantUids, user.uid])),
              }
            : m
        )
      );

      setClaimMessage(`Successfully claimed matter ${matterId} to your practicum workspace!`);
    } catch (err) {
      console.error('Error claiming matter:', err);
    }
  };

  const filteredMatters = matters.filter((matter) => {
    if (selectedArea !== 'all' && matter.practiceArea !== selectedArea) return false;
    if (selectedNgo !== 'all' && matter.originatingNgo !== selectedNgo) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        matter.title.toLowerCase().includes(q) ||
        matter.description.toLowerCase().includes(q) ||
        matter.originatingNgo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <Scale className="h-4 w-4" />
            Cross-NGO Legal Aggregation Hub
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ingested Task Operations
          </h1>
          <p className="mt-2 text-slate-400 text-sm max-w-2xl leading-relaxed">
            Real-world legal, regulatory compliance, and contract tasks originating from sister domains: transportation, grounds, forge, orchestra, and ReadyAimGo.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Ingest New Legal Task
        </button>
      </div>

      {claimMessage && (
        <div className="rounded-lg border border-blue-500/30 bg-blue-900/20 p-4 text-sm text-blue-200 flex items-center justify-between">
          <span>{claimMessage}</span>
          <button onClick={() => setClaimMessage(null)} className="text-xs text-blue-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            Practice Area:
          </div>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="rounded-md border border-white/10 bg-[#0c101c] px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Practice Areas (5)</option>
            {LAW_PRACTICE_AREAS.map((area) => (
              <option key={area.slug} value={area.slug}>
                {area.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 ml-0 sm:ml-2">
            NGO Source:
          </div>
          <select
            value={selectedNgo}
            onChange={(e) => setSelectedNgo(e.target.value)}
            className="rounded-md border border-white/10 bg-[#0c101c] px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Sister Domains</option>
            <option value="transportation.beamthinktank.space">transportation</option>
            <option value="grounds.beamthinktank.space">grounds</option>
            <option value="forge.beamthinktank.space">forge</option>
            <option value="orchestra.beamthinktank.space">orchestra</option>
            <option value="clients.readyaimgo.biz">clients.readyaimgo.biz</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-[#0c101c] pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatters.map((matter) => {
          const isClaimedByUser = user ? matter.assignedParticipantUids.includes(user.uid) : false;

          return (
            <div
              key={matter.id}
              className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0a0d18] p-6 space-y-4 hover:border-white/20 transition-all shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-950/60 border border-blue-500/30 px-2.5 py-1 text-[0.68rem] font-semibold text-blue-300">
                    <ExternalLink className="h-3 w-3" />
                    {matter.originatingNgo}
                  </span>
                  <span
                    className={`text-[0.68rem] font-semibold uppercase px-2 py-0.5 rounded border ${
                      matter.urgency === 'critical'
                        ? 'bg-red-950/60 border-red-500/40 text-red-400'
                        : matter.urgency === 'high'
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {matter.urgency} priority
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{matter.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {matter.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-blue-400" />
                  <span className="capitalize text-slate-300 font-medium">Status: {matter.status}</span>
                </div>

                {isClaimedByUser ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-4 w-4" /> Claimed in Workspace
                  </span>
                ) : (
                  <button
                    onClick={() => handleClaimMatter(matter.id)}
                    className="inline-flex items-center gap-1.5 rounded bg-blue-600/20 border border-blue-500/40 px-3 py-1.5 font-semibold text-blue-300 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Claim for Practicum
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Ingesting New Task */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0a0d18] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">Ingest Legal / Regulatory Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMatter} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., FAA Airspace Waiver Amendment"
                  value={newMatter.title}
                  onChange={(e) => setNewMatter({ ...newMatter, title: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-[#070912] p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Originating Sister NGO</label>
                  <select
                    value={newMatter.originatingNgo}
                    onChange={(e) =>
                      setNewMatter({
                        ...newMatter,
                        originatingNgo: e.target.value as LegalMatter['originatingNgo'],
                      })
                    }
                    className="w-full rounded-md border border-white/10 bg-[#070912] p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="transportation.beamthinktank.space">transportation</option>
                    <option value="grounds.beamthinktank.space">grounds</option>
                    <option value="forge.beamthinktank.space">forge</option>
                    <option value="orchestra.beamthinktank.space">orchestra</option>
                    <option value="clients.readyaimgo.biz">clients.readyaimgo.biz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Practice Area</label>
                  <select
                    value={newMatter.practiceArea}
                    onChange={(e) =>
                      setNewMatter({
                        ...newMatter,
                        practiceArea: e.target.value as LegalPracticeArea,
                      })
                    }
                    className="w-full rounded-md border border-white/10 bg-[#070912] p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    {LAW_PRACTICE_AREAS.map((a) => (
                      <option key={a.slug} value={a.slug}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Urgency</label>
                <select
                  value={newMatter.urgency}
                  onChange={(e) =>
                    setNewMatter({
                      ...newMatter,
                      urgency: e.target.value as typeof newMatter.urgency,
                    })
                  }
                  className="w-full rounded-md border border-white/10 bg-[#070912] p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Task Scope & Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail contract clauses, zoning codes, FAA regulations, or dataset consent rules needing legal review..."
                  value={newMatter.description}
                  onChange={(e) => setNewMatter({ ...newMatter, description: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-[#070912] p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Ingesting...' : 'Ingest Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
