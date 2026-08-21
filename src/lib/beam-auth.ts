import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LegalParticipantProfile, RoleTier } from '@/lib/domain';

export const BEAM_HANDOFF_STORAGE_KEY = 'beam-handoff';
export const BEAM_RETURN_TOKEN_KEY = 'beam-return-id-token';

export interface BeamHandoffPayload {
  uid: string;
  email: string | null;
  displayName?: string | null;
  role?: string;
  sourceType?: string;
  sourceSystem?: string;
  entryChannel?: string;
  organizationId?: string;
  organizationName?: string;
  landingPageUrl?: string;
  completedAt?: string;
  roleTier?: RoleTier;
  institutionAffiliation?: string;
  barNumber?: string;
}

export function readStoredBeamHandoff(): BeamHandoffPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(BEAM_HANDOFF_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BeamHandoffPayload;
  } catch {
    return null;
  }
}

export function clearStoredBeamHandoff() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(BEAM_HANDOFF_STORAGE_KEY);
  window.sessionStorage.removeItem(BEAM_RETURN_TOKEN_KEY);
}

export async function ensureLegalParticipantProfile(
  authUser: FirebaseUser,
  handoffData?: BeamHandoffPayload | null
): Promise<LegalParticipantProfile> {
  const profileRef = doc(db, 'participantProfiles', authUser.uid);
  const snap = await getDoc(profileRef);

  const existing = snap.exists() ? (snap.data() as LegalParticipantProfile) : null;

  const roleTier: RoleTier = handoffData?.roleTier || existing?.roleTier || 'pre-law';
  const fullName = authUser.displayName || handoffData?.displayName || existing?.fullName || authUser.email?.split('@')[0] || 'Practicum Member';
  const email = authUser.email || handoffData?.email || existing?.email || '';

  const profile: LegalParticipantProfile = {
    uid: authUser.uid,
    fullName,
    email,
    sourceDomain: 'law.beamthinktank.space',
    roleTier,
    institutionAffiliation: handoffData?.institutionAffiliation || existing?.institutionAffiliation || 'BEAM Legal Operations Practicum',
    barNumber: handoffData?.barNumber || existing?.barNumber || '',
    licensedStates: existing?.licensedStates || (roleTier === 'licensed-attorney' ? ['WI'] : []),
    practiceAreas: existing?.practiceAreas || ['transportation-regulatory', 'municipal-zoning-clt', 'ip-academic-licensing'],
    credentialLevel: existing?.credentialLevel || 1,
    activeMatterIds: existing?.activeMatterIds || [],
    reviewsCompletedCount: existing?.reviewsCompletedCount || 0,
    portfolio: existing?.portfolio || [],
    updatedAt: serverTimestamp(),
  };

  await setDoc(profileRef, profile, { merge: true });
  return profile;
}
