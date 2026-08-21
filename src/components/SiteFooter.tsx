'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ExternalLink } from 'lucide-react';

const sisterDomains = [
  { name: 'BEAM Home', href: 'https://home.beamthinktank.space' },
  { name: 'BEAM Forge', href: 'https://forge.beamthinktank.space' },
  { name: 'BEAM Grounds', href: 'https://grounds.beamthinktank.space' },
  { name: 'BEAM Transportation', href: 'https://transportation.beamthinktank.space' },
  { name: 'BEAM Orchestra', href: 'https://orchestra.beamthinktank.space' },
  { name: 'ReadyAimGo Client Portal', href: 'https://clients.readyaimgo.biz' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#04050a] py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-semibold text-lg">
              <Scale className="h-5 w-5 text-blue-400" />
              <span>BEAM Law & Legal Operations Hub</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Shared-state legal task aggregation, regulatory compliance oversight, and earn-while-learning practicum workspace for pre-law, paralegal, and law student participants under supervised attorney review.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Legal Hub Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Overview</Link>
              </li>
              <li>
                <Link href="/ingestion" className="hover:text-white transition-colors">Cross-NGO Ingestion Hub</Link>
              </li>
              <li>
                <Link href="/workspace" className="hover:text-white transition-colors">Practicum Workspace</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">Admin Studio</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              BEAM Ecosystem Nodes
            </h4>
            <ul className="space-y-2 text-sm">
              {sisterDomains.map((domain) => (
                <li key={domain.name}>
                  <a
                    href={domain.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                  >
                    <span>{domain.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BEAM Think Tank & Legal Operations Hub. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Supervised Legal Operations & Practicum Hub</p>
        </div>
      </div>
    </footer>
  );
}
