'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useLawAuth } from '@/components/AuthBootstrapper';
import { Scale, User } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Overview' },
  { href: '/ingestion', label: 'Ingestion Hub' },
  { href: '/workspace', label: 'Practicum Workspace' },
  { href: '/admin', label: 'Admin Studio' },
];

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export function AppHeader({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, profile, isAuthLoading } = useLawAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Sign-in cancelled or failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className={`sticky top-0 z-50 border-b border-white/10 bg-[#070912]/85 backdrop-blur-md ${className || ''}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 group-hover:bg-blue-600/30 transition-colors">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-white group-hover:text-blue-300 transition-colors">
                BEAM Law
              </span>
              <span className="hidden sm:inline-block ml-2 rounded bg-blue-900/40 px-1.5 py-0.5 text-[0.65rem] font-medium text-blue-300 border border-blue-500/20">
                Operations Hub
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-white">{profile?.fullName || user.displayName || user.email}</span>
                <span className="text-[0.68rem] text-blue-400 capitalize">
                  Level {profile?.credentialLevel || 1} • {profile?.roleTier || 'pre-law'}
                </span>
              </div>
              {user.photoURL ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={user.photoURL} alt="User Avatar" className="h-8 w-8 rounded-full border border-blue-400/40" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20 text-blue-300 border border-blue-400/40">
                  <User className="h-4 w-4" />
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="text-xs font-medium text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={isSigningIn || isAuthLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              <GoogleIcon className="h-3.5 w-3.5" />
              {isSigningIn ? 'Signing in...' : 'BEAM Sign In'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
