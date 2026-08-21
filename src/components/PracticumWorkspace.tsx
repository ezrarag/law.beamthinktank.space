'use client';

import React, { useState } from 'react';
import { useLawAuth } from '@/components/AuthBootstrapper';
import {
  CREDENTIAL_LEVEL_DESCRIPTIONS,
  LAW_PRACTICE_AREAS,
  type LegalMemo,
  type RoleTier,
} from '@/lib/domain';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  FileEdit,
  Send,
  User,
  Star,
} from 'lucide-react';

const INITIAL_DEMO_MEMOS: LegalMemo[] = [
  {
    id: 'memo-01',
    matterId: 'matter-trans-01',
    authorUid: 'demo-user-1',
    authorName: 'Alex Morgan',
    roleTier: 'law-student',
    memoExcerpt:
      'Legal opinion on 14 CFR Part 107 waiver for beyond-visual-line-of-sight drone flight paths. All ground safety mitigation criteria have been satisfied under DOT fleet rules.',
    redlineContent:
      'Clause 4.2: Replace "exclusive airspace rights" with "non-exclusive municipal flight corridor license subject to FAA priority emergency preemption."',
    status: 'submitted-for-review',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'memo-02',
    matterId: 'matter-grounds-02',
    authorUid: 'demo-user-1',
    authorName: 'Alex Morgan',
    roleTier: 'law-student',
    memoExcerpt:
      'Zoning variance brief for Community Land Trust adaptive reuse at 800 W. Wells. Structured 99-year ground lease covenants preventing predatory commercial flipping.',
    redlineContent:
      'Section 12.1: Add requirement for quarterly UWM Community Development Law Clinic reporting and affordable housing rent caps.',
    status: 'approved',
    supervisorFeedback: 'Outstanding research on municipal zoning variances and land trust covenant mechanics. Approved for portfolio.',
    supervisorUid: 'atty-faculty-1',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function PracticumWorkspace() {
  const { user, profile } = useLawAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'drafting' | 'supervision'>('profile');
  const [memos, setMemos] = useState<LegalMemo[]>(INITIAL_DEMO_MEMOS);

  // New Memo Draft Form State
  const [, setDraftMatterTitle] = useState('');
  const [draftMemoExcerpt, setDraftMemoExcerpt] = useState('');
  const [draftRedlineContent, setDraftRedlineContent] = useState('');
  const [draftSuccessMsg, setDraftSuccessMsg] = useState<string | null>(null);

  // Supervisor Review State
  const [supervisorFeedback, setSupervisorFeedback] = useState('');

  const currentRoleTier: RoleTier = profile?.roleTier || 'law-student';
  const credentialLevel = profile?.credentialLevel || 2;
  const levelInfo = CREDENTIAL_LEVEL_DESCRIPTIONS[credentialLevel];

  const handleCreateMemo = (e: React.FormEvent) => {
    e.preventDefault();
    const newMemo: LegalMemo = {
      id: `memo-${Date.now()}`,
      matterId: `matter-user-${Date.now()}`,
      authorUid: user?.uid || 'guest-participant',
      authorName: profile?.fullName || user?.displayName || 'Practicum Participant',
      roleTier: currentRoleTier,
      memoExcerpt: draftMemoExcerpt,
      redlineContent: draftRedlineContent,
      status: 'submitted-for-review',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMemos((prev) => [newMemo, ...prev]);
    setDraftMemoExcerpt('');
    setDraftRedlineContent('');
    setDraftMatterTitle('');
    setDraftSuccessMsg('Your legal review memo & redlines have been submitted for licensed attorney review!');
  };

  const handleApproveMemo = (memoId: string) => {
    setMemos((prev) =>
      prev.map((m) =>
        m.id === memoId
          ? {
              ...m,
              status: 'approved',
              supervisorFeedback: supervisorFeedback || 'Approved by Faculty Liaison / Licensed Attorney.',
              supervisorUid: user?.uid || 'supervisor-1',
            }
          : m
      )
    );
    setSupervisorFeedback('');
  };

  const handleRequestRevision = (memoId: string) => {
    setMemos((prev) =>
      prev.map((m) =>
        m.id === memoId
          ? {
              ...m,
              status: 'revision-requested',
              supervisorFeedback: supervisorFeedback || 'Revisions requested. Please review notes.',
              supervisorUid: user?.uid || 'supervisor-1',
            }
          : m
      )
    );
    setSupervisorFeedback('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
            <GraduationCap className="h-4 w-4" />
            Earn-While-Learning Workspace
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Practicum Participant & Supervised Review Hub
          </h1>
          <p className="mt-2 text-slate-400 text-sm max-w-2xl leading-relaxed">
            Produce legal review memos, perform contract redlines, earn credential progression, and receive supervised licensed attorney approvals.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-1.5 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="h-3.5 w-3.5" /> Participant Profile
          </button>
          <button
            onClick={() => setActiveTab('drafting')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'drafting'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileEdit className="h-3.5 w-3.5" /> Memo & Redline Drafter
          </button>
          <button
            onClick={() => setActiveTab('supervision')}
            className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === 'supervision'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="h-3.5 w-3.5" /> Attorney Review Hub
          </button>
        </div>
      </div>

      {/* TAB 1: PARTICIPANT PROFILE */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0a0d18] p-6 space-y-6 lg:col-span-1 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xl font-bold">
                {profile?.fullName?.charAt(0) || 'P'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {profile?.fullName || user?.displayName || 'Practicum Participant'}
                </h3>
                <p className="text-xs text-slate-400">{profile?.email || user?.email || 'participant@beamthinktank.space'}</p>
                <span className="inline-block mt-2 rounded bg-purple-950/60 px-2.5 py-0.5 text-[0.68rem] font-medium text-purple-300 border border-purple-500/30 capitalize">
                  Role: {profile?.roleTier || 'law-student'}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Institution:</span>
                <span className="font-semibold text-white">{profile?.institutionAffiliation || 'UWM Community Dev Clinic'}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Bar / ID Number:</span>
                <span className="font-mono text-slate-200">{profile?.barNumber || 'PRAC-2026-8812'}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">Completed Reviews:</span>
                <span className="font-bold text-emerald-400">{profile?.reviewsCompletedCount || 3} Memos</span>
              </div>
            </div>

            {/* Credential Level Badge */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-950/30 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-300">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" /> Credential Progression
                </span>
                <span>Level {credentialLevel} / 5</span>
              </div>
              <p className="text-sm font-bold text-white">{levelInfo.title}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{levelInfo.desc}</p>
            </div>
          </div>

          {/* Portfolio & Practice Areas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0a0d18] p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-400" /> Active Practice Area Authorizations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {LAW_PRACTICE_AREAS.map((area) => (
                  <div
                    key={area.slug}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-slate-200"
                  >
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: area.colorAccent }} />
                    <span className="font-semibold">{area.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0a0d18] p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-400" /> Verified Practicum Portfolio (Approved Memos)
              </h3>

              <div className="space-y-4">
                {memos
                  .filter((m) => m.status === 'approved')
                  .map((memo) => (
                    <div
                      key={memo.id}
                      className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Attorney Approved
                        </span>
                        <span>{new Date(memo.createdAt as string).toLocaleDateString()}</span>
                      </div>
                      <p className="font-bold text-white text-sm">{memo.memoExcerpt}</p>
                      <p className="text-slate-300 font-mono bg-black/40 p-2 rounded border border-white/5">
                        {memo.redlineContent}
                      </p>
                      {memo.supervisorFeedback && (
                        <p className="text-purple-300 italic">Feedback: &quot;{memo.supervisorFeedback}&quot;</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEMO & REDLINE DRAFTER */}
      {activeTab === 'drafting' && (
        <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-[#0a0d18] p-8 space-y-6 shadow-xl">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileEdit className="h-5 w-5 text-blue-400" /> Draft Practicum Review Memo &amp; Contract Redline
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Produce legal review excerpts and clause redlines for ingested NGO tasks under licensed attorney supervision.
            </p>
          </div>

          {draftSuccessMsg && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-900/20 p-4 text-xs text-emerald-200 flex items-center justify-between">
              <span>{draftSuccessMsg}</span>
              <button onClick={() => setDraftSuccessMsg(null)} className="text-emerald-400 hover:underline">
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleCreateMemo} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Legal Matter Title</label>
              <input
                type="text"
                required
                placeholder="e.g., FAA Airspace Lease Corridor Flight Approval"
                onChange={(e) => setDraftMatterTitle(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-[#070912] p-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Legal Memo Excerpt &amp; Findings</label>
              <textarea
                rows={4}
                required
                placeholder="Detail statutory analysis, municipal zoning codes, 14 CFR Part 107 compliance, or IP dataset consent rules..."
                value={draftMemoExcerpt}
                onChange={(e) => setDraftMemoExcerpt(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-[#070912] p-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Contract Redline &amp; Clause Edits</label>
              <textarea
                rows={3}
                required
                placeholder="e.g., Section 8.4: Modify indemnity cap to $50,000 for ReadyAimGo client agreement..."
                value={draftRedlineContent}
                onChange={(e) => setDraftRedlineContent(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-[#070912] p-3 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-lg hover:bg-blue-500 transition-colors"
              >
                <Send className="h-4 w-4" /> Submit for Attorney Approval
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SUPERVISED ATTORNEY REVIEW HUB */}
      {activeTab === 'supervision' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-6 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-400" /> Licensed Attorney &amp; Faculty Liaison Review Hub
            </h3>
            <p className="text-xs text-purple-200 leading-relaxed">
              Supervisors evaluate practicum student legal memos and contract redlines. Approved memos are published to the student&apos;s portfolio and increment their credential progression score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memos.map((memo) => (
              <div
                key={memo.id}
                className="rounded-xl border border-white/10 bg-[#0a0d18] p-6 space-y-4 shadow-lg text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">{memo.authorName}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-semibold uppercase ${
                      memo.status === 'approved'
                        ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                        : memo.status === 'submitted-for-review'
                        ? 'bg-purple-950/80 border border-purple-500/40 text-purple-300'
                        : 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                    }`}
                  >
                    {memo.status}
                  </span>
                </div>

                <p className="text-slate-300 font-medium leading-relaxed">{memo.memoExcerpt}</p>
                <div className="rounded border border-white/5 bg-black/40 p-2.5 font-mono text-slate-300">
                  {memo.redlineContent}
                </div>

                {memo.supervisorFeedback && (
                  <p className="text-purple-300 italic">Supervisor Notes: &quot;{memo.supervisorFeedback}&quot;</p>
                )}

                {memo.status === 'submitted-for-review' && (
                  <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                    <button
                      onClick={() => handleApproveMemo(memo.id)}
                      className="flex-1 rounded bg-emerald-600 py-1.5 font-semibold text-white hover:bg-emerald-500 transition-colors"
                    >
                      Approve &amp; Add to Portfolio
                    </button>
                    <button
                      onClick={() => handleRequestRevision(memo.id)}
                      className="flex-1 rounded bg-amber-600/30 border border-amber-500/40 py-1.5 font-semibold text-amber-200 hover:bg-amber-600 transition-colors"
                    >
                      Request Revision
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
