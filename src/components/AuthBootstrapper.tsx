'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firebaseConfigured } from '@/lib/firebase';
import {
  ensureLegalParticipantProfile,
  readStoredBeamHandoff,
  type BeamHandoffPayload,
} from '@/lib/beam-auth';
import type { LegalParticipantProfile } from '@/lib/domain';

interface LawAuthContextValue {
  user: FirebaseUser | null;
  profile: LegalParticipantProfile | null;
  isAuthLoading: boolean;
  handoffPayload: BeamHandoffPayload | null;
  refreshProfile: () => Promise<void>;
}

const LawAuthContext = createContext<LawAuthContextValue>({
  user: null,
  profile: null,
  isAuthLoading: true,
  handoffPayload: null,
  refreshProfile: async () => {},
});

export function AuthBootstrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<LegalParticipantProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [handoffPayload, setHandoffPayload] = useState<BeamHandoffPayload | null>(null);

  useEffect(() => {
    const storedHandoff = readStoredBeamHandoff();
    if (storedHandoff) {
      setHandoffPayload(storedHandoff);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    try {
      const updated = await ensureLegalParticipantProfile(user, handoffPayload);
      setProfile(updated);
    } catch (err) {
      console.error('Error refreshing legal participant profile:', err);
    }
  }, [user, handoffPayload]);

  useEffect(() => {
    if (!firebaseConfigured || !auth) {
      setIsAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const loadedProfile = await ensureLegalParticipantProfile(currentUser, handoffPayload);
          setProfile(loadedProfile);
        } catch (err) {
          console.error('Error loading legal participant profile:', err);
        }
      } else {
        setProfile(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [handoffPayload]);

  return (
    <LawAuthContext.Provider
      value={{
        user,
        profile,
        isAuthLoading,
        handoffPayload,
        refreshProfile,
      }}
    >
      {children}
    </LawAuthContext.Provider>
  );
}

export function useLawAuth() {
  return useContext(LawAuthContext);
}
