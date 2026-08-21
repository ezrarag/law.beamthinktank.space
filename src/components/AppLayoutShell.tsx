'use client';

import type { ReactNode } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { SiteFooter } from '@/components/SiteFooter';

export function AppLayoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070912] text-slate-100 antialiased">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_85%_25%,rgba(139,92,246,0.12),transparent_32%),linear-gradient(180deg,#090b14_0%,#070912_50%,#04050a_100%)]" />
      
      {/* Subtle grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

      <AppHeader />
      <main className="relative z-10 min-h-[calc(100vh-4rem-12rem)]">{children}</main>
      <SiteFooter />
    </div>
  );
}
