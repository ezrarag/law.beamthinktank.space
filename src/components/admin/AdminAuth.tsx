'use client';

import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

type AuthState = { user: User | null; loading: boolean; authorized: boolean };
const Context = createContext<AuthState>({ user: null, loading: true, authorized: false });
export const useAdminAuth = () => useContext(Context);

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, authorized: false });
  const router = useRouter(); const pathname = usePathname();
  useEffect(() => onAuthStateChanged(auth, async (user) => {
    if (!user) { setState({ user: null, loading: false, authorized: false }); if (pathname !== '/admin/login') router.replace('/admin/login'); return; }
    const claims = (await user.getIdTokenResult(true)).claims;
    const authorized = claims.beam_admin === true || claims.partner_admin === true;
    setState({ user, loading: false, authorized });
    if (!authorized && pathname !== '/admin/login') router.replace('/admin/login');
    if (authorized && pathname === '/admin/login') router.replace('/admin');
  }), [pathname, router]);
  if (state.loading) return <div className="grid min-h-screen place-items-center bg-[#080b12] text-slate-400">Checking access…</div>;
  return <Context.Provider value={state}>{children}</Context.Provider>;
}

export async function logOut() { await signOut(auth); }

