'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LAW_PRACTICE_AREAS, type LegalPracticeArea } from '@/lib/domain';
import {
  Scale,
  Shield,
  Building2,
  FileCheck,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';

const AUTO_ADVANCE_MS = 6500;

const AREA_ICONS: Record<LegalPracticeArea, React.ElementType> = {
  'transportation-regulatory': Briefcase,
  'municipal-zoning-clt': Building2,
  'ip-academic-licensing': FileCheck,
  'contract-client-services': Shield,
  'nonprofit-governance': Scale,
};

export function LawLanding() {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const activeArea = LAW_PRACTICE_AREAS[activeIndex];
  const ActiveIcon = AREA_ICONS[activeArea.slug] || Scale;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % LAW_PRACTICE_AREAS.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + LAW_PRACTICE_AREAS.length) % LAW_PRACTICE_AREAS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % LAW_PRACTICE_AREAS.length);
  };

  return (
    <div className="relative isolate overflow-hidden bg-[#070912]">
      {/* Hero Carousel Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between px-4 sm:px-8 lg:px-12 py-8 sm:py-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeArea.slug}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none"
          >
            <div
              className="absolute inset-0 opacity-40 transition-all duration-700"
              style={{
                background: `radial-gradient(circle at 75% 30%, ${activeArea.colorAccent}66, transparent 28%), radial-gradient(circle at 20% 70%, ${activeArea.colorAccent}33, transparent 32%), linear-gradient(135deg, #090b14 0%, #0c101c 50%, ${activeArea.colorAccent}15 100%)`,
              }}
            />
            <div
              className="absolute right-[8%] top-1/2 flex h-[38vw] max-h-[32rem] min-h-72 w-[38vw] min-w-72 -translate-y-1/2 items-center justify-center rounded-full border opacity-20 blur-[0.5px]"
              style={{ borderColor: activeArea.colorAccent, boxShadow: `0 0 140px ${activeArea.colorAccent}30` }}
            >
              <ActiveIcon
                className="h-1/2 w-1/2"
                style={{ color: activeArea.colorAccent }}
                strokeWidth={0.7}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Header indicator */}
        <div className="relative z-10 mx-auto w-full max-w-7xl flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
          <p>
            <span className="text-white font-semibold">BEAM</span>
            <span className="mx-3 text-slate-600">·</span>
            Legal Operations & Practicum Hub
          </p>
          <div className="flex items-center gap-2">
            <span className="text-white font-mono font-bold">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-500 font-mono">
              {String(LAW_PRACTICE_AREAS.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Main Hero Copy */}
        <div className="relative z-10 mx-auto w-full max-w-7xl my-auto py-12 sm:py-20">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`slide-${activeArea.slug}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="max-w-4xl"
            >
              <div
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider border bg-white/5"
                style={{ borderColor: `${activeArea.colorAccent}50`, color: activeArea.colorAccent }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Practice Area {String(activeIndex + 1).padStart(2, '0')}
              </div>

              <h1 className="mt-6 font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
                {activeArea.label}
              </h1>

              <p className="mt-4 text-base sm:text-xl font-medium text-blue-200/90">
                {activeArea.tagline}
              </p>

              <p className="mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
                {activeArea.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={`/ingestion?area=${activeArea.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5"
                  style={{ backgroundColor: activeArea.colorAccent }}
                >
                  Explore Ingestion Tasks
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/workspace"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10 transition-colors"
                >
                  <GraduationCap className="h-4 w-4 text-blue-400" />
                  Practicum Workspace
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Slide Indicators & Controls */}
        <div className="relative z-10 mx-auto w-full max-w-7xl flex items-end justify-between gap-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            {LAW_PRACTICE_AREAS.map((area, index) => (
              <button
                key={area.slug}
                onClick={() => setActiveIndex(index)}
                aria-label={`View ${area.label}`}
                className="group flex h-8 items-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'w-10' : 'w-3 bg-white/20 group-hover:bg-white/50'
                  }`}
                  style={index === activeIndex ? { backgroundColor: activeArea.colorAccent } : undefined}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-colors"
              aria-label="Previous practice area"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-colors"
              aria-label="Next practice area"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Overview & Practicum Hub Grid */}
      <section className="relative z-10 border-t border-white/10 bg-[#090c16] py-16 sm:py-24 px-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs uppercase tracking-[0.25em] text-blue-400 font-semibold">
              Legal Operations Ecosystem
            </h2>
            <p className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Connected Legal Infrastructure & Earn-While-Learning Practicum
            </p>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Bridging real-world NGO legal tasks with law students, paralegals, and faculty supervisors across 5 sister domains.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-4 hover:border-blue-500/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">1. Cross-NGO Aggregation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ingest real-world legal tasks, fleet FAA leases, land trust variances, AI licensing, and ReadyAimGo client agreements from sister BEAM domains into a unified operations queue.
              </p>
              <Link
                href="/ingestion"
                className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                Go to Ingestion Hub <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-4 hover:border-purple-500/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">2. Earn-While-Learning Practicum</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Pre-law, paralegal, and law student participants earn credential levels (Level 1 to Level 5) by drafting legal review memos and contract redlines under attorney supervision.
              </p>
              <Link
                href="/workspace"
                className="inline-flex items-center text-xs font-semibold text-purple-400 hover:text-purple-300"
              >
                Enter Practicum Workspace <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-4 hover:border-emerald-500/40 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">3. Supervised Attorney Review</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Licensed attorneys and faculty liaisons review, provide structured feedback, and approve participant work—building verified legal portfolios and compliance deliverables.
              </p>
              <Link
                href="/workspace"
                className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                View Review Workflows <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
