import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import type { Participant } from './domain';

export async function writeParticipantIdentity(participant: Participant, caseId?: string, trackId?: string) {
  const batch = writeBatch(db);
  batch.set(doc(db, 'participantProfiles', participant.id), {
    participantId: participant.id, name: participant.name, email: participant.email.toLowerCase(),
    role: participant.role, sourceSite: 'law', updatedAt: serverTimestamp(),
  }, { merge: true });
  if (participant.chapterId) {
    batch.set(doc(db, 'organizationMemberships', `${participant.id}_${participant.chapterId}`), {
      participantProfileId: participant.id, organizationId: participant.chapterId, organizationType: 'chapter',
      role: participant.role, status: participant.status, sourceSite: 'law', updatedAt: serverTimestamp(),
    }, { merge: true });
  }
  if (caseId && trackId) {
    batch.set(doc(db, 'cohortMemberships', `${participant.id}_${caseId}`), {
      participantProfileId: participant.id, cohortId: caseId, cohortType: 'case', trackId,
      role: participant.role, status: 'active', sourceSite: 'law', updatedAt: serverTimestamp(),
    }, { merge: true });
  }
  await batch.commit();
}
